"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function NavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const { wishlistIds } = useWishlistStore();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4 md:p-6 flex items-center justify-between pointer-events-none">
        {/* Brand Logo (Top-Left Corner) */}
        <Link href="/" className="pointer-events-auto flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="KLN Ayurveda Logo"
            height={90}
            width={90}
            className="w-16 sm:w-20 md:w-24 object-contain hover:scale-105 active:scale-95 transition-transform"
          />
        </Link>

        {/* Top-Right Corner Floating Cluster: Nav Links + Profile/Auth Actions */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Desktop Navigation Links */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/80 px-4 py-2 rounded-full shadow-xl hidden md:flex items-center gap-2">
            <Link href="/" className={getNavLinkClass("/", true)}>
              Home
            </Link>
            <Link href="/shop" className={getNavLinkClass("/shop")}>
              <span>🛍️</span>
              <span>Shop</span>
            </Link>
            <Link href="/about" className={getNavLinkClass("/about")}>
              About
            </Link>
            <Link href="/contact" className={getNavLinkClass("/contact")}>
              Contact
            </Link>

            {isAuthenticated && (
              <>
                <Link href="/wishlist" className={getNavLinkClass("/wishlist")}>
                  Wishlist
                </Link>
                <Link href="/cart" className={getNavLinkClass("/cart")}>
                  Cart
                </Link>
              </>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <div className="hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 shadow-md">
                <Link
                  href="/profile"
                  className={`text-xs font-extrabold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all ${
                    pathname.startsWith("/profile") ? "text-[#2F5D34] underline" : "text-[#222123] hover:text-[#2F5D34]"
                  }`}
                >
                  👤 {user?.firstName || "Profile"}
                </Link>
                <button
                  onClick={logout}
                  className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 hover:text-rose-800 hover:underline active:scale-95 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => openAuthModal("Sign in to access your account & cart.")}
                className="px-5 py-2.5 rounded-full bg-[#2F5D34] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2.5 rounded-full bg-white/90 border border-[#2F5D34]/20 text-[#2F5D34] shadow-md hover:bg-[#2F5D34] hover:text-white transition-all cursor-pointer active:scale-90"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-over Glass Drawer (Root Level Overlay) */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md flex justify-end md:hidden animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-4/5 max-w-xs bg-[#F6F3EC] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-white/80"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#2F5D34]/15 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Image src="/images/logo.svg" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
                  <span className="font-extrabold text-sm text-[#2F5D34] uppercase tracking-wider">
                    KLN Ayurveda
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-gray-200/80 text-gray-700 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links List */}
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all ${
                    pathname === "/" ? "bg-[#2F5D34] text-white shadow-md" : "bg-white/80 text-[#222123] hover:bg-[#2F5D34]/10"
                  }`}
                >
                  <span>🏠 Home</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all ${
                    pathname.startsWith("/shop") ? "bg-[#2F5D34] text-white shadow-md" : "bg-white/80 text-[#222123] hover:bg-[#2F5D34]/10"
                  }`}
                >
                  <span>🛍️ Shop Collection</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all ${
                    pathname.startsWith("/about") ? "bg-[#2F5D34] text-white shadow-md" : "bg-white/80 text-[#222123] hover:bg-[#2F5D34]/10"
                  }`}
                >
                  <span>ℹ️ About Us</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all ${
                    pathname.startsWith("/contact") ? "bg-[#2F5D34] text-white shadow-md" : "bg-white/80 text-[#222123] hover:bg-[#2F5D34]/10"
                  }`}
                >
                  <span>📞 Contact</span>
                  <span>→</span>
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      href="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all ${
                        pathname.startsWith("/wishlist") ? "bg-[#2F5D34] text-white shadow-md" : "bg-white/80 text-[#222123] hover:bg-[#2F5D34]/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500 fill-current" />
                        <span>Wishlist</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#C9A66B] text-[#222123] text-[10px] font-bold">
                        {wishlistIds?.length || 0}
                      </span>
                    </Link>

                    <Link
                      href="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all ${
                        pathname.startsWith("/cart") ? "bg-[#2F5D34] text-white shadow-md" : "bg-white/80 text-[#222123] hover:bg-[#2F5D34]/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-amber-600" />
                        <span>Shopping Cart</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#C9A66B] text-[#222123] text-[10px] font-bold">
                        {totalItems || 0}
                      </span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all ${
                        pathname.startsWith("/profile") ? "bg-[#2F5D34] text-white shadow-md" : "bg-white/80 text-[#222123] hover:bg-[#2F5D34]/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#2F5D34]" />
                        <span>My Account Profile</span>
                      </div>
                      <span>→</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#2F5D34]/15 mt-6">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-rose-100 text-rose-700 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal("Sign in to access your account & cart.");
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#2F5D34] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] transition-all cursor-pointer"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
