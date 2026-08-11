import { axiosClient } from "./axiosClient";

export const orderApi = {
  // Normal cart checkout — backend reads from user's cart
  createOrder: (data) => axiosClient.post("/orders", data),

  // data shape: { shippingAddress, paymentMethod, buyNowItem? }
  getUserOrders: () => axiosClient.get("/orders"),
  getOrderDetails: (orderId) => axiosClient.get(`/orders/${orderId}`),
  trackOrder: (orderNumber) => axiosClient.get(`/orders/track/${orderNumber}`),
  cancelOrder: (orderId) => axiosClient.post(`/orders/${orderId}/cancel`),
};
