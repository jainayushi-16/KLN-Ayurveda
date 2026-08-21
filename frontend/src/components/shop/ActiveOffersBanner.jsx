"use client";

import { useEffect, useState } from "react";
import offerApi from "@/services/offer.api";
import { Tag, Sparkles, Copy, Check, Percent, Gift } from "lucide-react";
import toast from "react-hot-toast";

export default function ActiveOffersBanner() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true);
        const res = await offerApi.getActiveOffers();
        if (res && res.success && Array.isArray(res.data)) {
          setOffers(res.data);
        }
      } catch (err) {
        console.error("Failed to load active offers banner:", err);
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

  if (loading || offers.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#1B351E] via-[#2F5D34] to-[#1B351E] text-white py-3.5 px-4 sm:px-8 shadow-inner border-y border-[#C9A66B]/30 relative z-20">
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#C9A66B]/20 text-[#C9A66B] flex-none">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C9A66B] block">
              🔥 Limited Time Ayurvedic Offers
            </span>
            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
              {offers[0].name} — {offers[0].description || "Apply code at checkout to save instantly."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0">
          {offers.slice(0, 3).map((offer) => (
            <div
              key={offer.id}
              onClick={() => handleCopyCode(offer.code)}
              className="flex-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer transition-all group"
              title="Click to copy code"
            >
              <span className="text-xs font-mono font-black text-[#C9A66B] uppercase">{offer.code}</span>
              <span className="text-[11px] font-bold text-white">
                ({offer.type === 'FREE_SHIPPING' ? 'Free Ship' : offer.type === 'PERCENTAGE' ? `${offer.value}% OFF` : `₹${offer.value} OFF`})
              </span>
              {copiedCode === offer.code ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
