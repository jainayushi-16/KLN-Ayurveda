"use client";

import { useState } from "react";
import { KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/services/auth.api";
import toast from "react-hot-toast";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ChangePasswordSection() {
  const { t } = useLanguage();
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwords.currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsChangingPass(true);

    try {
      await authApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Account password changed successfully!", {
        icon: "🔒",
        style: {
          borderRadius: "16px",
          background: "#2F5D34",
          color: "#fff",
        },
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to change password.";
      toast.error(errorMsg);
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-[#2F5D34]/15 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            {t("profilePage.changePassword", {}, "Change Password")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            {t("profilePage.changePasswordDesc", {}, "Update your account password to maintain secure access.")}
          </p>
        </div>
        <span className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34]">
          <KeyRound className="w-5 h-5" />
        </span>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            {t("profilePage.currentPassword", {}, "Current Password")}
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              placeholder="Enter current password"
              className="w-full px-4 py-3 pl-10 pr-10 rounded-2xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#2F5D34] focus:bg-white"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              {t("profilePage.newPassword", {}, "New Password")}
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 pl-10 pr-10 rounded-2xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#2F5D34] focus:bg-white"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              {t("profilePage.confirmNewPassword", {}, "Confirm New Password")}
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="Repeat new password"
                className="w-full px-4 py-3 pl-10 pr-10 rounded-2xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#2F5D34] focus:bg-white"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isChangingPass}
            className="px-8 py-3 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isChangingPass ? t("profilePage.changingPassword", {}, "Changing Password...") : t("profilePage.changePasswordBtn", {}, "Change Password")}
          </button>
        </div>
      </form>
    </div>
  );
}
