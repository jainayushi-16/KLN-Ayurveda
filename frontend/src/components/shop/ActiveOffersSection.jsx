"use client";

import { useEffect, useState } from "react";
import offerApi from "@/services/offer.api";
import { Tag, Sparkles, Copy, Check, Calendar, ArrowRight } from "lucide-react";
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
        if (res && res.success && Array.isArray(res.data)) {
          setOffers(res.data);
        }
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
    toast.success(`Coupon code '${code}' copied! 📋`);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  if (loading) {
    return (
      <div className="w-full py-12 px-6 max-w-[1800px] mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-44 bg-gray-200 rounded-3xl"></div>
          <div className="h-44 bg-gray-200 rounded-3xl"></div>
          <div className="h-44 bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (offers.length === 0) return null;

  return (
    <section className="w-full py-12 px-6 md:px-12 lg:px-16 max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F5D34] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
            🎁 Active Deals & Coupons
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#222123] mt-2 tracking-tight">
            Exclusive Herbal Savings
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2F5D34] hover:text-[#224426] transition-colors"
        >
          <span>Explore All Formulations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#F7F4EC] via-white to-[#E8F2E3] border border-[#2F5D34]/15 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
          >
            {/* Background Decorative Element */}
            <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Tag className="w-40 h-40 text-[#2F5D34]" />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#2F5D34] text-white font-extrabold text-xs tracking-wider">
                  {offer.type === "PERCENTAGE"
                    ? `${offer.value}% OFF`
                    : offer.type === "FLAT"
                    ? `₹${offer.value} OFF`
                    : offer.type === "FREE_SHIPPING"
                    ? "FREE SHIPPING"
                    : `₹${offer.value} OFF`}
                </span>
                {offer.endAt && (
                  <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#2F5D34]" />
                    <span>Until {new Date(offer.endAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </span>
                )}
              </div>

              <h3 className="text-lg font-extrabold text-[#222123] tracking-tight">{offer.name}</h3>
              <p className="text-xs text-gray-600 font-medium line-clamp-2 mt-1 mb-4">
                {offer.description || "Authentic cold-pressed herbal formulation deal."}
              </p>
            </div>

            <div className="pt-4 border-t border-[#2F5D34]/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Promo Code</span>
                <span className="font-mono font-black text-sm text-[#2F5D34] uppercase">{offer.code}</span>
              </div>

              <button
                onClick={() => handleCopyCode(offer.code)}
                className="px-4 py-2 rounded-xl bg-[#2F5D34] text-white hover:bg-[#224426] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode === offer.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
