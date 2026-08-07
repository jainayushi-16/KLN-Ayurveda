import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS } from "@/data/products";
import toast from "react-hot-toast";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      wishlistIds: [],
      isLoading: false,

      fetchWishlist: async () => {
        // Sync wishlist items with current products catalog based on saved wishlistIds
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

      toggleWishlist: (productId) => {
        const currentIds = get().wishlistIds || [];
        const isWishlisted = currentIds.includes(productId);
        const matchedProduct = PRODUCTS.find((p) => p.id === productId);

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
      },

      removeFromWishlist: (productId) => {
        const updatedIds = (get().wishlistIds || []).filter((id) => id !== productId);
        const updatedItems = (get().items || []).filter((item) => item.productId !== productId);
        set({ wishlistIds: updatedIds, items: updatedItems });
        toast.success("Item removed from Wishlist");
      },

      moveToCart: (productId) => {
        const updatedIds = (get().wishlistIds || []).filter((id) => id !== productId);
        const updatedItems = (get().items || []).filter((item) => item.productId !== productId);
        set({ wishlistIds: updatedIds, items: updatedItems });
        toast.success("Moved item to Cart 🛒");
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
