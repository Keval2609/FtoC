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
    role: data.role,
    createdAt: Date.now(),
    onboardingComplete: false,
    profileImage: data.profileImage || '',
    ...(data.role === 'farmer' && {
      farmName: '',
      bio: '',
      farmPhoto: '',
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

export async function updateFarmerProfile(uid, profileData) {
  if (useMock) {
    const saved = localStorage.getItem('mockUserProfile');
    const existing = saved ? JSON.parse(saved) : {};
    const updated = { ...existing, ...profileData };
    localStorage.setItem('mockUserProfile', JSON.stringify(updated));
    return;
  }

  // Update users collection
  const userUpdates = {
    farmName: profileData.farmName,
    bio: profileData.bio,
    location: profileData.location,
    payoutMethod: profileData.payoutMethod,
  };
  if (profileData.farmPhoto !== undefined) {
    userUpdates.farmPhoto = profileData.farmPhoto;
  }
  await updateDoc(doc(db, 'users', uid), userUpdates);

  // Update farmers collection
  const farmerRef = doc(db, 'farmers', uid);
  const snap = await getDoc(farmerRef);
  if (snap.exists()) {
    const farmerUpdates = {
      name: profileData.farmName,
      farmName: profileData.farmName,
      story: profileData.bio,
      location: profileData.location,
    };
    if (profileData.farmPhoto !== undefined) {
      farmerUpdates.heroImageUrl = profileData.farmPhoto;
      farmerUpdates.imageUrl = profileData.farmPhoto;
    }
    await updateDoc(farmerRef, farmerUpdates);
  }
}

export async function completeOnboarding(uid, role, profileData) {
  if (useMock) {
    const saved = localStorage.getItem('mockUserProfile');
    const existing = saved ? JSON.parse(saved) : {};
    const updated = { ...existing, uid, role, ...profileData, onboardingComplete: true };
    localStorage.setItem('mockUserProfile', JSON.stringify(updated));
    return;
  }

  await updateDoc(doc(db, 'users', uid), {
    ...profileData,
    onboardingComplete: true,
  });

  if (role === 'farmer') {
    const farmerRef = doc(db, 'farmers', uid);
    const snap = await getDoc(farmerRef);
    if (!snap.exists()) {
      await setDoc(farmerRef, {
        userId: uid,
        farmName: profileData.farmName || '',
        story: profileData.bio || '',
        heroImageUrl: profileData.farmPhoto || '',
        imageUrl: profileData.farmPhoto || '',
        farmingMethods: [],
        trustBadges: [],
        verificationStatus: 'pending',
        createdAt: Date.now(),
      });
    } else {
      await updateDoc(farmerRef, {
        farmName: profileData.farmName || '',
        story: profileData.bio || '',
      });
    }
  }
}

// ═══════════════════════════════════════════════════
//  FARMERS
// ═══════════════════════════════════════════════════

export async function getFarmers(filters = {}) {
  if (useMock) return mockFarmers;

  try {
    const ref = collection(db, 'farmers');
    const constraints = [];
    if (filters.verificationStatus) {
      constraints.push(where('verificationStatus', '==', filters.verificationStatus));
    }
    const q = constraints.length > 0 ? query(ref, ...constraints) : ref;
    const snap = await getDocs(q);
    const farmers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // If Firestore returns no farmers (e.g. empty collection during dev),
    // fall back to mock data so the discovery page is never blank.
    if (farmers.length === 0 && import.meta.env.DEV) {
      console.warn('[TerraDirect] No farmers found in Firestore — using mock data as fallback');
      return mockFarmers;
    }

    return farmers;
  } catch (err) {
    console.error('[TerraDirect] getFarmers error:', err);
    // Return mock data on error so the UI is never broken
    return mockFarmers;
  }
}

export async function getFarmerById(id) {
  if (useMock) return getMockFarmerById(id);

  try {
    const snap = await getDoc(doc(db, 'farmers', id));
    if (!snap.exists()) {
      // Fallback to mock data for known mock IDs (useful in dev)
      return getMockFarmerById(id) || null;
    }
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error('[TerraDirect] getFarmerById error:', err);
    return getMockFarmerById(id) || null;
  }
}

// ═══════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════

export async function addProduct(productData) {
  if (useMock) {
    const mockId = 'prod-' + Date.now();
    // Persist to localStorage so dashboard can read it back
    const key = `mockProducts_${productData.sellerId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const newProduct = { id: mockId, ...productData, createdAt: Date.now() };
    localStorage.setItem(key, JSON.stringify([newProduct, ...existing]));
    console.log('[MOCK] Product created:', newProduct);
    return newProduct;
  }

  const ref = collection(db, 'products');
  const docRef = await addDoc(ref, {
    ...productData,
    createdAt: Date.now(),
  });
  return { id: docRef.id, ...productData };
}

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

  try {
    const ref = collection(db, 'products');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[TerraDirect] getAllProducts error:', err);
    return [];
  }
}

/**
 * Get products for a specific farmer.
 * Falls back gracefully if the Firestore index is missing.
 */
export async function getProductsByFarmer(farmerId) {
  if (useMock) {
    // First check localStorage for products added during this session
    const key = `mockProducts_${farmerId}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    const staticMock = getMockProductsByFarmer(farmerId);
    // Merge: stored products first, then static mock (deduped by id)
    const storedIds = new Set(stored.map((p) => p.id));
    const merged = [...stored, ...staticMock.filter((p) => !storedIds.has(p.id))];
    return merged;
  }

  try {
    const ref = collection(db, 'products');
    // Try with orderBy first (requires composite index)
    const q = query(
      ref,
      where('sellerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // If the composite index doesn't exist yet, fall back to a simpler query
    if (err.code === 'failed-precondition' || err.message?.includes('index')) {
      console.warn(
        '[TerraDirect] Missing Firestore index for products query. ' +
        'Create a composite index on: collection=products, fields=sellerId ASC, createdAt DESC. ' +
        'Falling back to unordered query.'
      );
      try {
        const ref = collection(db, 'products');
        const q = query(ref, where('sellerId', '==', farmerId));
        const snap = await getDocs(q);
        const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort client-side as fallback
        return products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      } catch (fallbackErr) {
        console.error('[TerraDirect] getProductsByFarmer fallback error:', fallbackErr);
        return [];
      }
    }
    console.error('[TerraDirect] getProductsByFarmer error:', err);
    return [];
  }
}

// Alias for dashboard usage
export const getMyProducts = getProductsByFarmer;

/**
 * Real-time listener for farmer's products (dashboard inventory).
 * Returns unsubscribe function — call in useEffect cleanup.
 */
export function onMyProductsSnapshot(farmerId, callback) {
  if (useMock) {
    // Return merged static + session-stored mock products
    const key = `mockProducts_${farmerId}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    const staticMock = getMockProductsByFarmer(farmerId);
    const storedIds = new Set(stored.map((p) => p.id));
    const merged = [...stored, ...staticMock.filter((p) => !storedIds.has(p.id))];
    const products = merged.map((p) => ({
      ...p,
      stock: p.stock ?? 50,
      status: (p.stock ?? 50) > 10 ? 'in-stock' : (p.stock ?? 50) > 0 ? 'low-stock' : 'out-of-stock',
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

  return onSnapshot(
    q,
    (snap) => {
      const products = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
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
    },
    (err) => {
      // Index missing — fall back to simple query
      if (err.code === 'failed-precondition' || err.message?.includes('index')) {
        console.warn('[TerraDirect] onMyProductsSnapshot: missing index, using simple query');
        getProductsByFarmer(farmerId).then(callback);
      } else {
        console.error('[TerraDirect] onMyProductsSnapshot error:', err);
      }
    }
  );
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
    // Update in localStorage
    // We don't know the sellerId here, so search all mock product keys
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('mockProducts_')) {
        const products = JSON.parse(localStorage.getItem(key) || '[]');
        const idx = products.findIndex((p) => p.id === productId);
        if (idx !== -1) {
          products[idx] = { ...products[idx], ...updates };
          localStorage.setItem(key, JSON.stringify(products));
          break;
        }
      }
    }
    return;
  }
  await updateDoc(doc(db, 'products', productId), updates);
}

export async function deleteProduct(productId) {
  if (useMock) {
    console.log('[MOCK] Product deleted:', productId);
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('mockProducts_')) {
        const products = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = products.filter((p) => p.id !== productId);
        localStorage.setItem(key, JSON.stringify(filtered));
      }
    }
    return;
  }
  await deleteDoc(doc(db, 'products', productId));
}

// ═══════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════

export async function createOrder(orderData, cartItems = []) {
  if (useMock) {
    const mockOrder = { id: 'mock-order-' + Date.now(), ...orderData, status: 'pending' };
    console.log('[MOCK] Order created:', mockOrder);
    return mockOrder;
  }

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

    const orderRef = doc(collection(db, 'orders'));
    const orderDoc = {
      userId: orderData.userId,
      farmerId,
      totalAmount: subtotal,
      status: 'pending',
      contactInfo: orderData.contact || orderData.contactInfo || {},
      shippingAddress: orderData.delivery || orderData.shippingAddress || {},
      createdAt: Date.now(),
    };

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

  return createdOrders[0];
}

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

  try {
    const ref = collection(db, 'orders');
    const q = query(
      ref,
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    if (err.code === 'failed-precondition') {
      // Fallback without ordering
      const ref = collection(db, 'orders');
      const q = query(ref, where('farmerId', '==', farmerId));
      const snap = await getDocs(q);
      return snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    throw err;
  }
}

export async function getUserOrders(userId) {
  if (useMock) return [];

  try {
    const ref = collection(db, 'orders');
    const q = query(
      ref,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[TerraDirect] getUserOrders error:', err);
    return [];
  }
}

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

  try {
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
  } catch (err) {
    console.error('[TerraDirect] getUserChats error:', err);
    return [];
  }
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
