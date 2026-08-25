"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  MessageSquare,
  PlusCircle,
  BarChart3,
  Package,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function AdminPortalSidebar({ onOpenAddReviewModal, activeSection = "reviews" }) {
  const pathname = usePathname();

  const adminNavItems = [
    {
      id: "reviews",
      label: "Product Reviews",
      href: "/admin/reviews",
      icon: MessageSquare,
      badge: "Curate & Add",
    },
  ];

  return (
    <aside className="w-full lg:w-72 flex-none">
      <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-xl sticky top-28 flex flex-col gap-6">
        {/* Admin Header */}
        <div className="pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#2F5D34] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Admin Portal
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#222123]">Control Center</h2>
          <p className="text-[11px] text-gray-500 font-paragraph mt-0.5">
            Manage reviews, products & shop content
          </p>
        </div>

        {/* Primary Action Button: Add Review */}
        <div>
          <button
            onClick={onOpenAddReviewModal}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#2F5D34]/30"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>+ Write New Review</span>
          </button>
        </div>

        {/* Admin Sidebar Navigation */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F5D34] px-3 mb-1">
            Admin Sections
          </span>

          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || activeSection === item.id;

            return (
              <Link key={item.id} href={item.href}>
                <div
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#2F5D34] text-white font-bold shadow-md"
                      : "text-gray-700 hover:bg-[#E7F0E4]/60 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-amber-300" : "text-[#2F5D34]"
                      }`}
                    />
                    <span className="text-xs uppercase tracking-wider">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#E7F0E4] text-[#2F5D34]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Back to Shop Link */}
        <div className="pt-4 border-t border-gray-100">
          <Link
            href="/shop"
            className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#2F5D34] hover:underline"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
            </span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
