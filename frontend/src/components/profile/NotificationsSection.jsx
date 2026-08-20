"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, PackageCheck, Tag, Newspaper, Save, Inbox, Check, CheckCheck, Loader2, Trash2 } from "lucide-react";
import { notificationApi } from "@/services/notification.api";
import {
  getLocalNotifications,
  markLocalNotificationAsRead,
  markAllLocalNotificationsAsRead,
  deleteLocalNotification,
  clearAllLocalNotifications,
} from "@/utils/notificationHelper";
import toast from "react-hot-toast";

export default function NotificationsSection({ initialSettings, onSaveSettings }) {
  const [activeSubTab, setActiveSubTab] = useState("inbox"); // 'inbox' | 'preferences'
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const [settings, setSettings] = useState(
    initialSettings || {
      emailNotifications: true,
      promotionalOffers: true,
      orderUpdates: true,
      newsletter: false,
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotifications = async () => {
    setIsLoadingNotifications(true);
    let apiNotifs = [];
    try {
      const res = await notificationApi.getNotifications();
      if (Array.isArray(res)) {
        apiNotifs = res;
      } else if (res && Array.isArray(res.data)) {
        apiNotifs = res.data;
      }
    } catch (err) {
      console.error("Failed to load in-app notifications from API:", err);
    }

    const localNotifs = getLocalNotifications();
    const combined = [...localNotifs, ...apiNotifs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setNotifications(combined);
    setUnreadCount(combined.filter((n) => !n.readAt).length);
    setIsLoadingNotifications(false);
  };

  useEffect(() => {
    fetchNotifications();

    const handleRealtimeUpdate = () => {
      fetchNotifications();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("kln_notification_created", handleRealtimeUpdate);
      window.addEventListener("kln_notification_updated", handleRealtimeUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("kln_notification_created", handleRealtimeUpdate);
        window.removeEventListener("kln_notification_updated", handleRealtimeUpdate);
      }
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    if (String(id).startsWith("local-")) {
      markLocalNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Notification marked as read");
      return;
    }

    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    markAllLocalNotificationsAsRead();
    try {
      await notificationApi.markAllAsRead();
    } catch (err) {}
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
    setUnreadCount(0);
    toast.success("All notifications marked as read.");
  };

  const handleDeleteNotification = async (id) => {
    if (String(id).startsWith("local-")) {
      deleteLocalNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => prev.filter((n) => n.id !== id && !n.readAt).length);
      toast.success("Notification deleted");
      return;
    }

    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification.");
    }
  };

  const handleClearAll = async () => {
    clearAllLocalNotifications();
    try {
      await notificationApi.clearAllNotifications();
    } catch (err) {}
    setNotifications([]);
    setUnreadCount(0);
    toast.success("Notifications cleared");
  };

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (onSaveSettings) onSaveSettings(settings);
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            In-App Notifications & Settings
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            View order activity alerts and manage how KLN Ayurveda communicates with you.
          </p>
        </div>

        {/* Sub Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-100/80 border border-gray-200">
          <button
            onClick={() => setActiveSubTab("inbox")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "inbox"
                ? "bg-[#2F5D34] text-white shadow-md"
                : "text-gray-600 hover:text-[#2F5D34]"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Activity Inbox</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-400 text-white text-[10px] font-extrabold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("preferences")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "preferences"
                ? "bg-[#2F5D34] text-white shadow-md"
                : "text-gray-600 hover:text-[#2F5D34]"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* Sub Tab 1: Activity Inbox */}
      {activeSubTab === "inbox" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Live Order & System Updates
            </span>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-bold text-[#2F5D34] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark all as read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear all</span>
                </button>
              )}
            </div>
          </div>

          {isLoadingNotifications ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#2F5D34] mb-3" />
              <span className="text-xs font-semibold">Loading in-app notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
              <Inbox className="w-10 h-10 mb-3 opacity-40 text-[#2F5D34]" />
              <p className="text-sm font-bold text-[#222123]">No Notifications Yet</p>
              <p className="text-xs text-gray-400 font-paragraph max-w-sm mt-1">
                Real-time updates regarding your placed orders, shipping mists, and account alerts will be stored here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((item) => {
                const isUnread = !item.readAt;

                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                      isUnread
                        ? "bg-[#E7F0E4]/60 border-[#2F5D34]/30 shadow-sm"
                        : "bg-gray-50/70 border-gray-200 opacity-85"
                    }`}
                  >
                    <span className={`p-3 rounded-xl flex-none mt-0.5 ${isUnread ? "bg-[#2F5D34] text-white" : "bg-gray-200 text-gray-600"}`}>
                      <Bell className="w-4 h-4" />
                    </span>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#222123]">{item.title}</h4>
                        <span className="text-xs text-gray-400 font-mono">
                          {new Date(item.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 font-paragraph mt-1 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-none mt-0.5">
                      {isUnread && (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          title="Mark as read"
                          className="p-2 rounded-xl bg-white border border-[#2F5D34]/20 hover:bg-[#2F5D34] hover:text-white text-[#2F5D34] transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(item.id)}
                        title="Delete notification"
                        className="p-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-500 hover:text-white text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub Tab 2: Notification Preferences */}
      {activeSubTab === "preferences" && (
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

          <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
            <button
              onClick={handleSavePreferences}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
