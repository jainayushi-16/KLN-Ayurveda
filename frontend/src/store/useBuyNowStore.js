import { create } from "zustand";

const STORAGE_KEY = "kln_buy_now_item";

export const useBuyNowStore = create((set, get) => ({
  buyNowItem: null,
  isBuyNowActive: false,

  setBuyNowProduct: (product, quantity = 1, variant = null) => {
    if (!product) return;
    const qty = Math.max(1, Number(quantity) || 1);
    const price = Number(product.price) || 0;
    const item = {
      id: "buynow-item-" + Date.now(),
      productId: product.id,
      name: product.name,
      slug: product.slug || product.id,
      price: price,
      originalPrice: product.originalPrice || price,
      quantity: qty,
      variant: variant || product.variant || null,
      subtotal: price * qty,
      image: product.images?.[0] || product.image || "/images/products/hairoil/oilf.jpeg",
      category: product.category || "Hair Care",
    };

    set({ buyNowItem: item, isBuyNowActive: true });
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(item));
      } catch (e) {
        console.error("Failed to save buyNowItem to sessionStorage", e);
      }
    }
    return item;
  },

  updateBuyNowQuantity: (quantity) => {
    const item = get().buyNowItem || get().loadFromStorage();
    if (!item) return;
    const qty = Number(quantity);
    if (qty < 1) {
      get().clearBuyNow();
      return;
    }
    const updated = {
      ...item,
      quantity: qty,
      subtotal: item.price * qty,
    };
    set({ buyNowItem: updated, isBuyNowActive: true });
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update buyNowItem in sessionStorage", e);
      }
    }
    return updated;
  },

  clearBuyNow: () => {
    set({ buyNowItem: null, isBuyNowActive: false });
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // ignore
      }
    }
  },

  loadFromStorage: () => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.productId && parsed.price) {
            set({ buyNowItem: parsed, isBuyNowActive: true });
            return parsed;
          }
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  },
}));
