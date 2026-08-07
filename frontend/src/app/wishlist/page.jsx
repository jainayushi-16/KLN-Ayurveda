"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import ProductCard from "@/components/shop/ProductCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { PRODUCTS } from "@/data/products";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";

export default function WishlistPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlistIds, fetchWishlist, toggleWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useGSAP(() => {
    gsap.fromTo(
      ".wishlist-header",
      { y: 35, opacity: 0, scale: 0.97, filter: "blur(6px)" },
      { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
    );
    gsap.fromTo(
      ".wishlist-card",
      { y: 30, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 1, ease: "power3.out" }
    );
  });

  const handleAddToCart = (product, quantity) => {
    addToCart(product.id, quantity);
  };

  const handleBuyNow = (product, quantity) => {
    addToCart(product.id, quantity);
  };

  // Populate wishlisted products from local static catalog and deduplicate
  const wishlistedProducts = Array.from(new Set(wishlistIds || []))
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <ProtectedRoute pageTitle="your Wishlist">
      <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
        {/* Navbar */}
        <ShopNavBar searchQuery={searchQuery} onSearchChange={setSearchQuery} wishlistCount={wishlistedProducts.length} />

        {/* Background Organic Botanical Accents */}
        <Image src="/images/branch.svg" alt="" width={450} height={450} className="absolute top-20 right-5 opacity-20 pointer-events-none floating-leaf z-0" />
        <Image src="/images/leaf.svg" alt="" width={350} height={350} className="absolute bottom-40 left-5 opacity-20 pointer-events-none floating-leaf z-0" />

        {/* Header Section with Back to Shop Button */}
        <section className="pt-12 pb-10 w-full px-6 md:px-12 lg:px-16 relative z-10">
          <div className="max-w-[1800px] mx-auto mb-6 flex items-center justify-between">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white bg-white/90 px-5 py-2.5 rounded-full border border-[#2F5D34]/20 shadow-md transition-all duration-300 hover:scale-105"
            >
              <span>← Back to Shop</span>
            </Link>
          </div>

          <div className="max-w-[1800px] mx-auto text-center wishlist-header">
            <span className="inline-block px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#2F5D34]/15 text-[#2F5D34] text-xs md:text-sm font-bold uppercase tracking-widest mb-4 shadow-sm">
              Saved Formulations
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-[#2F5D34] tracking-tight leading-none">
              My Wishlist
            </h1>
            <p className="text-gray-700 font-paragraph text-base md:text-xl mt-4 leading-relaxed max-w-2xl mx-auto">
              Your personal collection of pure Ayurvedic oils, masks, and revitalizing elixirs.
            </p>
          </div>
        </section>

        {/* Wishlist Products Grid / Empty State */}
        <section className="pb-28 w-full px-6 md:px-12 lg:px-16 relative z-10">
          <div className="max-w-[1800px] mx-auto">
            {wishlistedProducts.length === 0 ? (
              /* Empty State */
              <div className="text-center py-24 px-8 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-[#2F5D34]/30 max-w-xl mx-auto shadow-sm">
                <div className="text-6xl mb-4">🌸</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#222123] mb-3">
                  Your Wishlist is Empty
                </h2>
                <p className="text-gray-600 font-paragraph text-base mb-8 leading-relaxed">
                  Explore our authentic Ayurvedic collection and save your favorite hair and skin formulations for later.
                </p>
                <Link href="/shop">
                  <button className="px-8 py-4 rounded-full bg-[#2F5D34] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all">
                    Explore Collection
                  </button>
                </Link>
              </div>
            ) : (
              /* Wishlist Products Grid */
              <div className="wishlist-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {wishlistedProducts.map((product) => (
                  <div key={product.id} className="wishlist-card">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      onToggleWishlist={() => toggleWishlist(product.id)}
                      isWishlisted={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <FooterSection />
      </main>
    </ProtectedRoute>
  );
}
