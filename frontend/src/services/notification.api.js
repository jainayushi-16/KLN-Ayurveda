import { axiosClient } from "./axiosClient";

export const notificationApi = {
  getNotifications: async () => {
    const res = await axiosClient.get("/notifications");
    return res.data;
  },

  getUnreadCount: async () => {
    const res = await axiosClient.get("/notifications/unread-count");
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await axiosClient.patch(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await axiosClient.patch("/notifications/read-all");
    return res.data;
  },
};
