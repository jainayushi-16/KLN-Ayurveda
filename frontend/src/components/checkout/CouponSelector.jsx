"use client";

import { useState } from "react";
import { Ticket, CheckCircle2, Tag, Percent, Sparkles, X, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import toast from "react-hot-toast";

const AVAILABLE_COUPONS = [
  {
    code: "KLN20",
    badge: "🔥 BEST VALUE",
    title: "Get 20% Instant Discount",
    description: "Save 20% on all authentic KLN Ayurvedic formulations.",
    discountPercent: 0.2,
    minSubtotal: 0,
    isFreeShipping: false,
    color: "from-emerald-600 to-green-700",
  },
  {
    code: "AYUR50",
    badge: "🌟 MEGA 50% SAVER",
    title: "Flat 50% OFF Bumper Discount",
    description: "Enjoy massive half-price savings on your wellness order.",
    discountPercent: 0.5,
    minSubtotal: 399,
    isFreeShipping: false,
    color: "from-amber-600 to-amber-800",
  },
  {
    code: "WELCOME15",
    badge: "🎁 WELCOME OFFER",
    title: "15% OFF New Customer Bonus",
    description: "Special welcome gift discount for natural hair care lovers.",
    discountPercent: 0.15,
    minSubtotal: 0,
    isFreeShipping: false,
    color: "from-purple-600 to-indigo-700",
  },
  {
    code: "FREESHIP",
    badge: "🚚 FREE EXPRESS DELIVERY",
    title: "Zero Shipping Charges",
    description: "Get 100% free doorstep express delivery on your package.",
    discountPercent: 0,
    minSubtotal: 0,
    isFreeShipping: true,
    color: "from-teal-600 to-cyan-700",
  },
  {
    code: "KLN10",
    badge: "🌿 10% EXTRA SAVINGS",
    title: "10% Instant Savings",
    description: "Extra 10% discount on all items in your cart.",
    discountPercent: 0.1,
    minSubtotal: 0,
    isFreeShipping: false,
    color: "from-green-700 to-emerald-800",
  },
];

export default function CouponSelector({
  subtotal = 0,
  appliedCoupon = null,
  onApplyCoupon,
  onRemoveCoupon,
  isValidating = false,
}) {
  const { t, isHindi } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputCode, setInputCode] = useState("");

  const calculateSavings = (coupon) => {
    if (coupon.isFreeShipping) return 49;
    return Math.round(subtotal * (coupon.discountPercent || 0));
  };

  const handleSelectCoupon = async (code) => {
    if (onApplyCoupon) {
      await onApplyCoupon(code);
      setIsOpen(false);
    }
  };

  const handleManualApply = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    if (onApplyCoupon) {
      await onApplyCoupon(inputCode.trim().toUpperCase());
      setInputCode("");
      setIsOpen(false);
    }
  };

  const activeCode = appliedCoupon?.code || appliedCoupon?.couponCode;

  return (
    <div className="w-full">
      {/* Active Applied Coupon Banner (Meesho/Flipkart celebratory green badge) */}
      {appliedCoupon && activeCode ? (
        <div className="bg-gradient-to-r from-emerald-900 via-[#1B351E] to-[#2F5D34] rounded-2xl p-4 text-white shadow-xl border border-emerald-500/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 translate-x-3 -translate-y-3 size-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-lg flex-none">
                🎉
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/40">
                    {activeCode}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    {isHindi ? "कूपन लागू" : "Applied"}
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold text-emerald-100">
                  {appliedCoupon.isFreeShipping
                    ? isHindi ? "मुफ्त एक्सप्रेस डिलीवरी लागू हो गई है!" : "Free Express Shipping Unlocked!"
                    : isHindi ? `आपने इस ऑर्डर पर ₹${Number(appliedCoupon.discountAmount || 0).toFixed(2)} की बचत की!` : `You saved ₹${Number(appliedCoupon.discountAmount || 0).toFixed(2)} with this coupon!`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {isHindi ? "बदलें" : "Change"}
              </button>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="size-8 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs font-extrabold transition-all flex items-center justify-center cursor-pointer"
                title="Remove coupon"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Meesho/Flipkart Style Coupon Trigger Box */
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 rounded-2xl p-3.5 border-2 border-dashed border-[#2F5D34]/30 flex items-center justify-between gap-3 shadow-sm hover:border-[#2F5D34] transition-all">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#2F5D34] text-white flex items-center justify-center font-bold text-lg shadow-md flex-none">
              🏷️
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-[#222123] uppercase tracking-wider flex items-center gap-1.5">
                <span>{isHindi ? "कूपन कोड या डिस्काउंट लागू करें" : "Apply Coupon / Promo Code"}</span>
                <span className="bg-[#C9A66B] text-[#222123] px-2 py-0.5 rounded-full text-[10px] font-black">
                  5 {isHindi ? "ऑफर उपलब्ध" : "Offers"}
                </span>
              </h4>
              <p className="text-xs text-gray-600 font-paragraph mt-0.5">
                {isHindi ? "ऑर्डर पर तुरंत छूट पाने के लिए कूपन चुनें" : "Tap to select available coupons & save extra on this order"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2F5D34] hover:bg-[#1B351E] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 flex-none cursor-pointer"
          >
            <span>{isHindi ? "ऑफर देखें" : "Apply Offer"}</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Meesho / Flipkart Style Interactive Coupon Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-[#F7F4EC] w-full max-w-lg rounded-[2.5rem] border border-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#2F5D34] p-5 sm:p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                  🎟️
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg uppercase tracking-wider">
                    {isHindi ? "उपलब्ध कूपन और ऑफ़र" : "Apply Coupons & Offers"}
                  </h3>
                  <p className="text-xs text-emerald-200 font-paragraph">
                    {isHindi ? "अपने पसंदीदा कूपन पर टैप करके तुरंत छूट पाएं" : "Tap any coupon card to calculate & apply instant discount"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Manual Code Input Bar */}
            <div className="p-4 sm:p-5 bg-white border-b border-gray-200">
              <form onSubmit={handleManualApply} className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder={isHindi ? "कूपन कोड दर्ज करें (जैसे KLN20)" : "Enter Promo Code (e.g. KLN20)"}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-xs font-extrabold uppercase outline-none focus:border-[#2F5D34] transition-colors"
                />
                <button
                  type="submit"
                  disabled={isValidating || !inputCode.trim()}
                  className="px-5 py-3 rounded-xl bg-[#2F5D34] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#1B351E] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isValidating ? "..." : isHindi ? "लागू करें" : "Apply"}
                </button>
              </form>
            </div>

            {/* Coupons Card List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                ⚡ {isHindi ? "सर्वश्रेष्ठ कूपन और ऑफ़र list" : "BEST AVAILABLE COUPONS FOR YOU"}
              </span>

              {AVAILABLE_COUPONS.map((coupon) => {
                const savings = calculateSavings(coupon);
                const isCurrentApplied = activeCode === coupon.code;

                return (
                  <div
                    key={coupon.code}
                    className={`rounded-2xl bg-white p-4 border-2 transition-all relative overflow-hidden shadow-md group ${
                      isCurrentApplied
                        ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/30"
                        : "border-gray-200 hover:border-[#2F5D34] hover:shadow-lg"
                    }`}
                  >
                    {/* Top Tag Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        {coupon.badge}
                      </span>
                      {savings > 0 && (
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {coupon.isFreeShipping
                            ? isHindi ? "₹49 शिपिंग बचत" : "Save ₹49 Shipping"
                            : isHindi ? `₹${savings} की बचत` : `Save ₹${savings}`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        {/* Coupon Code Pill */}
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#2F5D34] border-2 border-dashed border-[#2F5D34]/40 px-3 py-1 rounded-lg bg-green-50 uppercase tracking-widest">
                            {coupon.code}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 mt-2">
                          {coupon.title}
                        </h4>
                        <p className="text-xs text-gray-600 font-paragraph mt-0.5">
                          {coupon.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectCoupon(coupon.code)}
                        disabled={isValidating}
                        className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex-none shadow cursor-pointer ${
                          isCurrentApplied
                            ? "bg-emerald-700 text-white"
                            : "bg-[#2F5D34] hover:bg-[#1B351E] text-white hover:scale-105 active:scale-95"
                        }`}
                      >
                        {isCurrentApplied
                          ? isHindi ? "✓ लागू" : "✓ Applied"
                          : isHindi ? "लागू करें" : "APPLY"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
