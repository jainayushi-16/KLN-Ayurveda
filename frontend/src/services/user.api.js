// Temporary Standalone Mode: Backend API calls commented out
// import { axiosClient } from "./axiosClient";
import { CURRENT_USER } from "@/data/users";

export const userApi = {
  // getProfile: () => axiosClient.get("/users/profile"),
  getProfile: () => Promise.resolve({ success: true, data: CURRENT_USER }),

  // updateProfile: (data) => axiosClient.put("/users/profile", data),
  updateProfile: (data) => Promise.resolve({ success: true, data: { ...CURRENT_USER, ...data } }),

  // getAddresses: () => axiosClient.get("/users/addresses"),
  getAddresses: () => Promise.resolve({ success: true, data: [CURRENT_USER.address] }),

  // addAddress: (data) => axiosClient.post("/users/addresses", data),
  addAddress: (data) => Promise.resolve({ success: true, data }),

  // deleteAccount: () => axiosClient.delete("/users/account"),
  deleteAccount: () => Promise.resolve({ success: true, message: "Account deleted" }),
};
