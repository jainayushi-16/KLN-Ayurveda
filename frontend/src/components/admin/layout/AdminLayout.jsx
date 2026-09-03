"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import FloatingLeaves from "@/components/admin/common/FloatingLeaves";
import { useSidebar } from "@/context/SidebarContext";

export default function AdminLayout({ children }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="admin-body-wrapper relative">
      <FloatingLeaves />
      <div className={`app-container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
        <Sidebar />
        <div className="main-wrapper">
          <Header />
          <main className="content-body animate-fadeIn relative z-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
