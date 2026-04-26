/**
 * Firebase Service — real Firebase operations.
 * Re-exports from existing firestore.js and cloudinary.js,
 * with useMock forced to false.
 *
 * This is the production service layer.
 */

// Re-export everything from the existing data layer
// These functions already have real Firebase implementations
export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  completeOnboarding,
  getFarmers,
  getFarmerById,
  addProduct,
  getAllProducts,
  getProductsByFarmer,
  getMyProducts,
  onMyProductsSnapshot,
  getProductById,
  updateProduct,
  deleteProduct,
  createOrder,
  getFarmerOrders,
  getUserOrders,
  updateOrderStatus,
  getOrCreateChat,
  sendMessage,
  onMessagesSnapshot,
  getUserChats,
  createReview,
} from '../firestore';

export {
  uploadToCloudinary,
  uploadProductImages,
} from '../cloudinary';
