"use client";

import { useEffect, useState } from "react";
import offerApi from "@/services/offer.api";
import { Tag, Sparkles, Copy, Check, Calendar, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ActiveOffersSection() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true);
        const res = await offerApi.getActiveOffers();
        const rawOffers = res ? (Array.isArray(res.data) ? res.data : Array.isArray(res.message) ? res.message : Array.isArray(res) ? res : []) : [];
        setOffers(rawOffers);
      } catch (err) {
        console.error("Failed to load active offers section:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code '${code}' copied to clipboard! 📋`);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  if (loading) {
    return (
      <div className="w-full py-6 px-6 max-w-[1800px] mx-auto animate-pulse">
        <div className="h-32 bg-emerald-900/10 rounded-[2.5rem] border border-[#2F5D34]/10"></div>
      </div>
    );
  }

  if (offers.length === 0) return null;

  const featuredOffer = offers.find((o) => o.isFeatured) || offers[0];

  return (
    <section className="w-full py-6 px-6 md:px-12 lg:px-16 max-w-[1800px] mx-auto relative z-10">
      {/* Featured Banner Voucher Card */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#1B351E] via-[#2F5D34] to-[#122815] text-white p-6 sm:p-8 shadow-2xl border border-[#C9A66B]/40 overflow-hidden mb-8">
        {/* Background Ambient Leaf Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A66B]/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 opacity-10 pointer-events-none">
          <Tag className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Section: Offer Details */}
          <div className="flex items-start gap-4 sm:gap-6 text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#C9A66B] to-[#9E7C44] text-[#1B351E] flex flex-col items-center justify-center font-extrabold flex-none shadow-lg border border-white/20">
              <Sparkles className="w-5 h-5 mb-0.5" />
              <span className="text-xs sm:text-sm tracking-tight leading-none uppercase">
                {featuredOffer.type === "PERCENTAGE"
                  ? `${featuredOffer.value}%`
                  : featuredOffer.type === "FREE_SHIPPING"
                  ? "FREE"
                  : `₹${featuredOffer.value}`}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-80">OFF</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-[#C9A66B]/20 text-[#C9A66B] text-[10px] font-extrabold uppercase tracking-widest border border-[#C9A66B]/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 animate-bounce" /> Special Deal
                </span>
                {featuredOffer.endAt && (
                  <span className="text-[11px] font-semibold text-emerald-200/80 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#C9A66B]" />
                    <span>Valid till {new Date(featuredOffer.endAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                {featuredOffer.name}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl font-medium">
                {featuredOffer.description || "Apply this promotional offer during checkout for instant savings on holistic herbal formulations."}
              </p>
            </div>
          </div>

          {/* Right Section: Coupon Voucher Box */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-dashed border-[#C9A66B]/60 shadow-inner">
            <div className="text-center sm:text-left px-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#C9A66B] block">Coupon Code</span>
              <span className="font-mono font-black text-xl sm:text-2xl text-white tracking-wider uppercase">
                {featuredOffer.code}
              </span>
            </div>

            <button
              onClick={() => handleCopyCode(featuredOffer.code)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A66B] to-[#B89355] text-[#1B351E] font-extrabold text-xs tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedCode === featuredOffer.code ? (
                <>
                  <Check className="w-4 h-4 text-[#1B351E]" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Other Active Store Coupons if more than 1 */}
      {offers.length > 1 && (
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#2F5D34] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> More Active Promo Deals
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.filter((o) => o.id !== featuredOffer.id).map((offer) => (
              <div
                key={offer.id}
                className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#2F5D34]/15 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2F5D34] text-white text-[10px] font-extrabold tracking-wider">
                      {offer.type === "PERCENTAGE"
                        ? `${offer.value}% OFF`
                        : offer.type === "FREE_SHIPPING"
                        ? "FREE SHIP"
                        : `₹${offer.value} OFF`}
                    </span>
                    <span className="font-mono font-bold text-xs text-[#2F5D34] uppercase">{offer.code}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#222123] mt-1.5 line-clamp-1">{offer.name}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{offer.description || "Authentic Ayurvedic deal."}</p>
                </div>

                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="p-2.5 rounded-xl bg-gray-100 group-hover:bg-[#2F5D34] text-gray-700 group-hover:text-white transition-colors flex-none cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode === offer.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
