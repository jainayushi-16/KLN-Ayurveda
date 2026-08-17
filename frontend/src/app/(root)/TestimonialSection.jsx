"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/libs/gsap";
import { useGSAP } from "@gsap/react";

export default function TestimonialSection() {
  const containerRef = useRef(null);

  // Real Seminar Photos from /images/seminar/
  const seminarImages = [
    {
      src: "/images/seminar/IMG_0398.JPG.jpeg",
      title: "Ayurvedic Cosmetic Science Seminar",
      subtitle: "Director Neha Lunawat presenting traditional herbal formulation techniques.",
      tag: "Main Address",
    },
    {
      src: "/images/seminar/IMG_0408.PNG",
      title: "Herbal Extraction & Research Session",
      subtitle: "Demonstrating 150+ herb selections, boiling, and 7-day sunlight charging.",
      tag: "Research & Formulation",
    },
    {
      src: "/images/seminar/IMG_0422.JPG.jpeg",
      title: "KLN Ayurveda Delegation & Exhibition",
      subtitle: "Promoting chemical-free, authentic Ayurvedic wellness routines.",
      tag: "Delegation & Exhibition",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeSeminar = seminarImages[activeIndex];

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Header entrance animation
      gsap.from(".seminar-badge", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".seminar-section",
          start: "top 80%",
        },
      });

      gsap.from(".seminar-title", {
        y: 35,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".seminar-title",
          start: "top 85%",
        },
      });

      // Seminar image card zoom & entrance
      gsap.from(".seminar-image-box", {
        scale: 0.94,
        y: 45,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".seminar-image-box",
          start: "top 80%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="seminar-section py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3]/60 to-[#F7F4EC]">
      <div className="container mx-auto px-5 md:px-10 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="seminar-badge inline-block px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#2F5D34]/20 text-[#2F5D34] text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 shadow-sm">
            Ayurvedic Excellence & Seminar
          </span>
          <h2 className="seminar-title text-3xl sm:text-5xl md:text-6xl font-bold text-[#222123] uppercase tracking-tight leading-tight">
            KLN Ayurveda Seminar & Legacy
          </h2>
          <p className="text-gray-600 font-paragraph text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Promoting authentic traditional formulations, natural cosmetic science, and holistic wellness education across India.
          </p>
        </div>

        {/* Primary Featured Seminar Image Display Container */}
        <div className="seminar-image-box relative w-full max-w-6xl mx-auto h-[55vh] sm:h-[70vh] lg:h-[80vh] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white group transition-all duration-700 hover:shadow-[0_30px_60px_rgba(47,93,52,0.3)] mb-8">
          <Image
            src={activeSeminar.src}
            alt={activeSeminar.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Elegant Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-70 transition-opacity duration-500" />

          {/* Shimmer Light Beam Effect on Hover */}
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />

          {/* Glassmorphic Caption Card */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 z-10">
            <div className="bg-black/60 backdrop-blur-xl border border-white/25 p-6 sm:p-8 rounded-3xl text-white max-w-2xl shadow-2xl">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#2F5D34] text-[#E7F0E4] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-2">
                {activeSeminar.tag} — KLN Ayurveda
              </span>
              <h3 className="text-xl sm:text-3xl font-bold tracking-tight">
                {activeSeminar.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 font-paragraph mt-2 leading-relaxed">
                {activeSeminar.subtitle}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-3 rounded-full border border-white text-[#2F5D34] text-xs font-bold uppercase tracking-wider shadow-lg">
              <span>🌿 Traditional Excellence</span>
            </div>
          </div>
        </div>

        {/* Seminar Photos Selector / Thumbnails Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {seminarImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-24 sm:h-32 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                activeIndex === idx
                  ? "border-[#2F5D34] scale-105 shadow-xl ring-4 ring-[#2F5D34]/20"
                  : "border-white/80 opacity-70 hover:opacity-100 hover:scale-102"
              }`}
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="300px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">
                  {img.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
