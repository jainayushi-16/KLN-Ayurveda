import { create } from "zustand";
import { wishlistApi } from "@/services/wishlist.api";
import { PRODUCTS } from "@/data/products";
import toast from "react-hot-toast";

export const useWishlistStore = create((set, get) => ({
  items: [],
  wishlistIds: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const res = await wishlistApi.getWishlist();
      if (res.success && res.data) {
        const items = res.data.items || [];
        const ids = items.map((i) => i.productId);
        set({ items, wishlistIds: ids });
      }
    } catch (err) {
      // Handled gracefully
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId) => {
    const isWishlisted = get().wishlistIds.includes(productId);
    const matchedProduct = PRODUCTS.find((p) => p.id === productId);
    if (isWishlisted) {
      const updatedIds = get().wishlistIds.filter((id) => id !== productId);
      const updatedItems = get().items.filter((item) => item.productId !== productId);
      set({ wishlistIds: updatedIds, items: updatedItems });
      toast.success("Removed from Wishlist");

      // Standalone Mode: Backend sync commented out
      /*
      try {
        await wishlistApi.removeFromWishlist(productId);
      } catch (err) {}
      */
    } else {
      const updatedIds = [...get().wishlistIds, productId];
      const newItem = {
        id: "wishlist-" + Date.now(),
        productId,
        name: matchedProduct ? matchedProduct.name : "Formulation",
        slug: matchedProduct ? matchedProduct.slug : "formulation",
        shortDesc: matchedProduct ? matchedProduct.shortDesc : "",
        price: matchedProduct ? matchedProduct.price : 49,
        rating: matchedProduct ? matchedProduct.rating : 4.9,
        inStock: true,
        image: matchedProduct ? matchedProduct.images[0] : "/images/products/hairoil/oilf.jpeg",
        category: matchedProduct ? matchedProduct.category : "Hair Care",
      };
      set({ wishlistIds: updatedIds, items: [...get().items, newItem] });
      toast.success("Saved to Wishlist ♥");

      // Standalone Mode: Backend sync commented out
      /*
      try {
        await wishlistApi.addToWishlist(productId);
      } catch (err) {}
      */
    }
  },

  removeFromWishlist: async (productId) => {
    const updatedIds = get().wishlistIds.filter((id) => id !== productId);
    const updatedItems = get().items.filter((item) => item.productId !== productId);
    set({ wishlistIds: updatedIds, items: updatedItems });
    toast.success("Item removed from Wishlist");

    // Standalone Mode: Backend sync commented out
    /*
    try {
      await wishlistApi.removeFromWishlist(productId);
    } catch (err) {}
    */
  },

  moveToCart: async (productId) => {
    const updatedIds = get().wishlistIds.filter((id) => id !== productId);
    const updatedItems = get().items.filter((item) => item.productId !== productId);
    set({ wishlistIds: updatedIds, items: updatedItems });
    toast.success("Moved item to Cart 🛒");

    // Standalone Mode: Backend sync commented out
    /*
    try {
      await wishlistApi.moveToCart(productId);
    } catch (err) {}
    */
  },
}));
