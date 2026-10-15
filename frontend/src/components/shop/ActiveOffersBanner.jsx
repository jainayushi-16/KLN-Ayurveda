"use client";

import { useEffect, useState } from "react";
import offerApi from "@/services/offer.api";
import { Sparkles, Copy, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

export default function ActiveOffersBanner() {
  const { t } = useLanguage();
  const { appliedCoupon } = useCartStore();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState("");

  const activeCartCode = (appliedCoupon?.code || "").toUpperCase();

  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true);
        const res = await offerApi.getActiveOffers();
        const rawOffers = res ? (Array.isArray(res.data) ? res.data : Array.isArray(res.message) ? res.message : Array.isArray(res) ? res : []) : [];
        setOffers(rawOffers);
      } catch (err) {
        console.error("Failed to load active offers banner:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  const handleCopyCode = (offer) => {
    const isUsed = Boolean(offer.isUsed || offer.isMaxUsed);
    if (isUsed) {
      toast("You have already redeemed coupon '" + offer.code + "'.", { icon: "🔒" });
      return;
    }
    navigator.clipboard.writeText(offer.code);
    setCopiedCode(offer.code);
    toast.success(`${t("offers.code", {}, "Coupon code")} '${offer.code}' ${t("offers.copied", {}, "copied to clipboard!")} 📋`);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  if (loading || offers.length === 0) return null;

  const firstOfferUsed = Boolean(offers[0].isUsed || offers[0].isMaxUsed);

  return (
    <div className="w-full bg-gradient-to-r from-[#1B351E] via-[#2F5D34] to-[#1B351E] text-white py-3.5 px-4 sm:px-8 shadow-inner border-y border-[#C9A66B]/30 relative z-20">
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#C9A66B]/20 text-[#C9A66B] flex-none">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C9A66B] block">
                🔥 {t("offers.bannerTitle", {}, "Limited Time Ayurvedic Offers")}
              </span>
              {firstOfferUsed && (
                <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-gray-700/80 text-gray-300 border border-gray-600">
                  USED
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
              {offers[0].name} — {offers[0].description || t("offers.bannerDescFallback", {}, "Apply code at checkout to save instantly.")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0">
          {offers.slice(0, 3).map((offer) => {
            const isUsed = Boolean(offer.isUsed || offer.isMaxUsed);
            const isApplied = activeCartCode === (offer.code || "").toUpperCase();

            return (
              <div
                key={offer.id}
                onClick={() => handleCopyCode(offer)}
                className={`flex-none flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  isApplied
                    ? "bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-sm cursor-pointer"
                    : isUsed
                    ? "bg-white/5 border-white/10 opacity-70 text-gray-400 cursor-not-allowed"
                    : "bg-white/10 hover:bg-white/20 border-white/20 cursor-pointer text-white group"
                }`}
                title={
                  isApplied
                    ? "Coupon currently applied in your cart"
                    : isUsed
                    ? "You have already used this coupon"
                    : t("offers.copyCode", {}, "Click to copy code")
                }
              >
                <span
                  className={`text-xs font-mono font-black uppercase ${
                    isApplied
                      ? "text-emerald-300"
                      : isUsed
                      ? "text-gray-400 line-through"
                      : "text-[#C9A66B]"
                  }`}
                >
                  {offer.code}
                </span>

                <span className="text-[11px] font-bold">
                  ({offer.type === 'FREE_SHIPPING' ? t("common.free", {}, "Free Ship") : offer.type === 'PERCENTAGE' ? `${offer.value}% OFF` : `₹${offer.value} OFF`})
                </span>

                {isApplied ? (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-500/40 text-emerald-200 border border-emerald-400/40">
                    IN USE
                  </span>
                ) : isUsed ? (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-gray-700/80 text-gray-300 border border-gray-600">
                    USED
                  </span>
                ) : copiedCode === offer.code ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
