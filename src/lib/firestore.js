import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
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
    console.log('[MOCK] User profile created:', { uid, ...data });
    return { uid, ...data };
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
    console.log('[MOCK] User profile updated:', { uid, ...updates });
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
    console.log('[MOCK] Onboarding completed:', { uid, role, ...profileData });
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
