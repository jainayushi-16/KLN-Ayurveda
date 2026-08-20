"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function ShopNavBar({
  searchQuery,
  onSearchChange,
  cartCount: propCartCount,
  wishlistCount: propWishlistCount,
}) {
  const pathname = usePathname();
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
  const { totalItems, fetchCart } = useCartStore();
  const { wishlistIds, fetchWishlist } = useWishlistStore();

  // Search History State
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchCart();
    fetchWishlist();
  }, [fetchCart, fetchWishlist]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kln_recent_searches");
      if (saved) {
        try {
          setSearchHistory(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  const saveSearchQuery = (query) => {
    if (!query || !query.trim()) return;
    const trimmed = query.trim();
    const updated = [trimmed, ...searchHistory.filter((q) => q !== trimmed)].slice(0, 5);
    setSearchHistory(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("kln_recent_searches", JSON.stringify(updated));
    }
  };

  const removeHistoryItem = (e, itemToRemove) => {
    e.stopPropagation();
    const updated = searchHistory.filter((item) => item !== itemToRemove);
    setSearchHistory(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("kln_recent_searches", JSON.stringify(updated));
    }
  };

  const clearAllHistory = (e) => {
    e.stopPropagation();
    setSearchHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("kln_recent_searches");
    }
  };

  const storeCartCount = totalItems || 0;
  const storeWishlistCount = wishlistIds ? wishlistIds.length : 0;

  const activeCartCount = isMounted
    ? Math.max(propCartCount && propCartCount > 0 ? propCartCount : 0, storeCartCount)
    : 0;

  const activeWishlistCount = isMounted
    ? Math.max(propWishlistCount && propWishlistCount > 0 ? propWishlistCount : 0, storeWishlistCount)
    : 0;

  const getNavLinkClass = (path, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    const baseClass =
      "px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer active:scale-95";

    if (isActive) {
      return `${baseClass} bg-[#2F5D34] text-white shadow-md ring-2 ring-[#2F5D34]/30 scale-105`;
    }
    return `${baseClass} text-[#222123] hover:text-[#2F5D34] hover:bg-[#2F5D34]/10 hover:scale-105`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F6F3EC]/90 backdrop-blur-xl border-b border-[#2F5D34]/15 px-4 sm:px-8 md:px-12 py-3.5 transition-all">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Logo */}
        <Link href="/" className="flex-none flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="KLN Ayurveda Logo"
            height={80}
            width={80}
            className="w-16 md:w-20 object-contain hover:scale-105 active:scale-95 transition-transform"
          />
        </Link>

        {/* Search Bar with History Dropdown */}
        <div className="flex-1 min-w-[140px] max-w-2xl mx-1 sm:mx-4 relative z-20">
          <input
            type="text"
            value={searchQuery || ""}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveSearchQuery(searchQuery);
                setShowHistory(false);
              }
            }}
            placeholder="Search products..."
            className="w-full py-2.5 sm:py-3 px-3.5 sm:px-5 pr-8 sm:pr-10 rounded-full bg-white border-2 border-[#2F5D34]/25 text-xs sm:text-sm font-extrabold text-[#222123] outline-none placeholder:text-gray-400 focus:border-[#2F5D34] focus:ring-2 focus:ring-[#2F5D34]/20 shadow-md transition-all z-10"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange && onSearchChange("")}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs sm:text-sm p-1 z-20 cursor-pointer"
            >
              ✕
            </button>
          ) : (
            <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-[#2F5D34]/70 pointer-events-none z-20">
              🔍
            </span>
          )}

          {/* Recent Searches Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-[#2F5D34]/20 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  🕒 Recent Searches
                </span>
                <button
                  onMouseDown={clearAllHistory}
                  className="text-[10px] font-extrabold text-rose-500 hover:underline uppercase cursor-pointer"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {searchHistory.map((item, idx) => (
                  <div
                    key={idx}
                    onMouseDown={() => {
                      if (onSearchChange) onSearchChange(item);
                      saveSearchQuery(item);
                      setShowHistory(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#E7F0E4]/60 text-xs sm:text-sm text-[#222123] font-bold cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">🔍</span>
                      <span>{item}</span>
                    </div>
                    <button
                      onMouseDown={(e) => removeHistoryItem(e, item)}
                      className="text-gray-400 hover:text-rose-500 text-xs p-1 cursor-pointer"
                      title="Remove search"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Nav Links */}
        <div className="hidden md:flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#222123]">
          <Link href="/" className={getNavLinkClass("/", true)}>
            Home
          </Link>
          <Link href="/shop" className={getNavLinkClass("/shop")}>
            <span className="text-sm">🛍️</span>
            <span>Shop</span>
          </Link>
          <Link href="/about" className={getNavLinkClass("/about")}>
            About
          </Link>
          <Link href="/contact" className={getNavLinkClass("/contact")}>
            Contact
          </Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-none">
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <NotificationBell />

              {/* Wishlist */}
              <div className="relative group">
                <Link href="/wishlist">
                  <button
                    aria-label="Wishlist"
                    className={`p-3 rounded-full border border-[#2F5D34]/20 text-lg sm:text-xl shadow-md hover:scale-105 active:scale-95 transition-all relative cursor-pointer ${
                      pathname.startsWith("/wishlist")
                        ? "bg-[#2F5D34] text-white ring-2 ring-[#2F5D34]/30"
                        : "bg-white/90 text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white"
                    }`}
                  >
                    ♥
                    {activeWishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 size-5 rounded-full bg-[#C9A66B] text-[#222123] text-[10px] font-bold flex items-center justify-center border border-white shadow">
                        {activeWishlistCount}
                      </span>
                    )}
                  </button>
                </Link>
              </div>

              {/* Cart */}
              <div className="relative group">
                <Link href="/cart">
                  <button
                    aria-label="Shopping Cart"
                    className={`p-3 rounded-full text-lg sm:text-xl shadow-lg hover:scale-105 active:scale-95 transition-all relative cursor-pointer ${
                      pathname.startsWith("/cart")
                        ? "bg-[#2F5D34] text-white ring-2 ring-[#2F5D34]/30"
                        : "bg-[#2F5D34] text-white hover:bg-[#224426]"
                    }`}
                  >
                    🛒
                    {activeCartCount > 0 && (
                      <span className="absolute -top-1 -right-1 size-5 rounded-full bg-[#C9A66B] text-[#222123] text-[10px] font-bold flex items-center justify-center border border-white shadow">
                        {activeCartCount}
                      </span>
                    )}
                  </button>
                </Link>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <Link
                  href="/profile"
                  className={`text-xs font-extrabold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all ${
                    pathname.startsWith("/profile")
                      ? "text-[#2F5D34] underline"
                      : "text-[#222123] hover:text-[#2F5D34]"
                  }`}
                >
                  👤 {user?.firstName || "Profile"}
                </Link>
                <button
                  onClick={logout}
                  className="text-[10px] font-extrabold text-rose-600 hover:text-rose-800 hover:underline uppercase tracking-wider cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal("Please sign in to view cart & wishlist.")}
                className="px-4 py-2 rounded-full bg-[#2F5D34] text-white font-extrabold text-xs uppercase tracking-wider shadow hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
