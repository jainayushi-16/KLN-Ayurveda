import { create } from "zustand";
import { walletApi } from "@/services/wallet.api";

export const useWalletStore = create((set, get) => ({
  balance: 0,
  currencySymbol: "₹",
  totalCashback: 0,
  totalRefunds: 0,
  totalPurchases: 0,
  transactions: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
  isLoading: false,
  isTransactionsLoading: false,
  error: null,

  fetchWalletBalance: async () => {
    const isAuth = typeof window !== "undefined" && Boolean(localStorage.getItem("kln_token"));
    if (!isAuth) return;

    set({ isLoading: true, error: null });
    try {
      const res = await walletApi.getWalletBalance();
      const d = res?.data || res || {};
      if (d) {
        set({
          balance: Number(d.balance || 0),
          currencySymbol: d.currencySymbol || "₹",
          totalCashback: Number(d.totalCashback || 0),
          totalRefunds: Number(d.totalRefunds || 0),
          totalPurchases: Number(d.totalPurchases || 0),
        });
      }
    } catch (err) {
      console.warn("Fetch wallet balance error:", err?.response?.data?.message || err.message);
      set({ error: err?.response?.data?.message || "Failed to load wallet balance" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchWalletTransactions: async ({ page = 1, limit = 20, type = "ALL", search = "" } = {}) => {
    const isAuth = typeof window !== "undefined" && Boolean(localStorage.getItem("kln_token"));
    if (!isAuth) return;

    set({ isTransactionsLoading: true });
    try {
      const res = await walletApi.getWalletTransactions({ page, limit, type, search });
      if (res) {
        const rawItems = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : (res.data?.items || []));
        const rawPag = res.pagination || res.data?.pagination || {};
        const pagination = {
          page: Number(rawPag.page || page || 1),
          limit: Number(rawPag.limit || limit || 20),
          total: Number(rawPag.totalItems !== undefined ? rawPag.totalItems : (rawPag.total !== undefined ? rawPag.total : rawItems.length)),
          totalItems: Number(rawPag.totalItems !== undefined ? rawPag.totalItems : (rawPag.total !== undefined ? rawPag.total : rawItems.length)),
          totalPages: Number(rawPag.totalPages || Math.ceil((rawPag.totalItems || rawItems.length) / (rawPag.limit || limit || 20)) || 1),
        };
        set({ transactions: rawItems, pagination });
      }
    } catch (err) {
      console.warn("Fetch wallet transactions error:", err?.response?.data?.message || err.message);
    } finally {
      set({ isTransactionsLoading: false });
    }
  },
}));
