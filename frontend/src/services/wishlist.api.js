import { axiosClient } from "./axiosClient";

export const wishlistApi = {
  getWishlist: () => axiosClient.get("/wishlist"),
  addToWishlist: (productId) => axiosClient.post("/wishlist/items", { productId }),
  removeFromWishlist: (productId) => axiosClient.delete(`/wishlist/items/${productId}`),
  moveToCart: (productId) => axiosClient.post("/wishlist/move-to-cart", { productId }),
};
