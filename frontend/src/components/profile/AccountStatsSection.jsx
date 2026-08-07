"use client";

import { ShoppingBag, CreditCard, Heart, Star, Award, TrendingUp } from "lucide-react";

export default function AccountStatsSection({ stats }) {
  const STAT_CARDS = [
    {
      label: "Total Orders",
      value: stats?.totalOrders || 12,
      desc: "Delivered & Active",
      icon: ShoppingBag,
      color: "from-emerald-500 to-teal-700",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Total Spent",
      value: stats?.totalSpent || "₹14,850",
      desc: "Lifetime Purchases",
      icon: CreditCard,
      color: "from-blue-500 to-indigo-700",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      label: "Wishlist Items",
      value: stats?.wishlistItems || 8,
      desc: "Saved Formulations",
      icon: Heart,
      color: "from-rose-500 to-pink-700",
      textColor: "text-rose-700",
      bgColor: "bg-rose-50",
    },
    {
      label: "Reviews Given",
      value: stats?.reviewsGiven || 5,
      desc: "Verified Ratings",
      icon: Star,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
    },
    {
      label: "Reward Points",
      value: `${stats?.rewardPoints?.toLocaleString() || "1,450"} pts`,
      desc: "Gold Tier Perks",
      icon: Award,
      color: "from-purple-500 to-indigo-800",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            Account Statistics
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            Overview of your activity, rewards, and lifetime order metrics.
          </p>
        </div>
        <span className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34]">
          <TrendingUp className="w-5 h-5" />
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAT_CARDS.map((st, idx) => {
          const Icon = st.icon;

          return (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-[#2F5D34]/30 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`p-3 rounded-2xl ${st.bgColor} ${st.textColor}`}>
                  <Icon className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  KLN Metrics
                </span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#222123]">
                  {st.value}
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mt-1">
                  {st.label}
                </h4>
                <p className="text-[11px] text-gray-500 font-paragraph mt-0.5">
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
