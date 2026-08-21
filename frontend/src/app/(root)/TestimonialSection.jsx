"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";

export default function TestimonialSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef(null);

  // All 4 Seminar Images
  const seminarCards = [
    {
      id: 1,
      src: "/images/seminar/IMG_0398.JPG.jpeg",
      title: "Ayurvedic Cosmetic Science Seminar",
      subtitle: "Director Neha Lunawat Keynote Address",
      tag: "Main Address",
      desc: "Distinguished presentation on 100% botanical formulations, clean Kshirapaka extraction, and Vedic cosmetic standards.",
    },
    {
      id: 2,
      src: "/images/seminar/IMG_0408.PNG",
      title: "Herbal Science & Formulation Session",
      subtitle: "150+ Rare Herbs & 7-Day Sun Charging",
      tag: "Herbal Research",
      desc: "Live demonstration of traditional herb processing, cold-pressed seed extraction, and scalp revitalization science.",
    },
    {
      id: 3,
      src: "/images/seminar/IMG_0422.JPG.jpeg",
      title: "KLN Ayurveda Delegation & Exhibition",
      subtitle: "Authentic Product Showcase & Vaidya Meet",
      tag: "Exhibition",
      desc: "Showcasing KLN's organic hair care range to industry leaders, certified Vaidyas, and holistic wellness experts.",
    },
    {
      id: 4,
      src: "/images/seminar/IMG_0199.jpg",
      title: "Traditional Formulation & Science",
      subtitle: "Sunlight Charging & Herbal Purity Standards",
      tag: "Vedic Science",
      desc: "Exploring ancient Ayurvedic texts, natural preservation methods, and eco-friendly sustainable packaging.",
    },
  ];

  useGSAP(
    () => {
      if (typeof window === "undefined" || !sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll(".seminar-desktop-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            y: 70,
            scale: 0.85,
            opacity: 0,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.85,
            stagger: 0.2,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % seminarCards.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + seminarCards.length) % seminarCards.length);
  };

  return (
    <section ref={sectionRef} className="testimonials-section relative w-full min-h-screen bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] py-16 md:py-24 px-4 sm:px-8 overflow-hidden flex flex-col items-center justify-center">
      {/* Background Decorative Graphic */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 opacity-15">
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-[#2F5D34] tracking-widest">
          SEMINAR
        </h1>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-[#C9A66B] tracking-widest my-2">
          HERITAGE
        </h1>
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* Section Title Header */}
        <div className="text-center mb-10 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2F5D34] text-[#E7F0E4] text-xs font-extrabold uppercase tracking-widest shadow-md mb-3">
            🌿 KLN Ayurveda Seminars & Exhibitions
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#1B351E] tracking-tight">
            Our Seminar Legacy & Research
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mt-3 font-paragraph">
            Highlights from our national herbal science conventions, Vaidya delegations, and traditional formulation exhibitions.
          </p>
        </div>

        {/* 💻 DESKTOP & LAPTOP SCREEN DISPLAY (One-by-One Pop Animation Layout) */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
          {seminarCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedImage(card)}
              className="seminar-desktop-card bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/80 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/90 shadow-inner mb-5">
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  sizes="(max-width: 1200px) 50vw, 600px"
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Badge & Zoom Icon */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#2F5D34] text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                    {card.tag}
                  </span>
                  <span className="p-2.5 rounded-full bg-white/80 text-[#1B351E] group-hover:bg-white group-hover:scale-110 transition-all shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-[#1B351E] leading-snug group-hover:text-[#2F5D34] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs font-bold text-[#C9A66B] mt-1">
                  {card.subtitle}
                </p>
                <p className="text-xs text-gray-600 font-paragraph mt-2 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 📱 MOBILE & TABLET DISPLAY (Sleek Interactive Showcase Slider) */}
        <div className="block lg:hidden relative w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-4 sm:p-6 border border-white/80 shadow-2xl">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-black/90 group shadow-inner">
            <Image
              src={seminarCards[activeSlide].src}
              alt={seminarCards[activeSlide].title}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
              className="object-contain object-center transition-all duration-700 ease-out"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            {/* Top Tag & Fullscreen Trigger */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <span className="px-3.5 py-1.5 rounded-full bg-[#2F5D34] text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                {seminarCards[activeSlide].tag}
              </span>
              <button
                onClick={() => setSelectedImage(seminarCards[activeSlide])}
                className="p-2.5 rounded-full bg-white/80 text-[#1B351E] hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer"
                title="View High-Res Photo"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 text-white">
              <h3 className="text-lg sm:text-2xl font-extrabold leading-snug drop-shadow-md">
                {seminarCards[activeSlide].title}
              </h3>
              <p className="text-xs sm:text-sm text-[#C9A66B] font-bold mt-1">
                {seminarCards[activeSlide].subtitle}
              </p>
              <p className="text-xs text-gray-300 font-paragraph mt-1.5 hidden sm:block max-w-xl">
                {seminarCards[activeSlide].desc}
              </p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Seminar Photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/80 text-[#1B351E] hover:bg-white hover:scale-110 active:scale-90 transition-all shadow-xl cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next Seminar Photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/80 text-[#1B351E] hover:bg-white hover:scale-110 active:scale-90 transition-all shadow-xl cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Thumbnail Selection Bar for Mobile/Tablet */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4">
            {seminarCards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => setActiveSlide(idx)}
                className={`relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeSlide === idx
                    ? "border-[#2F5D34] ring-2 ring-[#2F5D34]/30 scale-105 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  sizes="200px"
                  className="object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High-Resolution Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] bg-[#1B351E] rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl flex flex-col"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/20 hover:bg-rose-600 text-white font-bold transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-[55vh] sm:h-[70vh] bg-black">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain object-center"
              />
            </div>

            <div className="p-4 sm:p-6 bg-[#1B351E] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-white/10">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#C9A66B]">
                  {selectedImage.tag} — KLN Ayurveda Legacy
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  {selectedImage.title}
                </h3>
                <p className="text-xs text-gray-300 font-paragraph mt-1">
                  {selectedImage.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-5 py-2 rounded-full bg-white/15 text-white text-xs font-extrabold uppercase tracking-wider hover:bg-white/30 transition-all cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
