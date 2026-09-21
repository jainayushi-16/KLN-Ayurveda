import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { wishlistApi } from "@/services/wishlist.api";
import toast from "react-hot-toast";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      wishlistIds: [],
      isLoading: false,
      error: null,

      fetchWishlist: async () => {
        if (typeof window !== "undefined" && !localStorage.getItem("kln_token")) {
          set({ isLoading: false, items: [], wishlistIds: [] });
          return;
        }
        set({ isLoading: true, error: null });
        try {
          const res = await wishlistApi.getWishlist();
          if (res && res.data && res.data.items) {
            const items = res.data.items.map((item) => ({
              id: item.id,
              productId: item.productId || item.product?.id,
              name: item.product?.name || item.name,
              slug: item.product?.slug || item.slug,
              shortDesc: item.product?.shortDesc || item.shortDesc || "",
              price: item.product?.price || item.price,
              rating: item.product?.rating || item.rating || 4.9,
              inStock: item.product?.inStock ?? item.inStock ?? true,
              image: item.product?.images?.[0]?.url || item.image || "/images/products/hairoil/oilf.jpeg",
              category: item.product?.category?.name || item.category || "Hair Care",
            }));
            const ids = items.map((i) => i.productId).filter(Boolean);
            set({ items, wishlistIds: ids });
          }
        } catch (err) {
          set({ items: [], wishlistIds: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      toggleWishlist: async (productId) => {
        if (typeof window !== "undefined" && !localStorage.getItem("kln_token")) {
          toast.error("Please login to manage your wishlist.");
          return;
        }
        const currentIds = get().wishlistIds || [];
        const isWishlisted = currentIds.includes(productId);

        try {
          if (isWishlisted) {
            await wishlistApi.removeFromWishlist(productId);
            toast.success("Removed from Wishlist");
          } else {
            await wishlistApi.addToWishlist(productId);
            toast.success("Saved to Wishlist ♥");
          }
          await get().fetchWishlist();
        } catch (err) {
          toast.error(err.message || "Failed to update wishlist.");
        }
      },

      removeFromWishlist: async (productId) => {
        const updatedIds = (get().wishlistIds || []).filter((id) => id !== productId);
        const updatedItems = (get().items || []).filter((item) => item.productId !== productId);
        set({ wishlistIds: updatedIds, items: updatedItems });
        toast.success("Item removed from Wishlist");

        try {
          await wishlistApi.removeFromWishlist(productId);
        } catch (err) {
          console.error("Failed to remove from wishlist:", err);
        }
      },

      moveToCart: async (productId) => {
        const updatedIds = (get().wishlistIds || []).filter((id) => id !== productId);
        const updatedItems = (get().items || []).filter((item) => item.productId !== productId);
        set({ wishlistIds: updatedIds, items: updatedItems });
        toast.success("Moved item to Cart 🛒");

        try {
          await wishlistApi.moveToCart(productId);
        } catch (err) {
          console.error("Failed to move to cart:", err);
        }
      },
    }),
    {
      name: "kln_wishlist_storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
);
