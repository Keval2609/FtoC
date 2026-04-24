import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { mockFarmers, getMockFarmerById, getMockProductsByFarmer } from './mockData';

const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// ═══════════════════════════════════════════════════
//  USER PROFILE
// ═══════════════════════════════════════════════════

/**
 * Create user profile document linked to Firebase Auth uid.
 * Called once during sign-up after role is selected.
 * Supports profileImage (Cloudinary URL) from db.js merge.
 */
export async function createUserProfile(uid, data) {
  if (useMock) {
    const mockProfile = { uid, ...data, onboardingComplete: false };
    localStorage.setItem('mockUserProfile', JSON.stringify(mockProfile));
    return mockProfile;
  }

  const userRef = doc(db, 'users', uid);
  const profileData = {
    email: data.email || '',
    displayName: data.displayName || '',
    role: data.role, // 'farmer' or 'customer'
    createdAt: Date.now(),
    onboardingComplete: false,
    profileImage: data.profileImage || '',  // Cloudinary URL (from db.js merge)
    ...(data.role === 'farmer' && {
      farmName: '',
      bio: '',
      farmPhoto: '',   // Cloudinary URL
      location: null,
      rating: 0,
    }),
    ...(data.role === 'customer' && {
      savedFarms: [],
      deliveryAddress: '',
    }),
  };

  await setDoc(userRef, profileData);
  return { uid, ...profileData };
}

/**
 * Fetch a user profile by uid.
 */
export async function getUserProfile(uid) {
  if (useMock) {
    const saved = localStorage.getItem('mockUserProfile');
    if (saved) return JSON.parse(saved);
    return {
      uid,
      email: 'demo@example.com',
      displayName: 'Demo User',
      role: 'customer',
      onboardingComplete: true,
      createdAt: Date.now(),
    };
  }

  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() };
}

/**
 * Update user profile fields (partial merge).
 * Only these fields allowed by firestore.rules:
 * displayName, onboardingComplete, farmName, bio, location,
 * rating, savedFarms, deliveryAddress, phone, payoutMethod,
 * profileImage, farmPhoto
 */
export async function updateUserProfile(uid, updates) {
  if (useMock) {
    const saved = localStorage.getItem('mockUserProfile');
    const existing = saved ? JSON.parse(saved) : {};
    const updated = { ...existing, uid, ...updates };
    localStorage.setItem('mockUserProfile', JSON.stringify(updated));
    return;
  }

  await updateDoc(doc(db, 'users', uid), updates);
}

/**
 * Complete onboarding — saves role-specific profile + creates /farmers doc.
 * profileImage and farmPhoto are Cloudinary URLs.
 */
export async function completeOnboarding(uid, role, profileData) {
  if (useMock) {
    const saved = localStorage.getItem('mockUserProfile');
    const existing = saved ? JSON.parse(saved) : {};
    const updated = { ...existing, uid, role, ...profileData, onboardingComplete: true };
    localStorage.setItem('mockUserProfile', JSON.stringify(updated));
    return;
  }

  // Update /users doc
  await updateDoc(doc(db, 'users', uid), {
    ...profileData,
    onboardingComplete: true,
  });

  // Create /farmers doc for farmer role
  if (role === 'farmer') {
    await setDoc(doc(db, 'farmers', uid), {
      userId: uid,
      farmName: profileData.farmName || '',
      story: profileData.bio || '',
      farmingMethods: [],
      trustBadges: [],
      verificationStatus: 'pending',
      createdAt: Date.now(),
    });
  }
}

// ═══════════════════════════════════════════════════
//  FARMERS
// ═══════════════════════════════════════════════════

