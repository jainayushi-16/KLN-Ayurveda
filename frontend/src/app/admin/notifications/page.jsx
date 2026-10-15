"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import axiosClient from "@/services/axiosClient";
import StatCard from "@/components/admin/common/StatCard";
import Badge from "@/components/admin/common/Badge";
import {
  Bell,
  ShoppingBag,
  Package,
  Warehouse,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Trash2,
  CheckCheck,
  Search,
  Filter,
  Send,
  PlusCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  Megaphone,
  X,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  sendBrowserNotification,
  requestBrowserNotificationPermission,
  getBrowserNotificationPermission,
} from "@/utils/browserNotification";
import toast from "react-hot-toast";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, ORDER, INVENTORY, RETURN, ANNOUNCEMENT
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, UNREAD, READ
  const [search, setSearch] = useState("");
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Broadcast Form State
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    targetRole: "ALL", // ALL, CUSTOMER, ADMIN
    type: "ANNOUNCEMENT",
  });
  const [isSubmittingBroadcast, setIsSubmittingBroadcast] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/notifications");
      if (res && res.data) {
        setNotifications(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      toast.error("Failed to load admin notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Type Filter
      if (activeTab !== "ALL") {
        const itemType = (item.type || "").toUpperCase();
        if (activeTab === "ORDER" && !itemType.includes("ORDER")) return false;
        if (activeTab === "INVENTORY" && !itemType.includes("INVENTORY") && !itemType.includes("STOCK")) return false;
        if (activeTab === "RETURN" && !itemType.includes("RETURN")) return false;
        if (activeTab === "ANNOUNCEMENT" && !itemType.includes("ANNOUNCE") && !itemType.includes("SYSTEM")) return false;
      }

      // Status Filter
      if (statusFilter === "UNREAD" && item.readAt) return false;
      if (statusFilter === "READ" && !item.readAt) return false;

      // Search Query
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const text = `${item.title || ""} ${item.message || ""} ${JSON.stringify(item.metadata || {})}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [notifications, activeTab, statusFilter, search]);

  // Metrics
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.readAt).length;
    const orders = notifications.filter((n) => (n.type || "").toUpperCase().includes("ORDER")).length;
    const inventory = notifications.filter((n) => (n.type || "").toUpperCase().includes("INVENTORY") || (n.type || "").toUpperCase().includes("STOCK")).length;
    return { total, unread, orders, inventory };
  }, [notifications]);

  // Actions
  const handleMarkAsRead = async (id) => {
    try {
      if (String(id).startsWith("order-alert-") || String(id).startsWith("inventory-low-")) {
        // Synthetic item update locally
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
        );
        return;
      }
      await axiosClient.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axiosClient.patch("/notifications/read-all");
    } catch (err) {}
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
    );
    toast.success("All notifications marked as read");
  };

  const handleDeleteNotification = async (id) => {
    try {
      if (String(id).startsWith("order-alert-") || String(id).startsWith("inventory-low-")) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.success("Notification dismissed");
        return;
      }
      await axiosClient.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification removed");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      await axiosClient.delete("/notifications/clear-all");
    } catch (err) {}
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) {
      toast.error("Please fill in both title and message");
      return;
    }

    setIsSubmittingBroadcast(true);
    try {
      const res = await axiosClient.post("/admin/notifications/broadcast", broadcastForm);
      toast.success(res?.message || "Notification broadcasted successfully!");
      setIsBroadcastModalOpen(false);
      setBroadcastForm({
        title: "",
        message: "",
        targetRole: "ALL",
        type: "ANNOUNCEMENT",
      });
      fetchNotifications();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to broadcast notification");
    } finally {
      setIsSubmittingBroadcast(false);
    }
  };

  // Helper formatting for timestamps
  const formatTime = (dateStr) => {
    if (!dateStr) return "Recently";
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Recently";
    }
  };

  // Icon selector per notification type
  const getTypeBadge = (type) => {
    const t = (type || "").toUpperCase();
    if (t.includes("ORDER")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
          <ShoppingBag size={11} />
          <span>Order</span>
        </span>
      );
    }
    if (t.includes("INVENTORY") || t.includes("STOCK")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
          <Warehouse size={11} />
          <span>Inventory</span>
        </span>
      );
    }
    if (t.includes("RETURN")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
          <RotateCcw size={11} />
          <span>Return</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
        <Megaphone size={11} />
        <span>Notice</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="stats-grid">
        <StatCard
          label="Total Notifications"
          value={stats.total}
          icon={Bell}
          color="#2F5D34"
        />
        <StatCard
          label="Unread Alerts"
          value={stats.unread}
          icon={AlertTriangle}
          color="#D4AF37"
        />
        <StatCard
          label="Order Notifications"
          value={stats.orders}
          icon={ShoppingBag}
          color="#3D1A4F"
        />
        <StatCard
          label="Inventory Alerts"
          value={stats.inventory}
          icon={Warehouse}
          color="#2563EB"
        />
      </div>

      {/* Main Notifications Hub Container */}
      <div className="card-table-wrapper">
        {/* Table Toolbar Header */}
        <div className="table-toolbar">
          <div>
            <h3 className="text-base font-bold text-[#f5f8f6] flex items-center gap-2">
              <span>Notifications & Store Alerts</span>
              {stats.unread > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  {stats.unread} New
                </span>
              )}
            </h3>
            <p className="text-xs text-[#6b8277]">
              Real-time feed of customer orders, inventory levels, and system dispatches
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="btn-primary flex items-center gap-1.5 text-xs"
            >
              <Send size={14} />
              <span>Broadcast Notice</span>
            </button>

            {stats.unread > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="btn-secondary flex items-center gap-1.5 text-xs text-emerald-400"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                <span>Mark All Read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="btn-secondary flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
                title="Clear all notifications"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={fetchNotifications}
              className="btn-icon"
              title="Refresh notifications"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-[#2F5D34]/15 bg-white/40 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: "ALL", label: "All Alerts", count: stats.total },
              { id: "ORDER", label: "Orders", count: stats.orders },
              { id: "INVENTORY", label: "Inventory", count: stats.inventory },
              { id: "ANNOUNCEMENT", label: "Broadcasts" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-[#2F5D34] text-white shadow-md scale-102"
                    : "bg-white/80 hover:bg-white text-gray-700 border border-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search & Read Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="table-search flex-1 md:w-64">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search alerts by order #, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              style={{ width: "135px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="UNREAD">Unread Only</option>
              <option value="READ">Read Only</option>
            </select>
          </div>
        </div>

        {/* Notifications Feed List */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="py-16 text-center text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#2F5D34] mb-3" />
              <p className="text-sm font-bold text-[#1B351E]">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <div className="w-16 h-16 rounded-3xl bg-[#E7F0E4] text-[#2F5D34] flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Bell size={28} />
              </div>
              <h4 className="text-base font-bold text-[#1B351E]">No Notifications Found</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {search || activeTab !== "ALL" || statusFilter !== "ALL"
                  ? "No alerts match your current filter settings."
                  : "You're all caught up! New orders, stock updates, and customer notices will appear here in real-time."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isUnread = !notif.readAt;
              const meta = notif.metadata || {};
              const orderId = meta.orderId || meta.orderNumber;
              const isOrder = (notif.type || "").toUpperCase().includes("ORDER") || orderId;

              return (
                <div
                  key={notif.id}
                  className={`p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                    isUnread
                      ? "bg-gradient-to-r from-emerald-50/70 via-white to-white hover:bg-emerald-50/90 border-l-4 border-[#2F5D34]"
                      : "bg-white hover:bg-gray-50/80"
                  }`}
                >
                  {/* Left Section: Icon & Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="flex-none pt-1">
                      {isUnread ? (
                        <div className="relative">
                          <div className="p-2.5 rounded-2xl bg-[#2F5D34] text-white shadow-md">
                            <Bell size={18} className="animate-pulse" />
                          </div>
                          <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-[#C9A66B] ring-2 ring-white animate-ping" />
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-2xl bg-gray-100 text-gray-500">
                          <CheckCircle2 size={18} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {getTypeBadge(notif.type)}

                        <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                          <Clock size={11} />
                          <span>{formatTime(notif.createdAt)}</span>
                        </span>

                        {isUnread && (
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                            New
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm tracking-tight line-clamp-1 ${
                          isUnread ? "font-extrabold text-[#1B351E]" : "font-bold text-gray-800"
                        }`}
                      >
                        {notif.title}
                      </h4>

                      <p className="text-xs text-gray-600 font-paragraph mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      {/* Metadata Chips if available */}
                      {meta && (meta.totalAmount || meta.status || meta.productId) && (
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {meta.totalAmount && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black">
                              Amount: ₹{Number(meta.totalAmount).toLocaleString("en-IN")}
                            </span>
                          )}
                          {meta.status && (
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-bold">
                              Status: {meta.status}
                            </span>
                          )}
                          {meta.orderNumber && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-bold">
                              Order #{meta.orderNumber}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Section: Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-none">
                    {isOrder && (
                      <Link
                        href="/admin/orders"
                        className="px-3.5 py-1.5 rounded-xl bg-[#2F5D34] hover:bg-[#224426] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>View Order</span>
                        <ExternalLink size={12} />
                      </Link>
                    )}

                    {(notif.type || "").toUpperCase().includes("INVENTORY") && (
                      <Link
                        href="/admin/inventory"
                        className="px-3.5 py-1.5 rounded-xl bg-[#C9A66B] hover:bg-[#B89355] text-[#1B351E] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Check Stock</span>
                        <ExternalLink size={12} />
                      </Link>
                    )}

                    {isUnread && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer"
                        title="Mark as read"
                      >
                        <CheckCheck size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-rose-100 text-gray-500 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fadeIn" style={{ maxWidth: "540px" }}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#C9A66B]/20 text-[#C9A66B]">
                  <Megaphone size={18} />
                </span>
                <h3 className="modal-title">Broadcast Store Notification</h3>
              </div>
              <button
                className="modal-close"
                onClick={() => setIsBroadcastModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit}>
              <div className="modal-body space-y-4">
                <p className="text-xs text-gray-500">
                  Send an official announcement or alert to customers and administrators across the platform.
                </p>

                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <select
                    className="form-control"
                    value={broadcastForm.targetRole}
                    onChange={(e) =>
                      setBroadcastForm((prev) => ({ ...prev, targetRole: e.target.value }))
                    }
                  >
                    <option value="ALL">🌐 All Registered Users (Customers & Admins)</option>
                    <option value="CUSTOMER">🛍️ Customers Only</option>
                    <option value="ADMIN">👑 Store Administrators Only</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Alert Category</label>
                  <select
                    className="form-control"
                    value={broadcastForm.type}
                    onChange={(e) =>
                      setBroadcastForm((prev) => ({ ...prev, type: e.target.value }))
                    }
                  >
                    <option value="ANNOUNCEMENT">📢 General Announcement</option>
                    <option value="PROMOTION">🎟️ Festive Promo & Coupon Notice</option>
                    <option value="SYSTEM">⚙️ System Maintenance / Advisory</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notice Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Festive Ayurvedic Mega Sale is Live!"
                    className="form-control"
                    value={broadcastForm.title}
                    onChange={(e) =>
                      setBroadcastForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your announcement details here..."
                    className="form-control"
                    value={broadcastForm.message}
                    onChange={(e) =>
                      setBroadcastForm((prev) => ({ ...prev, message: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsBroadcastModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBroadcast}
                  className="btn-primary flex items-center gap-1.5"
                >
                  <Send size={14} />
                  <span>{isSubmittingBroadcast ? "Broadcasting..." : "Dispatch Notification"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
