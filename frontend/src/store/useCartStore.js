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
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await cartApi.getCart();
      if (res.success && res.data) {
        set({
          cart: res.data,
          items: res.data.items || [],
          totalItems: res.data.totalItems || 0,
          subtotal: res.data.subtotal || 0,
          totalAmount: res.data.totalAmount || 0,
        });
      }
    } catch (err) {
      // Handled gracefully
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    // Optimistic local state update & toast notification
    const matchedProduct = PRODUCTS.find((p) => p.id === productId);
    const existingIndex = get().items.findIndex((item) => item.productId === productId);
    let updatedItems = [...get().items];
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

    // Standalone Mode: Backend API sync commented out
    /*
    try {
      await cartApi.addToCart(productId, quantity);
    } catch (err) {
      // Backend request sync error handled gracefully
    }
    */
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

    // Standalone Mode: Backend API sync commented out
    /*
    try {
      await cartApi.updateQuantity(productId, quantity);
    } catch (err) {
      // Handled gracefully
    }
    */
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

    // Standalone Mode: Backend API sync commented out
    /*
    try {
      await cartApi.removeItem(productId);
    } catch (err) {
      // Handled gracefully
    }
    */
  },

  clearCart: async () => {
    set({ items: [], totalItems: 0, subtotal: 0, totalAmount: 0 });

    // Standalone Mode: Backend API sync commented out
    /*
    try {
      await cartApi.clearCart();
    } catch (err) {
      // Handled gracefully
    }
    */
  },
}));
