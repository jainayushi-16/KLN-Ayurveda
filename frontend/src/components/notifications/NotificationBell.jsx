"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, Inbox, Loader2, Trash2 } from "lucide-react";
import { notificationApi } from "@/services/notification.api";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getLocalNotifications,
  markLocalNotificationAsRead,
  markAllLocalNotificationsAsRead,
  deleteLocalNotification,
  clearAllLocalNotifications,
} from "@/utils/notificationHelper";
import toast from "react-hot-toast";

export default function NotificationBell() {
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    let apiCount = 0;
    if (isAuthenticated) {
      try {
        const res = await notificationApi.getUnreadCount();
        if (res) {
          if (typeof res.unreadCount === "number") apiCount = res.unreadCount;
          else if (res.data && typeof res.data.unreadCount === "number") apiCount = res.data.unreadCount;
          else if (typeof res.data === "number") apiCount = res.data;
        }
      } catch (err) {
        // Silent
      }
    }
    const localNotifs = getLocalNotifications();
    const localUnread = localNotifs.filter((n) => !n.readAt).length;
    setUnreadCount(apiCount + localUnread);
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    let apiNotifs = [];
    if (isAuthenticated) {
      try {
        const res = await notificationApi.getNotifications();
        if (Array.isArray(res)) apiNotifs = res;
        else if (res && Array.isArray(res.data)) apiNotifs = res.data;
      } catch (err) {
        // Silent
      }
    }
    const localNotifs = getLocalNotifications();

    const combined = [...localNotifs, ...apiNotifs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setNotifications(combined);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);

    const handleRealtimeUpdate = () => {
      fetchUnreadCount();
      if (isOpen) {
        fetchNotifications();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("kln_notification_created", handleRealtimeUpdate);
      window.addEventListener("kln_notification_updated", handleRealtimeUpdate);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("kln_notification_created", handleRealtimeUpdate);
        window.removeEventListener("kln_notification_updated", handleRealtimeUpdate);
      }
    };
  }, [isAuthenticated, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    if (String(id).startsWith("local-")) {
      markLocalNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return;
    }

    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    markAllLocalNotificationsAsRead();
    if (isAuthenticated) {
      try {
        await notificationApi.markAllAsRead();
      } catch (err) {}
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
    setUnreadCount(0);
    toast.success("All notifications marked as read.");
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    if (String(id).startsWith("local-")) {
      deleteLocalNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchUnreadCount();
      toast.success("Notification deleted");
      return;
    }

    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchUnreadCount();
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification.");
    }
  };

  const handleClearAll = async () => {
    clearAllLocalNotifications();
    if (isAuthenticated) {
      try {
        await notificationApi.clearAllNotifications();
      } catch (err) {}
    }
    setNotifications([]);
    setUnreadCount(0);
    toast.success("Notifications cleared");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="p-3 rounded-full bg-white/90 border border-[#2F5D34]/20 text-[#2F5D34] text-lg sm:text-xl shadow-md hover:bg-[#2F5D34] hover:text-white hover:scale-105 active:scale-95 transition-all relative cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center border border-white shadow">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="fixed inset-x-3 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 w-auto sm:w-96 max-h-[80vh] sm:max-h-[520px] bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-[#2F5D34]/20 z-[100] animate-fadeIn flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#E7F0E4] text-[#2F5D34]">
                <Bell className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-[#222123]">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[11px] font-bold text-[#2F5D34] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#2F5D34] mb-2" />
                <span className="text-xs">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-gray-400 text-center">
                <Inbox className="w-8 h-8 mb-2 opacity-50 text-[#2F5D34]" />
                <p className="text-xs font-semibold text-gray-600">No notifications yet</p>
                <p className="text-[11px] text-gray-400 font-paragraph mt-0.5">
                  Updates on your orders and account will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !item.readAt;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all flex items-start gap-3 group ${
                      isUnread
                        ? "bg-[#E7F0E4]/40 border-[#2F5D34]/20"
                        : "bg-gray-50/70 border-gray-100 opacity-80"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#222123]">{item.title}</h4>
                        <span className="text-[10px] text-gray-400 flex-none">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-paragraph mt-1 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-none mt-1">
                      {isUnread && (
                        <button
                          onClick={(e) => handleMarkAsRead(item.id, e)}
                          title="Mark as read"
                          className="p-1.5 rounded-full hover:bg-emerald-100 text-[#2F5D34] transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteNotification(item.id, e)}
                        title="Delete notification"
                        className="p-1.5 rounded-full hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
