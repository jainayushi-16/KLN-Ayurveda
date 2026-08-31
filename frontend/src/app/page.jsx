"use client";

import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import ActiveOffersBanner from "@/components/shop/ActiveOffersBanner";
import ActiveOffersSection from "@/components/shop/ActiveOffersSection";
import Hero from "@/app/(root)/Hero";
import MessageSection from "@/app/(root)/MessageSection";
import FlavorSection from "@/app/(root)/FlavorSection";
import NutritionSection from "@/app/(root)/NutritionSection";
import BenefitSection from "@/app/(root)/BenefitSection";
import TestimonialSection from "@/app/(root)/TestimonialSection";
import FooterSection from "@/app/(root)/FooterSection";
import { ScrollTrigger } from "@/libs/gsap";

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger after DOM mount & layout shifts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F4EC] text-[#222123]">
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
