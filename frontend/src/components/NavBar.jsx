"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, ShoppingCart, User, LogOut, Home, ShoppingBag, Info, Phone, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import NotificationBell from "@/components/notifications/NotificationBell";
import LanguageSelector from "@/components/LanguageSelector";

export default function NavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const { wishlistIds } = useWishlistStore();

  const isAdmin = Boolean(user && user.role === "ADMIN");

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

  const isHome = pathname === "/";

  const renderIconLink = (href, icon, label, exact = false) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        className={`group flex items-center p-2 sm:p-2.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${
          isActive
            ? "bg-[#2F5D34] text-white shadow-md scale-105"
            : "bg-white/80 text-[#222123] hover:bg-[#2F5D34] hover:text-white hover:shadow-md hover:scale-105"
        }`}
        title={label}
      >
        <span className="flex-none transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
        <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap text-xs font-extrabold uppercase tracking-wider pr-1">
          {label}
        </span>
      </Link>
    );
  };

  return (
    <>
      <nav
        className={
          isHome
            ? "fixed top-0 left-0 right-0 z-50 p-3 sm:p-4 md:p-6 flex items-center justify-between pointer-events-none"
            : "fixed top-0 left-0 right-0 z-50 bg-[#F6F3EC]/90 backdrop-blur-xl border-b border-[#2F5D34]/15 px-4 sm:px-6 md:px-10 py-3 flex items-center justify-between shadow-sm"
        }
      >
        {/* Brand Logo with Name */}
        <Link
          href="/"
          className={
            isHome
              ? "pointer-events-auto group flex items-center bg-white/90 backdrop-blur-xl border border-white/80 p-2 sm:p-2.5 rounded-full shadow-lg hover:shadow-xl hover:bg-white hover:scale-105 active:scale-95 transition-all duration-500 ease-out"
              : "group flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-300"
          }
          title="KLN Ayurveda"
        >
          <Image
            src="/images/logo.svg"
            alt="KLN Ayurveda Logo"
            height={40}
            width={40}
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span
            className={
              isHome
                ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2.5 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap font-extrabold text-xs sm:text-sm text-[#2F5D34] uppercase tracking-wider pr-1"
                : "font-extrabold text-sm sm:text-base text-[#2F5D34] uppercase tracking-wider"
            }
          >
            KLN Ayurveda
          </span>
        </Link>

        {/* Right Corner Cluster: Nav Links + Language + Profile/Auth Actions */}
        <div className={isHome ? "pointer-events-auto flex items-center gap-2 sm:gap-3" : "flex items-center gap-2 sm:gap-3"}>
          {/* Language Selector Pill in Navbar */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xl flex items-center">
            <LanguageSelector />
          </div>

          {/* Desktop Icon Navigation Links with Hover Text Reveal */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/80 p-1.5 rounded-full shadow-xl hidden md:flex items-center gap-1.5">
            {renderIconLink("/", <Home className="w-4 h-4" />, "Home", true)}
            {renderIconLink("/shop", <ShoppingBag className="w-4 h-4" />, "Shop")}
            {renderIconLink("/about", <Info className="w-4 h-4" />, "About")}
            {renderIconLink("/contact", <Phone className="w-4 h-4" />, "Contact")}

            {isAuthenticated && (
              <>
                {renderIconLink("/wishlist", <Heart className="w-4 h-4 text-rose-500 fill-current" />, "Wishlist")}
                {renderIconLink("/cart", <ShoppingCart className="w-4 h-4 text-amber-600" />, "Cart")}
              </>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="px-3.5 py-1.5 rounded-full bg-amber-400 text-gray-950 font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-amber-300 transition-all flex items-center gap-1.5 border border-amber-500 hover:scale-105 active:scale-95"
                  title="Access Admin Control Portal"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-900" />
                  <span className="hidden sm:inline">Admin Portal</span>
                </Link>
              )}
              <NotificationBell />
              <Link
                href="/profile"
                className="size-10 sm:size-11 rounded-full bg-white/90 backdrop-blur-xl border border-white/80 flex items-center justify-center text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95"
                title="My Account Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={logout}
                className="size-10 sm:size-11 rounded-full bg-white/90 backdrop-blur-xl border border-white/80 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2F5D34] to-[#1B351E] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl hover:shadow-[0_10px_25px_rgba(47,93,52,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>🔑</span>
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden size-10 rounded-full bg-white/90 backdrop-blur-xl border border-white/80 flex items-center justify-center text-[#222123] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden flex flex-col justify-end animate-in fade-in duration-300">
          <div className="bg-[#F6F3EC] w-full rounded-t-[2.5rem] p-6 sm:p-8 border-t border-white shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2F5D34]/15 pb-4">
              <span className="font-extrabold text-[#2F5D34] text-sm uppercase tracking-wider flex items-center gap-2">
                <span>🌿</span> Navigation Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 my-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition-all ${
                  pathname === "/" ? "bg-[#2F5D34] text-white shadow-md" : "bg-white/80 text-[#222123] hover:bg-[#2F5D34]/10"
                }`}
              >
                <span>🏡 Home</span>
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
                      <span>My Profile</span>
                    </div>
                    <span>→</span>
                  </Link>
                </>
              )}
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-3.5 rounded-full bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Account</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-3.5 rounded-full bg-[#2F5D34] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <span>🔑</span>
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
