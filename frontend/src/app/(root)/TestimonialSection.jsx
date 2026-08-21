"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";

export default function TestimonialSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const containerRef = useRef(null);

  // All 4 Seminar Images with rotation & translation for stacked card deck
  const seminarCards = [
    {
      src: "/images/seminar/IMG_0398.JPG.jpeg",
      title: "Ayurvedic Cosmetic Science Seminar",
      subtitle: "Director Neha Lunawat Keynote Address",
      tag: "Main Address",
      rotation: "rotate-z-[-6deg]",
      translation: "translate-y-[-10%]",
    },
    {
      src: "/images/seminar/IMG_0408.PNG",
      title: "Herbal Science & Formulation Session",
      subtitle: "150+ Herbs & 7-Day Sun Charging",
      tag: "Herbal Research",
      rotation: "rotate-z-[4deg]",
      translation: "translate-y-[10%]",
    },
    {
      src: "/images/seminar/IMG_0422.JPG.jpeg",
      title: "KLN Delegation & Exhibition",
      subtitle: "Authentic Product Quality Showcase",
      tag: "Exhibition",
      rotation: "rotate-z-[-4deg]",
      translation: "translate-y-[-5%]",
    },
    {
      src: "/images/seminar/IMG_0199.jpg",
      title: "Traditional Formulation & Science",
      subtitle: "Sunlight Charging & Purity Standards",
      tag: "Vedic Science",
      rotation: "rotate-z-[6deg]",
      translation: "translate-y-[5%]",
    },
  ];

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current || !document.querySelector(".testimonials-section")) return;

      // Desktop animation only
      const mediaQuery = window.matchMedia("(min-width: 1024px)");
      if (!mediaQuery || !mediaQuery.matches) return;

      // Title horizontal scroll animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".testimonials-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      tl.to(".testimonials-section .first-title", {
        xPercent: 50,
      })
        .to(
          ".testimonials-section .second-title",
          {
            xPercent: 20,
          },
          "<"
        )
        .to(
          ".testimonials-section .third-title",
          {
            xPercent: -40,
          },
          "<"
        );

      // Card-frame pinned stack scroll animation
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".testimonials-section",
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
        },
      });

      pinTl.from(".vd-card", {
        yPercent: 160,
        stagger: 0.25,
        ease: "power1.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="testimonials-section relative w-full min-h-screen lg:h-dvh overflow-hidden bg-[#F7F4EC] py-12 lg:py-0">
      {/* Background Titles */}
      <div className="lg:absolute size-full flex flex-col items-center pt-4 lg:pt-[4vw] pointer-events-none select-none z-0">
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-[#2F5D34]/90 first-title tracking-wider"> OUR </h1>
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#C9A66B] second-title tracking-widest my-1"> SEMINAR </h1>
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-[#2F5D34]/90 third-title tracking-wider"> LEGACY </h1>
      </div>

      {/* Mobile & Tablet Responsive Horizontal Touch Carousel */}
      <div className="lg:hidden relative z-10 w-full mt-6 px-4">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#2F5D34] mb-3">
          ← Swipe to explore seminar highlights →
        </p>
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-6 px-2 custom-scrollbar">
          {seminarCards.map((card, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(card)}
              className="flex-none w-[82vw] sm:w-[320px] md:w-[360px] snap-center cursor-pointer group shadow-xl rounded-3xl overflow-hidden border-4 border-white bg-black relative h-[52vh]"
            >
              <Image
                src={card.src}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 85vw, 360px"
                priority={index === 0}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                <span className="inline-block px-3 py-1 rounded-full bg-[#2F5D34] text-[#E7F0E4] text-[10px] font-bold uppercase tracking-widest mb-1.5 shadow">
                  {card.tag}
                </span>
                <h3 className="text-base font-bold leading-snug">{card.title}</h3>
                <p className="text-xs text-gray-200 font-paragraph mt-0.5">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Pinned Card Stack */}
      <div className="hidden lg:flex pin-box h-full top-1 z-10 items-center justify-center w-full ps-20 md:ps-52 absolute 2xl:bottom-32 bottom-[45vh]">
        {seminarCards.map((card, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(card)}
            className={`vd-card ${card.translation} ${card.rotation} relative cursor-pointer group shadow-2xl transition-transform duration-500 hover:scale-108 hover:z-30`}
          >
            <div className="w-full h-[55vh] md:h-[65vh] relative overflow-hidden rounded-[2.5rem] border-[.5vw] border-white bg-black">
              <Image
                src={card.src}
                alt={card.title}
                fill
                sizes="400px"
                priority={index === 0}
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 z-10 text-white">
                <span className="inline-block px-3 py-1 rounded-full bg-[#2F5D34] text-[#E7F0E4] text-[10px] font-bold uppercase tracking-widest mb-1.5 shadow-md">
                  {card.tag}
                </span>
                <h3 className="text-base md:text-lg font-bold leading-snug tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-200 font-paragraph mt-1">
                  {card.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
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
              className="absolute top-5 right-5 z-20 size-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white font-bold text-lg flex items-center justify-center transition-all"
            >
              ✕
            </button>
            <div className="relative w-full h-[60vh] sm:h-[75vh]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
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
