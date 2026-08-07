import { create } from "zustand";
import { userApi } from "@/services/user.api";
import { CURRENT_USER } from "@/data/users";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  profile: CURRENT_USER,
  addresses: [CURRENT_USER.address],
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await userApi.getProfile();
      if (res.success && res.data) {
        set({ profile: res.data, addresses: [res.data.address] });
      }
    } catch (err) {
      set({ profile: CURRENT_USER, addresses: [CURRENT_USER.address] });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const updatedProfile = { ...get().profile, ...data };
    set({ profile: updatedProfile });
    toast.success("Profile updated successfully!");

    // Standalone Mode: Backend call commented out
    /*
    try {
      await userApi.updateProfile(data);
    } catch (err) {}
    */
    return true;
  },

  fetchAddresses: async () => {
    try {
      const res = await userApi.getAddresses();
      if (res.success && res.data) {
        set({ addresses: res.data });
      }
    } catch (err) {
      set({ addresses: [CURRENT_USER.address] });
    }
  },

  addAddress: async (data) => {
    set((state) => ({ addresses: [...state.addresses, data] }));
    toast.success("New shipping address added!");

    // Standalone Mode: Backend call commented out
    /*
    try {
      await userApi.addAddress(data);
    } catch (err) {}
    */
    return true;
  },
}));
