"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function ShopNavBar({ searchQuery, onSearchChange, cartCount: propCartCount, wishlistCount: propWishlistCount }) {
    const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
    const { totalItems, fetchCart } = useCartStore();
    const { wishlistIds, fetchWishlist } = useWishlistStore();


    // Search History State
    const [showHistory, setShowHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
            fetchWishlist();
        }
    }, [isAuthenticated, fetchCart, fetchWishlist]);

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

    const activeCartCount = propCartCount !== undefined ? propCartCount : totalItems;
    const activeWishlistCount = propWishlistCount !== undefined ? propWishlistCount : wishlistIds.length;

    return (
      <header className="sticky top-0 z-50 w-full bg-[#F6F3EC]/90 backdrop-blur-xl border-b border-[#2F5D34]/15 px-4 sm:px-8 md:px-12 py-3.5 transition-all">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4 md:gap-8">
          {/* Brand Logo */}
          <Link href="/" className="flex-none flex items-center gap-2">
            <Image src="/images/logo.svg" alt="KLN Ayurveda" height={80} width={80} className="w-16 md:w-20 object-contain hover:scale-105 transition-transform"/>
          </Link>

          {/* Search Bar with History Dropdown */}
          <div className="flex-1 min-w-[140px] max-w-2xl mx-1 sm:mx-4 relative z-20">
            <input
              type="text"
              value={searchQuery || ""}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveSearchQuery(searchQuery);
                  setShowHistory(false);
                }
              }}
              placeholder="Search products..."
              className="w-full py-2.5 sm:py-3 px-3.5 sm:px-5 pr-8 sm:pr-10 rounded-full bg-white border-2 border-[#2F5D34]/25 text-xs sm:text-sm font-bold text-[#222123] outline-none placeholder:text-gray-400 focus:border-[#2F5D34] focus:ring-2 focus:ring-[#2F5D34]/20 shadow-md transition-all z-10"
            />
            {searchQuery ? (
              <button onClick={() => onSearchChange("")} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs sm:text-sm p-1 z-20">
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
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    🕒 Recent Searches
                  </span>
                  <button
                    onMouseDown={clearAllHistory}
                    className="text-[10px] font-bold text-rose-500 hover:underline uppercase cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {searchHistory.map((item, idx) => (
                    <div
                      key={idx}
                      onMouseDown={() => {
                        onSearchChange(item);
                        saveSearchQuery(item);
                        setShowHistory(false);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#E7F0E4]/60 text-xs sm:text-sm text-[#222123] font-medium cursor-pointer transition-colors"
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
          <div className="hidden md:flex items-center gap-3 lg:gap-5 text-xs font-bold uppercase tracking-wider text-[#222123]">
            <Link href="/" className="hover:text-[#2F5D34] transition-colors">
              Home
            </Link>
            {/* Shopping Bag Icon Logo Badge instead of long text */}
            <Link href="/shop" className="px-3 py-1.5 rounded-full bg-[#2F5D34]/10 text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white transition-all flex items-center gap-1.5 font-extrabold shadow-sm">
              <span className="text-sm sm:text-base">🛍️</span>
              <span className="hidden sm:inline text-[11px]">Shop</span>
            </Link>
            <Link href="/about" className="hover:text-[#2F5D34] transition-colors">
              About
            </Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4 flex-none">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />

                {/* Wishlist */}
                <div className="relative group">
                  <Link href="/wishlist">
                    <button aria-label="Wishlist" className="p-3 rounded-full bg-white/90 border border-[#2F5D34]/20 text-[#2F5D34] text-lg sm:text-xl shadow-md hover:bg-[#2F5D34] hover:text-white hover:scale-105 active:scale-95 transition-all relative">
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
                    <button aria-label="Shopping Cart" className="p-3 rounded-full bg-[#2F5D34] text-white text-lg sm:text-xl shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all relative">
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
                <div className="flex items-center gap-2 bg-white/80 px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm">
                  <Link href="/profile" className="text-xs font-bold text-[#2F5D34] hover:underline flex items-center gap-1">
                    👤 {user?.firstName || "Profile"}
                  </Link>
                  <button onClick={logout} className="text-[10px] font-bold text-red-600 hover:underline uppercase tracking-wider">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => openAuthModal("Please sign in to view cart & wishlist.")} className="px-4 py-2 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow hover:bg-[#224426] transition-all">
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
}
