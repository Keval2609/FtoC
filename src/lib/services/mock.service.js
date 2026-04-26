/**
 * Mock Service — in-memory implementations of all Firebase operations.
 * Used exclusively by the demo environment. No Firebase SDK is loaded.
 *
 * State lives in module-scoped variables and resets on page reload (expected).
 */

import { mockFarmers, mockProducts, getMockFarmerById, getMockProductsByFarmer } from '../mockData';
import { mockInventory } from '../mockInventory';

// ═══════════════════════════════════════════════════
//  IN-MEMORY STATE (resets on reload)
// ═══════════════════════════════════════════════════

let _users = {};
let _orders = [];
let _chats = {};
let _messages = {};
let _products = {};
let _reviews = [];
let _nextId = 1;

function genId(prefix = 'mock') {
  return `${prefix}-${Date.now()}-${_nextId++}`;
}

// Pre-populate products from mockData
Object.entries(mockProducts).forEach(([farmerId, products]) => {
  products.forEach((p) => {
    _products[p.id] = { ...p, sellerId: farmerId, createdAt: Date.now() };
  });
});

// ═══════════════════════════════════════════════════
//  DEMO USER
// ═══════════════════════════════════════════════════

export const DEMO_USER = {
  uid: 'demo-customer-001',
  email: 'demo@terradirect.app',
  displayName: 'Alex Demo',
  photoURL: null,
};

export const DEMO_USER_PROFILE = {
  uid: DEMO_USER.uid,
  email: DEMO_USER.email,
  displayName: DEMO_USER.displayName,
  role: 'customer',
  onboardingComplete: true,
  createdAt: Date.now(),
  deliveryAddress: '123 Demo Street, Portland, OR 97201',
  phone: '(555) 123-4567',
};

// Initialize demo user in state
_users[DEMO_USER.uid] = DEMO_USER_PROFILE;

// ═══════════════════════════════════════════════════
//  USER PROFILE
// ═══════════════════════════════════════════════════

export async function createUserProfile(uid, data) {
  const profile = {
    uid,
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
  _users[uid] = profile;
  return profile;
}

export async function getUserProfile(uid) {
  return _users[uid] || null;
}

export async function updateUserProfile(uid, updates) {
  if (_users[uid]) {
    _users[uid] = { ..._users[uid], ...updates };
  }
}

export async function completeOnboarding(uid, role, profileData) {
  _users[uid] = { ..._users[uid], ...profileData, onboardingComplete: true };
}

// ═══════════════════════════════════════════════════
//  FARMERS
// ═══════════════════════════════════════════════════

export async function getFarmers(filters = {}) {
  if (filters.verificationStatus) {
    return mockFarmers.filter((f) => f.verificationStatus === filters.verificationStatus);
  }
  return [...mockFarmers];
}

export async function getFarmerById(id) {
  return getMockFarmerById(id);
}

// ═══════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════

export async function addProduct(productData) {
  const id = genId('prod');
  const product = { id, ...productData, createdAt: Date.now() };
  _products[id] = product;
  return product;
}

export async function getAllProducts() {
  return mockFarmers.flatMap((farmer) =>
    getMockProductsByFarmer(farmer.id).map((p) => ({
      ...p,
      sellerId: farmer.id,
      sellerName: farmer.farmName || farmer.name,
    }))
  );
}

export async function getProductsByFarmer(farmerId) {
  return getMockProductsByFarmer(farmerId);
}

export const getMyProducts = getProductsByFarmer;

export function onMyProductsSnapshot(farmerId, callback) {
  const products = getMockProductsByFarmer(farmerId).map((p) => ({
    ...p,
    stock: 50,
    status: 'in-stock',
  }));
  // Simulate async delivery
  setTimeout(() => callback(products), 50);
  return () => {};
}

export async function getProductById(id) {
  if (_products[id]) return _products[id];
  return { id, name: 'Mock Product', price: 10, unit: 'kg', imageUrls: [] };
}

export async function updateProduct(productId, updates) {
  if (_products[productId]) {
    _products[productId] = { ..._products[productId], ...updates };
  }
}

export async function deleteProduct(productId) {
  delete _products[productId];
}

// ═══════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════

export async function createOrder(orderData, cartItems = []) {
  const id = genId('order');
  const order = {
    id,
    ...orderData,
    status: 'pending',
    createdAt: Date.now(),
    items: cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.qty || item.quantity || 1,
      priceAtPurchase: item.price,
      imageUrl: item.imageUrls?.[0] || item.imageUrl || '',
    })),
  };
  _orders.push(order);
  return order;
}

