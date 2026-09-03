"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-screen min-h-screen overflow-hidden bg-[#132A15]">
      <div className="hero-container relative w-full h-full flex items-center justify-center">
        {/* Decorative Nature Accents */}
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

        {/* Full Screen Edge-to-Edge Hero Video */}
        <video
          src="/videos/hero2.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Dark Contrast Overlay for readability */}
        <div className="absolute inset-0 bg-black/25 z-10 pointer-events-none" />

        {/* Floating CTA Button */}
        <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-full px-4 text-center">
          <Link href="/shop">
            <button className="hero-explore-btn px-8 sm:px-14 md:px-20 py-3.5 sm:py-5 md:py-6 rounded-full bg-[#F6F3EC] text-[#2F5D34] text-sm sm:text-lg md:text-2xl font-black tracking-widest uppercase border-2 sm:border-4 border-[#2F5D34] shadow-[0_15px_45px_rgba(0,0,0,0.4)] hover:bg-[#2F5D34] hover:text-[#F6F3EC] hover:shadow-[0_20px_50px_rgba(47,93,52,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
              <strong className="font-black" style={{ fontWeight: 900 }}>
                {t("home.heroExplore", {}, "Explore Collection")}
              </strong>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
