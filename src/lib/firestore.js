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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { mockFarmers, getMockFarmerById, getMockProductsByFarmer } from './mockData';

const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// ═══════════════════════════════════════════════════
//  USER PROFILE (Phase 2 — Step 1)
// ═══════════════════════════════════════════════════

/**
 * Create a user profile document linked to Firebase Auth uid.
 * Called once during sign-up after the role is selected.
 */
export async function createUserProfile(uid, data) {
  if (useMock) {
    const mockProfile = { uid, ...data, onboardingComplete: false };
    localStorage.setItem('mockUserProfile', JSON.stringify(mockProfile));
    console.log('[MOCK] User profile created:', mockProfile);
    return mockProfile;
  }

  const userRef = doc(db, 'users', uid);
  const profileData = {
    email: data.email,
    displayName: data.displayName,
    role: data.role, // "farmer" or "customer"
    createdAt: Date.now(),
    onboardingComplete: false,
    // Role-specific defaults
    ...(data.role === 'farmer' && {
      farmName: '',
      bio: '',
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
 * Returns null if the document does not exist.
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
 */
export async function updateUserProfile(uid, updates) {
  if (useMock) {
    const saved = localStorage.getItem('mockUserProfile');
    const existing = saved ? JSON.parse(saved) : {};
    const updated = { ...existing, uid, ...updates };
    localStorage.setItem('mockUserProfile', JSON.stringify(updated));
    console.log('[MOCK] User profile updated:', updated);
    return;
  }

  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, updates);
}

/**
 * Complete onboarding for a user — saves role-specific profile data.
 */
export async function completeOnboarding(uid, role, profileData) {
  if (useMock) {
    const saved = localStorage.getItem('mockUserProfile');
    const existing = saved ? JSON.parse(saved) : {};
    const updated = { ...existing, uid, role, ...profileData, onboardingComplete: true };
    localStorage.setItem('mockUserProfile', JSON.stringify(updated));
    console.log('[MOCK] Onboarding completed:', updated);
    return;
  }

  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...profileData,
    onboardingComplete: true,
  });

  // If farmer, also create the farmer profile document
  if (role === 'farmer') {
    const farmerRef = doc(db, 'farmers', uid);
    await setDoc(farmerRef, {
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
//  EXISTING — Farmers / Products / Orders
// ═══════════════════════════════════════════════════

/** Get all farmers */
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

/** Get single farmer by ID */
export async function getFarmerById(id) {
  if (useMock) return getMockFarmerById(id);

  const snap = await getDoc(doc(db, 'farmers', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/** Get products for a farmer */
export async function getProductsByFarmer(farmerId) {
  if (useMock) return getMockProductsByFarmer(farmerId);

  const ref = collection(db, 'farmers', farmerId, 'products');
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Create a new order */
export async function createOrder(orderData) {
  if (useMock) {
    console.log('[MOCK] Order created:', orderData);
    return { id: 'mock-order-' + Date.now(), ...orderData };
  }

  const ref = collection(db, 'orders');
  const docRef = await addDoc(ref, {
    ...orderData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...orderData };
}

// ═══════════════════════════════════════════════════
//  MESSAGING (Phase 2 — Step 2.2)
// ═══════════════════════════════════════════════════

/**
 * Generate a deterministic chat ID from two user IDs.
 * Sorts alphabetically so uid1_uid2 === uid2_uid1.
 */
function getChatId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

/**
 * Get or create a chat document between two users.
 * Returns the chat document data with its ID.
 */
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

  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }

  // Create a new chat
  const chatData = {
    participants: [currentUid, otherUid],
    lastMessage: '',
    updatedAt: Date.now(),
  };
  await setDoc(chatRef, chatData);
  return { id: chatId, ...chatData };
}

/**
 * Send a message in a chat.
 */
export async function sendMessage(chatId, senderId, text) {
  if (useMock) {
    console.log('[MOCK] Message sent:', { chatId, senderId, text });
    return { id: 'mock-msg-' + Date.now(), senderId, text, timestamp: Date.now() };
  }

  // Add to messages sub-collection
  const msgRef = collection(db, 'chats', chatId, 'messages');
  const docRef = await addDoc(msgRef, {
    senderId,
    text,
    timestamp: Date.now(),
  });

  // Update the chat's lastMessage and timestamp
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessage: text.length > 80 ? text.substring(0, 80) + '…' : text,
    updatedAt: Date.now(),
  });

  return { id: docRef.id, senderId, text, timestamp: Date.now() };
}

/**
 * Subscribe to real-time messages in a chat.
 * Returns an unsubscribe function.
 */
export function onMessagesSnapshot(chatId, callback) {
  if (useMock) {
    // Return mock messages once
    callback([
      {
        id: 'msg-1',
        senderId: 'mock-farmer',
        text: 'Hi! Thanks for your interest in our organic produce.',
        timestamp: Date.now() - 120000,
      },
      {
        id: 'msg-2',
        senderId: 'mock-user',
        text: 'Are the tomatoes available for pickup tomorrow?',
        timestamp: Date.now() - 60000,
      },
      {
        id: 'msg-3',
        senderId: 'mock-farmer',
        text: 'Absolutely! We harvest fresh every morning. Come by after 9 AM.',
        timestamp: Date.now(),
      },
    ]);
    return () => {}; // noop unsubscribe
  }

  const msgsRef = collection(db, 'chats', chatId, 'messages');
  const q = query(msgsRef, orderBy('timestamp', 'asc'), limit(200));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    callback(messages);
  });
}

/**
 * Get all chats for a given user (where they are a participant).
 */
export async function getUserChats(uid) {
  if (useMock) {
    return [
      {
        id: 'mock-chat-1',
        participants: [uid, 'mock-farmer'],
        lastMessage: 'See you tomorrow at the farm!',
        updatedAt: Date.now() - 3600000,
        otherUser: {
          uid: 'mock-farmer',
          displayName: 'Green Valley Farm',
          role: 'farmer',
        },
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
    // Fetch the other user's profile for display
    let otherUser = { uid: otherUid, displayName: 'User' };
    try {
      const profile = await getUserProfile(otherUid);
      if (profile) otherUser = profile;
    } catch {
      // fallback to default
    }
    chats.push({ id: d.id, ...data, otherUser });
  }

  return chats;
}

// ═══════════════════════════════════════════════════
//  PRODUCTS — Global Collection (Phase 2 — Step 3)
// ═══════════════════════════════════════════════════

/**
 * Add a new product to the global /products collection.
 * Only callable by farmers (enforced by Firestore rules).
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
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...productData };
}

/**
 * Get all products (marketplace view).
 */
export async function getAllProducts() {
  if (useMock) {
    return mockFarmers.flatMap((farmer) =>
      getMockProductsByFarmer(farmer.id).map((p) => ({
        ...p,
        sellerId: farmer.id,
        sellerName: farmer.name,
      }))
    );
  }

  const ref = collection(db, 'products');
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Get all products for a specific farmer (by sellerId).
 */
export async function getMyProducts(sellerId) {
  if (useMock) {
    return getMockProductsByFarmer(sellerId);
  }

  const ref = collection(db, 'products');
  const q = query(ref, where('sellerId', '==', sellerId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Update an existing product (owner only — enforced by rules).
 */
export async function updateProduct(productId, updates) {
  if (useMock) {
    console.log('[MOCK] Product updated:', { productId, ...updates });
    return;
  }
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, updates);
}

/**
 * Delete a product (owner only — enforced by rules).
 */
export async function deleteProduct(productId) {
  if (useMock) {
    console.log('[MOCK] Product deleted:', productId);
    return;
  }
  await deleteDoc(doc(db, 'products', productId));
}

// ═══════════════════════════════════════════════════
//  REVIEWS
// ═══════════════════════════════════════════════════

/**
 * Add a new review to the global /reviews collection.
 */
export async function createReview(productId, userId, rating, comment) {
  if (useMock) {
    const mockId = 'review-' + Date.now();
    console.log('[MOCK] Review created:', { id: mockId, productId, userId, rating, comment });
    return { success: true, id: mockId };
  }

  try {
    const reviewData = {
      productId,
      userId,
      rating: Number(rating),
      comment,
      createdAt: Date.now(),
    };

    const ref = collection(db, 'reviews');
    const docRef = await addDoc(ref, reviewData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all reviews for a specific product.
 */
export async function getProductReviews(productId) {
  if (useMock) {
    return []; // Return empty mock reviews for now
  }

  const ref = collection(db, 'reviews');
  const q = query(ref, where('productId', '==', productId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

