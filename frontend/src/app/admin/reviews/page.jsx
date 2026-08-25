"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import ReviewsManagerSection from "@/components/admin/ReviewsManagerSection";
import { useAuthStore } from "@/store/useAuthStore";
import { ShieldCheck, Sparkles, Star, MessageSquare } from "lucide-react";

export default function AdminReviewsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = Boolean(
    user && (user.role === "ADMIN" || (user.email && typeof user.email === "string" && user.email.toLowerCase().includes("admin")))
  );

  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      {/* Navbar */}
      <ShopNavBar />

      {/* Admin Header Banner */}
      <section className="py-8 sm:py-10 w-full px-6 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#2F5D34]/15 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3.5 py-1 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Admin Portal
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-[#2F5D34] text-xs font-bold border border-[#2F5D34]/20 shadow-xs">
                Verified Admin Access
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold uppercase text-[#2F5D34] tracking-tight">
              Product Reviews Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-paragraph mt-2">
              Write, curate, and publish custom reviews and testimonials across all KLN Ayurveda formulations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-full bg-white text-[#2F5D34] font-bold text-xs uppercase tracking-wider border border-[#2F5D34]/20 shadow-sm hover:bg-[#E8F2E3] transition-all"
            >
              ← View Shop PDP
            </Link>
          </div>
        </div>
      </section>

      {/* Main Admin Reviews Content */}
      <section className="pb-28 w-full px-6 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-[1800px] mx-auto">
          <ReviewsManagerSection />
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
