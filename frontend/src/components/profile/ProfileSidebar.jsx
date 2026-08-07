"use client";

import {
  User,
  UserEdit,
  PackageCheck,
  Truck,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  KeyRound,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  BarChart3,
  History,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  { id: "overview", label: "My Profile", icon: User },
  { id: "edit-profile", label: "Edit Profile", icon: UserEdit },
  { id: "orders", label: "My Orders", icon: PackageCheck, badge: "12" },
  { id: "track-orders", label: "Track Orders", icon: Truck },
  { id: "wishlist", label: "Wishlist", icon: Heart, badge: "8" },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "payment", label: "Payment Methods", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "password", label: "Change Password", icon: KeyRound },
  { id: "privacy", label: "Privacy Settings", icon: Lock },
  { id: "stats", label: "Account Statistics", icon: BarChart3 },
  { id: "activity", label: "Recent Activity", icon: History },
  { id: "help", label: "Help & Support", icon: HelpCircle },
];

export default function ProfileSidebar({ activeTab, onSelectTab, onLogout, isMobileOpen, onCloseMobile }) {
  return (
    <aside className="w-full lg:w-72 flex-none">
      {/* Container with Glassmorphism Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-4 sm:p-5 shadow-xl sticky top-28">
        <div className="text-xs font-bold uppercase tracking-widest text-[#2F5D34] px-4 py-2 mb-2 flex items-center justify-between">
          <span>Account Navigation</span>
          <span className="text-[10px] bg-[#E7F0E4] px-2 py-0.5 rounded-full font-bold">14 Items</span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#2F5D34] text-white shadow-lg shadow-[#2F5D34]/25 translate-x-1"
                    : "text-gray-700 hover:bg-emerald-50/70 hover:text-[#2F5D34]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#2F5D34]"}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#C9A66B]/20 text-[#222123]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? "text-white translate-x-0.5" : "text-gray-400 opacity-60"
                    }`}
                  />
                </div>
              </button>
            );
          })}

          <div className="my-2 border-t border-gray-100" />

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Logout</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Exit</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
