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

      gsap.fromTo(
        ".about-hero-cta",
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)", delay: 0.7 }
      );

      // 2. Our Story Genesis Section
      gsap.fromTo(
        ".story-img-wrapper",
        { scale: 0.9, opacity: 0, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.3,
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
        ".story-content",
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-story-section",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 3. Mission & Vision Cards
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

      // 4. Core Values Grid Cards
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

      // 5. Manufacturing Timeline Steps
      gsap.fromTo(
        ".timeline-step",
        { y: 35, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 6. Certifications Grid Cards
      gsap.fromTo(
        ".cert-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".cert-trigger",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 7. Why Choose Us Grid Cards
      gsap.fromTo(
        ".why-card",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".why-trigger",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 8. Expert Team Cards
      gsap.fromTo(
        ".team-card",
        { y: 40, opacity: 0, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".team-trigger",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 9. Achievements Banner
      gsap.fromTo(
        ".achievement-stat",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.12,
          duration: 1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".achievements-trigger",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 10. CTA Floating Card Banner
      gsap.fromTo(
        ".cta-card-box",
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-trigger",
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
    { step: "01", name: "Farm", desc: "Organic harvesting of Bhringraj, Amla & Neem from pristine Himalayan foothills." },
    { step: "02", name: "Selection", desc: "Hand-selection of potent herbs by certified Ayurvedic Vaidyas." },
    { step: "03", name: "Preparation", desc: "Kshirapaka slow thermal decoction in copper vessels over 72 hours." },
    { step: "04", name: "Quality Testing", desc: "Chromatography and batch lab analysis for heavy metal purity." },
    { step: "05", name: "Packaging", desc: "UV-protective glass bottling to preserve bio-active potency." },
    { step: "06", name: "Delivered to You", desc: "Eco-friendly express dispatch directly to your doorstep." },
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
    { title: "Expert Formulation", desc: "Crafted by senior Ayurvedic doctors & chemists." },
    { title: "Affordable Pricing", desc: "Luxury organic wellness made accessible to everyone." },
  ];

  const teamMembers = [
    {
      name: "Dr. Arvind Shastri",
      role: "Chief Ayurvedic Vaidya",
      desc: "30+ years of clinical experience in classical Kshirapaka formulations.",
      avatar: "👴🏾",
    },
    {
      name: "Sunita Roy",
      role: "Head of Botanical R&D",
      desc: "Ph.D. in Pharmacognosy specializing in herbal extraction techniques.",
      avatar: "👩🏽‍🔬",
    },
    {
      name: "Vikram Malhotra",
      role: "Master Quality Chemist",
      desc: "Ensures 100% heavy-metal-free and toxin-free purity across batches.",
      avatar: "👨🏽‍🔬",
    },
  ];

  const achievements = [
    { count: "25+", label: "Years of Heritage" },
    { count: "50,000+", label: "Happy Customers" },
    { count: "100%", label: "Organic Formulations" },
    { count: "100,000+", label: "Orders Delivered" },
  ];

  return (
    <main ref={containerRef} className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
      {/* Homepage Sticky Navbar */}
      <NavBar />

      {/* 1. Hero Section */}
      <section className="relative min-h-[88vh] flex items-center justify-center pt-32 pb-20 px-6 md:px-12 lg:px-16 overflow-hidden">
        {/* Background Image Accent */}
        <Image
          src="/images/products/hairoil/oilbenefit.jpeg"
          alt="KLN Ayurveda Heritage"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-20 pointer-events-none transition-transform duration-1000 ease-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F4EC]/80 via-[#E8F2E3]/90 to-[#F7F4EC]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="about-hero-badge inline-block px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#2F5D34]/20 text-[#2F5D34] text-xs md:text-sm font-bold uppercase tracking-widest mb-6 shadow-sm hover:scale-105 transition-transform duration-300">
            Our Heritage & Philosophy
          </span>

          <h1 className="about-hero-title text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-[#2F5D34] tracking-tight leading-none">
            Rooted in Ayurveda. <br /> Crafted with Care.
          </h1>

          <p className="about-hero-desc text-gray-700 font-paragraph text-base md:text-2xl mt-6 leading-relaxed max-w-2xl mx-auto">
            Honoring 5,000-year-old Vedic wisdom through pure, uncompromised botanical hair and skin remedies.
          </p>

          <div className="about-hero-cta mt-10">
            <Link href="/shop">
              <button className="px-10 py-5 rounded-full bg-[#2F5D34] text-white text-xs md:text-sm font-bold uppercase tracking-widest shadow-xl hover:bg-[#224426] hover:scale-108 hover:shadow-[0_20px_40px_rgba(47,93,52,0.35)] active:scale-95 transition-all duration-300">
                Explore Our Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-24 w-full px-6 md:px-12 lg:px-16 relative z-10 about-story-section">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Image Card */}
          <div className="story-img-wrapper relative h-[400px] sm:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/80 group">
            <Image
              src="/images/products/hairoil/oilbenefit.jpeg"
              alt="Ayurvedic Preparation"
              fill
              className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Right Content */}
          <div className="story-content">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B7C3A] bg-white/80 px-4 py-1.5 rounded-full border border-[#5B7C3A]/20 inline-block mb-4 shadow-sm">
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

      {/* 3. Mission & Vision */}
      <section className="py-16 w-full px-6 md:px-12 lg:px-16 relative z-10 mission-trigger">
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

      {/* 4. Our Values */}
      <section className="py-20 w-full px-6 md:px-12 lg:px-16 relative z-10 values-trigger">
        <div className="max-w-[1700px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
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

      {/* 5. Manufacturing Journey Timeline */}
      <section className="py-24 bg-[#E7F0E4]/60 w-full px-6 md:px-12 lg:px-16 relative z-10 timeline-container">
        <div className="max-w-[1700px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
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

      {/* 6. Certifications */}
      <section className="py-20 w-full px-6 md:px-12 lg:px-16 relative z-10 cert-trigger">
        <div className="max-w-[1700px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
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

      {/* 7. Why Choose KLN */}
      <section className="py-20 bg-white/50 w-full px-6 md:px-12 lg:px-16 relative z-10 why-trigger">
        <div className="max-w-[1700px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
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

      {/* 8. Our Team */}
      <section className="py-20 w-full px-6 md:px-12 lg:px-16 relative z-10 team-trigger">
        <div className="max-w-[1700px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
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

      {/* 9. Achievements Banner */}
      <section className="py-16 bg-[#2F5D34] text-white w-full px-6 md:px-12 lg:px-16 relative z-10 achievements-trigger">
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

      {/* 10. Call To Action Banner */}
      <section className="py-24 w-full px-6 md:px-12 lg:px-16 relative z-10 text-center cta-trigger">
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
