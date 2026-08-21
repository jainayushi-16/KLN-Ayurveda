import { axiosClient } from "./axiosClient";
import {
  DUMMY_PAYMENT_METHODS,
  DUMMY_SECURITY_DEVICES,
  DUMMY_NOTIFICATION_SETTINGS,
} from "@/data/profile";

export const profileApi = {
  // Get User Profile — maps to GET /users/profile
  getProfile: () => axiosClient.get("/users/profile"),

  // Update Personal Information — maps to PUT /users/profile
  updateProfile: (data) => axiosClient.put("/users/profile", data),

  // Upload Profile Avatar Photo — no backend endpoint yet, keep dummy
  uploadAvatar: (file) =>
    Promise.resolve({
      success: true,
      message: "Profile image updated successfully",
      avatarUrl: URL.createObjectURL(file),
    }),

  // Address Book APIs — maps to /users/addresses
  getAddresses: () => axiosClient.get("/users/addresses"),
  addAddress: (addressData) => axiosClient.post("/users/addresses", addressData),
  updateAddress: (id, addressData) => axiosClient.put(`/users/addresses/${id}`, addressData),
  deleteAddress: (id) => axiosClient.delete(`/users/addresses/${id}`),
  setDefaultAddress: (id) => axiosClient.patch(`/users/addresses/${id}/default`),

  // Orders — maps to GET /orders
  getOrders: () => axiosClient.get("/orders"),

  // reorderItems — no backend endpoint, stub
  reorderItems: (orderId) =>
    Promise.resolve({
      success: true,
      message: `Items from Order ${orderId} added to cart`,
    }),

  // Wishlist — maps to GET /wishlist
  getWishlist: () => axiosClient.get("/wishlist"),

  // Remove from wishlist — maps to DELETE /wishlist/items/:productId
  removeFromWishlist: (productId) => axiosClient.delete(`/wishlist/items/${productId}`),

  // Security — change password maps to POST /auth/change-password
  changePassword: (passwords) => axiosClient.post("/auth/change-password", passwords),

  // 2FA, devices, notifications — no backend endpoints yet, keep as stubs
  toggle2FA: (enabled) =>
    Promise.resolve({
      success: true,
      message: enabled ? "Two-Factor Authentication enabled" : "Two-Factor Authentication disabled",
    }),
  revokeDevice: (deviceId) =>
    Promise.resolve({
      success: true,
      message: "Device session revoked",
      deviceId,
    }),
  updateNotifications: (settings) =>
    Promise.resolve({
      success: true,
      message: "Notification preferences updated",
      data: settings,
    }),

  // Privacy — download data stub; deleteAccount maps to DELETE /users/account
  downloadUserData: () =>
    Promise.resolve({
      success: true,
      message: "Data export initiated. Download starting...",
    }),
  deleteAccount: () => axiosClient.delete("/users/account"),
};
