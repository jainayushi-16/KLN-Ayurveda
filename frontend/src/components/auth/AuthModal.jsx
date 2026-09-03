"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguage } from "@/i18n/LanguageContext";
import toast from "react-hot-toast";

import { authApi } from "@/services/auth.api";

import { validateEmail } from "@/utils/validators";

export default function AuthModal() {
    const { t } = useLanguage();
    const { isAuthModalOpen, closeAuthModal, modalMessage, login, register } = useAuthStore();
    const [activeTab, setActiveTab] = useState("login");
    const [email, setEmail] = useState("customer@klnayurveda.com");
    const [password, setPassword] = useState("Customer@12345");
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState("Ananya");
    const [lastName, setLastName] = useState("Sharma");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailCheck = validateEmail(email);
        if (!emailCheck.isValid) {
            toast.error(emailCheck.error);
            return;
        }

        setIsSubmitting(true);
        try {
          if (activeTab === "login") {
              await login({ email, password });
          } else if (activeTab === "register") {
              await register({ email, password, firstName, lastName });
          } else if (activeTab === "forgot") {
              const res = await authApi.forgotPassword({ email });
              setResetSent(true);
              toast.success(res.message || `Password reset link sent to ${email}! 📧`, {
                icon: "✉️",
                style: {
                  borderRadius: "16px",
                  background: "#2F5D34",
                  color: "#fff",
                  fontWeight: "bold",
                },
              });
          }
        } catch (err) {
          toast.error(err.message || t("messages.error", {}, "Authentication request failed."));
        } finally {
          setIsSubmitting(false);
        }
    };


    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <div onClick={closeAuthModal} className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"/>

        {/* Modal Container */}
        <div className="relative w-full max-w-md bg-[#F6F3EC] rounded-[2.5rem] p-8 shadow-2xl z-10 border border-white/80 my-auto animate-scaleUp">
          {/* Close Button */}
          <button onClick={closeAuthModal} aria-label={t("common.close", {}, "Close authentication modal")} className="absolute top-5 right-5 size-10 rounded-full bg-white/80 flex items-center justify-center font-bold text-gray-600 shadow hover:bg-white transition-all">
            ✕
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E7F0E4] border border-[#2F5D34]/20 text-[#2F5D34] text-xs font-bold uppercase tracking-widest mb-3">
              KLN Ayurveda Account
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#222123]">
              {activeTab === "login" ? t("common.login", {}, "Welcome Back") : activeTab === "register" ? t("common.register", {}, "Create Account") : t("profile.security", {}, "Reset Password")}
            </h3>
            <p className="text-xs sm:text-sm font-paragraph text-gray-600 mt-2">
              {activeTab === "forgot"
                ? "Enter your registered email to receive a reset link."
                : (typeof modalMessage === "string" ? modalMessage : t("messages.loginRequired", {}, "Please sign in to continue shopping."))}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-white/80 p-1.5 rounded-full border border-gray-200 mb-6">
            <button onClick={() => { setActiveTab("login"); setResetSent(false); }} className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "login"
              ? "bg-[#2F5D34] text-white shadow-md"
              : "text-gray-600 hover:text-black"}`}>
              {t("common.login", {}, "Sign In")}
            </button>
            <button onClick={() => { setActiveTab("register"); setResetSent(false); }} className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "register"
              ? "bg-[#2F5D34] text-white shadow-md"
              : "text-gray-600 hover:text-black"}`}>
              {t("common.register", {}, "Register")}
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {activeTab === "register" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {t("checkout.firstName", {}, "First Name")}
                  </label>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ananya" className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {t("checkout.lastName", {}, "Last Name")}
                  </label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sharma" className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"/>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                {t("checkout.email", {}, "Email Address")}
              </label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@klnayurveda.com" className="w-full py-3 px-4 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-medium outline-none focus:border-[#2F5D34]"/>
            </div>

            {activeTab !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    {t("profile.currentPassword", {}, "Password")}
                  </label>
                  {activeTab === "login" && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("forgot")}
                      className="text-[11px] text-[#2F5D34] font-bold hover:underline"
                    >
                      {t("profile.security", {}, "Forgot Password?")}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-3 px-4 pr-10 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-medium outline-none focus:border-[#2F5D34]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2F5D34] text-sm cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "forgot" && resetSent && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium leading-relaxed">
                ✅ If an account exists with <strong>{email}</strong>, a password reset link has been sent to your inbox.
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="mt-4 w-full py-4 rounded-full bg-gradient-to-r from-[#2F5D34] via-[#3F4A3C] to-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-102 active:scale-95 transition-all disabled:opacity-50">
              {isSubmitting
                ? t("common.loading", {}, "Processing...")
                : activeTab === "login"
                  ? t("common.login", {}, "Sign In & Continue")
                  : activeTab === "register"
                    ? t("common.register", {}, "Create Account & Continue")
                    : t("profile.updatePassword", {}, "Send Reset Email")}
            </button>

            {/* Quick Admin Access Button */}
            {activeTab === "login" && (
              <button
                type="button"
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await login({ email: "admin@klnayurveda.com", password: "adminpassword" });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="mt-2 w-full py-2.5 rounded-full bg-amber-400 text-gray-950 font-bold text-xs uppercase tracking-wider shadow hover:bg-amber-300 transition-all flex items-center justify-center gap-1.5 border border-amber-500 cursor-pointer"
              >
                <span>👑 Quick Sign In as Admin Portal</span>
              </button>
            )}
          </form>

          <p className="text-[11px] text-center text-gray-400 mt-6 font-paragraph">
            🔒 {t("checkout.secureCheckout", {}, "100% Encrypted & Safe Authentication")}
          </p>
        </div>
      </div>
    );
}
