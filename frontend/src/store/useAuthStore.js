import { create } from "zustand";
import { authApi } from "@/services/auth.api";
import toast from "react-hot-toast";

const getSavedUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const u = localStorage.getItem("kln_user");
    const parsed = u ? JSON.parse(u) : null;
    const savedAvatar = localStorage.getItem("kln_avatar");
    if (parsed && savedAvatar) {
      parsed.avatar = savedAvatar;
    }
    return parsed;
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
  isAuthChecking: false,
  isAuthModalOpen: false,
  modalMessage: "Please sign in to continue shopping.",
  pendingAction: null,

  openAuthModal: (message, action) => {
    const msg = typeof message === "string" ? message : "Please sign in to continue shopping.";
    const fn = typeof action === "function" ? action : null;
    set({
      isAuthModalOpen: true,
      modalMessage: msg,
      pendingAction: fn,
    });
  },

  closeAuthModal: () => set({ isAuthModalOpen: false, pendingAction: null }),

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      try {
        const cleanUser = { ...user };
        if (cleanUser.avatar && cleanUser.avatar.length > 500) {
          try {
            localStorage.setItem("kln_avatar", cleanUser.avatar);
          } catch (e) {}
          delete cleanUser.avatar;
        }
        localStorage.setItem("kln_user", JSON.stringify(cleanUser));
        localStorage.setItem("kln_token", token);
      } catch (e) {
        console.warn("Storage quota warning handled in setAuth:", e);
      }
    }
    const savedAvatar = typeof window !== "undefined" ? localStorage.getItem("kln_avatar") : null;
    const finalUser = { ...user, avatar: savedAvatar || user?.avatar };
    set({ user: finalUser, token, isAuthenticated: true });
  },

  updateUser: (updatedFields) => {
    const currentUser = get().user || {};
    const savedAvatar = typeof window !== "undefined" ? localStorage.getItem("kln_avatar") : null;
    const persistentAvatar = updatedFields?.avatar || savedAvatar || currentUser.avatar;

    const newUser = { ...currentUser, ...updatedFields, avatar: persistentAvatar };

    if (typeof window !== "undefined") {
      try {
        if (updatedFields?.avatar && updatedFields.avatar.length > 500) {
          try {
            localStorage.setItem("kln_avatar", updatedFields.avatar);
          } catch (e) {}
        }
        const cleanUser = { ...newUser };
        if (cleanUser.avatar && cleanUser.avatar.length > 500) {
          delete cleanUser.avatar;
        }
        localStorage.setItem("kln_user", JSON.stringify(cleanUser));
      } catch (e) {
        console.warn("Storage quota exception handled in updateUser:", e);
      }
    }

    set({ user: newUser });
  },

  checkAuth: async () => {
    set({ isAuthChecking: true });
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null, isAuthChecking: false });
      return false;
    }
    try {
      const res = await authApi.getMe();
      if (res && res.data) {
        const savedAvatar = typeof window !== "undefined" ? localStorage.getItem("kln_avatar") : null;
        const finalUser = {
          ...res.data,
          avatar: savedAvatar || res.data.avatar || get().user?.avatar,
        };
        get().updateUser(finalUser);
        set({ isAuthenticated: true, isAuthChecking: false });
        return true;
      }
    } catch (err) {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("kln_user");
          localStorage.removeItem("kln_token");
        } catch (e) {}
      }
      set({ user: null, token: null, isAuthenticated: false, isAuthChecking: false });
    }
    set({ isAuthChecking: false });
    return false;
  },

  login: async (credentials) => {
    try {
      const res = await authApi.login(credentials);
      const data = res.data || res;
      if (data && (data.user || data.tokens)) {
        const user = data.user;
        const accessToken = data.tokens?.accessToken || data.accessToken;
        get().setAuth(user, accessToken);
        toast.success(`Welcome back, ${user.firstName || "User"}! 🌿`);
        set({ isAuthModalOpen: false });

        const pending = get().pendingAction;
        if (typeof pending === "function") {
          try {
            pending();
          } catch (e) {}
        }
        set({ pendingAction: null });
        return { success: true, user };
      }
      throw new Error(res?.message || "Login failed");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Invalid credentials.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  },

  register: async (data) => {
    try {
      const res = await authApi.register(data);
      const payload = res.data || res;
      if (payload && (payload.user || payload.tokens)) {
        const newUser = payload.user;
        const accessToken = payload.tokens?.accessToken || payload.accessToken;
        get().setAuth(newUser, accessToken);
        toast.success(`Account created! Welcome, ${newUser.firstName || "User"}. 🌿`);
        set({ isAuthModalOpen: false });

        const pending = get().pendingAction;
        if (typeof pending === "function") {
          try {
            pending();
          } catch (e) {}
        }
        set({ pendingAction: null });
        return { success: true, user: newUser };
      }
      throw new Error(res?.message || "Registration failed");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Registration failed.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (e) {}
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("kln_user");
        localStorage.removeItem("kln_token");
      } catch (e) {}
    }
    set({ user: null, token: null, isAuthenticated: false });
    toast.success("Logged out successfully.");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
}));
