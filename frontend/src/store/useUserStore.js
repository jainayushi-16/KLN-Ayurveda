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
                set({ profile: res.data, addresses: res.data.addresses || [] });
            }
        }
        catch (err) {
            // Handled gracefully
        }
        finally {
            set({ isLoading: false });
        }
    },
    updateProfile: async (data) => {
        try {
            const res = await userApi.updateProfile(data);
            if (res.success) {
                toast.success("Profile updated successfully!");
                get().fetchProfile();
                return true;
            }
            return false;
        }
        catch (err) {
            return false;
        }
    },
    fetchAddresses: async () => {
        try {
            const res = await userApi.getAddresses();
            if (res.success && res.data) {
                set({ addresses: res.data });
            }
        }
        catch (err) {
            // Handled gracefully
        }
    },
    addAddress: async (data) => {
        try {
            const res = await userApi.addAddress(data);
            if (res.success) {
                toast.success("New shipping address added!");
                get().fetchAddresses();
                return true;
            }
            return false;
        }
        catch (err) {
            return false;
        }
    },
}));
