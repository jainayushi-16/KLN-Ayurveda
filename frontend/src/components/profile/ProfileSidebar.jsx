"use client";

import {
  UserPen,
  PackageCheck,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  KeyRound,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ProfileSidebar({ activeTab, onSelectTab, onLogout, isMobileOpen, onCloseMobile, ordersCount = 0, wishlistCount = 0 }) {
  const { t } = useLanguage();
  const { user } = useAuthStore();

  const isAdmin = Boolean(user && user.role === "ADMIN");

  const sidebarItems = [
    ...(isAdmin ? [{ id: "admin-portal", label: "👑 Admin Control Portal", icon: ShieldCheck, badge: "ADMIN" }] : []),
    { id: "edit-profile", label: t("profilePage.editProfile", {}, "Edit Profile"), icon: UserPen },
    { id: "orders", label: t("profilePage.myOrders", {}, "My Orders"), icon: PackageCheck, badge: String(ordersCount) },
    { id: "wishlist", label: t("profilePage.wishlist", {}, "Wishlist"), icon: Heart, badge: String(wishlistCount) },
    { id: "addresses", label: t("profilePage.savedAddresses", {}, "Saved Addresses"), icon: MapPin },
    { id: "payment", label: t("profilePage.paymentMethods", {}, "Payment Methods"), icon: CreditCard },
    { id: "notifications", label: t("profilePage.notifications", {}, "Notifications"), icon: Bell },
    { id: "password", label: t("profilePage.changePassword", {}, "Change Password"), icon: KeyRound },
    { id: "help", label: t("profilePage.helpSupport", {}, "Help & Support"), icon: HelpCircle },
  ];

  return (
    <aside className="w-full lg:w-72 flex-none">
      {/* Container with Glassmorphism Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-4 sm:p-5 shadow-xl sticky top-28">
        <div className="text-xs font-bold uppercase tracking-widest text-[#2F5D34] px-4 py-2 mb-2 flex items-center justify-between">
          <span>{t("profilePage.accountNav", {}, "Account Navigation")}</span>
          <span className="text-[10px] bg-[#E7F0E4] px-2 py-0.5 rounded-full font-bold">{sidebarItems.length} {t("profilePage.sections", {}, "Sections")}</span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {sidebarItems.map((item) => {
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
              <span>{t("common.logout", {}, "Logout")}</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Exit</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
