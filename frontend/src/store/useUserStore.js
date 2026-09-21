import { create } from "zustand";
import { userApi } from "@/services/user.api";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  profile: null,
  addresses: [],
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await userApi.getProfile();
      if (res.success && res.data) {
        set({ profile: res.data, addresses: res.data.addresses || (res.data.address ? [res.data.address] : []) });
      }
    } catch (err) {
      set({ profile: null, addresses: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await userApi.updateProfile(data);
      if (res.success && res.data) {
        set({ profile: res.data });
        toast.success("Profile updated successfully!");
        return true;
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
      return false;
    }
  },

  fetchAddresses: async () => {
    try {
      const res = await userApi.getAddresses();
      if (res.success && res.data) {
        set({ addresses: res.data });
      }
    } catch (err) {
      set({ addresses: [] });
    }
  },

  addAddress: async (data) => {
    try {
      const res = await userApi.addAddress(data);
      if (res.success && res.data) {
        set((state) => ({ addresses: [...state.addresses, res.data] }));
        toast.success("New shipping address added!");
        return true;
      }
    } catch (err) {
      toast.error(err.message || "Failed to add address.");
      return false;
    }
  },
}));
