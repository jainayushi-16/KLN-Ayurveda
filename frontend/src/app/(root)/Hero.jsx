"use client";

import Image from "next/image";
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
      </div>
    </section>
  );
}
