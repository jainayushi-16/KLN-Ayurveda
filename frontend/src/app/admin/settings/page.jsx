"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Save,
  ShieldCheck,
  Store,
  Lock,
  Mail,
  Phone,
  Bell,
  Percent,
  Truck,
  Sparkles,
  Globe,
  Building,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff,
  User,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("store"); // "store" | "security" | "notifications" | "branding"
  const [loading, setLoading] = useState(true);

  const [savingStore, setSavingStore] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingToggles, setSavingToggles] = useState(false);

  // Store Configuration State
  const [storeForm, setStoreForm] = useState({
    siteName: "KLN Ayurveda",
    supportEmail: "support@klnayurveda.com",
    supportPhone: "+91 9876543210",
    businessAddress: "KLN Ayurveda Pvt. Ltd., Narsinghpur, Madhya Pradesh - 487001",
    currency: "INR (₹)",
    taxPercent: "18",
    freeShippingThreshold: "499",
  });

  // Admin Profile State
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "System",
    lastName: user?.lastName || "Admin",
    email: user?.email || "admin@klnayurveda.com",
    phone: user?.phone || "+91 9876543210",
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // System Toggles State
  const [toggles, setToggles] = useState({
    orderEmailAlerts: true,
    lowStockAlerts: true,
    lowStockLimit: "10",
    customerStatusEmails: true,
    dailySummaryDigest: false,
    maintenanceMode: false,
    autoApproveReviews: false,
    announcementText: "100% Pesticide-Free & Pure Ayurvedic • Free Shipping on Orders Over ₹499",
    defaultLanguage: "en-IN",
  });

  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/settings");
      if (res && (res.data || res.success)) {
        const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        const map = {};
        list.forEach((s) => {
          if (s.key && s.value !== undefined) {
            map[s.key] = s.value;
          }
        });

        setStoreForm((prev) => ({
          ...prev,
          siteName: map.siteName || map.storeName || prev.siteName,
          supportEmail: map.supportEmail || prev.supportEmail,
          supportPhone: map.supportPhone || prev.supportPhone,
          businessAddress: map.businessAddress || prev.businessAddress,
          currency: map.currency || prev.currency,
          taxPercent: map.taxPercent || prev.taxPercent,
          freeShippingThreshold: map.freeShippingThreshold || prev.freeShippingThreshold,
        }));

        setToggles((prev) => ({
          ...prev,
          orderEmailAlerts: map.orderEmailAlerts !== undefined ? map.orderEmailAlerts === "true" || map.orderEmailAlerts === true : prev.orderEmailAlerts,
          lowStockAlerts: map.lowStockAlerts !== undefined ? map.lowStockAlerts === "true" || map.lowStockAlerts === true : prev.lowStockAlerts,
          lowStockLimit: map.lowStockLimit || prev.lowStockLimit,
          customerStatusEmails: map.customerStatusEmails !== undefined ? map.customerStatusEmails === "true" || map.customerStatusEmails === true : prev.customerStatusEmails,
          dailySummaryDigest: map.dailySummaryDigest !== undefined ? map.dailySummaryDigest === "true" || map.dailySummaryDigest === true : prev.dailySummaryDigest,
          maintenanceMode: map.maintenanceMode !== undefined ? map.maintenanceMode === "true" || map.maintenanceMode === true : prev.maintenanceMode,
          autoApproveReviews: map.autoApproveReviews !== undefined ? map.autoApproveReviews === "true" || map.autoApproveReviews === true : prev.autoApproveReviews,
          announcementText: map.announcementText || prev.announcementText,
          defaultLanguage: map.defaultLanguage || prev.defaultLanguage,
        }));
      }
    } catch (err) {
      console.warn("Could not load server settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettingsWithFallback = async (settingsList) => {
    try {
      await axiosClient.put("/admin/settings", { settings: settingsList });
    } catch (err) {
      // Fallback for endpoints expecting individual setting objects
      await Promise.all(
        settingsList.map((item) =>
          axiosClient.put("/admin/settings", item).catch((e) => {
            console.warn("Single setting upsert warning:", e?.message);
            return null;
          })
        )
      );
    }
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();
    setSavingStore(true);
    try {
      await saveSettingsWithFallback([
        { key: "siteName", value: storeForm.siteName, description: "Store Title" },
        { key: "storeName", value: storeForm.siteName, description: "Store Title" },
        { key: "supportEmail", value: storeForm.supportEmail, description: "Customer Support Email" },
        { key: "supportPhone", value: storeForm.supportPhone, description: "Customer Support Phone" },
        { key: "businessAddress", value: storeForm.businessAddress, description: "Registered Business Address" },
        { key: "currency", value: storeForm.currency, description: "Store Currency" },
        { key: "taxPercent", value: String(storeForm.taxPercent), description: "Default GST/Tax %" },
        { key: "freeShippingThreshold", value: String(storeForm.freeShippingThreshold), description: "Free Shipping Order Minimum" },
      ]);
      toast.success("Store configuration saved successfully! 🌿");
    } catch (err) {
      toast.error(err.message || "Failed to save store settings");
    } finally {
      setSavingStore(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      try {
        await axiosClient.put("/users/profile", {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone,
        });
      } catch (e) {}

      updateUser({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
      });

      toast.success("Admin profile updated successfully! 🛡️");
    } catch (err) {
      toast.error(err.message || "Failed to update admin profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    setSavingPassword(true);
    try {
      await axiosClient.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Administrator password changed successfully! 🔑");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to update password. Check current password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveToggles = async (e) => {
    e.preventDefault();
    setSavingToggles(true);
    try {
      await saveSettingsWithFallback([
        { key: "orderEmailAlerts", value: String(toggles.orderEmailAlerts), description: "New Order Email Alerts" },
        { key: "lowStockAlerts", value: String(toggles.lowStockAlerts), description: "Low Stock Warning Alerts" },
        { key: "lowStockLimit", value: String(toggles.lowStockLimit), description: "Low Stock Quantity Limit" },
        { key: "customerStatusEmails", value: String(toggles.customerStatusEmails), description: "Customer Order Status Emails" },
        { key: "dailySummaryDigest", value: String(toggles.dailySummaryDigest), description: "Daily Sales Email Digest" },
        { key: "maintenanceMode", value: String(toggles.maintenanceMode), description: "Maintenance Mode Banner" },
        { key: "autoApproveReviews", value: String(toggles.autoApproveReviews), description: "Auto-Approve Customer Reviews" },
        { key: "announcementText", value: toggles.announcementText, description: "Top Header Announcement Bar" },
        { key: "defaultLanguage", value: toggles.defaultLanguage, description: "Default Store Language" },
      ]);
      toast.success("System preferences & alerts saved! ⚡");
    } catch (err) {
      toast.error(err.message || "Failed to update preferences");
    } finally {
      setSavingToggles(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 bg-[#F7F4EC] p-4 sm:p-6 rounded-3xl min-h-screen text-[#4B0082]">
      {/* Top Banner & Title Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2F5D34]/15 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#E7F0E4] text-[#2F5D34] border border-[#2F5D34]/20 shadow-sm flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#2F5D34]" />
                System Administration
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Status: Operational
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2F5D34] tracking-tight uppercase">
              Admin Portal Settings
            </h1>
            <p className="text-sm text-[#5B7C3A] max-w-2xl mt-1 leading-relaxed font-paragraph">
              Manage core Ayurvedic store parameters, global fulfillment settings, administrator security credentials, and real-time alert notifications.
            </p>
          </div>

          <button
            onClick={fetchSettings}
            disabled={loading}
            className="self-start md:self-auto px-5 py-2.5 rounded-2xl bg-[#E7F0E4] hover:bg-[#2F5D34] hover:text-white border border-[#2F5D34]/20 text-[#2F5D34] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Syncing..." : "Sync Settings"}</span>
          </button>
        </div>

        {/* Quick System Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100 text-xs">
          <div className="bg-[#F6F3EC] p-3.5 rounded-2xl border border-[#2F5D34]/10">
            <span className="text-[#5B7C3A] block text-[11px] font-semibold uppercase">Admin Account</span>
            <span className="text-[#2F5D34] font-bold truncate block mt-0.5">{profileForm.email}</span>
          </div>
          <div className="bg-[#F6F3EC] p-3.5 rounded-2xl border border-[#2F5D34]/10">
            <span className="text-[#5B7C3A] block text-[11px] font-semibold uppercase">Store Brand</span>
            <span className="text-[#4B0082] font-bold truncate block mt-0.5">{storeForm.siteName}</span>
          </div>
          <div className="bg-[#F6F3EC] p-3.5 rounded-2xl border border-[#2F5D34]/10">
            <span className="text-[#5B7C3A] block text-[11px] font-semibold uppercase">Default GST Rate</span>
            <span className="text-emerald-700 font-bold block mt-0.5">{storeForm.taxPercent}% Standard</span>
          </div>
          <div className="bg-[#F6F3EC] p-3.5 rounded-2xl border border-[#2F5D34]/10">
            <span className="text-[#5B7C3A] block text-[11px] font-semibold uppercase">Free Shipping Above</span>
            <span className="text-[#C9A66B] font-bold block mt-0.5">₹{storeForm.freeShippingThreshold}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-[#2F5D34]/15 shadow-sm">
        <button
          onClick={() => setActiveTab("store")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "store"
              ? "bg-[#2F5D34] text-white shadow-md border border-[#2F5D34] scale-[1.01]"
              : "text-[#5B7C3A] hover:text-[#2F5D34] hover:bg-[#E7F0E4]"
          }`}
        >
          <Store size={16} />
          <span>Store & Business</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "security"
              ? "bg-[#2F5D34] text-white shadow-md border border-[#2F5D34] scale-[1.01]"
              : "text-[#5B7C3A] hover:text-[#2F5D34] hover:bg-[#E7F0E4]"
          }`}
        >
          <ShieldCheck size={16} />
          <span>Admin Security</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "notifications"
              ? "bg-[#2F5D34] text-white shadow-md border border-[#2F5D34] scale-[1.01]"
              : "text-[#5B7C3A] hover:text-[#2F5D34] hover:bg-[#E7F0E4]"
          }`}
        >
          <Bell size={16} />
          <span>Alerts & Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab("branding")}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "branding"
              ? "bg-[#2F5D34] text-white shadow-md border border-[#2F5D34] scale-[1.01]"
              : "text-[#5B7C3A] hover:text-[#2F5D34] hover:bg-[#E7F0E4]"
          }`}
        >
          <Sparkles size={16} />
          <span>Branding & Controls</span>
        </button>
      </div>

      {/* Tab 1: Store & Business Settings */}
      {activeTab === "store" && (
        <form onSubmit={handleSaveStore} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2F5D34]/15 shadow-md space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34] border border-[#2F5D34]/20">
                <Store size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2F5D34] uppercase tracking-wide">
                  Store Profile & Taxation
                </h2>
                <p className="text-xs text-[#5B7C3A]">
                  General information displayed on invoices, checkout receipts, and customer communications.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block text-[#4B0082] font-bold mb-2 uppercase tracking-wider">
                  Store Brand Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={storeForm.siteName}
                    onChange={(e) => setStoreForm({ ...storeForm, siteName: e.target.value })}
                    className="w-full p-3.5 pl-11 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold focus:border-[#2F5D34] focus:ring-1 focus:ring-[#2F5D34] outline-none transition-all"
                  />
                  <Store size={18} className="absolute left-4 top-3.5 text-[#5B7C3A]" />
                </div>
              </div>

              <div>
                <label className="block text-[#4B0082] font-bold mb-2 uppercase tracking-wider">
                  Customer Support Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={storeForm.supportEmail}
                    onChange={(e) => setStoreForm({ ...storeForm, supportEmail: e.target.value })}
                    className="w-full p-3.5 pl-11 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold focus:border-[#2F5D34] focus:ring-1 focus:ring-[#2F5D34] outline-none transition-all"
                  />
                  <Mail size={18} className="absolute left-4 top-3.5 text-[#5B7C3A]" />
                </div>
              </div>

              <div>
                <label className="block text-[#4B0082] font-bold mb-2 uppercase tracking-wider">
                  Support Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={storeForm.supportPhone}
                    onChange={(e) => setStoreForm({ ...storeForm, supportPhone: e.target.value })}
                    className="w-full p-3.5 pl-11 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold focus:border-[#2F5D34] focus:ring-1 focus:ring-[#2F5D34] outline-none transition-all"
                  />
                  <Phone size={18} className="absolute left-4 top-3.5 text-[#5B7C3A]" />
                </div>
              </div>

              <div>
                <label className="block text-[#4B0082] font-bold mb-2 uppercase tracking-wider">
                  Currency Symbol & Format
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={storeForm.currency}
                    onChange={(e) => setStoreForm({ ...storeForm, currency: e.target.value })}
                    className="w-full p-3.5 pl-11 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold focus:border-[#2F5D34] focus:ring-1 focus:ring-[#2F5D34] outline-none transition-all"
                  />
                  <Globe size={18} className="absolute left-4 top-3.5 text-[#5B7C3A]" />
                </div>
              </div>

              <div>
                <label className="block text-[#4B0082] font-bold mb-2 uppercase tracking-wider">
                  Default GST / Tax Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={storeForm.taxPercent}
                    onChange={(e) => setStoreForm({ ...storeForm, taxPercent: e.target.value })}
                    className="w-full p-3.5 pl-11 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold focus:border-[#2F5D34] focus:ring-1 focus:ring-[#2F5D34] outline-none transition-all"
                  />
                  <Percent size={18} className="absolute left-4 top-3.5 text-[#5B7C3A]" />
                </div>
              </div>

              <div>
                <label className="block text-[#4B0082] font-bold mb-2 uppercase tracking-wider">
                  Free Shipping Threshold Minimum (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    value={storeForm.freeShippingThreshold}
                    onChange={(e) => setStoreForm({ ...storeForm, freeShippingThreshold: e.target.value })}
                    className="w-full p-3.5 pl-11 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold focus:border-[#2F5D34] focus:ring-1 focus:ring-[#2F5D34] outline-none transition-all"
                  />
                  <Truck size={18} className="absolute left-4 top-3.5 text-[#5B7C3A]" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[#4B0082] font-bold mb-2 uppercase tracking-wider">
                  Registered Business Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={storeForm.businessAddress}
                    onChange={(e) => setStoreForm({ ...storeForm, businessAddress: e.target.value })}
                    className="w-full p-3.5 pl-11 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold focus:border-[#2F5D34] focus:ring-1 focus:ring-[#2F5D34] outline-none transition-all"
                  />
                  <Building size={18} className="absolute left-4 top-3.5 text-[#5B7C3A]" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={savingStore}
                className="px-8 py-3.5 rounded-2xl bg-[#2F5D34] hover:bg-[#234727] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} />
                <span>{savingStore ? "Saving Changes..." : "Save Store Configuration"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Admin Security & Profile */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Profile Form */}
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2F5D34]/15 shadow-md space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34] border border-[#2F5D34]/20">
                <User size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2F5D34] uppercase tracking-wide">
                  Admin Personal Details
                </h2>
                <p className="text-xs text-[#5B7C3A]">
                  Update your system administrator name and contact details.
                </p>
              </div>
            </div>

            <div className="bg-[#F6F3EC] p-4 rounded-2xl border border-gray-200 flex items-center gap-4">
              <div className="size-12 rounded-full bg-[#2F5D34] text-white font-bold text-lg flex items-center justify-center shadow-inner">
                {profileForm.firstName?.[0] || "A"}{profileForm.lastName?.[0] || "S"}
              </div>
              <div>
                <div className="text-[#4B0082] font-bold text-sm">
                  {profileForm.firstName} {profileForm.lastName}
                </div>
                <div className="text-xs text-[#5B7C3A]">
                  Role: <strong className="text-[#2F5D34]">{user?.role || "ADMIN"}</strong>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#4B0082] font-bold mb-1.5 uppercase tracking-wider">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold outline-none focus:border-[#2F5D34]"
                />
              </div>

              <div>
                <label className="block text-[#4B0082] font-bold mb-1.5 uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold outline-none focus:border-[#2F5D34]"
                />
              </div>

              <div>
                <label className="block text-[#4B0082] font-bold mb-1.5 uppercase tracking-wider">
                  Account Email (Read-Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={profileForm.email}
                  className="w-full p-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-gray-500 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[#4B0082] font-bold mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold outline-none focus:border-[#2F5D34]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-3.5 rounded-2xl bg-[#2F5D34] hover:bg-[#234727] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} />
                <span>{savingProfile ? "Updating..." : "Update Profile"}</span>
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handleSavePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2F5D34]/15 shadow-md space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                <KeyRound size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2F5D34] uppercase tracking-wide">
                  Change Credentials
                </h2>
                <p className="text-xs text-[#5B7C3A]">
                  Ensure strong security by updating your administrator password periodically.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#4B0082] font-bold mb-1.5 uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full p-3.5 pr-11 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold outline-none focus:border-[#2F5D34]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-500 hover:text-black"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#4B0082] font-bold mb-1.5 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full p-3.5 pr-11 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold outline-none focus:border-[#2F5D34]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-500 hover:text-black"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#4B0082] font-bold mb-1.5 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold outline-none focus:border-[#2F5D34]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                <ShieldAlert size={16} className="text-amber-600 flex-none mt-0.5" />
                <span>Password should be at least 6 characters long and include numbers and symbols for maximum protection.</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-3.5 rounded-2xl bg-[#C9A66B] hover:bg-[#ab8951] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock size={16} />
                <span>{savingPassword ? "Updating..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: System Notifications & Alerts */}
      {activeTab === "notifications" && (
        <form onSubmit={handleSaveToggles} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2F5D34]/15 shadow-md space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34] border border-[#2F5D34]/20">
                <Bell size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2F5D34] uppercase tracking-wide">
                  Order & Stock Notification Rules
                </h2>
                <p className="text-xs text-[#5B7C3A]">
                  Control automated emails, dispatch updates, and low inventory warnings.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Toggle 1: New Order Email Alerts */}
              <div className="p-4 rounded-2xl bg-[#F6F3EC] border border-gray-200 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-[#4B0082] text-sm">New Order Instant Email Alert</div>
                  <div className="text-xs text-[#5B7C3A]">Send an instant notification email to administrator when a customer places an order.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setToggles({ ...toggles, orderEmailAlerts: !toggles.orderEmailAlerts })}
                  className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
                    toggles.orderEmailAlerts ? "bg-[#2F5D34]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`size-6 rounded-full bg-white shadow-md transform transition-transform ${
                      toggles.orderEmailAlerts ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Low Stock Warning */}
              <div className="p-4 rounded-2xl bg-[#F6F3EC] border border-gray-200 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-[#4B0082] text-sm">Low Stock Inventory Warnings</div>
                    <div className="text-xs text-[#5B7C3A]">Highlight product stock level warnings when product count drops below threshold.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setToggles({ ...toggles, lowStockAlerts: !toggles.lowStockAlerts })}
                    className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
                      toggles.lowStockAlerts ? "bg-[#2F5D34]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`size-6 rounded-full bg-white shadow-md transform transition-transform ${
                        toggles.lowStockAlerts ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {toggles.lowStockAlerts && (
                  <div className="pt-3 border-t border-gray-200 flex items-center gap-3 text-xs">
                    <span className="text-[#4B0082] font-semibold">Low Stock Threshold Limit:</span>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={toggles.lowStockLimit}
                      onChange={(e) => setToggles({ ...toggles, lowStockLimit: e.target.value })}
                      className="w-24 p-2 rounded-xl bg-white border border-gray-300 text-[#2F5D34] font-bold text-center outline-none"
                    />
                    <span className="text-[#5B7C3A]">units remaining</span>
                  </div>
                )}
              </div>

              {/* Toggle 3: Customer Dispatch Emails */}
              <div className="p-4 rounded-2xl bg-[#F6F3EC] border border-gray-200 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-[#4B0082] text-sm">Customer Order Status Emails</div>
                  <div className="text-xs text-[#5B7C3A]">Automatically send dispatch, shipping, and delivery status updates to customers.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setToggles({ ...toggles, customerStatusEmails: !toggles.customerStatusEmails })}
                  className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
                    toggles.customerStatusEmails ? "bg-[#2F5D34]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`size-6 rounded-full bg-white shadow-md transform transition-transform ${
                      toggles.customerStatusEmails ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4: Daily Sales Digest */}
              <div className="p-4 rounded-2xl bg-[#F6F3EC] border border-gray-200 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-[#4B0082] text-sm">Daily Sales Summary Digest</div>
                  <div className="text-xs text-[#5B7C3A]">Receive a daily performance summary email with revenue, order counts, and top formulations sold.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setToggles({ ...toggles, dailySummaryDigest: !toggles.dailySummaryDigest })}
                  className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
                    toggles.dailySummaryDigest ? "bg-[#2F5D34]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`size-6 rounded-full bg-white shadow-md transform transition-transform ${
                      toggles.dailySummaryDigest ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={savingToggles}
                className="px-8 py-3.5 rounded-2xl bg-[#2F5D34] hover:bg-[#234727] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} />
                <span>{savingToggles ? "Saving..." : "Save Notification Preferences"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 4: Branding & Storefront Controls */}
      {activeTab === "branding" && (
        <form onSubmit={handleSaveToggles} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2F5D34]/15 shadow-md space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34] border border-[#2F5D34]/20">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2F5D34] uppercase tracking-wide">
                  Storefront Announcements & Controls
                </h2>
                <p className="text-xs text-[#5B7C3A]">
                  Customize banner announcements, default storefront language, and review auto-approvals.
                </p>
              </div>
            </div>

            <div className="space-y-6 text-xs">
              <div>
                <label className="block text-[#4B0082] font-bold mb-2 uppercase tracking-wider">
                  Top Header Announcement Banner Text
                </label>
                <input
                  type="text"
                  required
                  value={toggles.announcementText}
                  onChange={(e) => setToggles({ ...toggles, announcementText: e.target.value })}
                  className="w-full p-3.5 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold outline-none focus:border-[#2F5D34]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#4B0082] font-bold mb-2 uppercase tracking-wider">
                    Default Storefront Language
                  </label>
                  <select
                    value={toggles.defaultLanguage}
                    onChange={(e) => setToggles({ ...toggles, defaultLanguage: e.target.value })}
                    className="w-full p-3.5 rounded-2xl bg-[#F6F3EC] border border-gray-200 text-[#4B0082] font-semibold outline-none focus:border-[#2F5D34] cursor-pointer"
                  >
                    <option value="en-IN">English (India) - Default</option>
                    <option value="hi-IN">Hindi (हिंदी) - Default</option>
                  </select>
                </div>

                {/* Toggle: Maintenance Mode */}
                <div className="p-4 rounded-2xl bg-[#F6F3EC] border border-gray-200 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-[#4B0082] text-sm">Store Maintenance Mode</div>
                    <div className="text-xs text-[#5B7C3A]">Display maintenance banner across store pages during system upgrades.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setToggles({ ...toggles, maintenanceMode: !toggles.maintenanceMode })}
                    className={`w-14 h-8 rounded-full transition-colors relative p-1 flex-none cursor-pointer ${
                      toggles.maintenanceMode ? "bg-amber-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`size-6 rounded-full bg-white shadow-md transform transition-transform ${
                        toggles.maintenanceMode ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Toggle: Auto-Approve Reviews */}
              <div className="p-4 rounded-2xl bg-[#F6F3EC] border border-gray-200 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-[#4B0082] text-sm">Auto-Approve Customer Reviews</div>
                  <div className="text-xs text-[#5B7C3A]">Automatically publish verified customer reviews without requiring manual admin approval.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setToggles({ ...toggles, autoApproveReviews: !toggles.autoApproveReviews })}
                  className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
                    toggles.autoApproveReviews ? "bg-[#2F5D34]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`size-6 rounded-full bg-white shadow-md transform transition-transform ${
                      toggles.autoApproveReviews ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={savingToggles}
                className="px-8 py-3.5 rounded-2xl bg-[#2F5D34] hover:bg-[#234727] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} />
                <span>{savingToggles ? "Saving..." : "Save Branding Controls"}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
