import { create } from "zustand";

const STORAGE_KEY = "kln_buy_now_item";

export const useBuyNowStore = create((set, get) => ({
  buyNowItem: null,
  isBuyNowActive: false,

  setBuyNowProduct: (product, quantity = 1, variant = null) => {
    if (!product) return;
    const qty = Math.max(1, Number(quantity) || 1);
    const price = Number(product.price) || 0;
    const getImageUrl = (img) => {
      if (!img) return "/images/products/hairoil/oilf.jpeg";
      if (typeof img === "string") return img;
      if (typeof img === "object" && img.url) return img.url;
      return "/images/products/hairoil/oilf.jpeg";
    };

    const rawImg = Array.isArray(product.images) ? product.images[0] : product.images || product.image || product.imageUrl || "/images/products/hairoil/oilf.jpeg";
    const cleanImg = getImageUrl(rawImg);

    const item = {
      id: "buynow-item-" + Date.now(),
      productId: product.id,
      name: product.name || "Ayurvedic Product",
      slug: product.slug || product.id,
      price: price,
      originalPrice: product.originalPrice || price,
      quantity: qty,
      variant: variant || product.variant || null,
      subtotal: price * qty,
      image: cleanImg,
      category: typeof product.category === "object" ? product.category?.name : product.category || "Hair Care",
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
            const current = get().buyNowItem;
            if (!current || current.id !== parsed.id || current.quantity !== parsed.quantity) {
              set({ buyNowItem: parsed, isBuyNowActive: true });
            }
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
