"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";

export default function AboutPage() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // 1. Hero Text & Badge Entrance Sequence
      gsap.fromTo(
        ".about-hero-badge",
        { y: -20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      );

      gsap.fromTo(
        ".about-hero-title",
        { y: 45, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.3, ease: "power3.out", delay: 0.3 }
      );

      gsap.fromTo(
        ".about-hero-desc",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.5 }
      );

      // 2. Story Section Entrance
      gsap.fromTo(
        ".story-img-wrapper",
        { scale: 0.92, opacity: 0, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-story-section",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".story-content-block",
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-story-section",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 3. Beginning & Process Cards Entrance
      gsap.fromTo(
        ".process-card",
        { y: 35, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.2,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-section",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 4. Quote Banner Animation
      gsap.fromTo(
        ".director-quote-box",
        { scale: 0.95, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".director-quote-box",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <main ref={containerRef} className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      {/* Homepage Sticky Navbar */}
      <NavBar />

      {/* 1. Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center pt-32 pb-16 px-6 md:px-12 lg:px-16 overflow-hidden">
        {/* Background Accent */}
        <Image
          src="/images/products/hairoil/oilbenefit.jpeg"
          alt="KLN Ayurveda Heritage"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-15 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F4EC]/80 via-[#E8F2E3]/90 to-[#F7F4EC]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="about-hero-badge inline-block px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#2F5D34]/20 text-[#2F5D34] text-xs md:text-sm font-bold uppercase tracking-widest mb-6 shadow-sm">
            Leadership & Tradition
          </span>

          <h1 className="about-hero-title text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-[#2F5D34] tracking-tight leading-none">
            About KLN Ayurveda <br /> & Our Director
          </h1>

          <p className="about-hero-desc text-gray-700 font-paragraph text-base md:text-2xl mt-6 leading-relaxed max-w-2xl mx-auto">
            Combining traditional Ayurvedic wisdom, natural ingredients, and disciplined manufacturing for trusted everyday wellness.
          </p>
        </div>
      </section>

      {/* 2. SECTION 1: About the Director - Neha Lunawat */}
      <section className="py-20 w-full px-6 md:px-12 lg:px-16 relative z-10 about-story-section">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column - Director Card */}
          <div className="lg:col-span-5 story-img-wrapper relative h-[500px] sm:h-[620px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/80 group">
            <Image
              src="/images/seminar/IMG_0398.JPG.jpeg"
              alt="Neha Lunawat - Director of KLN Ayurveda"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2F5D34]/95 via-[#2F5D34]/40 to-transparent flex flex-col justify-end p-8 sm:p-10 text-white">
              <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest w-fit mb-3 border border-white/30">
                Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Neha Lunawat
              </h2>
              <p className="text-base font-medium text-[#E7F0E4] mt-1">
                Director – KLN Ayurveda Private Limited
              </p>
            </div>
          </div>

          {/* Right Column - Section Content */}
          <div className="lg:col-span-7 story-content-block flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-white/90 px-4 py-1.5 rounded-full border border-[#5B7C3A]/20 inline-block mb-4 shadow-sm w-fit">
              • About the Director
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-[#222123] tracking-tight mb-6 leading-tight">
              Neha Lunawat
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2F5D34] mb-6">
              Director – KLN Ayurveda Private Limited
            </h3>

            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-5">
              Neha Lunawat is the Director of KLN Ayurveda Private Limited, driven by a deep passion for Ayurveda, natural wellness, and the traditional art of creating effective Hair Care and Skin Care products through Ayurvedic methods.
            </p>

            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-5">
              Her academic and professional journey began in Pune, where she spent approximately eight years pursuing her studies and developing a strong foundation in the field of Ayurveda and natural product formulation. She completed her B.Sc. from INIFD/INFT College in association with Annamalai University, Pune, and further pursued specialized education in Ayurveda and Ayurvedic cosmetic formulation from Dr. Sumitra Patil Ayurvedic Cosmetic Academy Pune.
            </p>

            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed">
              Through her specialized training, she gained practical knowledge of Ayurvedic herbs, traditional formulations, cosmetic preparation methods, and the processes involved in developing natural Hair Care and Skin Care products. Her objective was not simply to learn Ayurveda, but to transform this traditional knowledge into carefully prepared products that could become a part of people’s everyday wellness routines.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: The Beginning of KLN Ayurveda */}
      <section className="py-20 w-full px-6 md:px-12 lg:px-16 relative z-10 process-section">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Beginning Card */}
          <div className="process-card bg-white/90 backdrop-blur-md p-8 sm:p-12 rounded-[2.5rem] border border-white shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2F5D34] bg-[#E7F0E4] px-4 py-1.5 rounded-full inline-block mb-4 border border-[#2F5D34]/20">
                • The Beginning of KLN Ayurveda
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-[#222123] mb-6">
                Commenced Manufacturing on 10 April 2024
              </h3>
              <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-5">
                With this vision, Neha Lunawat started her manufacturing journey, with the first production batch commencing on <strong>10 April 2024</strong>.
              </p>
              <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-5">
                Since then, KLN Ayurveda has successfully completed numerous production batches and has received an encouraging response from customers. The products have been used and appreciated by <strong>1,000+ customers</strong>, reflecting the trust and satisfaction that the brand has built through its commitment to quality and traditional Ayurvedic preparation.
              </p>
              <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed">
                Today, Neha continues to personally dedicate herself to the formulation and production of Ayurvedic Hair Care and Skin Care products, with a focus on maintaining the authenticity of natural ingredients and traditional preparation methods.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
              <span className="text-3xl">🌿</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D34]">
                1,000+ Satisfied Customers & Verified Ayurvedic Quality
              </span>
            </div>
          </div>

          {/* Inspired by Traditional Ayurveda Card */}
          <div className="process-card bg-white/90 backdrop-blur-md p-8 sm:p-12 rounded-[2.5rem] border border-white shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-[#E7F0E4] px-4 py-1.5 rounded-full inline-block mb-4 border border-[#5B7C3A]/20">
                • Inspired by Traditional Ayurveda
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-[#222123] mb-6">
                150+ Herbs & 7-Day Sunlight Charging
              </h3>
              <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-5">
                KLN Ayurveda’s formulations are based on the use of <strong>150+ herbs and natural Ayurvedic ingredients</strong>, carefully selected for their traditional significance in Hair Care and Skin Care.
              </p>
              <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-5">
                The manufacturing process is not a quick or mass-production approach. Each batch requires time, patience, and several carefully followed stages. A single batch takes a <strong>minimum of seven days to complete</strong>.
              </p>
              <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed">
                The process involves multiple traditional stages, including the careful boiling and extraction of herbs, followed by <strong>sunlight charging</strong>, allowing the formulation to undergo a natural preparation process. The next stages involve incorporating natural ingredients in the appropriate manner, followed by filtration, preparation, packaging, and final sealing.
              </p>
            </div>
            <div className="mt-8 p-4 rounded-2xl bg-[#E7F0E4] border border-[#2F5D34]/20 text-[#2F5D34] font-bold text-xs sm:text-sm uppercase tracking-wider">
              “This time-intensive process reflects the philosophy of KLN Ayurveda: quality should never be compromised for speed.”
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 4: Our Purpose & Highlighted Founder Quote */}
      <section className="py-20 w-full px-6 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-[1700px] mx-auto">
          <div className="bg-white/90 backdrop-blur-md p-8 sm:p-14 rounded-[3rem] border border-white shadow-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2F5D34] bg-[#E7F0E4] px-4 py-1.5 rounded-full inline-block mb-4 border border-[#2F5D34]/20">
              • Our Purpose
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-[#222123] mb-6">
              Bringing Traditional Indian Knowledge into Modern Life
            </h2>

            <p className="text-gray-700 font-paragraph text-base md:text-xl leading-relaxed mb-6">
              For Neha Lunawat, Ayurveda is more than just a profession—it is a way of bringing traditional Indian knowledge into modern everyday life.
            </p>

            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-6">
              Her primary professional focus is the development and manufacturing of Ayurvedic Hair Care and Skin Care products, with the aim of making carefully prepared, herb-based formulations accessible to people.
            </p>

            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed">
              Through KLN Ayurveda Private Limited, she continues to work towards building a brand that combines traditional Ayurvedic wisdom, natural ingredients, disciplined manufacturing processes, and a commitment to customer trust.
            </p>
          </div>

          {/* Visually Highlighted Founder / Director Quote */}
          <div className="director-quote-box max-w-5xl mx-auto bg-gradient-to-r from-[#2F5D34] via-[#3B6E40] to-[#2F5D34] text-white p-10 sm:p-16 rounded-[3rem] shadow-2xl border border-white/30 text-center relative overflow-hidden">
            <div className="absolute top-4 left-6 text-6xl text-white/10 font-serif font-bold pointer-events-none">
              “
            </div>
            <div className="absolute bottom-4 right-6 text-6xl text-white/10 font-serif font-bold pointer-events-none">
              ”
            </div>

            <p className="text-xl sm:text-3xl font-paragraph leading-relaxed italic text-[#E7F0E4] relative z-10">
              “Our aim is to preserve the essence of traditional Ayurveda and present it through carefully prepared, natural products that people can trust and make a part of their daily care.”
            </p>

            <div className="mt-8 pt-6 border-t border-white/20 inline-block relative z-10">
              <span className="block text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                Neha Lunawat
              </span>
              <span className="block text-xs sm:text-sm font-medium text-[#E7F0E4]/80 mt-1">
                Director – KLN Ayurveda Private Limited
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
