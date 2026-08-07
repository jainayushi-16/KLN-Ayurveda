"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
export default function ProtectedRoute({ children, pageTitle = "this section", }) {
    const { isAuthenticated, openAuthModal } = useAuthStore();
    useEffect(() => {
        if (!isAuthenticated) {
            openAuthModal(`Please sign in to access ${pageTitle}.`);
        }
    }, [isAuthenticated, openAuthModal, pageTitle]);
    if (!isAuthenticated) {
        return (<div className="min-h-screen w-full flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC]">
        <div className="max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-2xl">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#222123] mb-3">
            Authentication Required
          </h2>
          <p className="text-sm font-paragraph text-gray-600 mb-8 leading-relaxed">
            Please sign in to access {pageTitle} and manage your KLN Ayurveda order.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => openAuthModal(`Please sign in to access ${pageTitle}.`)} className="w-full py-4 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-[#224426] transition-all">
              Sign In to Continue
            </button>
            <Link href="/shop">
              <button className="w-full py-3.5 rounded-full border-2 border-[#2F5D34] text-[#2F5D34] font-bold text-xs uppercase tracking-widest hover:bg-[#2F5D34] hover:text-white transition-all">
                Browse Shop Collection
              </button>
            </Link>
          </div>
        </div>
      </div>);
    }
    return <>{children}</>;
}
