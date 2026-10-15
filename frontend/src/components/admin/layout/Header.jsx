"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Leaf, User, Bell } from "lucide-react";
import {
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  sendBrowserNotification,
} from "@/utils/browserNotification";
import axiosClient from "@/services/axiosClient";
import toast from "react-hot-toast";

import Image from "next/image";

const titlesMap = {
  "/admin": "Dashboard Overview",
  "/admin/dashboard": "Dashboard Overview",
  "/admin/products": "Product Management",
  "/admin/categories": "Category Management",
  "/admin/orders": "Order Management",
  "/admin/customers": "Customer Directory",
  "/admin/inventory": "Inventory & Stock Control",
  "/admin/reviews": "Review Moderation",
  "/admin/payments": "Payment & Invoice History",
  "/admin/offers": "Offers & Discount Codes",
  "/admin/settings": "Admin Settings & Profile",
  "/admin/notifications": "Notifications & Alerts Hub",
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    setPermission(getBrowserNotificationPermission());

    const handlePermChange = (e) => {
      setPermission(e.detail || getBrowserNotificationPermission());
    };
    window.addEventListener("kln_notification_permission_changed", handlePermChange);
    return () => {
      window.removeEventListener("kln_notification_permission_changed", handlePermChange);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out of Admin Portal successfully.");
    router.replace("/login");
  };

  const pageTitle = titlesMap[pathname] || "Admin Dashboard";
  const userInitial = user?.firstName ? user.firstName[0].toUpperCase() : "A";

  return (
    <header className="top-header">
      <div className="page-title-area flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 border border-[#2F5D34]/30 overflow-hidden">
          <Image
            src="/images/kln-logo.jpg"
            alt="KLN Ayurveda Logo"
            width={32}
            height={32}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h2>{pageTitle}</h2>
      </div>

      <div className="header-user-bar">
        {/* Browser Order Alerts Control */}
        {permission === "granted" ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-sm"
            title="Browser Order Notifications Active"
          >
            <Bell size={14} className="text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Order Alerts: Active</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={async () => {
              const res = await requestBrowserNotificationPermission();
              setPermission(res);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-[#c9a66b]/40 text-[#c9a66b] text-xs font-bold hover:bg-amber-900/80 transition-all cursor-pointer shadow-sm animate-pulse"
            title="Enable Browser Notifications for Incoming Store Orders"
          >
            <Bell size={14} />
            <span>Enable Order Alerts 🔔</span>
          </button>
        )}

        {/* Link to Notifications Hub Page */}
        <Link
          href="/admin/notifications"
          className="relative p-2 rounded-xl bg-white/80 border border-[#2F5D34]/20 hover:bg-[#2F5D34] hover:text-white text-[#2F5D34] transition-all shadow-sm flex items-center justify-center cursor-pointer"
          title="View All Store Notifications"
        >
          <Bell size={16} />
        </Link>

        <div className="user-badge">
          <div className="user-avatar">{userInitial}</div>
          <div className="user-info-text">
            <div className="user-name">
              {user?.firstName || "Admin"} {user?.lastName || ""}
            </div>
            <div className="user-role">System Administrator</div>
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout} title="Log out of Admin Portal">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
