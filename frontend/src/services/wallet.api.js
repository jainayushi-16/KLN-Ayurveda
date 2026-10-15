import { axiosClient } from "./axiosClient";

export const walletApi = {
  // Customer endpoints
  getWalletBalance: () => axiosClient.get("/wallet"),
  getWalletTransactions: (params) => axiosClient.get("/wallet/transactions", { params }),

  // Admin endpoints
  adminGetAllWallets: (params) => axiosClient.get("/admin/wallet/all", { params }),
  adminGetCustomerTransactions: (userId, params) => axiosClient.get(`/admin/wallet/${userId}/transactions`, { params }),
  adminAdjustWallet: (userId, data) => axiosClient.post(`/admin/wallet/${userId}/adjust`, data),
  adminExportTransactions: (params) => axiosClient.get("/admin/wallet/export", { params, responseType: "blob" }),
};
