"use client";

import { History, ShoppingBag, Heart, MapPin, ShieldCheck, ArrowRight } from "lucide-react";

export default function RecentActivitySection({ activities, onNavigateSection }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case "wishlist":
        return <Heart className="w-4 h-4 text-rose-500" />;
      case "address":
        return <MapPin className="w-4 h-4 text-blue-600" />;
      case "security":
      default:
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            Recent Activity Timeline
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            Real-time audit log of your account updates, orders, and preference changes.
          </p>
        </div>
        <span className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34]">
          <History className="w-5 h-5" />
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-200 space-y-8 my-4">
        {activities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Dot Indicator */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 p-2 rounded-full bg-white border-2 border-[#2F5D34] shadow-md group-hover:scale-110 transition-transform">
              {getActivityIcon(act.type)}
            </div>

            {/* Activity Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 border border-gray-200 hover:border-[#2F5D34]/30 hover:bg-white transition-all shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-bold text-[#222123]">
                  {act.title}
                </h4>
                <span className="text-[11px] font-semibold text-gray-400 font-paragraph">
                  {act.date}
                </span>
              </div>
              <p className="text-xs text-gray-600 font-paragraph leading-relaxed">
                {act.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
