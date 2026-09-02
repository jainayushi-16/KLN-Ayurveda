"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { PRODUCTS } from "@/data/products";
import { productApi } from "@/services/product.api";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useBuyNowStore } from "@/store/useBuyNowStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguage } from "@/i18n/LanguageContext";
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function HomeProductsSection() {
  const router = useRouter();
  const { t } = useLanguage();
  const [products, setProducts] = useState(PRODUCTS);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { addToCart } = useCartStore();
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { setBuyNowProduct } = useBuyNowStore();

  useEffect(() => {
    async function loadHomeProducts() {
      try {
        setLoading(true);
        const res = await productApi.getProducts();
        const apiData = res?.data || res;
        if (Array.isArray(apiData) && apiData.length > 0) {
          setProducts(apiData);
        } else {
          setProducts(PRODUCTS);
        }
      } catch (err) {
        console.error("Home products sync note, using fallback:", err);
        setProducts(PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    loadHomeProducts();
  }, []);

  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product.id, quantity);
    toast.success(`Added "${product.name}" (${quantity}) to Cart!`, {
      icon: "🛒",
      style: {
        borderRadius: "16px",
        background: "#2F5D34",
        color: "#fff",
      },
    });
  };

  const handleBuyNow = (product, quantity = 1) => {
    setBuyNowProduct(product, quantity);
    toast.success(`Proceeding to Express Checkout for "${product.name}"`, { icon: "⚡" });
    router.push("/checkout?buyNow=true");
  };

  const handleToggleWishlist = (productId) => {
    if (!isAuthenticated) {
      openAuthModal("Please sign in to save items to your wishlist.");
      return;
    }
    const isSaved = wishlistIds.includes(productId);
    toggleWishlist(productId);
    if (isSaved) {
      toast.success("Removed from Wishlist", { icon: "💔" });
    } else {
      toast.success("Saved to Wishlist! ❤️", { icon: "💖" });
    }
  };

  return (
    <section className="w-full py-16 px-4 sm:px-8 md:px-12 max-w-[1800px] mx-auto relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4 border-b border-[#2F5D34]/15 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E7F0E4] text-[#2F5D34] text-xs font-black uppercase tracking-widest mb-2 shadow-sm">
            <Leaf className="w-3.5 h-3.5" /> 100% Ayurvedic Formulations
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#222123]">
            Featured Ayurvedic Hair Range
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-paragraph mt-1 max-w-2xl leading-relaxed">
            Handcrafted with organic Bhringraj, Amla, Rosemary & Argan oils. Free from synthetic chemicals, parabens & pesticides.
          </p>
        </div>

        <Link href="/shop">
          <button className="px-6 py-3 rounded-full bg-[#2F5D34] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          const isWishlisted = wishlistIds.includes(product.id);

          return (
            <div key={product.id} className="h-full">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={isWishlisted}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
