import { create } from "zustand";
import { cartApi } from "@/services/cart.api";
import { PRODUCTS } from "@/data/products";
import toast from "react-hot-toast";

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

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await cartApi.getCart();
      if (res && res.data) {
        set({
          cart: res.data,
          items: res.data.items || [],
          totalItems: res.data.totalItems || 0,
          subtotal: res.data.subtotal || 0,
          totalAmount: res.data.totalAmount || 0,
          shipping: res.data.shipping || 0,
          tax: res.data.tax || 0,
        });
      }
    } catch (err) {
      set({ error: err.message || "Failed to fetch cart" });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    const matchedProduct = PRODUCTS.find((p) => p.id === productId);
    const existingIndex = get().items.findIndex((item) => item.productId === productId);
    let updatedItems = [...get().items];

    // Optimistic local update
    if (existingIndex > -1) {
      updatedItems[existingIndex].quantity += quantity;
      updatedItems[existingIndex].subtotal = updatedItems[existingIndex].price * updatedItems[existingIndex].quantity;
    } else {
      updatedItems.push({
        id: "cart-item-" + Date.now(),
        productId,
        name: matchedProduct ? matchedProduct.name : "Ayurvedic Formulation",
        slug: (matchedProduct && matchedProduct.slug) || "formulation",
        price: matchedProduct ? matchedProduct.price : 49,
        quantity,
        subtotal: (matchedProduct ? matchedProduct.price : 49) * quantity,
        image: matchedProduct ? matchedProduct.images[0] : "/images/products/hairoil/oilf.jpeg",
        category: matchedProduct ? matchedProduct.category : "Hair Care",
      });
    }

    const newTotalItems = updatedItems.reduce((acc, curr) => acc + curr.quantity, 0);
    const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
    set({
      items: updatedItems,
      totalItems: newTotalItems,
      subtotal: newSubtotal,
      totalAmount: newSubtotal,
    });
    toast.success(`Added ${quantity}x "${matchedProduct ? matchedProduct.name : "Formulation"}" to Cart 🛒`);

    // Sync with backend
    try {
      const res = await cartApi.addToCart(productId, quantity);
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
      console.error("Failed to sync cart with backend:", err);
      toast.error("Cart saved locally. Will sync when connection improves.");
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
    set({ items: [], totalItems: 0, subtotal: 0, totalAmount: 0, shipping: 0, tax: 0 });

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
        });
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  },
}));
