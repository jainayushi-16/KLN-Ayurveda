"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Phone, Mail, ArrowRight, Facebook, Instagram, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function FooterSection() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(t("footer.subscribeToast", {}, "Thank you for subscribing to KLN Ayurveda! 🌿"));
    setEmail("");
  };

  return (
    <footer className="footer-section w-full bg-[#132A15] text-[#F6F3EC] pt-8 pb-5 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-6 md:gap-8 pb-6">
          
          {/* Col 1: NAVIGATION */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#C9A66B] mb-3">
              {t("footer.navigation", {}, "NAVIGATION")}
            </h4>
            <ul className="space-y-1.5 text-xs font-paragraph text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t("nav.home", {}, "Home")}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  {t("nav.shop", {}, "Shop")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t("nav.about", {}, "About Us")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t("nav.contact", {}, "Contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: FORMULATIONS */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#C9A66B] mb-3">
              {t("footer.formulations", {}, "FORMULATIONS")}
            </h4>
            <ul className="space-y-1.5 text-xs font-paragraph text-gray-300">
              <li>
                <Link href="/shop?type=Oil" className="hover:text-white transition-colors">
                  {t("footer.oil", {}, "Hair Growth Oil")}
                </Link>
              </li>
              <li>
                <Link href="/shop?type=Mask" className="hover:text-white transition-colors">
                  {t("footer.mask", {}, "Herbal Hair Mask")}
                </Link>
              </li>
              <li>
                <Link href="/shop?type=Tonic" className="hover:text-white transition-colors">
                  {t("footer.tonic", {}, "Scalp Tonic")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: CUSTOMER CARE */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#C9A66B] mb-3">
              {t("footer.customerCare", {}, "CUSTOMER CARE")}
            </h4>
            <ul className="space-y-1.5 text-xs font-paragraph text-gray-300">
              <li>
                <a href="tel:7725820320" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={13} className="text-[#C9A66B]" />
                  <span>7725820320</span>
                </a>
              </li>
              <li>
                <a href="mailto:ayurvedakln@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={13} className="text-[#C9A66B]" />
                  <span>ayurvedakln@gmail.com</span>
                </a>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  {t("nav.wishlist", {}, "Saved Items")}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  {t("nav.cart", {}, "My Cart")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: POLICIES & LEGAL */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#C9A66B] mb-3">
              {t("footer.policies", {}, "POLICIES & LEGAL")}
            </h4>
            <ul className="space-y-1.5 text-xs font-paragraph text-gray-300">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  {t("footer.privacyPolicy", {}, "Privacy Policy")}
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  {t("footer.termsOfService", {}, "Terms & Conditions")}
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  {t("footer.returnPolicy", {}, "Return & Refund Policy")}
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  {t("footer.shippingPolicy", {}, "Shipping & Delivery Policy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: NEWSLETTER, FOLLOW US & AVAILABLE ON */}
          <div className="col-span-2 md:col-span-4 lg:col-span-3 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-paragraph text-gray-300 leading-relaxed mb-3">
                {t("footer.newsletterTitle", {}, "Discover authentic Ayurvedic wellness. Stay informed about new products & recipes!")}
              </p>
              
              <form onSubmit={handleSubscribe} className="relative">
                <div className="flex items-center border-b border-white/40 pb-1.5">
                  <input
                    type="email"
                    required
                    placeholder={t("footer.emailPlaceholder", {}, "Enter your email address")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none pr-6 font-paragraph"
                  />
                  <button type="submit" aria-label={t("footer.subscribeAria", {}, "Subscribe to newsletter")} className="text-white hover:text-[#C9A66B] transition-colors">
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>

              {/* Side-by-side Follow Us & Available On */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#C9A66B] mb-2">
                    {t("footer.followUs", {}, "FOLLOW US")}
                  </h4>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://www.facebook.com/share/19VQq9RfLm/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      title="Follow KLN Ayurveda on Facebook"
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#C9A66B] hover:text-[#132A15] text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-white/10 hover:scale-105"
                    >
                      <Facebook size={14} />
                    </a>
                    <a
                      href="https://www.instagram.com/klnayurveda?utm_source=qr&stkn=MWV6a3Z4ajhwOXNodQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      title="Follow KLN Ayurveda on Instagram"
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#C9A66B] hover:text-[#132A15] text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-white/10 hover:scale-105"
                    >
                      <Instagram size={14} />
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#C9A66B] mb-2">
                    {t("footer.availableOn", {}, "AVAILABLE ON")}
                  </h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-[11px] font-medium text-white border border-white/10 hover:border-[#FF9900]/60 hover:bg-[#FF9900]/15 transition-all">
                      <ShoppingBag size={11} className="text-[#C9A66B]" />
                      Amazon
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-[11px] font-medium text-white border border-white/10 hover:border-[#2874F0]/60 hover:bg-[#2874F0]/15 transition-all">
                      <ShoppingBag size={11} className="text-[#C9A66B]" />
                      Flipkart
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-[11px] font-medium text-white border border-white/10 hover:border-[#F43397]/60 hover:bg-[#F43397]/15 transition-all">
                      <ShoppingBag size={11} className="text-[#C9A66B]" />
                      Meesho
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-paragraph text-gray-400">
          <div>
            {t("footer.copyright", {}, "© 2026 KLN Ayurveda. All rights reserved.")}
          </div>

          {/* Legal Links Right Side */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-paragraph text-gray-300">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              {t("footer.privacyPolicy", {}, "Privacy Policy")}
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              {t("footer.termsOfService", {}, "Terms & Conditions")}
            </Link>
            <Link href="/return-policy" className="hover:text-white transition-colors">
              {t("footer.returnPolicy", {}, "Return & Refund Policy")}
            </Link>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              {t("footer.shippingPolicy", {}, "Shipping & Delivery Policy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
