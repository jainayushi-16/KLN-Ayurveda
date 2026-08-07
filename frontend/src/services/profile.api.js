// Standalone Mode: Backend API integration calls commented out for future enablement.
// import { axiosClient } from "./axiosClient";
import {
  DUMMY_PROFILE_USER,
  DUMMY_ADDRESSES,
  DUMMY_ORDERS_LIST,
  DUMMY_WISHLIST,
  DUMMY_PAYMENT_METHODS,
  DUMMY_SECURITY_DEVICES,
  DUMMY_NOTIFICATION_SETTINGS,
} from "@/data/profile";

export const profileApi = {
  // Get User Profile
  // getProfile: () => axiosClient.get("/profile/me"),
  getProfile: () =>
    Promise.resolve({
      success: true,
      data: DUMMY_PROFILE_USER,
    }),

  // Update Personal Information
  // updateProfile: (data) => axiosClient.put("/profile/me", data),
  updateProfile: (data) =>
    Promise.resolve({
      success: true,
      message: "Personal information updated successfully",
      data: { ...DUMMY_PROFILE_USER, ...data },
    }),

  // Upload Profile Avatar Photo
  // uploadAvatar: (formData) => axiosClient.post("/profile/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  uploadAvatar: (file) =>
    Promise.resolve({
      success: true,
      message: "Profile image updated successfully",
      avatarUrl: URL.createObjectURL(file),
    }),

  // Address Book APIs
  // getAddresses: () => axiosClient.get("/profile/addresses"),
  getAddresses: () =>
    Promise.resolve({
      success: true,
      data: DUMMY_ADDRESSES,
    }),

  // addAddress: (addressData) => axiosClient.post("/profile/addresses", addressData),
  addAddress: (addressData) =>
    Promise.resolve({
      success: true,
      message: "Address added to book",
      data: { id: `addr-${Date.now()}`, ...addressData },
    }),

  // updateAddress: (id, addressData) => axiosClient.put(`/profile/addresses/${id}`, addressData),
  updateAddress: (id, addressData) =>
    Promise.resolve({
      success: true,
      message: "Address updated successfully",
      data: { id, ...addressData },
    }),

  // deleteAddress: (id) => axiosClient.delete(`/profile/addresses/${id}`),
  deleteAddress: (id) =>
    Promise.resolve({
      success: true,
      message: "Address removed successfully",
      id,
    }),

  // Orders APIs
  // getOrders: () => axiosClient.get("/profile/orders"),
  getOrders: () =>
    Promise.resolve({
      success: true,
      data: DUMMY_ORDERS_LIST,
    }),

  // reorderItems: (orderId) => axiosClient.post(`/profile/orders/${orderId}/reorder`),
  reorderItems: (orderId) =>
    Promise.resolve({
      success: true,
      message: `Items from Order ${orderId} added to cart`,
    }),

  // Wishlist APIs
  // getWishlist: () => axiosClient.get("/profile/wishlist"),
  getWishlist: () =>
    Promise.resolve({
      success: true,
      data: DUMMY_WISHLIST,
    }),

  // Security APIs
  // changePassword: (passwords) => axiosClient.post("/profile/security/change-password", passwords),
  changePassword: (passwords) =>
    Promise.resolve({
      success: true,
      message: "Password changed successfully",
    }),

  // toggle2FA: (enabled) => axiosClient.post("/profile/security/2fa", { enabled }),
  toggle2FA: (enabled) =>
    Promise.resolve({
      success: true,
      message: enabled ? "Two-Factor Authentication enabled" : "Two-Factor Authentication disabled",
    }),

  // revokeDevice: (deviceId) => axiosClient.delete(`/profile/security/devices/${deviceId}`),
  revokeDevice: (deviceId) =>
    Promise.resolve({
      success: true,
      message: "Device session revoked",
      deviceId,
    }),

  // Notification Preferences APIs
  // updateNotifications: (settings) => axiosClient.put("/profile/notifications", settings),
  updateNotifications: (settings) =>
    Promise.resolve({
      success: true,
      message: "Notification preferences updated",
      data: settings,
    }),

  // Privacy & Data APIs
  // downloadUserData: () => axiosClient.get("/profile/privacy/download-data"),
  downloadUserData: () =>
    Promise.resolve({
      success: true,
      message: "Data export initiated. Download starting...",
    }),

  // deleteAccount: () => axiosClient.delete("/profile/privacy/delete-account"),
  deleteAccount: () =>
    Promise.resolve({
      success: true,
      message: "Account deletion requested",
    }),
};
