import { create } from "zustand";
import { authApi } from "@/services/auth.api";
import toast from "react-hot-toast";

const getSavedUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const u = localStorage.getItem("kln_user");
    return u ? JSON.parse(u) : null;
  } catch (e) {
    return null;
  }
};

const getSavedToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kln_token") || null;
};

export const useAuthStore = create((set, get) => ({
  user: getSavedUser(),
  token: getSavedToken(),
  isAuthenticated: Boolean(getSavedToken()),
  isAuthModalOpen: false,
  modalMessage: "Please sign in to continue shopping.",
  pendingAction: null,

  openAuthModal: (message, action) =>
    set({
      isAuthModalOpen: true,
      modalMessage: message || "Please sign in to continue shopping.",
      pendingAction: action || null,
    }),

  closeAuthModal: () => set({ isAuthModalOpen: false }),

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kln_user", JSON.stringify(user));
      localStorage.setItem("kln_token", token);
    }
    set({ user, token, isAuthenticated: true });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }
    try {
      const res = await authApi.getMe();
      if (res && res.data) {
        set({ user: res.data, isAuthenticated: true });
        return true;
      }
    } catch (err) {
      // Token invalid or expired
      if (typeof window !== "undefined") {
        localStorage.removeItem("kln_user");
        localStorage.removeItem("kln_token");
      }
      set({ user: null, token: null, isAuthenticated: false });
    }
    return false;
  },

  login: async (credentials) => {
    try {
      const res = await authApi.login(credentials);
      if (res && res.data) {
        const { user, tokens } = res.data;
        const accessToken = tokens?.accessToken || res.data.accessToken;
        get().setAuth(user, accessToken);
        toast.success(`Welcome back, ${user.firstName || "User"}!`);
        set({ isAuthModalOpen: false });
        const pending = get().pendingAction;
        if (pending) {
          pending();
          set({ pendingAction: null });
        }
        return true;
      }
    } catch (err) {
      const msg = err.message || "Invalid email or password.";
      toast.error(msg);
      return false;
    }
  },

  register: async (data) => {
    try {
      const res = await authApi.register(data);
      if (res && res.data) {
        const { user, tokens } = res.data;
        const accessToken = tokens?.accessToken || res.data.accessToken;
        get().setAuth(user, accessToken);
        toast.success(`Account created! Welcome, ${user.firstName || "User"}.`);
        set({ isAuthModalOpen: false });
        const pending = get().pendingAction;
        if (pending) {
          pending();
          set({ pendingAction: null });
        }
        return true;
      }
    } catch (err) {
      const msg = err.message || "Registration failed.";
      toast.error(msg);
      return false;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("kln_user");
      localStorage.removeItem("kln_token");
    }
    set({ user: null, token: null, isAuthenticated: false });
    toast.success("Logged out successfully.");
  },
}));
