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
        const isAuth = typeof window !== "undefined" && Boolean(localStorage.getItem("kln_token"));
        if (!isAuth) {
          // Keep current local guest wishlist state intact
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
          console.warn("Fetch wishlist error:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      toggleWishlist: async (productId) => {
        const isAuth = typeof window !== "undefined" && Boolean(localStorage.getItem("kln_token"));
        const currentIds = get().wishlistIds || [];
        const currentItems = get().items || [];
        const isWishlisted = currentIds.includes(productId);

        if (!isAuth) {
          // Guest User Flow
          if (isWishlisted) {
            const updatedIds = currentIds.filter((id) => id !== productId);
            const updatedItems = currentItems.filter((i) => (i.productId || i.id) !== productId);
            set({ wishlistIds: updatedIds, items: updatedItems });
            toast.success("Removed from Wishlist");
          } else {
            const updatedIds = [...currentIds, productId];
            const newItem = { productId, id: productId };
            set({ wishlistIds: updatedIds, items: [...currentItems, newItem] });
            toast.success("Saved to Wishlist ♥");
          }
          return;
        }

        // Authenticated User Flow
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
        const isAuth = typeof window !== "undefined" && Boolean(localStorage.getItem("kln_token"));
        const updatedIds = (get().wishlistIds || []).filter((id) => id !== productId);
        const updatedItems = (get().items || []).filter((item) => (item.productId || item.id) !== productId);
        set({ wishlistIds: updatedIds, items: updatedItems });
        toast.success("Item removed from Wishlist");

        if (isAuth) {
          try {
            await wishlistApi.removeFromWishlist(productId);
          } catch (err) {
            console.error("Failed to remove from wishlist:", err);
          }
        }
      },

      moveToCart: async (productId) => {
        const isAuth = typeof window !== "undefined" && Boolean(localStorage.getItem("kln_token"));
        const updatedIds = (get().wishlistIds || []).filter((id) => id !== productId);
        const updatedItems = (get().items || []).filter((item) => (item.productId || item.id) !== productId);
        set({ wishlistIds: updatedIds, items: updatedItems });
        toast.success("Moved item to Cart 🛒");

        if (isAuth) {
          try {
            await wishlistApi.moveToCart(productId);
          } catch (err) {
            console.error("Failed to move to cart:", err);
          }
        }
      },

      mergeGuestWishlist: async () => {
        const guestIds = get().wishlistIds || [];
        if (guestIds.length === 0) {
          await get().fetchWishlist();
          return;
        }
        try {
          // Fetch existing user wishlist on server
          const res = await wishlistApi.getWishlist();
          const serverItems = res?.data?.items || [];
          const serverIds = serverItems.map((i) => i.productId || i.product?.id).filter(Boolean);

          // Add guest items to server if not already present
          for (const pid of guestIds) {
            if (pid && !serverIds.includes(pid)) {
              try {
                await wishlistApi.addToWishlist(pid);
              } catch (e) {}
            }
          }
          // Fetch final merged server wishlist
          await get().fetchWishlist();
        } catch (err) {
          console.error("Wishlist merge error:", err);
        }
      },

      clearWishlist: () => {
        set({ items: [], wishlistIds: [], isLoading: false, error: null });
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
