// Temporary Standalone Mode: Backend API calls commented out
// import { axiosClient } from "./axiosClient";
import { CURRENT_USER } from "@/data/users";

export const authApi = {
  // register: (data) => axiosClient.post("/auth/register", data),
  register: (data) => Promise.resolve({ success: true, data: CURRENT_USER, message: "Registration successful" }),

  // login: (data) => axiosClient.post("/auth/login", data),
  login: (data) => Promise.resolve({ success: true, data: CURRENT_USER, message: "Login successful" }),

  // logout: () => axiosClient.post("/auth/logout"),
  logout: () => Promise.resolve({ success: true, message: "Logout successful" }),

  // refreshToken: () => axiosClient.post("/auth/refresh-token"),
  refreshToken: () => Promise.resolve({ success: true, token: CURRENT_USER.token }),

  // changePassword: (data) => axiosClient.post("/auth/change-password", data),
  changePassword: (data) => Promise.resolve({ success: true, message: "Password updated successfully" }),

  // getMe: () => axiosClient.get("/auth/me"),
  getMe: () => Promise.resolve({ success: true, data: CURRENT_USER }),
};
