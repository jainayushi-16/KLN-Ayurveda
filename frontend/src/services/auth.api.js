import { axiosClient } from "./axiosClient";

export const authApi = {
  register: (data) => axiosClient.post("/auth/register", data),
  login: (data) => axiosClient.post("/auth/login", data),
  logout: () => axiosClient.post("/auth/logout"),
  refreshToken: () => axiosClient.post("/auth/refresh-token"),
  forgotPassword: (data) => axiosClient.post("/auth/forgot-password", data),
  resetPassword: (data) => axiosClient.post("/auth/reset-password", data),
  changePassword: (data) => axiosClient.post("/auth/change-password", data),
  getMe: () => axiosClient.get("/auth/me"),
};

