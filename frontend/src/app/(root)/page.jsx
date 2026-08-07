"use client";
import FlavorSection from "@/app/(root)/FlavorSection";
import Hero from "@/app/(root)/Hero";
import MessageSection from "@/app/(root)/MessageSection";
import NavBar from "@/components/NavBar";
import { ScrollSmoother, ScrollTrigger } from "@/libs/gsap";
import { useEffect } from "react";
import NutritionSection from "./NutritionSection";
import BenefitSection from "./BenefitSection";
import TestimonialSection from "./TestimonialSection";
import FooterSection from "./FooterSection";

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
    return (<main>
      <NavBar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Hero />
          <MessageSection />
          <FlavorSection />
          <NutritionSection />
          <BenefitSection />
          <TestimonialSection />
          <FooterSection />
        </div>
      </div>
    </main>);
}
