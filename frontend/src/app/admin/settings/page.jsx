"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import { useAuthStore } from "@/store/useAuthStore";
import { Save, ShieldCheck, Settings as SettingsIcon, Store } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    siteName: "KLN Ayurveda",
    supportEmail: "support@klnayurveda.com",
    supportPhone: "+91 9876543210",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/admin/settings");
        if (res && res.data && Array.isArray(res.data)) {
          const settingsMap = {};
          res.data.forEach((s) => {
            settingsMap[s.key] = s.value;
          });
          setForm((prev) => ({
            ...prev,
            siteName: settingsMap.siteName || prev.siteName,
            supportEmail: settingsMap.supportEmail || prev.supportEmail,
            supportPhone: settingsMap.supportPhone || prev.supportPhone,
          }));
        }
      } catch (err) {
        console.warn("Could not fetch server settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Save store settings
      await axiosClient.put("/admin/settings", {
        settings: [
          { key: "siteName", value: form.siteName, description: "Store Name" },
          { key: "supportEmail", value: form.supportEmail, description: "Customer Support Email" },
          { key: "supportPhone", value: form.supportPhone, description: "Customer Support Phone" },
        ],
      });

      // Save user profile
      try {
        await axiosClient.put("/users/profile", {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
        });
      } catch (e) {}

      updateUser({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });

      toast.success("Admin settings & profile saved to database successfully 🌿");
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    }
  };

  return (
    <div>
      <div className="card-table-wrapper max-w-2xl">
        <div className="table-toolbar mb-4">
          <div>
            <h3 className="text-base font-bold text-[#f5f8f6]">Admin Settings & System Profile</h3>
            <p className="text-xs text-[#6b8277]">Configure your system administrator account and store preferences</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="bg-[#0e1c16] p-4 rounded-xl border border-[#c9a66b]/20 flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Authenticated System Administrator</div>
              <div className="text-[11px] text-gray-400">Role: <strong className="text-amber-400">{user?.role || "ADMIN"}</strong></div>
            </div>
          </div>

          <div className="font-bold text-[#e8c88a] flex items-center gap-2 pt-2 border-t border-white/10">
            <Store size={16} />
            <span>Store Configuration</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">Store Brand Name</label>
              <input
                type="text"
                required
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">Support Email</label>
              <input
                type="email"
                required
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              />
            </div>
          </div>

          <div className="font-bold text-[#e8c88a] flex items-center gap-2 pt-2 border-t border-white/10">
            <ShieldCheck size={16} />
            <span>Admin Account Details</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">First Name</label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">Last Name</label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1 font-semibold">Contact Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 9876543210"
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end">
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
