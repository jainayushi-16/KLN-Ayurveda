// Temporary Standalone Mode: Backend API calls commented out
// import { axiosClient } from "./axiosClient";
import { DUMMY_ORDERS, INITIAL_ORDER } from "@/data/orders";

export const orderApi = {
  // createOrder: (data) => axiosClient.post("/orders", data),
  createOrder: (data) => Promise.resolve({ success: true, data: INITIAL_ORDER }),

  // getUserOrders: () => axiosClient.get("/orders"),
  getUserOrders: () => Promise.resolve({ success: true, data: DUMMY_ORDERS }),

  // getOrderDetails: (orderId) => axiosClient.get(`/orders/${orderId}`),
  getOrderDetails: (orderId) => {
    const order = DUMMY_ORDERS.find((o) => o.orderId === orderId) || INITIAL_ORDER;
    return Promise.resolve({ success: true, data: order });
  },

  // trackOrder: (orderNumber) => axiosClient.get(`/orders/track/${orderNumber}`),
  trackOrder: (orderNumber) => Promise.resolve({ success: true, data: { status: "DISPATCHED", estimatedDelivery: "3-5 Days" } }),

  // cancelOrder: (orderId) => axiosClient.post(`/orders/${orderId}/cancel`),
  cancelOrder: (orderId) => Promise.resolve({ success: true, message: "Order cancelled successfully" }),
};
