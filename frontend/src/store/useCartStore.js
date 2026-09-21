import { create } from "zustand";
import { cartApi } from "@/services/cart.api";
import toast from "react-hot-toast";

const getSavedAppliedCoupon = () => {
  if (typeof window === "undefined") return null;
  try {
    const saved = sessionStorage.getItem("kln_applied_coupon");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export const useCartStore = create((set, get) => ({
  cart: null,
  items: [],
  totalItems: 0,
  subtotal: 0,
  totalAmount: 0,
  shipping: 0,
  tax: 0,
  isLoading: false,
  error: null,
  appliedCoupon: getSavedAppliedCoupon(),
  couponDiscount: getSavedAppliedCoupon()?.discountAmount || 0,

  fetchCart: async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("kln_token")) {
      set({ isLoading: false });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const res = await cartApi.getCart();
      if (res && res.data) {
        set({
          cart: res.data,
          items: res.data.items || [],
          totalItems: res.data.totalItems || (res.data.items ? res.data.items.reduce((sum, item) => sum + item.quantity, 0) : 0),
          subtotal: res.data.subtotal || 0,
          totalAmount: res.data.totalAmount || 0,
          shipping: res.data.shipping || 0,
          tax: res.data.tax || 0,
        });
      }
    } catch (err) {
      // Unauthenticated / empty cart
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ isLoading: true });
    try {
      const res = await cartApi.addToCart(productId, quantity);
      if (res && res.data) {
        const items = res.data.items || [];
        const totalItems = res.data.totalItems || items.reduce((sum, item) => sum + item.quantity, 0);
        set({
          cart: res.data,
          items,
          totalItems,
          subtotal: res.data.subtotal || 0,
          totalAmount: res.data.totalAmount || 0,
          shipping: res.data.shipping || 0,
          tax: res.data.tax || 0,
        });
        toast.success(`Added ${quantity} item(s) to Cart 🛒`);
      }
    } catch (err) {
      toast.error(err.message || "Please login to add items to your cart.");
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    const updatedItems = get().items.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity, subtotal: item.price * quantity };
      }
      return item;
    });
    const newTotalItems = updatedItems.reduce((acc, curr) => acc + curr.quantity, 0);
    const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
    set({
      items: updatedItems,
      totalItems: newTotalItems,
      subtotal: newSubtotal,
      totalAmount: newSubtotal,
    });

    // Sync with backend
    try {
      const res = await cartApi.updateQuantity(productId, quantity);
      if (res && res.data) {
        set({
          cart: res.data,
          items: res.data.items || updatedItems,
          totalItems: res.data.totalItems || newTotalItems,
          subtotal: res.data.subtotal || newSubtotal,
          totalAmount: res.data.totalAmount || newSubtotal,
          shipping: res.data.shipping || 0,
          tax: res.data.tax || 0,
        });
      }
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  },

  removeItem: async (productId) => {
    const updatedItems = get().items.filter((item) => item.productId !== productId);
    const newTotalItems = updatedItems.reduce((acc, curr) => acc + curr.quantity, 0);
    const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
    set({
      items: updatedItems,
      totalItems: newTotalItems,
      subtotal: newSubtotal,
      totalAmount: newSubtotal,
    });
    toast.success("Item removed from Cart");

    // Sync with backend
    try {
      const res = await cartApi.removeItem(productId);
      if (res && res.data) {
        set({
          cart: res.data,
          items: res.data.items || updatedItems,
          totalItems: res.data.totalItems || newTotalItems,
          subtotal: res.data.subtotal || newSubtotal,
          totalAmount: res.data.totalAmount || newSubtotal,
          shipping: res.data.shipping || 0,
          tax: res.data.tax || 0,
        });
      }
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  },

  clearCart: async () => {
    set({ items: [], totalItems: 0, subtotal: 0, totalAmount: 0, shipping: 0, tax: 0, appliedCoupon: null, couponDiscount: 0 });
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("kln_applied_coupon");
      } catch (e) {}
    }

    // Sync with backend
    try {
      const res = await cartApi.clearCart();
      if (res && res.data) {
        set({
          cart: res.data,
          items: [],
          totalItems: 0,
          subtotal: 0,
          totalAmount: 0,
          shipping: 0,
          tax: 0,
          appliedCoupon: null,
          couponDiscount: 0,
        });
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  },

  applyCoupon: async (couponCode) => {
    try {
      const offerApi = require("@/services/offer.api").default;
      const res = await offerApi.validateCoupon(couponCode, get().items);
      if (res && res.data) {
        set({
          appliedCoupon: res.data,
          couponDiscount: res.data.discountAmount || 0,
        });
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("kln_applied_coupon", JSON.stringify(res.data));
          } catch (e) {}
        }
        toast.success(res.data.message || `Coupon '${couponCode}' applied!`);
        return res.data;
      }
    } catch (err) {
      const msg = err.message || (err.errors && err.errors[0]) || "Invalid or ineligible coupon code.";
      toast.error(msg);
      throw err;
    }
  },

  removeCoupon: () => {
    set({ appliedCoupon: null, couponDiscount: 0 });
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("kln_applied_coupon");
      } catch (e) {}
    }
    toast.success("Coupon removed.");
  },
}));
