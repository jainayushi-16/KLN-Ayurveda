"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/services/auth.api";
import toast from "react-hot-toast";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-[#1B351E] mb-2">Invalid Password Reset Link</h2>
        <p className="text-sm text-gray-600 mb-6">No valid reset token was provided in the URL.</p>
        <Link href="/" className="px-6 py-3 rounded-full bg-[#1B351E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2A4D2E] transition-all">
          Return to Home
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.resetPassword({ token, newPassword });
      setResetSuccess(true);
      toast.success(res.message || "Password reset successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to reset password. Token may be invalid or expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B351E] mb-3">Password Reset Complete!</h2>
        <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto">
          Your password for KLN Ayurveda has been updated successfully. You can now log in with your new credentials.
        </p>
        <Link
          href="/"
          className="px-8 py-3.5 rounded-full bg-[#1B351E] text-white text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-[#2A4D2E] transition-all inline-block"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md p-8 rounded-[2rem] border border-gray-200 shadow-2xl">
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#E7F0E4] border border-[#2F5D34]/20 text-[#2F5D34] text-xs font-bold uppercase tracking-widest mb-3">
          KLN Ayurveda Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B351E]">Set New Password</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          Please enter your new account password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full py-3 px-4 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2F5D34]"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Confirm New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium outline-none focus:border-[#2F5D34] focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-[#1B351E] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-[#2A4D2E] active:scale-95 transition-all disabled:opacity-50 mt-4"
        >
          {isSubmitting ? "Updating Password..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EC] flex flex-col justify-between">
      <ShopNavBar />
      <div className="flex-1 flex items-center justify-center p-4 py-16">
        <Suspense fallback={<div className="text-center py-12 font-paragraph text-sm text-gray-600">Loading security reset form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
      <FooterSection />
    </main>
  );
}
