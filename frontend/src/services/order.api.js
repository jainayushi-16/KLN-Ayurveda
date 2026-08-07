import { axiosClient } from "./axiosClient";
export const orderApi = {
    createOrder: (data) => axiosClient.post("/orders", data),
    getUserOrders: () => axiosClient.get("/orders"),
    getOrderDetails: (orderId) => axiosClient.get(`/orders/${orderId}`),
    trackOrder: (orderNumber) => axiosClient.get(`/orders/track/${orderNumber}`),
    cancelOrder: (orderId) => axiosClient.post(`/orders/${orderId}/cancel`),
};
