"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";
import { useLanguage } from "@/i18n/LanguageContext";

export default function TestimonialSection() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const containerRef = useRef(null);

  const handleImageError = (index) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  // All 9 Seminar Images for Our Legacy Gallery
  const seminarCards = [
    {
      src: "/images/seminar/seminar1.jpg",
      fallback: "/images/products/hairoil/oilbenefit.jpeg",
      title: t("home.seminarCard1Title", {}, "Ayurvedic Cosmetic Science Seminar"),
      subtitle: t("home.seminarCard1Sub", {}, "Director Neha Lunawat Keynote Address"),
      tag: t("home.seminarCard1Tag", {}, "Main Address"),
      rotation: "rotate-z-[-2deg]",
    },
    {
      src: "/images/seminar/seminar2.png",
      fallback: "/images/products/hairmask/maskf.jpeg",
      title: t("home.seminarCard2Title", {}, "Herbal Science & Formulation Session"),
      subtitle: t("home.seminarCard2Sub", {}, "152+ Herbs & 7-Day Sun Charging"),
      tag: t("home.seminarCard2Tag", {}, "Herbal Research"),
      rotation: "rotate-z-[2deg]",
    },
    {
      src: "/images/seminar/seminar3.jpg",
      fallback: "/images/products/hairtonic/tonicf.jpeg",
      title: t("home.seminarCard3Title", {}, "KLN Delegation & Exhibition"),
      subtitle: t("home.seminarCard3Sub", {}, "Authentic Product Quality Showcase"),
      tag: t("home.seminarCard3Tag", {}, "Exhibition"),
      rotation: "rotate-z-[-1deg]",
    },
    {
      src: "/images/seminar/seminar4.jpg",
      fallback: "/images/products/hairoil/oilf.jpeg",
      title: t("home.seminarCard4Title", {}, "Traditional Formulation & Science"),
      subtitle: t("home.seminarCard4Sub", {}, "Sunlight Charging & Purity Standards"),
      tag: t("home.seminarCard4Tag", {}, "Vedic Science"),
      rotation: "rotate-z-[3deg]",
    },
    {
      src: "/images/seminar/seminar5.jpg",
      fallback: "/images/products/hairoil/oilbenefit.jpeg",
      title: t("home.seminarCard5Title", {}, "Interactive Herbal Product Stall"),
      subtitle: t("home.seminarCard5Sub", {}, "Direct Customer Engagement & Guidance"),
      tag: t("home.seminarCard5Tag", {}, "Exhibition Stall"),
      rotation: "rotate-z-[-2deg]",
    },
    {
      src: "/images/seminar/seminar6.jpg",
      fallback: "/images/products/hairmask/maskf.jpeg",
      title: t("home.seminarCard6Title", {}, "Madhya Pradesh Startup Summit 2026"),
      subtitle: t("home.seminarCard6Sub", {}, "Chief Minister Dr. Mohan Yadav Pavilion"),
      tag: t("home.seminarCard6Tag", {}, "Startup Summit"),
      rotation: "rotate-z-[2deg]",
    },
    {
      src: "/images/seminar/seminar7.jpg",
      fallback: "/images/products/hairtonic/tonicf.jpeg",
      title: t("home.seminarCard7Title", {}, "Delegation & Food Area Entrance"),
      subtitle: t("home.seminarCard7Sub", {}, "PM Narendra Modi & MP Startup Pavilion"),
      tag: t("home.seminarCard7Tag", {}, "National Summit"),
      rotation: "rotate-z-[-1deg]",
    },
    {
      src: "/images/seminar/seminar8.jpg",
      fallback: "/images/products/hairoil/oilf.jpeg",
      title: t("home.seminarCard8Title", {}, "Auditorium Plenary Session"),
      subtitle: t("home.seminarCard8Sub", {}, "Industry Leaders & Ayurvedic Innovation"),
      tag: t("home.seminarCard8Tag", {}, "Keynote Session"),
      rotation: "rotate-z-[3deg]",
    },
    {
      src: "/images/seminar/seminar9.jpg",
      fallback: "/images/products/hairoil/oilbenefit.jpeg",
      title: t("home.seminarCard9Title", {}, "Swadesh News Live Media Interaction"),
      subtitle: t("home.seminarCard9Sub", {}, "Director Neha Lunawat Press Address"),
      tag: t("home.seminarCard9Tag", {}, "Media Feature"),
      rotation: "rotate-z-[-2deg]",
    },
  ];

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current || !document.querySelector(".testimonials-section")) return;

      const mediaQuery = window.matchMedia("(min-width: 1024px)");
      if (!mediaQuery || !mediaQuery.matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".testimonials-section",
          start: "top 90%",
          end: "bottom 10%",
          scrub: 1,
        },
      });

      tl.to(".testimonials-section .first-title", {
        xPercent: 20,
      })
        .to(
          ".testimonials-section .second-title",
          {
            xPercent: -10,
          },
          "<"
        )
        .to(
          ".testimonials-section .third-title",
          {
            xPercent: 15,
          },
          "<"
        );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="testimonials-section relative w-full min-h-screen lg:h-dvh overflow-hidden bg-[#F7F4EC] py-12 flex flex-col justify-center">
      {/* Background Titles */}
      <div className="absolute inset-0 size-full flex flex-col items-center justify-center pointer-events-none select-none z-0 opacity-20 lg:opacity-30">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#2F5D34] first-title tracking-wider"> {t("home.seminarOur", {}, "OUR")} </h1>
        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-[#C9A66B] second-title tracking-widest my-2"> {t("home.seminarTitle", {}, "SEMINAR")} </h1>
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#2F5D34] third-title tracking-wider"> {t("home.seminarLegacy", {}, "LEGACY")} </h1>
      </div>

      {/* Main Section Header */}
      <div className="relative z-10 text-center px-4 mb-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#2F5D34]/10 text-[#2F5D34] text-xs font-bold uppercase tracking-widest mb-2 border border-[#2F5D34]/20">
          🌿 {t("home.seminarBadge", {}, "Our Heritage & Exhibitions")}
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#2F5D34]">
          {t("home.seminarHeading", {}, "Our Seminar Legacy")}
        </h2>
        <p className="text-xs sm:text-sm text-[#222123]/70 font-paragraph mt-1 max-w-xl mx-auto">
          {t("home.seminarSubheading", {}, "Explore moments from national Ayurvedic summits, keynotes, and live media press addresses.")}
        </p>
      </div>

      {/* Responsive Horizontal Scrollable Gallery (Desktop & Mobile) */}
      <div className="relative z-10 w-full px-4 sm:px-8 max-w-[1800px] mx-auto">
        <p className="text-center text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C9A66B] mb-4">
          {t("home.seminarSwipe", {}, "← Scroll / Swipe to explore all 9 seminar highlights →")}
        </p>

        <div className="flex overflow-x-auto gap-4 sm:gap-6 snap-x snap-mandatory pb-8 pt-2 px-2 custom-scrollbar">
          {seminarCards.map((card, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(card)}
              className={`flex-none w-[80vw] sm:w-[300px] md:w-[340px] lg:w-[360px] snap-center cursor-pointer group shadow-xl rounded-3xl overflow-hidden border-4 border-white bg-black relative h-[48vh] sm:h-[52vh] lg:h-[56vh] ${card.rotation} hover:rotate-0 hover:scale-105 transition-all duration-500 hover:z-20`}
            >
              <Image
                src={failedImages[index] ? card.fallback : card.src}
                alt={card.title}
                fill
                unoptimized
                onError={() => handleImageError(index)}
                sizes="(max-width: 768px) 80vw, 360px"
                priority={index < 3}
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                <span className="inline-block px-3 py-1 rounded-full bg-[#2F5D34] text-[#E7F0E4] text-[10px] font-bold uppercase tracking-widest mb-1.5 shadow">
                  {card.tag}
                </span>
                <h3 className="text-base font-bold leading-snug tracking-tight">{card.title}</h3>
                <p className="text-xs text-gray-200 font-paragraph mt-0.5">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Res Lightbox Modal on Card Click */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] bg-black rounded-[2.5rem] overflow-hidden border-2 border-white/30 shadow-2xl flex flex-col"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 z-20 size-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white font-bold text-lg flex items-center justify-center transition-all cursor-pointer"
            >
              ✕
            </button>
            <div className="relative w-full h-[60vh] sm:h-[75vh]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
                unoptimized
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain object-center"
              />
            </div>
            <div className="p-5 sm:p-6 bg-[#2F5D34] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C9A66B] font-bold">
                  {selectedImage.tag} — KLN Ayurveda
                </span>
                <h3 className="text-lg sm:text-xl font-bold">{selectedImage.title}</h3>
                <p className="text-xs text-[#E7F0E4]/80 mt-0.5">{selectedImage.subtitle}</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-4 py-2 rounded-full">
                Tap anywhere to close
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
