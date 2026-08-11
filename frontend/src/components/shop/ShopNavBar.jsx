"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
export default function ShopNavBar({ searchQuery, onSearchChange, cartCount: propCartCount, wishlistCount: propWishlistCount, }) {
    const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
    const { totalItems, fetchCart } = useCartStore();
    const { wishlistIds, fetchWishlist } = useWishlistStore();
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
            fetchWishlist();
        }
    }, [isAuthenticated, fetchCart, fetchWishlist]);
    const activeCartCount = propCartCount !== undefined ? propCartCount : totalItems;
    const activeWishlistCount = propWishlistCount !== undefined ? propWishlistCount : wishlistIds.length;
    return (<header className="sticky top-0 z-50 w-full bg-[#F6F3EC]/90 backdrop-blur-xl border-b border-[#2F5D34]/15 px-4 sm:px-8 md:px-12 py-3.5 transition-all">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Logo */}
        <Link href="/" className="flex-none flex items-center gap-2">
          <Image src="/images/logo.svg" alt="KLN Ayurveda" height={80} width={80} className="w-16 md:w-20 object-contain hover:scale-105 transition-transform"/>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-2 sm:mx-6 relative">
          <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search hair oils, herbal masks, revitalizing mists..." className="w-full py-3 px-5 pr-10 rounded-full bg-white/95 border-2 border-[#2F5D34]/20 text-xs sm:text-sm md:text-base font-medium text-[#222123] outline-none placeholder:text-gray-400 focus:border-[#2F5D34] shadow-md transition-all"/>
          {searchQuery ? (<button onClick={() => onSearchChange("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-sm">
              ✕
            </button>) : (<span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-[#2F5D34]/70 pointer-events-none">
              🔍
            </span>)}
        </div>

        {/* Quick Nav Links */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-bold uppercase tracking-wider text-[#222123]">
          <Link href="/" className="hover:text-[#2F5D34] transition-colors">
            Home
          </Link>
          <Link href="/shop" className="hover:text-[#2F5D34] transition-colors">
            Shop Collection
          </Link>
          {/* <Link href="/profile" className="hover:text-[#2F5D34] transition-colors text-[#2F5D34]">
            My Profile
          </Link> */}
          <Link href="/about" className="hover:text-[#2F5D34] transition-colors">
            About Us
          </Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4 flex-none">
          {isAuthenticated ? (<>
              {/* Wishlist */}
              <div className="relative group">
                <Link href="/wishlist">
                  <button aria-label="Wishlist" className="p-3 rounded-full bg-white/90 border border-[#2F5D34]/20 text-[#2F5D34] text-lg sm:text-xl shadow-md hover:bg-[#2F5D34] hover:text-white hover:scale-105 active:scale-95 transition-all relative">
                    ♥
                    {activeWishlistCount > 0 && (<span className="absolute -top-1 -right-1 size-5 rounded-full bg-[#C9A66B] text-[#222123] text-[10px] font-bold flex items-center justify-center border border-white shadow">
                        {activeWishlistCount}
                      </span>)}
                  </button>
                </Link>
              </div>

              {/* Cart */}
              <div className="relative group">
                <Link href="/cart">
                  <button aria-label="Shopping Cart" className="p-3 rounded-full bg-[#2F5D34] text-white text-lg sm:text-xl shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all relative">
                    🛒
                    {activeCartCount > 0 && (<span className="absolute -top-1 -right-1 size-5 rounded-full bg-[#C9A66B] text-[#222123] text-[10px] font-bold flex items-center justify-center border border-white shadow">
                        {activeCartCount}
                      </span>)}
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
            </>) : (<div className="flex items-center gap-2">
              {/* <Link href="/profile" className="px-4 py-2 rounded-full bg-white text-[#2F5D34] font-bold text-xs uppercase tracking-wider border border-[#2F5D34]/20 shadow hover:bg-gray-50 transition-all">
                My Profile
              </Link> */}
              <button onClick={() => openAuthModal("Please sign in to view cart & wishlist.")} className="px-4 py-2 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow hover:bg-[#224426] transition-all">
                Sign In
              </button>
            </div>)}
        </div>
      </div>
    </header>);
}
