// Temporary Standalone Mode: Backend API calls commented out
// import { axiosClient } from "./axiosClient";

export const wishlistApi = {
  // getWishlist: () => axiosClient.get("/wishlist"),
  getWishlist: () => Promise.resolve({ success: true, data: { items: [] } }),

  // addToWishlist: (productId) => axiosClient.post("/wishlist/items", { productId }),
  addToWishlist: (productId) => Promise.resolve({ success: true, message: "Added to wishlist" }),

  // removeFromWishlist: (productId) => axiosClient.delete(`/wishlist/items/${productId}`),
  removeFromWishlist: (productId) => Promise.resolve({ success: true, message: "Removed from wishlist" }),

  // moveToCart: (productId) => axiosClient.post("/wishlist/move-to-cart", { productId }),
  moveToCart: (productId) => Promise.resolve({ success: true, message: "Moved to cart" }),
};
