"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Tag, PackageCheck, Newspaper, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationsSection({ initialSettings, onSaveSettings }) {
  const [settings, setSettings] = useState(
    initialSettings || {
      emailNotifications: true,
      smsNotifications: true,
      promotionalOffers: true,
      orderUpdates: true,
      newsletter: false,
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    onSaveSettings(settings);
    setIsSubmitting(false);
    toast.success("Notification preferences saved!", {
      icon: "🔔",
      style: {
        borderRadius: "16px",
        background: "#2F5D34",
        color: "#fff",
      },
    });
  };

  const NOTIF_OPTIONS = [
    {
      key: "emailNotifications",
      title: "Email Notifications",
      desc: "Receive order receipts, shipping updates, and account alerts via email.",
      icon: Mail,
    },
    {
      key: "smsNotifications",
      title: "SMS & WhatsApp Alerts",
      desc: "Instant text updates for out-for-delivery orders and OTP verification.",
      icon: MessageSquare,
    },
    {
      key: "orderUpdates",
      title: "Order Status Tracking Updates",
      desc: "Real-time notifications when your herbal package changes shipping status.",
      icon: PackageCheck,
    },
    {
      key: "promotionalOffers",
      title: "Exclusive Promotional Offers",
      desc: "Early access discounts, seasonal Ayurvedic sales, and gift coupons.",
      icon: Tag,
    },
    {
      key: "newsletter",
      title: "Ayurvedic Health & Wellness Newsletter",
      desc: "Weekly tips on hair wellness, dosha balance, and holistic skin nutrition.",
      icon: Newspaper,
    },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            Notification Preferences
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            Choose how and when KLN Ayurveda communicates with you.
          </p>
        </div>
        <span className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34]">
          <Bell className="w-5 h-5" />
        </span>
      </div>

      {/* Options List */}
      <div className="space-y-6">
        {NOTIF_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isChecked = settings[opt.key];

          return (
            <div
              key={opt.key}
              className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gray-50/80 border border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-start gap-4 pr-4">
                <span className="p-3 rounded-xl bg-white text-[#2F5D34] shadow-sm border border-gray-200 flex-none mt-0.5">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#222123]">{opt.title}</h4>
                  <p className="text-xs text-gray-500 font-paragraph mt-0.5 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleSetting(opt.key)}
                className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center flex-none cursor-pointer ${
                  isChecked ? "bg-[#2F5D34] justify-end" : "bg-gray-300 justify-start"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="px-8 py-3.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : "Save Preferences"}</span>
        </button>
      </div>
    </div>
  );
}
