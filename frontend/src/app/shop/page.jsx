"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ShopNavBar from "@/components/shop/ShopNavBar";
import ActiveOffersBanner from "@/components/shop/ActiveOffersBanner";
import ActiveOffersSection from "@/components/shop/ActiveOffersSection";
import FooterSection from "@/app/(root)/FooterSection";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { PRODUCTS } from "@/data/products";
import { productApi } from "@/services/product.api";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useBuyNowStore } from "@/store/useBuyNowStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/i18n/LanguageContext";
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
  const router = useRouter();
  const { t } = useLanguage();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { addToCart } = useCartStore();
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { setBuyNowProduct } = useBuyNowStore();

  useEffect(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const { data: fetchedProductsData, isLoading, error } = useQuery({
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

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch products from API, using local data:", error);
    }
  }, [error]);

  useGSAP(() => {
    if (document.querySelector(".shop-header")) {
      gsap.fromTo(
        ".shop-header",
        { y: 40, opacity: 0, scale: 0.96, filter: "blur(8px)" },
        { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
      );
    }
    if (document.querySelector(".shop-products-grid") && document.querySelector(".shop-card-item")) {
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
    }
  });

  const handlePartialFilter = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleToggleWishlist = (productId) => {
    if (!isAuthenticated) {
      openAuthModal("Please sign in to save items to your wishlist.", () => toggleWishlist(productId));
      return;
    }
    toggleWishlist(productId);
  };

  const handleAddToCart = (product, quantity) => {
    if (!isAuthenticated) {
      openAuthModal("Please sign in to add items to your cart.", () => addToCart(product.id, quantity));
      return;
    }
    addToCart(product.id, quantity);
  };

  const handleBuyNow = (product, quantity) => {
    if (!isAuthenticated) {
      openAuthModal("Please sign in to proceed to express checkout.", () => {
        setBuyNowProduct(product, quantity);
        router.push("/checkout?buyNow=true");
      });
      return;
    }
    setBuyNowProduct(product, quantity);
    router.push("/checkout?buyNow=true");
  };

  const filteredProducts = useMemo(() => {
    return activeProductsSource.filter((product) => {
      const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesSearch =
          product.name?.toLowerCase().includes(q) ||
          product.shortDesc?.toLowerCase().includes(q) ||
          product.fullDesc?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      if (filters.category && filters.category !== "All") {
        const targetCategory = filters.category.toLowerCase();
        const prodCat = (categoryName || "").toLowerCase();
        const matchesCategory =
          prodCat.includes(targetCategory) ||
          targetCategory.includes(prodCat) ||
          (targetCategory.includes("hair") && prodCat.includes("hair")) ||
          (targetCategory.includes("scalp") && prodCat.includes("scalp")) ||
          (targetCategory.includes("cleanser") && prodCat.includes("cleanser")) ||
          (targetCategory.includes("wellness") && prodCat.includes("wellness"));
        if (!matchesCategory) return false;
      }

      if (filters.type && filters.type !== "All") {
        const targetType = filters.type.toLowerCase();
        let prodType = product.type ? String(product.type).toLowerCase() : "";

        if (!prodType) {
          const nameLower = (product.name || "").toLowerCase();
          if (nameLower.includes("oil")) prodType = "oil";
          else if (nameLower.includes("mask")) prodType = "mask";
          else if (nameLower.includes("tonic")) prodType = "tonic";
          else if (nameLower.includes("serum")) prodType = "serum";
          else if (nameLower.includes("elixir")) prodType = "elixir";
        }

        if (prodType !== targetType) {
          return false;
        }
      }

      if (filters.selectedBenefits && filters.selectedBenefits.length > 0) {
        const productBenefits = Array.isArray(product.benefits)
          ? product.benefits.map((b) => (typeof b === "object" ? b.name : b))
          : [];
        const searchableBenefitsText = `${productBenefits.join(' ')} ${product.shortDesc || ''} ${product.fullDesc || ''} ${product.name || ''}`.toLowerCase();

        const matchesBenefits = filters.selectedBenefits.some((b) =>
          searchableBenefitsText.includes(b.toLowerCase())
        );
        if (!matchesBenefits) return false;
      }

      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }

      if (filters.minRating && filters.minRating > 0) {
        const rating = product.rating || 4.8;
        if (rating < filters.minRating) return false;
      }

      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      if (filters.onSaleOnly && !product.discountPercent && !product.originalPrice) {
        return false;
      }

      return true;
    });
  }, [activeProductsSource, filters]);

  return (
    <main className="min-h-screen bg-[#F6F3EC] text-[#222123]">
      <ActiveOffersBanner />
      <ShopNavBar />

      <section className="shop-header py-8 sm:py-10 px-6 sm:px-12 bg-gradient-to-b from-[#E7F0E4] via-[#F6F3EC] to-[#F6F3EC] border-b border-[#2F5D34]/15">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-paragraph">
              <span>{t("common.home", {}, "Home")}</span>
              <span>/</span>
              <span className="text-[#2F5D34] font-bold">{t("shopPage.breadcrumbShop", {}, "Shop Formulations")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2F5D34] tracking-tight">
              {t("shopPage.heroTitle", {}, "Ayurvedic Hair & Scalp Formulations")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-paragraph mt-1 max-w-xl">
              {t("shopPage.heroSubtitle", {}, "100% natural, pesticide-free hair oils, scalp tonics, and protective masks for root strength and growth.")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-full bg-white border border-gray-300 text-xs font-bold uppercase tracking-wider text-[#2F5D34] shadow-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <span>⚙️</span>
              <span>{t("shopPage.filtersBtn", {}, "Filters")}</span>
            </button>
            <span className="text-xs font-paragraph text-gray-500 font-bold bg-white/70 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              {filteredProducts.length} {t("shopPage.formulationsCount", {}, "Formulations")}
            </span>
          </div>
        </div>
      </section>

      <ActiveOffersSection />

      <section className="py-10 px-6 sm:px-12 max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <aside className="hidden lg:block w-72 flex-none sticky top-28 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl">
            <FilterSidebar
              filters={filters}
              onChangeFilter={handlePartialFilter}
              onClearFilters={handleClearFilters}
            />
          </aside>

          <div className="flex-1 w-full">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="h-96 rounded-3xl bg-gray-200/60 animate-pulse border border-gray-100"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center border border-white shadow-xl">
                <span className="text-5xl block mb-4">🌿</span>
                <h3 className="text-xl font-bold text-[#1B351E] mb-2">{t("shopPage.noProductsTitle", {}, "No Matching Formulations Found")}</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-paragraph max-w-md mx-auto mb-6">
                  {t("shopPage.noProductsDesc", {}, "Try adjusting your filter selection or clear all active search criteria.")}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 rounded-full bg-[#1B351E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2A4D2E] transition-all shadow-md"
                >
                  {t("shopPage.resetFilters", {}, "Reset All Filters")}
                </button>
              </div>
            ) : (
              <div className="shop-products-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="shop-card-item h-full">
                    <ProductCard
                      product={product}
                      isWishlisted={wishlistIds.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
