"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { validateEmail } from "@/utils/validators";
import { Lock, Mail, Leaf, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAuthChecking, login, checkAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Check auth state on load. If logged in, redirect based on role
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address (e.g. name@domain.com).");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login({ email, password });
      if (res && res.success && res.user) {
        if (res.user.role === "ADMIN") {
          toast.success("Welcome, Admin! Redirecting to Admin Dashboard... 👑");
          router.replace("/admin/dashboard");
        } else {
          toast.success(`Welcome back, ${res.user.firstName || "Customer"}! 🎉`);
          router.replace("/");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F6F3EC] flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-10 h-10 text-[#2F5D34] animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#2F5D34]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#F6F3EC] via-[#E8F2E3] to-[#F6F3EC] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#2F5D34]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#C9A66B]/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <Image
              src="/images/logo.svg"
              alt="KLN Ayurveda Logo"
              width={44}
              height={44}
              className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-lg text-[#2F5D34] uppercase tracking-wider">
              KLN Ayurveda
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-[#222123]">Account Sign In</h1>
          <p className="text-xs text-gray-500 font-paragraph mt-1">
            Sign in with your email & password to access your portal.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="name@domain.com"
                className={`w-full py-3 pl-10 pr-4 rounded-xl bg-gray-50 border text-xs font-medium outline-none transition-all ${
                  emailError ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-[#2F5D34]"
                }`}
              />
            </div>
            {emailError && <p className="text-[11px] font-bold text-red-600 mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{isSubmitting ? "Authenticating..." : "Sign In & Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link href="/" className="text-xs font-bold text-[#2F5D34] hover:underline">
            ← Return to KLN Ayurveda Store
          </Link>
        </div>
      </div>
    </main>
  );
}
