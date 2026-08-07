// Temporary Standalone Mode: Backend API call commented out
// import { axiosClient } from "./axiosClient";
import { INITIAL_CART } from "@/data/cart";

export const cartApi = {
  // getCart: () => axiosClient.get("/cart"),
  getCart: () => Promise.resolve({ success: true, data: INITIAL_CART }),

  // addToCart: (productId, quantity = 1) => axiosClient.post("/cart/items", { productId, quantity }),
  addToCart: (productId, quantity = 1) =>
    Promise.resolve({ success: true, message: `Added ${quantity}x item to cart` }),

  // updateQuantity: (productId, quantity) => axiosClient.put("/cart/items", { productId, quantity }),
  updateQuantity: (productId, quantity) =>
    Promise.resolve({ success: true, message: `Updated quantity to ${quantity}` }),

  // removeItem: (productId) => axiosClient.delete(`/cart/items/${productId}`),
  removeItem: (productId) =>
    Promise.resolve({ success: true, message: "Item removed from cart" }),

  // clearCart: () => axiosClient.delete("/cart"),
  clearCart: () =>
    Promise.resolve({ success: true, message: "Cart cleared" }),
};
