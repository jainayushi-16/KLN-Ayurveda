import { axiosClient } from "./axiosClient";

export const cartApi = {
  getCart: () => axiosClient.get("/cart"),
  addToCart: (productId, quantity = 1) => axiosClient.post("/cart/items", { productId, quantity }),
  updateQuantity: (productId, quantity) => axiosClient.put("/cart/items", { productId, quantity }),
  removeItem: (productId) => axiosClient.delete(`/cart/items/${productId}`),
  clearCart: () => axiosClient.delete("/cart"),
};
