"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import NavBar from "@/components/NavBar";
import ActiveOffersBanner from "@/components/shop/ActiveOffersBanner";
import ActiveOffersSection from "@/components/shop/ActiveOffersSection";
import Hero from "@/app/(root)/Hero";
import MessageSection from "@/app/(root)/MessageSection";
import FlavorSection from "@/app/(root)/FlavorSection";
import HomeProductsSection from "@/components/home/HomeProductsSection";
import NutritionSection from "@/app/(root)/NutritionSection";
import BenefitSection from "@/app/(root)/BenefitSection";
import TestimonialSection from "@/app/(root)/TestimonialSection";
import FooterSection from "@/app/(root)/FooterSection";
import { ScrollTrigger } from "@/libs/gsap";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // If logged-in user is an Admin, open DIRECTLY into Admin Portal
    if (isAuthenticated && user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    // Refresh ScrollTrigger progressively as media/images/fonts load to avoid stale trigger offsets
    const handleRefresh = () => {
      if (typeof window !== "undefined" && ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    };

    const timers = [
      setTimeout(handleRefresh, 100),
      setTimeout(handleRefresh, 300),
      setTimeout(handleRefresh, 600),
      setTimeout(handleRefresh, 1200),
      setTimeout(handleRefresh, 2500),
      setTimeout(handleRefresh, 4000),
    ];

    window.addEventListener("load", handleRefresh);
    window.addEventListener("resize", handleRefresh);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("load", handleRefresh);
      window.removeEventListener("resize", handleRefresh);
    };
  }, []);

  // If Admin, render nothing while redirecting to Admin Portal
  if (isAuthenticated && user?.role === "ADMIN") {
    return (
      <div className="min-h-screen bg-[#08120e] flex items-center justify-center">
        <div className="text-center text-[#f5f8f6]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#e8c88a] animate-pulse">
            Opening Admin Portal... 👑
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F4EC] text-[#4B0082]">
      <NavBar />
      <Hero />
      <MessageSection />
      <FlavorSection />
      <NutritionSection />
      <BenefitSection />
      <TestimonialSection />
      <FooterSection />
    </main>
  );
}
