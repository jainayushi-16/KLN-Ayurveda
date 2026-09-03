"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Save, ShieldCheck, User } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();

  const [form, setForm] = useState({
    firstName: user?.firstName || "Admin",
    lastName: user?.lastName || "User",
    email: user?.email || "admin@klnayurveda.com",
    phone: user?.phone || "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(form);
    toast.success("Admin settings & profile updated successfully");
  };

  return (
    <div>
      <div className="card-table-wrapper max-w-2xl">
        <div className="table-toolbar mb-4">
          <div>
            <h3 className="text-base font-bold text-[#f5f8f6]">Admin Settings & System Profile</h3>
            <p className="text-xs text-[#6b8277]">Configure your system administrator account parameters</p>
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
            <label className="block text-gray-300 mb-1 font-semibold">Admin Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
            />
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
