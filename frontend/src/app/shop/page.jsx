"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { PRODUCTS } from "@/data/products";
import { productApi } from "@/services/product.api";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useQuery } from "@tanstack/react-query";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";

const INITIAL_FILTERS = {
  searchQuery: "",
  category: "All",
  type: "All",
  selectedBenefits: [],
  maxPrice: 2000,
  minRating: 0,
  inStockOnly: false,
  onSaleOnly: false,
};

export default function ShopPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { addToCart } = useCartStore();
  const { wishlistIds, toggleWishlist } = useWishlistStore();

  // Reset filters to default on page mount so returning to Shop page always loads the complete product list
  useEffect(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // TanStack React Query for live catalog caching
  const { data: fetchedProductsData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await productApi.getProducts();
      return res?.data || [];
    },
  });

  const activeProductsSource =
    fetchedProductsData && fetchedProductsData.length > 0
      ? fetchedProductsData
      : PRODUCTS;

  useGSAP(() => {
    gsap.fromTo(
      ".shop-header",
      { y: 40, opacity: 0, scale: 0.96, filter: "blur(8px)" },
      { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
    );
    gsap.fromTo(
      ".shop-card-item",
      { y: 30, opacity: 0, scale: 0.96, filter: "blur(6px)" },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".shop-products-grid",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );
  });

  const handlePartialFilter = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleToggleWishlist = (productId) => {
    toggleWishlist(productId);
  };

  const handleAddToCart = (product, quantity) => {
    addToCart(product.id, quantity);
  };

  const handleBuyNow = (product, quantity) => {
    addToCart(product.id, quantity);
  };

  // Filtered catalog dataset
  const filteredProducts = useMemo(() => {
    return activeProductsSource.filter((product) => {
      if (
        filters.searchQuery &&
        !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !product.shortDesc.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (filters.category !== "All" && product.category !== filters.category) {
        return false;
      }
      if (filters.type !== "All" && product.type !== filters.type) {
        return false;
      }
      if (
        filters.selectedBenefits.length > 0 &&
        !filters.selectedBenefits.some((b) => product.benefits?.includes(b))
      ) {
        return false;
      }
      if (product.price > filters.maxPrice) {
        return false;
      }
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    });
  }, [filters, activeProductsSource]);

  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      {/* Shop Dedicated Navbar */}
      <ShopNavBar
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handlePartialFilter({ searchQuery: q })}
      />

      {/* Background Organic Botanical Textures */}
      <Image
        src="/images/branch.svg"
        alt=""
        width={450}
        height={450}
        className="absolute top-20 right-5 opacity-20 pointer-events-none floating-leaf z-0"
      />
      <Image
        src="/images/leaf.svg"
        alt=""
        width={350}
        height={350}
        className="absolute bottom-40 left-5 opacity-20 pointer-events-none floating-leaf z-0"
      />

      {/* Header Showcase Section */}
      <section className="pt-12 pb-8 w-full px-6 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-[1800px] mx-auto text-center shop-header">
          <span className="inline-block px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#2F5D34]/15 text-[#2F5D34] text-xs md:text-sm font-bold uppercase tracking-widest mb-4 shadow-sm">
            Handcrafted Formulations
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-[#2F5D34] tracking-tight leading-none">
            Our Collection
          </h1>
          <p className="text-gray-700 font-paragraph text-base md:text-xl mt-4 leading-relaxed max-w-2xl mx-auto">
            Authentic Ayurvedic formulations crafted with 100% natural cold-pressed botanicals for holistic hair and scalp wellness.
          </p>
        </div>
      </section>

      {/* Main Content Layout with Sticky Filter Sidebar + Product Grid */}
      <section className="pb-24 w-full px-6 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-10 items-start">
          {/* Desktop Filter Sidebar & Mobile Drawer */}
          <FilterSidebar
            filters={filters}
            onChangeFilter={handlePartialFilter}
            onClearFilters={handleClearFilters}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full">
            {/* Mobile Filter Toggle Button */}
            <div className="lg:hidden mb-6 flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#2F5D34]/15 shadow-sm">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow"
              >
                <span>⚡ Filter Formulations</span>
              </button>

              <span className="text-xs font-bold uppercase text-[#2F5D34]">
                Showing {filteredProducts.length} Products
              </span>
            </div>

            {/* Empty State or Loading State */}
            {isLoading ? (
              <div className="text-center py-24 bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-[#2F5D34]/30">
                <div className="text-4xl mb-4 animate-spin">🌿</div>
                <h3 className="text-xl font-bold text-[#222123]">
                  Fetching Pure Formulations...
                </h3>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-[#2F5D34]/30">
                <div className="text-5xl mb-4">🌿</div>
                <h3 className="text-2xl font-bold text-[#222123] mb-2">
                  No Formulations Found
                </h3>
                <p className="text-gray-500 font-paragraph text-sm max-w-md mx-auto mb-6">
                  We couldn&apos;t find any products matching your active filters. Try clearing your search or filter selection.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Product Cards Grid */
              <div className="shop-products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onToggleWishlist={() => handleToggleWishlist(product.id)}
                    isWishlisted={wishlistIds.includes(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
