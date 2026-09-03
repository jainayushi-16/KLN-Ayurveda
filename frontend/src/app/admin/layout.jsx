"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { SidebarProvider } from "@/context/SidebarContext";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { ShieldCheck, Leaf } from "lucide-react";
import "./admin.css";

function AdminRouteGuard({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, isAuthChecking, checkAuth } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      await checkAuth();
      if (isMounted) {
        setHasChecked(true);
      }
    };
    verify();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (hasChecked && !isAuthChecking) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user && user.role !== "ADMIN") {
        router.replace("/");
      }
    }
  }, [hasChecked, isAuthChecking, isAuthenticated, user, router]);

  // Prevent flash of wrong layout or unauthorized content
  if (isAuthChecking || !hasChecked || !isAuthenticated || (user && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-[#08120e] flex items-center justify-center p-4">
        <div className="text-center text-[#f5f8f6] animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-[#c9a66b]/40 text-[#c9a66b] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(201,166,107,0.2)] animate-pulse">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-lg font-bold text-[#e8c88a] mb-1">Authenticating Admin Access...</h2>
          <p className="text-xs text-[#a3b8ad]">Verifying credentials & role authorization from KLN backend</p>
        </div>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}

export default function RootAdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminRouteGuard>{children}</AdminRouteGuard>
    </SidebarProvider>
  );
}
