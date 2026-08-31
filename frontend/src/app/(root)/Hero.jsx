"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="bg-main-bg relative overflow-hidden">
      <div className="hero-container relative w-full min-h-[75vh] sm:min-h-[85vh] md:h-screen flex items-center justify-center">
        <Image
          src="/images/leaf.svg"
          alt=""
          height={400}
          width={400}
          className="absolute top-10 left-10 opacity-20 floating-leaf z-10 pointer-events-none"
        />
        <Image
          src="/images/flower.svg"
          alt=""
          height={300}
          width={300}
          className="absolute bottom-20 right-10 opacity-20 floating-leaf z-10 pointer-events-none"
        />

        {/* Clean Responsive Background Video */}
        <video
          src="/videos/hero2.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Dark Contrast Overlay for Mobile & Desktop */}
        <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />

        {/* Responsive Explore Collection CTA */}
        <div className="absolute bottom-10 sm:bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-full px-4 text-center">
          <Link href="/shop">
            <button className="hero-explore-btn px-8 sm:px-14 md:px-20 py-3.5 sm:py-5 md:py-6 rounded-full bg-[#F6F3EC] text-[#2F5D34] text-sm sm:text-lg md:text-2xl font-black tracking-widest uppercase border-2 sm:border-4 border-[#2F5D34] shadow-[0_15px_45px_rgba(0,0,0,0.3)] hover:bg-[#2F5D34] hover:text-[#F6F3EC] hover:shadow-[0_20px_50px_rgba(47,93,52,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
              <strong className="font-black" style={{ fontWeight: 900 }}>
                {t("hero.shopNow", {}, "Explore Collection")}
              </strong>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
