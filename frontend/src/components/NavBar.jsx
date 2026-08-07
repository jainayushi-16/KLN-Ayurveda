"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
export default function NavBar() {
    const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
    return (<nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-between pointer-events-none">
      {/* Brand Logo */}
      <Link href="/" className="pointer-events-auto flex items-center gap-2">
        <Image src="/images/logo.svg" alt="nav-logo" height={90} width={90} className="md:w-24 w-20 hover:scale-105 transition-transform"/>
      </Link>

      {/* Floating Glass Navigation Links */}
      <div className="pointer-events-auto bg-white/85 backdrop-blur-xl border border-white/80 px-6 py-3 rounded-full shadow-xl hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#222123]">
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

        {isAuthenticated && (<>
            <Link href="/wishlist" className="hover:text-[#2F5D34] transition-colors">
              Wishlist
            </Link>
            <Link href="/cart" className="hover:text-[#2F5D34] transition-colors">
              Cart
            </Link>
          </>)}
      </div>

      {/* Right User Actions */}
      <div className="pointer-events-auto flex items-center gap-3">
        {isAuthenticated ? (<div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 shadow-md">
            <Link href="/profile" className="text-xs font-bold text-[#2F5D34] hover:underline flex items-center gap-1">
              👤 {user?.firstName || "Profile"}
            </Link>
            <button onClick={logout} className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:underline">
              Logout
            </button>
          </div>) : (<div className="flex items-center gap-2">
            <Link href="/profile" className="px-4 py-2 rounded-full bg-white/90 text-[#2F5D34] font-bold text-xs uppercase tracking-wider border border-[#2F5D34]/20 shadow-md hover:bg-white transition-all">
              My Profile
            </Link>
            <button onClick={() => openAuthModal("Sign in to access your account & cart.")} className="px-5 py-2.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] transition-all">
              Sign In
            </button>
          </div>)}
      </div>
    </nav>);
}
