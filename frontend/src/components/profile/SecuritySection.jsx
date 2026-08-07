"use client";

import { useState } from "react";
import { Shield, KeyRound, Smartphone, Laptop, LogOut, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function SecuritySection({ devices, onRevokeDevice, onLogoutAllDevices }) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsChangingPass(true);

    try {
      // Backend integration commented
      /* await profileApi.changePassword(passwords); */

      await new Promise((resolve) => setTimeout(resolve, 500));
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
      toast.error("Failed to change password.");
    } finally {
      setIsChangingPass(false);
    }
  };

  const handle2FAToggle = () => {
    const nextState = !is2FAEnabled;
    setIs2FAEnabled(nextState);
    toast.success(
      nextState
        ? "Two-Factor Authentication (2FA) enabled via Authenticator App."
        : "Two-Factor Authentication (2FA) disabled.",
      { icon: "🛡️" }
    );
  };

  const handleLogoutAll = () => {
    onLogoutAllDevices();
    toast.success("Logged out from all other active sessions.", { icon: "🚪" });
  };

  return (
    <div className="space-y-8">
      {/* Change Password Card */}
      <div id="security-password-card" className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
              Security & Password
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
              Manage your password, login credentials, and account authentication.
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
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 pl-10 pr-10 rounded-2xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#2F5D34] focus:bg-white"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="At least 8 chars"
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-2xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#2F5D34] focus:bg-white"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-3 pl-10 rounded-2xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#2F5D34] focus:bg-white"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPass}
              className="px-8 py-3 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isChangingPass ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600">
              <Shield className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#222123]">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-xs text-gray-500 font-paragraph">
                Add an extra layer of protection using Google Authenticator or SMS codes.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handle2FAToggle}
            className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
              is2FAEnabled ? "bg-[#2F5D34] justify-end" : "bg-gray-300 justify-start"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
          </button>
        </div>
      </div>

      {/* Active Login Devices Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#222123]">Active Login Devices</h3>
            <p className="text-xs text-gray-500 font-paragraph mt-0.5">
              Devices currently signed in to your KLN Ayurveda account.
            </p>
          </div>

          <button
            onClick={handleLogoutAll}
            className="px-4 py-2 rounded-full bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout All Other Devices</span>
          </button>
        </div>

        <div className="space-y-4">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <span className="p-3 rounded-xl bg-white text-gray-700 shadow-sm border border-gray-200">
                  {dev.deviceType === "mobile" ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Laptop className="w-5 h-5" />
                  )}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-800">{dev.deviceName}</h4>
                    {dev.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-paragraph">
                    {dev.location} • {dev.browser} • Last active: {dev.lastActive}
                  </p>
                </div>
              </div>

              {!dev.isCurrent && (
                <button
                  onClick={() => onRevokeDevice(dev.id)}
                  className="text-xs font-bold text-rose-600 hover:underline px-3 py-1 rounded-lg hover:bg-rose-50"
                >
                  Revoke Access
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
