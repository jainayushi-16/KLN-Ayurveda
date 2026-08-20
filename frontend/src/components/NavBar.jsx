"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function NavBar() {
  const pathname = usePathname();
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();

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
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-between pointer-events-none">
      {/* Brand Logo */}
      <Link href="/" className="pointer-events-auto flex items-center gap-2">
        <Image
          src="/images/logo.svg"
          alt="KLN Ayurveda Logo"
          height={90}
          width={90}
          className="md:w-24 w-20 object-contain hover:scale-105 active:scale-95 transition-transform"
        />
      </Link>

      {/* Floating Glass Navigation Links */}
      <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/80 px-4 py-2 rounded-full shadow-xl hidden md:flex items-center gap-2">
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

      {/* Right User Actions */}
      <div className="pointer-events-auto flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 shadow-md">
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal("Sign in to access your account & cart.")}
              className="px-5 py-2.5 rounded-full bg-[#2F5D34] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