export async function getFarmers(filters = {}) {
  if (useMock) return mockFarmers;

  const ref = collection(db, 'farmers');
  const constraints = [];
  if (filters.verificationStatus) {
    constraints.push(where('verificationStatus', '==', filters.verificationStatus));
  }
  const q = constraints.length > 0 ? query(ref, ...constraints) : ref;
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getFarmerById(id) {
  if (useMock) return getMockFarmerById(id);

  const snap = await getDoc(doc(db, 'farmers', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ═══════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════

/**
 * Add product to global /products collection.
 * imageUrls MUST be Cloudinary URLs (1–5 required by firestore.rules).
 * sellerId must equal request.auth.uid.
 */
export async function addProduct(productData) {
  if (useMock) {
    const mockId = 'prod-' + Date.now();
    console.log('[MOCK] Product created:', { id: mockId, ...productData });
    return { id: mockId, ...productData, createdAt: Date.now() };
  }

  const ref = collection(db, 'products');
  const docRef = await addDoc(ref, {
    ...productData,
    createdAt: Date.now(),  // number — not serverTimestamp (rules validate as number)
  });
  return { id: docRef.id, ...productData };
}

/**
 * Get all products (marketplace).
 */
export async function getAllProducts() {
  if (useMock) {
    return mockFarmers.flatMap((farmer) =>
      getMockProductsByFarmer(farmer.id).map((p) => ({
        ...p,
        sellerId: farmer.id,
        sellerName: farmer.farmName || farmer.name,
      }))
    );
  }

  const ref = collection(db, 'products');
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * FIXED: was querying /farmers/{id}/products subcollection (wrong).
 * Now queries global /products with sellerId filter (correct).
 */
export async function getProductsByFarmer(farmerId) {
  if (useMock) return getMockProductsByFarmer(farmerId);

  const ref = collection(db, 'products');
  const q = query(
    ref,
    where('sellerId', '==', farmerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Alias for dashboard usage
export const getMyProducts = getProductsByFarmer;

/**
 * Real-time listener for farmer's products (dashboard inventory).
 * Returns unsubscribe function — call in useEffect cleanup.
 */
export function onMyProductsSnapshot(farmerId, callback) {
  if (useMock) {
    const products = getMockProductsByFarmer(farmerId).map((p) => ({
      ...p,
      stock: 50,
      status: 'in-stock',
    }));
    callback(products);
    return () => {};
  }

  const ref = collection(db, 'products');
  const q = query(
    ref,
    where('sellerId', '==', farmerId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snap) => {
    const products = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        // Normalize for InventoryTable component
        subtitle: data.description ? data.description.slice(0, 60) : '',
        imageUrl: data.imageUrls?.[0] || '',
        priceUnit: data.unit,
        status:
          (data.stock ?? 0) > 10
            ? 'in-stock'
            : (data.stock ?? 0) > 0
            ? 'low-stock'
            : 'out-of-stock',
      };
    });
    callback(products);
  });
}

export async function getProductById(id) {
  if (useMock) {
    return { id, name: 'Mock Product', price: 10, unit: 'kg', imageUrls: [] };
  }

  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function updateProduct(productId, updates) {
  if (useMock) {
    console.log('[MOCK] Product updated:', { productId, ...updates });
    return;
  }
  await updateDoc(doc(db, 'products', productId), updates);
}

export async function deleteProduct(productId) {
  if (useMock) {
    console.log('[MOCK] Product deleted:', productId);
    return;
  }
  await deleteDoc(doc(db, 'products', productId));
}

// ═══════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════

/**
 * Create order(s) from cart items.
 * Groups items by farmerId — one order doc per farmer.
 * Writes items as /orders/{id}/items subcollection.
 *
 * FIXED: uses Date.now() not serverTimestamp() — rules require createdAt is number.
 *
 * @param {object} orderData - { userId, contact, delivery }
 * @param {array}  cartItems - [{ id, farmerId, name, price, qty, imageUrls }]
 */
export async function createOrder(orderData, cartItems = []) {
  if (useMock) {
    const mockOrder = { id: 'mock-order-' + Date.now(), ...orderData, status: 'pending' };
    console.log('[MOCK] Order created:', mockOrder);
    return mockOrder;
  }

  // Group items by farmerId
  const farmerGroups = {};
  cartItems.forEach((item) => {
    const fid = item.farmerId || item.sellerId || 'unknown';
    if (!farmerGroups[fid]) farmerGroups[fid] = [];
    farmerGroups[fid].push(item);
  });

  const createdOrders = [];

  for (const [farmerId, items] of Object.entries(farmerGroups)) {
    const subtotal = items.reduce(
      (s, i) => s + i.price * (i.qty || i.quantity || 1),
      0
    );

    // Create order doc with auto-ID
    const orderRef = doc(collection(db, 'orders'));
    const orderDoc = {
      userId: orderData.userId,
      farmerId,
      totalAmount: subtotal,
      status: 'pending',
      contactInfo: orderData.contact || orderData.contactInfo || {},
      shippingAddress: orderData.delivery || orderData.shippingAddress || {},
      createdAt: Date.now(),  // MUST be number — rules: data.createdAt is number
    };

    // Write order + items atomically
    const batch = writeBatch(db);
    batch.set(orderRef, orderDoc);

    for (const item of items) {
      const itemRef = doc(collection(db, 'orders', orderRef.id, 'items'));
      batch.set(itemRef, {
        productId: item.id || item.productId,
        name: item.name || '',
        quantity: item.qty || item.quantity || 1,
        priceAtPurchase: item.price,
        imageUrl: item.imageUrls?.[0] || item.imageUrl || '',
      });
    }

    await batch.commit();
    createdOrders.push({ id: orderRef.id, ...orderDoc });
  }

  return createdOrders[0]; // Return first for single-farmer compat
}

/**
 * Get all orders for a farmer (dashboard).
 */
export async function getFarmerOrders(farmerId) {
  if (useMock) {
    return [
      {
        id: 'mo-1',
        userId: 'u1',
        farmerId,
        totalAmount: 24.5,
        status: 'pending',
        createdAt: Date.now() - 3600000,
        contactInfo: { firstName: 'Alice', lastName: 'Smith' },
        shippingAddress: { city: 'Portland' },
      },
      {
        id: 'mo-2',
        userId: 'u2',
        farmerId,
        totalAmount: 18.0,
        status: 'shipped',
        createdAt: Date.now() - 86400000,
        contactInfo: { firstName: 'Bob', lastName: 'Jones' },
        shippingAddress: { city: 'Beaverton' },
      },
    ];
  }

  const ref = collection(db, 'orders');
  const q = query(
    ref,
    where('farmerId', '==', farmerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Get all orders for a customer.
 */
export async function getUserOrders(userId) {
  if (useMock) {
    return [];
  }

  const ref = collection(db, 'orders');
  const q = query(
    ref,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Update order status (farmer only — enforced by rules).
 * Rules only allow changing 'status' field.
 * Allowed transitions: pending → shipped → delivered | cancelled
 */
export async function updateOrderStatus(orderId, newStatus) {
  const allowed = ['pending', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(newStatus)) throw new Error('Invalid status: ' + newStatus);

  if (useMock) {
    console.log('[MOCK] Order status updated:', orderId, newStatus);
    return;
  }

  await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
}

// ═══════════════════════════════════════════════════
//  MESSAGING (Firestore)
// ═══════════════════════════════════════════════════

function getChatId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

export async function getOrCreateChat(currentUid, otherUid) {
  if (useMock) {
    return {
      id: `${currentUid}_${otherUid}`,
      participants: [currentUid, otherUid],
      lastMessage: '',
      updatedAt: Date.now(),
    };
  }

  const chatId = getChatId(currentUid, otherUid);
  const chatRef = doc(db, 'chats', chatId);
  const snap = await getDoc(chatRef);

  if (snap.exists()) return { id: snap.id, ...snap.data() };

  const chatData = {
    participants: [currentUid, otherUid],
    lastMessage: '',
    updatedAt: Date.now(),
  };
  await setDoc(chatRef, chatData);
  return { id: chatId, ...chatData };
}

export async function sendMessage(chatId, senderId, text) {
  if (useMock) {
    return { id: 'mock-msg-' + Date.now(), senderId, text, timestamp: Date.now() };
  }

  const msgRef = collection(db, 'chats', chatId, 'messages');
  const docRef = await addDoc(msgRef, {
    senderId,
    text,
    timestamp: Date.now(),
  });

  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: text.length > 80 ? text.substring(0, 80) + '…' : text,
    updatedAt: Date.now(),
  });

  return { id: docRef.id, senderId, text, timestamp: Date.now() };
}

export function onMessagesSnapshot(chatId, callback) {
  if (useMock) {
    callback([
      { id: 'msg-1', senderId: 'mock-farmer', text: 'Hi! Thanks for your interest.', timestamp: Date.now() - 120000 },
      { id: 'msg-2', senderId: 'mock-user', text: 'Are the tomatoes available tomorrow?', timestamp: Date.now() - 60000 },
      { id: 'msg-3', senderId: 'mock-farmer', text: 'Yes! Come by after 9 AM.', timestamp: Date.now() },
    ]);
    return () => {};
  }

  const msgsRef = collection(db, 'chats', chatId, 'messages');
  const q = query(msgsRef, orderBy('timestamp', 'asc'), limit(200));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function getUserChats(uid) {
  if (useMock) {
    return [
      {
        id: 'mock-chat-1',
        participants: [uid, 'mock-farmer'],
        lastMessage: 'See you tomorrow at the farm!',
        updatedAt: Date.now() - 3600000,
        otherUser: { uid: 'mock-farmer', displayName: 'Green Valley Farm', role: 'farmer' },
      },
    ];
  }

  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', uid),
    orderBy('updatedAt', 'desc')
  );
  const snap = await getDocs(q);
  const chats = [];

  for (const d of snap.docs) {
    const data = d.data();
    const otherUid = data.participants.find((p) => p !== uid);
    let otherUser = { uid: otherUid, displayName: 'User' };
    try {
      const profile = await getUserProfile(otherUid);
      if (profile) otherUser = profile;
    } catch {
      // fallback
    }
    chats.push({ id: d.id, ...data, otherUser });
  }

  return chats;
}

// ═══════════════════════════════════════════════════
//  REVIEWS
// ═══════════════════════════════════════════════════

export async function createReview(productId, userId, rating, comment) {
  if (useMock) {
    return { success: true, id: 'review-' + Date.now() };
  }

  try {
    const ref = collection(db, 'reviews');
    const docRef = await addDoc(ref, {
      productId,
      userId,
      rating: Number(rating),
      comment,
      createdAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating review:', error);
    return { success: false, error: error.message };
  }
}
