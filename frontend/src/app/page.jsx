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
import { ScrollSmoother, ScrollTrigger } from "@/libs/gsap";

export default function Home() {
  useEffect(() => {
    let smoother;
    try {
      if (typeof window !== "undefined" && ScrollSmoother) {
        smoother = ScrollSmoother.create({
          smooth: 1.5,
          effects: true,
          smoothTouch: 0.1,
        });
        ScrollTrigger.refresh();
      }
    } catch (e) {
      console.warn("ScrollSmoother initialization skipped:", e);
    }

    return () => {
      if (smoother) {
        smoother.kill();
      }
    };
  }, []);

  return (
    <main>
      <ActiveOffersBanner />
      <NavBar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Hero />
          <ActiveOffersSection />
          <MessageSection />
          <FlavorSection />
          <NutritionSection />
          <BenefitSection />
          <TestimonialSection />
          <FooterSection />
        </div>
      </div>
    </main>
  );
}
