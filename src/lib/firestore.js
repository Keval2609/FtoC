import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { mockFarmers, getMockFarmerById, getMockProductsByFarmer } from './mockData';

const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

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
