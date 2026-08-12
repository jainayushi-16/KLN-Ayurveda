import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { wishlistApi } from "@/services/wishlist.api";
import { PRODUCTS } from "@/data/products";
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
          set({ isLoading: false });
          get().syncLocalWishlist();
          return;
        }
        set({ isLoading: true, error: null });
        try {
          const res = await wishlistApi.getWishlist();
          if (res && res.data && res.data.items) {
            const items = res.data.items.map((item) => ({
              id: item.id,
              productId: item.productId,
              name: item.name,
              slug: item.slug,
              shortDesc: item.shortDesc || "",
              price: item.price,
              rating: item.rating || 4.9,
              inStock: item.inStock ?? true,
              image: item.image || "/images/products/hairoil/oilf.jpeg",
              category: item.category || "Hair Care",
            }));
            const ids = items.map((i) => i.productId);
            set({ items, wishlistIds: ids });
          }
        } catch (err) {
          get().syncLocalWishlist();
        } finally {
          set({ isLoading: false });
        }
      },

      syncLocalWishlist: () => {
        const currentIds = Array.from(new Set(get().wishlistIds || []));
        const updatedItems = currentIds
          .map((id) => {
            const p = PRODUCTS.find((prod) => prod.id === id);
            if (!p) return null;
            return {
              id: "wishlist-" + id,
              productId: p.id,
              name: p.name,
              slug: p.slug || p.id,
              shortDesc: p.shortDesc || "",
              price: p.price,
              rating: p.rating || 4.9,
              inStock: p.inStock ?? true,
              image: p.images ? p.images[0] : "/images/products/hairoil/oilf.jpeg",
              category: p.category || "Hair Care",
            };
          })
          .filter(Boolean);

        set({ wishlistIds: currentIds, items: updatedItems });
      },

      toggleWishlist: async (productId) => {
        const currentIds = get().wishlistIds || [];
        const isWishlisted = currentIds.includes(productId);
        const matchedProduct = PRODUCTS.find((p) => p.id === productId);

        // Optimistic local update
        if (isWishlisted) {
          const updatedIds = currentIds.filter((id) => id !== productId);
          const updatedItems = (get().items || []).filter((item) => item.productId !== productId);
          set({ wishlistIds: updatedIds, items: updatedItems });
          toast.success("Removed from Wishlist");
        } else {
          const updatedIds = Array.from(new Set([...currentIds, productId]));
          const newItem = {
            id: "wishlist-" + productId,
            productId,
            name: matchedProduct ? matchedProduct.name : "Formulation",
            slug: matchedProduct ? matchedProduct.slug : productId,
            shortDesc: matchedProduct ? matchedProduct.shortDesc : "",
            price: matchedProduct ? matchedProduct.price : 49,
            rating: matchedProduct ? matchedProduct.rating : 4.9,
            inStock: true,
            image: matchedProduct ? matchedProduct.images[0] : "/images/products/hairoil/oilf.jpeg",
            category: matchedProduct ? matchedProduct.category : "Hair Care",
          };
          const updatedItems = [
            ...(get().items || []).filter((item) => item.productId !== productId),
            newItem,
          ];
          set({ wishlistIds: updatedIds, items: updatedItems });
          toast.success("Saved to Wishlist ♥");
        }

        // Sync with backend
        try {
          if (isWishlisted) {
            await wishlistApi.removeFromWishlist(productId);
          } else {
            await wishlistApi.addToWishlist(productId);
          }
        } catch (err) {
          console.error("Failed to sync wishlist with backend:", err);
          toast.error("Wishlist updated locally. Will sync when connection improves.");
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
