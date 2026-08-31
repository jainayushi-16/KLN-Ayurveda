"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import FooterSection from "@/app/(root)/FooterSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap";

export default function AboutPage() {
  const { t } = useLanguage();
  const containerRef = useRef(null);

  useGSAP(
    () => {
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
      title: t("nutrition.badge", {}, "Pure Ingredients"),
      desc: "Only wild-harvested herbs, cold-pressed botanical oils, and natural clays sourced from organic Indian farms.",
    },
    {
      icon: "📜",
      title: t("navigation.formulation", {}, "Traditional Ayurveda"),
      desc: "Formulated using ancient Kshirapaka thermal oil infusion methods detailed in 5,000-year-old Vedic texts.",
    },
    {
      icon: "🔬",
      title: t("benefits.badge", {}, "Scientific Research"),
      desc: "Every botanical formulation undergoes rigorous modern dermatological and microbiological purity testing.",
    },
    {
      icon: "🤝",
      title: t("testimonials.badge", {}, "Customer Trust"),
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
      <NavBar />

      {/* 1. Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center py-8 sm:py-12 px-6 md:px-12 lg:px-16 overflow-hidden">
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
            {t("common.about", {}, "Our Genesis & Leadership")}
          </span>

          <h1 className="about-hero-title text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-[#2F5D34] tracking-tight leading-none">
            {t("hero.title", {}, "Rooted in Ayurveda. Crafted with Care.")}
          </h1>

          <p className="about-hero-desc text-gray-700 font-paragraph text-base md:text-2xl mt-6 leading-relaxed max-w-2xl mx-auto">
            {t("hero.subtitle", {}, "Honoring 5,000-year-old Vedic wisdom through pure, uncompromised botanical hair and scalp remedies.")}
          </p>
        </div>
      </section>

      {/* 2. ORIGINAL GENESIS SECTION */}
      <section className="py-6 sm:py-8 w-full px-6 md:px-12 lg:px-16 relative z-10 genesis-section">
        <div className="max-w-[1700px] mx-auto bg-white/90 backdrop-blur-md p-8 sm:p-14 rounded-[3rem] border border-white shadow-xl">
          <div className="max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-[#E7F0E4] px-4 py-1.5 rounded-full border border-[#5B7C3A]/20 inline-block mb-4 shadow-sm">
              {t("common.about", {}, "Our Genesis")}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#222123] tracking-tight mb-6">
              {t("hero.badge", {}, "Preserving Ancient Kshirapaka Traditions")}
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

      {/* 3. Director Neha Lunawat */}
      <section className="py-6 sm:py-8 w-full px-6 md:px-12 lg:px-16 relative z-10 about-story-section">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
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

      {/* CTA Banner */}
      <section className="py-8 sm:py-12 w-full px-6 md:px-12 lg:px-16 relative z-10 text-center cta-trigger">
        <div className="cta-card-box max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-12 sm:p-16 rounded-[3rem] border border-white shadow-2xl hover:shadow-[0_30px_60px_rgba(47,93,52,0.25)] transition-all duration-500">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-[#E7F0E4] px-4 py-1.5 rounded-full inline-block mb-4 shadow-sm">
            {t("hero.badge", {}, "Begin Your Wellness Journey")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#222123] mb-6">
            {t("hero.title", {}, "Experience the Power of Ayurveda")}
          </h2>
          <p className="text-gray-600 font-paragraph text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            {t("hero.subtitle", {}, "Transform your hair and scalp care routine with 100% natural, cold-pressed Kshirapaka formulations.")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <button className="px-10 py-4.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:bg-[#224426] hover:scale-108 hover:shadow-[0_15px_35px_rgba(47,93,52,0.4)] active:scale-95 transition-all duration-300">
                {t("hero.shopNow", {}, "Shop Now")}
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-10 py-4.5 rounded-full border-2 border-[#2F5D34] text-[#2F5D34] hover:bg-[#2F5D34] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-widest hover:scale-105 transition-all duration-300">
                {t("common.contact", {}, "Contact Us")}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
