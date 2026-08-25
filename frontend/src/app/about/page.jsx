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

      // 2. Genesis & Story Section Entrance
      gsap.fromTo(
        ".genesis-section",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".genesis-section",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 3. Director Section Entrance
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

      // 4. Beginning & Process Cards Entrance
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

      // 5. Quote Banner Animation
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

      // 6. Mission & Vision Cards
      gsap.fromTo(
        ".mission-card",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.2,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".mission-trigger",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 7. Core Values Grid Cards
      gsap.fromTo(
        ".value-card",
        { y: 35, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.12,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".values-trigger",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  const values = [
    {
      icon: "🌿",
      title: "Pure Ingredients",
      desc: "Only wild-harvested herbs, cold-pressed botanical oils, and natural clays sourced from organic Indian farms.",
    },
    {
      icon: "📜",
      title: "Traditional Ayurveda",
      desc: "Formulated using ancient Kshirapaka thermal oil infusion methods detailed in 5,000-year-old Vedic texts.",
    },
    {
      icon: "🔬",
      title: "Scientific Research",
      desc: "Every botanical formulation undergoes rigorous modern dermatological and microbiological purity testing.",
    },
    {
      icon: "🤝",
      title: "Customer Trust",
      desc: "Uncompromising transparency, zero harmful toxins, zero synthetic dyes, and 100% cruelty-free commitment.",
    },
  ];

  const manufacturingTimeline = [
    { step: "01", name: "Herb Selection", desc: "150+ carefully chosen Ayurvedic herbs & natural ingredients." },
    { step: "02", name: "Boiling & Extraction", desc: "Slow decoction & extraction of bio-active herbal essence." },
    { step: "03", name: "Sunlight Charging", desc: "Infusing formulations under natural sunlight over multiple days." },
    { step: "04", name: "7-Day Batch Process", desc: "Minimum 7-day slow batch process: quality never compromised for speed." },
    { step: "05", name: "Filtration & Sealing", desc: "Multi-stage hygienic filtration, precision bottling, and final sealing." },
    { step: "06", name: "Delivered to You", desc: "Appreciated by 1,000+ satisfied customers nationwide." },
  ];

  const certifications = [
    { title: "GMP Certified", desc: "Good Manufacturing Practice certified facility standards." },
    { title: "ISO 9001:2015", desc: "International quality management & safety standards." },
    { title: "100% Organic", desc: "EcoCert certified pesticide-free organic botanicals." },
    { title: "Ayush Approved", desc: "Recognized by Ministry of Ayush, Government of India." },
  ];

  const whyChooseUs = [
    { title: "Natural Ingredients", desc: "100% plant-based botanicals without fillers." },
    { title: "No Harmful Chemicals", desc: "Free from parabens, sulfates, silicones, and mineral oil." },
    { title: "Trusted by Families", desc: "Safe, gentle formulations for all age groups." },
    { title: "Fast Global Delivery", desc: "Tracked express shipping across the globe." },
    { title: "Expert Formulation", desc: "Personally crafted by Director Neha Lunawat & Vaidyas." },
    { title: "Affordable Pricing", desc: "Luxury organic wellness made accessible to everyone." },
  ];

  const teamMembers = [
    {
      name: "Neha Lunawat",
      role: "Director – KLN Ayurveda Private Limited",
      desc: "Educated in Pune (INIFD & Dr. Sumitra Patil Ayurvedic Academy). Personally leads every batch formulation.",
      avatar: "👩🏽‍💼",
    },
    {
      name: "Dr. Arvind Shastri",
      role: "Senior Ayurvedic Vaidya",
      desc: "Over 30 years of clinical experience in classical Indian botanical extracts.",
      avatar: "👴🏾",
    },
    {
      name: "Sunita Roy",
      role: "Head of Botanical R&D",
      desc: "Specializes in multi-stage herbal boiling, sunlight charging, and purity testing.",
      avatar: "👩🏽‍🔬",
    },
  ];

  const achievements = [
    { count: "150+", label: "Ayurvedic Herbs Used" },
    { count: "1,000+", label: "Happy Customers" },
    { count: "7 Days", label: "Min. Batch Process" },
    { count: "100%", label: "Authentic & Natural" },
  ];

  return (
    <main ref={containerRef} className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      {/* Homepage Sticky Navbar */}
      <NavBar />

      {/* 1. Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center py-8 sm:py-12 px-6 md:px-12 lg:px-16 overflow-hidden">
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
            Our Genesis & Leadership
          </span>

          <h1 className="about-hero-title text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-[#2F5D34] tracking-tight leading-none">
            Rooted in Ayurveda. <br /> Crafted with Care.
          </h1>

          <p className="about-hero-desc text-gray-700 font-paragraph text-base md:text-2xl mt-6 leading-relaxed max-w-2xl mx-auto">
            Honoring 5,000-year-old Vedic wisdom through pure, uncompromised botanical hair and scalp remedies.
          </p>
        </div>
      </section>

      {/* 2. ORIGINAL GENESIS SECTION: Preserving Ancient Kshirapaka Traditions */}
      <section className="py-6 sm:py-8 w-full px-6 md:px-12 lg:px-16 relative z-10 genesis-section">
        <div className="max-w-[1700px] mx-auto bg-white/90 backdrop-blur-md p-8 sm:p-14 rounded-[3rem] border border-white shadow-xl">
          <div className="max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-[#E7F0E4] px-4 py-1.5 rounded-full border border-[#5B7C3A]/20 inline-block mb-4 shadow-sm">
              Our Genesis
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#222123] tracking-tight mb-6">
              Preserving Ancient Kshirapaka Traditions
            </h2>
            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-6">
              KLN Ayurveda was born out of a deep reverence for classical Indian wellness. Disillusioned by modern synthetic cosmetics loaded with silicones and artificial fragrances, our founders set out to revive authentic Kshirapaka recipes—a meticulous process where fresh herbs are simmered in milk and sesame oil over slow woodfires.
            </p>
            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed">
              Every drop of KLN Hair Oil, Hair Mask, and Scalp Tonic carries the sacred essence of wild Bhringraj, Amla, and Brahmi, formulated without compromise for transformative natural vitality.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION 1: About the Director - Neha Lunawat */}
      <section className="py-6 sm:py-8 w-full px-6 md:px-12 lg:px-16 relative z-10 about-story-section">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column - Director Card */}
          <div className="lg:col-span-5 story-img-wrapper relative h-[500px] sm:h-[620px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/80 group">
            <Image
              src="/images/seminar/IMG_0199.jpg"
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
              About the Director
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-[#222123] tracking-tight mb-4 leading-tight">
              Neha Lunawat
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2F5D34] mb-6">
              Director – KLN Ayurveda Private Limited
            </h3>

            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-5">
              Neha Lunawat is the Director of KLN Ayurveda Private Limited, driven by a deep passion for Ayurveda, natural wellness, and the traditional art of creating effective Hair Care and Scalp Care products through Ayurvedic methods.
            </p>

            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-5">
              Her academic and professional journey began in Pune, where she spent approximately eight years pursuing her studies and developing a strong foundation in the field of Ayurveda and natural product formulation. She completed her B.Sc. from INIFD/INFT College in association with Annamalai University, Pune, and further pursued specialized education in Ayurveda and Ayurvedic cosmetic formulation from Dr. Sumitra Patil Ayurvedic Cosmetic Academy Pune.
            </p>

            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed">
              Through her specialized training, she gained practical knowledge of Ayurvedic herbs, traditional formulations, cosmetic preparation methods, and the processes involved in developing natural Hair Care and Scalp Care products. Her objective was not simply to learn Ayurveda, but to transform this traditional knowledge into carefully prepared products that could become a part of people’s everyday wellness routines.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: The Beginning of KLN Ayurveda & SECTION 3: Inspired by Traditional Ayurveda */}
      <section className="py-6 sm:py-8 w-full px-6 md:px-12 lg:px-16 relative z-10 process-section">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Beginning Card */}
          <div className="process-card bg-white/90 backdrop-blur-md p-8 sm:p-12 rounded-[2.5rem] border border-white shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2F5D34] bg-[#E7F0E4] px-4 py-1.5 rounded-full inline-block mb-4 border border-[#2F5D34]/20">
                The Beginning of KLN Ayurveda
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
                Today, Neha continues to personally dedicate herself to the formulation and production of Ayurvedic Hair Care and Scalp Care products, with a focus on maintaining the authenticity of natural ingredients and traditional preparation methods.
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
                Inspired by Traditional Ayurveda
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-[#222123] mb-6">
                150+ Herbs & 7-Day Sunlight Charging
              </h3>
              <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-5">
                KLN Ayurveda’s formulations are based on the use of <strong>150+ herbs and natural Ayurvedic ingredients</strong>, carefully selected for their traditional significance in Hair Care and Scalp Care.
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

      {/* 5. SECTION 4: Our Purpose & Highlighted Director Quote */}
      <section className="py-6 sm:py-8 w-full px-6 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-[1700px] mx-auto">
          <div className="bg-white/90 backdrop-blur-md p-8 sm:p-14 rounded-[3rem] border border-white shadow-2xl mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2F5D34] bg-[#E7F0E4] px-4 py-1.5 rounded-full inline-block mb-4 border border-[#2F5D34]/20">
              Our Purpose
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-[#222123] mb-6">
              Bringing Traditional Indian Knowledge into Modern Life
            </h2>

            <p className="text-gray-700 font-paragraph text-base md:text-xl leading-relaxed mb-6">
              For Neha Lunawat, Ayurveda is more than just a profession—it is a way of bringing traditional Indian knowledge into modern everyday life.
            </p>

            <p className="text-gray-700 font-paragraph text-base md:text-lg leading-relaxed mb-6">
              Her primary professional focus is the development and manufacturing of Ayurvedic Hair Care and Scalp Care products, with the aim of making carefully prepared, herb-based formulations accessible to people.
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

      {/* 6. Mission & Vision */}
      <section className="py-6 sm:py-8 w-full px-6 md:px-12 lg:px-16 relative z-10 mission-trigger">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="mission-card bg-white/85 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/80 shadow-xl hover:shadow-[0_25px_50px_rgba(47,93,52,0.2)] hover:-translate-y-2 transition-all duration-500">
            <span className="text-4xl mb-4 block animate-pulse">🎯</span>
            <h3 className="text-2xl md:text-3xl font-bold text-[#2F5D34] mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 font-paragraph text-base leading-relaxed">
              To deliver 100% natural, chemical-free Ayurvedic remedies that restore holistic scalp health, stimulate thick hair growth, and impart timeless natural radiance.
            </p>
          </div>

          <div className="mission-card bg-white/85 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/80 shadow-xl hover:shadow-[0_25px_50px_rgba(47,93,52,0.2)] hover:-translate-y-2 transition-all duration-500">
            <span className="text-4xl mb-4 block animate-pulse">👁️</span>
            <h3 className="text-2xl md:text-3xl font-bold text-[#2F5D34] mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700 font-paragraph text-base leading-relaxed">
              To become the global benchmark for luxury Ayurvedic personal care by fusing ancient Vedic alchemy with transparent modern botanical science.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Our Values */}
      <section className="py-6 sm:py-8 w-full px-6 md:px-12 lg:px-16 relative z-10 values-trigger">
        <div className="max-w-[1700px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-white/80 px-4 py-1.5 rounded-full inline-block mb-3 border border-[#5B7C3A]/20 shadow-sm">
              Pillars of Integrity
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#222123]">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="value-card bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/80 shadow-lg flex flex-col items-center text-center group hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(47,93,52,0.18)] transition-all duration-500">
                <div className="size-16 rounded-2xl bg-[#E7F0E4] flex items-center justify-center text-3xl mb-6 group-hover:scale-115 group-hover:rotate-6 group-hover:bg-[#2F5D34] group-hover:text-white transition-all duration-500">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-[#222123] mb-3 group-hover:text-[#2F5D34] transition-colors">
                  {v.title}
                </h3>
                <p className="text-sm font-paragraph text-gray-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Manufacturing Journey Timeline */}
      <section className="py-8 sm:py-10 bg-[#E7F0E4]/60 w-full px-6 md:px-12 lg:px-16 relative z-10 timeline-container">
        <div className="max-w-[1700px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2F5D34] bg-white px-4 py-1.5 rounded-full inline-block mb-3 border border-[#2F5D34]/20 shadow-sm">
              From Seed to Bottle
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#222123]">
              Our Manufacturing Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            {manufacturingTimeline.map((step, idx) => (
              <div key={idx} className="timeline-step bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white shadow-md flex flex-col justify-between text-center group hover:-translate-y-3 hover:shadow-xl transition-all duration-500">
                <div>
                  <span className="size-10 rounded-full bg-[#2F5D34] text-white text-xs font-bold flex items-center justify-center mx-auto mb-4 group-hover:scale-115 group-hover:bg-[#5B7C3A] transition-all duration-300">
                    {step.step}
                  </span>
                  <h4 className="text-lg font-bold text-[#222123] mb-2 group-hover:text-[#2F5D34] transition-colors">
                    {step.name}
                  </h4>
                  <p className="text-xs font-paragraph text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Certifications */}
      <section className="py-6 sm:py-8 w-full px-6 md:px-12 lg:px-16 relative z-10 cert-trigger">
        <div className="max-w-[1700px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-white/80 px-4 py-1.5 rounded-full inline-block mb-3 border border-[#5B7C3A]/20 shadow-sm">
              Verified Excellence
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#222123]">
              Certified Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <div key={idx} className="cert-card bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/80 shadow-md text-center hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-3 animate-bounce">🏅</div>
                <h4 className="text-lg font-bold text-[#2F5D34] mb-2">
                  {cert.title}
                </h4>
                <p className="text-xs font-paragraph text-gray-600">
                  {cert.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Why Choose KLN */}
      <section className="py-6 sm:py-8 bg-white/50 w-full px-6 md:px-12 lg:px-16 relative z-10 why-trigger">
        <div className="max-w-[1700px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-white px-4 py-1.5 rounded-full inline-block mb-3 border border-[#5B7C3A]/20 shadow-sm">
              Unrivaled Quality
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#222123]">
              Why Choose KLN
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((w, i) => (
              <div key={i} className="why-card bg-white/85 backdrop-blur-md p-8 rounded-3xl border border-white shadow-md flex items-start gap-4 hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <span className="text-2xl text-[#2F5D34] font-bold">✓</span>
                <div>
                  <h4 className="text-base font-bold text-[#222123] mb-1">
                    {w.title}
                  </h4>
                  <p className="text-xs font-paragraph text-gray-600 leading-relaxed">
                    {w.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Our Team */}
      <section className="py-6 sm:py-8 w-full px-6 md:px-12 lg:px-16 relative z-10 team-trigger">
        <div className="max-w-[1700px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-white px-4 py-1.5 rounded-full inline-block mb-3 border border-[#5B7C3A]/20 shadow-sm">
              Masters of Alchemy
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#222123]">
              Meet Our Experts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((t, idx) => (
              <div key={idx} className="team-card bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-lg text-center group hover:-translate-y-3 hover:shadow-2xl transition-all duration-500">
                <div className="size-20 rounded-full bg-[#E7F0E4] flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 group-hover:bg-[#2F5D34] transition-all duration-500">
                  {t.avatar}
                </div>
                <h4 className="text-xl font-bold text-[#222123] mb-1 group-hover:text-[#2F5D34] transition-colors">
                  {t.name}
                </h4>
                <span className="text-xs font-bold text-[#2F5D34] uppercase tracking-wider block mb-3">
                  {t.role}
                </span>
                <p className="text-xs font-paragraph text-gray-600 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Achievements Banner */}
      <section className="py-8 sm:py-10 bg-[#2F5D34] text-white w-full px-6 md:px-12 lg:px-16 relative z-10 achievements-trigger">
        <div className="max-w-[1700px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {achievements.map((a, i) => (
            <div key={i} className="achievement-stat p-6 hover:scale-105 transition-transform duration-300">
              <span className="block text-4xl sm:text-6xl font-bold tracking-tight text-[#E7F0E4]">
                {a.count}
              </span>
              <span className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-[#E7F0E4]/80 mt-2">
                {a.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 13. Call To Action Banner */}
      <section className="py-8 sm:py-12 w-full px-6 md:px-12 lg:px-16 relative z-10 text-center cta-trigger">
        <div className="cta-card-box max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-12 sm:p-16 rounded-[3rem] border border-white shadow-2xl hover:shadow-[0_30px_60px_rgba(47,93,52,0.25)] transition-all duration-500">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-[#E7F0E4] px-4 py-1.5 rounded-full inline-block mb-4 shadow-sm">
            Begin Your Wellness Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#222123] mb-6">
            Experience the Power of Ayurveda
          </h2>
          <p className="text-gray-600 font-paragraph text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Transform your hair and scalp care routine with 100% natural, cold-pressed Kshirapaka formulations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <button className="px-10 py-4.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:bg-[#224426] hover:scale-108 hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] active:scale-95 transition-all duration-300">
                Shop Now
              </button>
            </Link>
            <Link href="/shop">
              <button className="px-10 py-4.5 rounded-full border-2 border-[#2F5D34] text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-widest hover:scale-105 transition-all duration-300">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
