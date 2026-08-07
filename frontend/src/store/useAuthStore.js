import { create } from "zustand";
import { authApi } from "@/services/auth.api";
import { CURRENT_USER } from "@/data/users";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  user: typeof window !== "undefined" && localStorage.getItem("kln_user")
    ? JSON.parse(localStorage.getItem("kln_user") || "null")
    : CURRENT_USER,
  token: typeof window !== "undefined" ? localStorage.getItem("kln_token") || CURRENT_USER.token : CURRENT_USER.token,
  isAuthenticated: true,
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

  login: async (credentials) => {
    // Standalone Mode: Backend API call commented out
    /*
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data) {
        const { user, tokens } = res.data;
        get().setAuth(user, tokens.accessToken);
        toast.success(`Welcome back, ${user.fullName}!`);
        return true;
      }
    } catch (err) {}
    */

    const userObj = { ...CURRENT_USER, email: credentials.email || CURRENT_USER.email };
    get().setAuth(userObj, CURRENT_USER.token);
    toast.success(`Welcome back, ${userObj.fullName}!`);

    set({ isAuthModalOpen: false });
    const pending = get().pendingAction;
    if (pending) {
      pending();
      set({ pendingAction: null });
    }
    return true;
  },

  register: async (data) => {
    // Standalone Mode: Backend API call commented out
    /*
    try {
      const res = await authApi.register(data);
      if (res.success && res.data) {
        const { user, tokens } = res.data;
        get().setAuth(user, tokens.accessToken);
        toast.success(`Account created successfully! Welcome, ${user.fullName}.`);
        return true;
      }
    } catch (err) {}
    */

    const newUser = {
      ...CURRENT_USER,
      fullName: `${data.firstName || "Aarav"} ${data.lastName || "Patel"}`.trim(),
      email: data.email || CURRENT_USER.email,
    };
    get().setAuth(newUser, CURRENT_USER.token);
    toast.success(`Account created successfully! Welcome, ${newUser.fullName}.`);

    set({ isAuthModalOpen: false });
    const pending = get().pendingAction;
    if (pending) {
      pending();
      set({ pendingAction: null });
    }
    return true;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("kln_user");
      localStorage.removeItem("kln_token");
    }
    set({ user: null, token: null, isAuthenticated: false });
    toast.success("Logged out successfully.");
  },
}));
