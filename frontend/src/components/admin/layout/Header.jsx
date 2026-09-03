"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Leaf, User } from "lucide-react";
import toast from "react-hot-toast";

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
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

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
        <div className="w-8 h-8 rounded-full bg-[#2F5D34]/10 text-[#2F5D34] flex items-center justify-center">
          <Leaf size={18} />
        </div>
        <h2>{pageTitle}</h2>
      </div>

      <div className="header-user-bar">
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
