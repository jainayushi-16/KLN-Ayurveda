import { axiosClient } from "./axiosClient";

export const adminApi = {
  getDashboardStats: () => axiosClient.get("/admin/dashboard"),
  getReviews: () => axiosClient.get("/admin/reviews"),
  createReview: (data) => axiosClient.post("/admin/reviews", data),
  deleteReview: (reviewId) => axiosClient.delete(`/admin/reviews/${reviewId}`),
};
