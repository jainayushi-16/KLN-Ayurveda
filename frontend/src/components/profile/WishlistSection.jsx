"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Trash2, Star, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";
import { useBuyNowStore } from "@/store/useBuyNowStore";

export default function WishlistSection({ wishlistItems, onRemoveFromWishlist }) {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { setBuyNowProduct } = useBuyNowStore();

  const handleMoveToCart = (product) => {
    addToCart(product.id, 1);
    onRemoveFromWishlist(product.id);
    toast.success(`Moved "${product.name}" to your Shopping Cart!`, {
      icon: "🛒",
      style: {
        borderRadius: "16px",
        background: "#2F5D34",
        color: "#fff",
      },
    });
  };

  const handleBuyNow = (product) => {
    setBuyNowProduct(product, 1);
    toast.success(`Proceeding to Express Checkout for "${product.name}"`, { icon: "⚡" });
    router.push("/checkout?buyNow=true");
  };

  const handleRemove = (product) => {
    onRemoveFromWishlist(product.id);
    toast.success(`Removed "${product.name}" from your Wishlist.`, {
      icon: "💔",
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            My Wishlist ({wishlistItems.length})
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            Your saved favorite herbal formulations and personal care kits.
          </p>
        </div>
        <span className="p-3 rounded-2xl bg-rose-50 text-rose-500">
          <Heart className="w-5 h-5 fill-rose-500" />
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/80 rounded-2xl border border-dashed border-gray-300">
          <Heart className="w-14 h-14 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#222123]">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-500 font-paragraph mt-1 mb-4">
            Explore our handcrafted Ayurvedic collection and save your favorites.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Product Image & Badge */}
                <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-[#2F5D34] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                      {item.badge}
                    </span>
                  )}
                  <button
                    onClick={() => handleRemove(item)}
                    title="Remove from Wishlist"
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white shadow transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F5D34]">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#222123] mt-1 line-clamp-1 group-hover:text-[#2F5D34] transition-colors">
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-2 text-xs">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-800 ml-1">{item.rating}</span>
                    </div>
                    <span className="text-gray-400 text-[11px]">({item.reviewsCount} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-lg font-bold text-[#2F5D34]">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="p-4 pt-0 flex gap-2">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="flex-1 py-2.5 rounded-xl border border-[#2F5D34] text-[#2F5D34] font-bold text-xs uppercase tracking-wider hover:bg-[#2F5D34] hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Cart</span>
                </button>
                <button
                  onClick={() => handleBuyNow(item)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
