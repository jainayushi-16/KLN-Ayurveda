"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { contactApi } from "@/services/contact.api";
import toast from "react-hot-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function FooterSection() {
  const { t } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubmitting(true);
    try {
      const res = await contactApi.subscribeNewsletter(newsletterEmail);
      if (res.success) {
        toast.success("Thank you for subscribing to KLN Ayurveda newsletter!");
        setNewsletterEmail("");
      }
    } catch (err) {
      toast.error(err.message || "Failed to subscribe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer-section w-full bg-[#1B351E] text-milk">
      <div className="relative pt-[8vh] pb-[6vh] px-6 md:px-12 max-w-[1800px] mx-auto">
        {/* Title Tagline */}
        <div className="relative z-10 overflow-hidden">
          <h1 className="general-title text-center text-milk py-4 font-bold tracking-widest text-2xl sm:text-4xl md:text-5xl opacity-90">
            #PURECARE
          </h1>
        </div>

        {/* Social Media Links */}
        <div className="relative z-10 flex items-center justify-center gap-5 md:mt-8 mt-4">
          <div className="social-btn p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer hover:scale-110">
            <img src="/images/youtube.svg" alt="YouTube" className="size-5 md:size-6" />
          </div>
          <div className="social-btn p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer hover:scale-110">
            <img src="/images/instagram.svg" alt="Instagram" className="size-5 md:size-6" />
          </div>
          <div className="social-btn p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer hover:scale-110">
            <img src="/images/facebook.svg" alt="Facebook" className="size-5 md:size-6" />
          </div>
        </div>

        {/* Premium Our Founder Section Card */}
        <div className="relative z-10 mt-14 mb-16">
          <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/15 p-6 sm:p-10 shadow-2xl hover:bg-white/[0.08] hover:border-white/25 hover:-translate-y-1 transition-all duration-500 group">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Founder Circular Image */}
              <div className="relative flex-none">
                <div className="size-32 sm:size-40 rounded-full p-1.5 border-2 border-[#C9A66B]/60 shadow-xl overflow-hidden bg-[#244428] relative group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/products/logo.jpeg"
                    alt="Neha Lunawat - Founder & Visionary of KLN Ayurveda"
                    fill
                    className="object-cover object-center rounded-full"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 bg-[#C9A66B] text-[#1B351E] text-xs font-bold px-3 py-1 rounded-full shadow-md border border-white/20">
                  {t("footer.visionaryBadge", {}, "Visionary")}
                </span>
              </div>

              {/* Founder Text & Bio Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-lg">🌿</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C9A66B]">
                    {t("footer.ourFounderBadge", {}, "Our Founder")}
                  </span>
                  <span className="text-lg">🌿</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  {t("footer.founderName", {}, "Neha Lunawat")}
                </h3>

                <p className="text-sm font-bold text-[#E7F0E4] mt-1 tracking-wide">
                  {t("footer.founderTitle", {}, "Founder & Visionary")}
                </p>

                <p className="text-xs italic text-gray-300/90 mt-1 font-paragraph">
                  {t("footer.founderDegree", {}, "Bachelor of Science in Interior Design, Annamalai University, Tamil Nadu")}
                </p>

                <p className="text-xs sm:text-sm font-paragraph text-gray-300 mt-4 leading-relaxed line-clamp-5 max-w-3xl">
                  {t("footer.founderBio", {}, "Neha combines her creative academic background with a deep passion for holistic wellness. She has successfully integrated design thinking and Ayurvedic principles to develop authentic herbal hair care formulations using over 250 carefully selected herbs and traditional preparation methods. Her mission is to create a brand that delivers 100% natural solutions, promotes sustainability, and empowers local artisans while preserving the timeless wisdom of Ayurveda.")}
                </p>

                <div className="mt-6">
                  <Link href="/about">
                    <button
                      aria-label="Read More About Our Story"
                      className="px-6 py-3 rounded-full bg-[#E7F0E4] text-[#1B351E] font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2"
                    >
                      <span>{t("footer.readOurStory", {}, "Read More About Our Story")}</span>
                      <span>→</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Links & Newsletter */}
        <div className="relative z-10 mt-12 md:px-10 px-5 flex gap-10 md:flex-row flex-col justify-between text-milk font-paragraph md:text-lg font-medium border-t border-white/15 pt-12">
          <div className="flex flex-wrap items-start md:gap-16 gap-8">
            <div>
              <p className="font-bold text-[#E7F0E4] uppercase text-xs tracking-widest mb-3">
                {t("footer.navigation", {}, "Navigation")}
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <Link href="/" className="hover:text-white transition-colors">
                  {t("common.home", {}, "Home")}
                </Link>
                <Link href="/shop" className="hover:text-white transition-colors">
                  {t("common.shop", {}, "Shop Collection")}
                </Link>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t("common.about", {}, "About Us")}
                </Link>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t("common.contact", {}, "Contact Us")}
                </Link>
              </div>
            </div>

            <div>
              <p className="font-bold text-[#E7F0E4] uppercase text-xs tracking-widest mb-3">
                {t("footer.customerCare", {}, "Customer Care")}
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <a href="tel:7725820320" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>📞</span> <span>7725820320</span>
                </a>
                <a href="mailto:ayurvedakln@gmail.com" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>✉️</span> <span>ayurvedakln@gmail.com</span>
                </a>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  {t("navigation.wishlist", {}, "Wishlist")}
                </Link>
                <Link href="/cart" className="hover:text-white transition-colors">
                  {t("navigation.cart", {}, "Shopping Cart")}
                </Link>
              </div>
            </div>

            <div>
              <p className="font-bold text-[#E7F0E4] uppercase text-xs tracking-widest mb-3">
                {t("footer.formulations", {}, "Formulations")}
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <Link href="/shop" className="hover:text-white transition-colors">
                  {t("footer.oil", {}, "Hair Growth Oil")}
                </Link>
                <Link href="/shop" className="hover:text-white transition-colors">
                  {t("footer.mask", {}, "Herbal Hair Mask")}
                </Link>
                <Link href="/shop" className="hover:text-white transition-colors">
                  {t("footer.tonic", {}, "Scalp Tonic")}
                </Link>
              </div>
            </div>
          </div>

          <div className="md:max-w-lg">
            <p className="text-sm text-gray-200 leading-relaxed">
              {t("footer.newsletterTitle", {}, "Discover authentic Ayurvedic wellness. Stay informed about new herbal products, recipes, and exclusive offers!")}
            </p>

            <form onSubmit={handleSubscribe} className="flex justify-between items-center border-b border-[#D9D9D9] py-4 mt-6">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t("footer.emailPlaceholder", {}, "Enter your email address")}
                className="w-full bg-transparent outline-none placeholder:text-[#999999] text-sm text-white"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-none p-2 hover:scale-110 transition-transform disabled:opacity-50"
              >
                <img src="/images/arrow.svg" alt="arrow" className="size-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright & Language Selector Bar */}
        <div className="relative z-10 mt-16 pt-6 border-t border-white/10 px-5 md:px-10 flex flex-col sm:flex-row justify-between items-center text-milk text-xs text-gray-400 gap-4">
          <p>{t("footer.copyright", {}, "© 2026 KLN Ayurveda. All rights reserved.")}</p>
          <div className="flex items-center gap-6">
            <div className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              <LanguageSelector />
            </div>
            <span className="hover:text-white cursor-pointer transition-colors">{t("footer.privacyPolicy", {}, "Privacy Policy")}</span>
            <span className="hover:text-white cursor-pointer transition-colors">{t("footer.termsOfService", {}, "Terms of Service")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
