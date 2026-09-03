"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  PackageCheck,
  MessageSquare,
  Tag,
  Boxes,
  Truck,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import ReviewsManagerSection from "@/components/admin/ReviewsManagerSection";
import { useOrderStore } from "@/store/useOrderStore";
import { PRODUCTS } from "@/constants/products";

const INITIAL_COUPONS = [
  { code: "KLN10", discount: "10% OFF", type: "Percentage", active: true },
  { code: "KLN20", discount: "20% OFF", type: "Percentage", active: true },
  { code: "WELCOME15", discount: "15% OFF", type: "Percentage", active: true },
  { code: "AYUR50", discount: "₹50 OFF", type: "Flat", active: true },
  { code: "FREESHIP", discount: "Free Shipping", type: "Shipping", active: true },
];

export default function AdminPortalSection({ user }) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState("orders");
  const { orders, updateOrderStatus, processReturnRequest } = useOrderStore();
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("10% OFF");
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);

  // Status Filter for Admin Orders
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "ALL") return true;
    const s = (o.status || o.deliveryStatus || "").toUpperCase();
    return s === statusFilter;
  });

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const clean = newCouponCode.trim().toUpperCase();
    if (coupons.some((c) => c.code === clean)) {
      toast.error(`Coupon ${clean} already exists!`);
      return;
    }
    setCoupons((prev) => [
      { code: clean, discount: newCouponDiscount, type: "Percentage", active: true },
      ...prev,
    ]);
    setNewCouponCode("");
    toast.success(`Created promo code: ${clean}! 🎉`);
  };

  const handleToggleCoupon = (code) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
    toast.success(`Updated status for ${code}`);
  };

  const handleDeleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    toast.success(`Deleted coupon ${code}`);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Admin Portal Header Banner */}
      <div className="bg-gradient-to-r from-[#2F5D34] via-[#1F3D23] to-[#2F5D34] rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-amber-400 text-gray-900 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-900" />
              Verified Admin Portal
            </span>
            <span className="text-xs text-emerald-200">Single Unified Portal Mode</span>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Admin Control Center</h2>
          <p className="text-xs text-emerald-100/90 font-paragraph mt-1">
            Logged in as: <strong>{user?.email || "Admin User"}</strong> (Role: {user?.role || "ADMIN"})
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveAdminSubTab("orders")}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeAdminSubTab === "orders"
                ? "bg-amber-400 text-gray-900 shadow"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            📦 System Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveAdminSubTab("reviews")}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeAdminSubTab === "reviews"
                ? "bg-amber-400 text-gray-900 shadow"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            ⭐ Reviews
          </button>
          <button
            onClick={() => setActiveAdminSubTab("coupons")}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeAdminSubTab === "coupons"
                ? "bg-amber-400 text-gray-900 shadow"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            🎟️ Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveAdminSubTab("products")}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeAdminSubTab === "products"
                ? "bg-amber-400 text-gray-900 shadow"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            🌿 Inventory ({PRODUCTS.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Admin All System Orders */}
      {activeAdminSubTab === "orders" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-[#222123]">All Customer Orders Manager</h3>
              <p className="text-xs text-gray-500">Update shipping status, manage returns, and track sales.</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["ALL", "PROCESSING", "SHIPPED", "DELIVERED", "RETURN_REQUESTED", "CANCELLED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                    statusFilter === st
                      ? "bg-[#2F5D34] text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <PackageCheck className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-600">No orders matching status &quot;{statusFilter}&quot;</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const currentStatus = (order.status || order.deliveryStatus || "PROCESSING").toUpperCase();

                return (
                  <div
                    key={order.orderId || order.id || order.orderNumber}
                    className="p-5 rounded-2xl border border-gray-200 bg-white shadow-xs space-y-3"
                  >
                    {/* Top Order Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-xs font-bold text-[#2F5D34]">
                          Order #{order.orderNumber || order.id || order.orderId}
                        </span>
                        <span className="text-xs text-gray-500 font-paragraph ml-3">
                          Date: {order.orderDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-800">
                          Total: ₹{order.totals?.grandTotal || order.totalAmount}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800">
                          {order.paymentStatus || "PAID"} ({order.paymentMethod || "ONLINE"})
                        </span>
                      </div>
                    </div>

                    {/* Order Details & Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-paragraph bg-gray-50 p-3 rounded-xl">
                      <div>
                        <strong className="text-gray-700 block">Shipping Address:</strong>
                        <p className="text-gray-600">
                          {order.shippingAddress?.fullName || user?.fullName || "Customer"} • {order.shippingAddress?.phone || user?.phone || ""}
                        </p>
                        <p className="text-gray-500">
                          {order.shippingAddress?.street || ""}, {order.shippingAddress?.city || ""}, {order.shippingAddress?.state || ""} {order.shippingAddress?.pincode || ""}
                        </p>
                      </div>

                      <div>
                        <strong className="text-gray-700 block">Items Ordered:</strong>
                        <p className="text-gray-600">
                          {(order.items || []).map((i) => `${i.name || i.product?.name || "Product"} (x${i.quantity})`).join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Reasons callout if present */}
                    {order.cancelReason && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                        <strong>Customer Cancel Reason:</strong> {order.cancelReason}
                      </div>
                    )}

                    {order.returnReason && (
                      <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800 flex items-center justify-between">
                        <div>
                          <strong>Customer Return Reason:</strong> {order.returnReason}
                          {order.returnNotes && <span> ({order.returnNotes})</span>}
                        </div>
                        {currentStatus === "RETURN_REQUESTED" && (
                          <div className="flex items-center gap-2 flex-none ml-2">
                            <button
                              onClick={() => processReturnRequest(order.orderId || order.id || order.orderNumber, true)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] uppercase hover:bg-emerald-700 shadow-xs"
                            >
                              ✓ Approve Return
                            </button>
                            <button
                              onClick={() => processReturnRequest(order.orderId || order.id || order.orderNumber, false)}
                              className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] uppercase hover:bg-rose-700 shadow-xs"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Admin Status Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-700">Change Status:</span>
                        <select
                          value={currentStatus}
                          onChange={(e) => updateOrderStatus(order.orderId || order.id || order.orderNumber, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold bg-white outline-none focus:border-[#2F5D34]"
                        >
                          <option value="PROCESSING">⏳ PROCESSING</option>
                          <option value="SHIPPED">🚚 SHIPPED</option>
                          <option value="DELIVERED">✅ DELIVERED</option>
                          <option value="RETURN_REQUESTED">↩️ RETURN REQUESTED</option>
                          <option value="RETURNED">📦 RETURNED</option>
                          <option value="CANCELLED">❌ CANCELLED</option>
                        </select>
                      </div>

                      <span className="text-[11px] text-gray-500 font-semibold">
                        Instant Admin Status Sync Enabled ⚡
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: Admin Reviews Manager */}
      {activeAdminSubTab === "reviews" && (
        <ReviewsManagerSection
          externalModalOpen={isAddReviewModalOpen}
          onRequestCloseModal={() => setIsAddReviewModalOpen(false)}
        />
      )}

      {/* SUB-TAB 3: Admin Coupons & Offers Manager */}
      {activeAdminSubTab === "coupons" && (
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-[#222123]">Coupons & Promotional Offers Manager</h3>
            <p className="text-xs text-gray-500">Create, enable, or revoke store promo codes for customer checkouts.</p>
          </div>

          {/* Create New Coupon Form */}
          <form onSubmit={handleAddCoupon} className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1">
                New Promo Code
              </label>
              <input
                type="text"
                required
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                placeholder="e.g. KLN30, SUMMER25"
                className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-bold outline-none focus:border-[#2F5D34] uppercase"
              />
            </div>

            <div className="w-36">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1">
                Discount Benefit
              </label>
              <input
                type="text"
                required
                value={newCouponDiscount}
                onChange={(e) => setNewCouponDiscount(e.target.value)}
                placeholder="e.g. 25% OFF"
                className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-bold outline-none focus:border-[#2F5D34]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow hover:bg-[#224426] transition-all cursor-pointer"
            >
              + Create Coupon
            </button>
          </form>

          {/* Active Coupons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  coupon.active ? "bg-white border-emerald-200 shadow-xs" : "bg-gray-100 border-gray-300 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#2F5D34] uppercase tracking-wider">
                      {coupon.code}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${coupon.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"}`}>
                      {coupon.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">{coupon.discount}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleCoupon(coupon.code)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-[10px] font-bold uppercase"
                  >
                    {coupon.active ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.code)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Admin Product Inventory Overview */}
      {activeAdminSubTab === "products" && (
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-[#222123]">Product Stock & Inventory Overview</h3>
            <p className="text-xs text-gray-500">Live store catalog items available on the customer website.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PRODUCTS.map((prod) => (
              <div key={prod.id} className="p-4 rounded-2xl border border-gray-200 bg-white shadow-xs flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 border relative overflow-hidden flex-none">
                  <Image src={prod.images?.[0] || "/images/products/hairoil/oilf.jpeg"} alt={prod.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#222123] line-clamp-1">{prod.name}</h4>
                  <p className="text-[11px] text-[#2F5D34] font-bold">₹{prod.price} • {prod.size}</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase mt-1 inline-block">
                    In Stock (Active)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