export async function getFarmerOrders(farmerId) {
  return [
    {
      id: 'demo-order-1',
      userId: 'u1',
      farmerId,
      totalAmount: 24.5,
      status: 'pending',
      createdAt: Date.now() - 3600000,
      contactInfo: { firstName: 'Alice', lastName: 'Smith' },
      shippingAddress: { city: 'Portland' },
    },
    {
      id: 'demo-order-2',
      userId: 'u2',
      farmerId,
      totalAmount: 18.0,
      status: 'shipped',
      createdAt: Date.now() - 86400000,
      contactInfo: { firstName: 'Bob', lastName: 'Jones' },
      shippingAddress: { city: 'Beaverton' },
    },
    ..._orders.filter((o) => o.farmerId === farmerId),
  ];
}

export async function getUserOrders(userId) {
  return _orders.filter((o) => o.userId === userId);
}

export async function updateOrderStatus(orderId, newStatus) {
  const order = _orders.find((o) => o.id === orderId);
  if (order) order.status = newStatus;
}

// ═══════════════════════════════════════════════════
//  MESSAGING
// ═══════════════════════════════════════════════════

function getChatId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

export async function getOrCreateChat(currentUid, otherUid) {
  const chatId = getChatId(currentUid, otherUid);
  if (!_chats[chatId]) {
    _chats[chatId] = {
      id: chatId,
      participants: [currentUid, otherUid],
      lastMessage: '',
      updatedAt: Date.now(),
    };
    _messages[chatId] = [];
  }
  return _chats[chatId];
}

export async function sendMessage(chatId, senderId, text) {
  const msg = { id: genId('msg'), senderId, text, timestamp: Date.now() };
  if (!_messages[chatId]) _messages[chatId] = [];
  _messages[chatId].push(msg);

  if (_chats[chatId]) {
    _chats[chatId].lastMessage = text.length > 80 ? text.substring(0, 80) + '…' : text;
    _chats[chatId].updatedAt = Date.now();
  }

  return msg;
}

export function onMessagesSnapshot(chatId, callback) {
  // Deliver initial mock messages immediately
  const initialMessages = [
    { id: 'msg-1', senderId: 'sunrise-valley', text: 'Hi! Thanks for your interest in our farm.', timestamp: Date.now() - 120000 },
    { id: 'msg-2', senderId: DEMO_USER.uid, text: 'Are the heirloom tomatoes available this week?', timestamp: Date.now() - 60000 },
    { id: 'msg-3', senderId: 'sunrise-valley', text: 'Yes! We just harvested a fresh batch. Come by after 9 AM.', timestamp: Date.now() },
  ];

  const existing = _messages[chatId] || [];
  const allMessages = existing.length > 0 ? existing : initialMessages;
  if (existing.length === 0) _messages[chatId] = initialMessages;

  callback(allMessages);

  // Return unsubscribe that does nothing
  return () => {};
}

export async function getUserChats(uid) {
  // Return a demo chat so the inbox is not empty
  return [
    {
      id: getChatId(uid, 'sunrise-valley'),
      participants: [uid, 'sunrise-valley'],
      lastMessage: 'Yes! We just harvested a fresh batch.',
      updatedAt: Date.now() - 3600000,
      otherUser: {
        uid: 'sunrise-valley',
        displayName: 'Sunrise Valley Farm',
        role: 'farmer',
      },
    },
  ];
}

// ═══════════════════════════════════════════════════
//  REVIEWS
// ═══════════════════════════════════════════════════

export async function createReview(productId, userId, rating, comment) {
  const id = genId('review');
  _reviews.push({ id, productId, userId, rating, comment, createdAt: Date.now() });
  return { success: true, id };
}

// ═══════════════════════════════════════════════════
//  IMAGE UPLOAD (mock)
// ═══════════════════════════════════════════════════

export async function uploadToCloudinary(file, folder = 'general') {
  // Return a placeholder URL using the file name
  const name = file?.name || 'image.jpg';
  return `https://placehold.co/600x400/2d5a27/ffffff?text=${encodeURIComponent(name)}`;
}

export async function uploadProductImages(userId, files, onProgress) {
  const urls = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 300));
    const url = await uploadToCloudinary(files[i], `products/${userId}`);
    urls.push(url);
    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  return urls;
}
