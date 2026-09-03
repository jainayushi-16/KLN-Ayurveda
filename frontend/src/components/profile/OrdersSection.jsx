"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PackageCheck,
  Truck,
  FileText,
  Repeat,
  CheckCircle,
  Clock,
  ArrowRight,
  X,
  XCircle,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useLanguage } from "@/i18n/LanguageContext";

const CANCEL_REASONS = [
  "Changed my mind / No longer needed",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Incorrect shipping address provided",
  "Delivery timeframe is too long",
  "Other Reason",
];

const RETURN_REASONS = [
  "Damaged or leaking packaging on arrival",
  "Wrong item / formulation delivered",
  "Quality or spoilage issue",
  "Product expired or near expiry date",
  "Allergic reaction or unexpected scalp irritation",
  "Other Reason",
];

export default function OrdersSection({ user, orders, onSelectTrackOrder }) {
  const { t } = useLanguage();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedTracking, setSelectedTracking] = useState(null);

  // Cancellation Modal State
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [selectedCancelReason, setSelectedCancelReason] = useState(CANCEL_REASONS[0]);
  const [cancelNotes, setCancelNotes] = useState("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  // Return Modal State
  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [selectedReturnReason, setSelectedReturnReason] = useState(RETURN_REASONS[0]);
  const [returnNotes, setReturnNotes] = useState("");
  const [selectedReturnItems, setSelectedReturnItems] = useState([]);
  const [agreedToReturnPolicy, setAgreedToReturnPolicy] = useState(false);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  const { addToCart } = useCartStore();
  const { cancelOrder, requestReturnOrder } = useOrderStore();

  const handleReorder = (order) => {
    (order.items || []).forEach((item) => {
      addToCart(item.id || item.productId, item.quantity || 1);
    });
    toast.success(`Reordered ${order.items?.length || 1} item(s) from #${order.orderNumber || order.id}! Added to Cart.`, {
      icon: "🛍️",
      style: {
        borderRadius: "16px",
        background: "#2F5D34",
        color: "#fff",
      },
    });
  };

  const handleOpenCancelModal = (order) => {
    setCancelModalOrder(order);
    setSelectedCancelReason(CANCEL_REASONS[0]);
    setCancelNotes("");
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    const orderIdToCancel = cancelModalOrder.orderId || cancelModalOrder.id || cancelModalOrder.orderNumber;
    const finalReason = selectedCancelReason === "Other Reason" ? (cancelNotes.trim() || "Other reason") : selectedCancelReason;

    setIsSubmittingCancel(true);
    try {
      await cancelOrder(orderIdToCancel, { reason: finalReason, notes: cancelNotes });
      setCancelModalOrder(null);
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const handleOpenReturnModal = (order) => {
    setReturnModalOrder(order);
    setSelectedReturnReason(RETURN_REASONS[0]);
    setReturnNotes("");
    setAgreedToReturnPolicy(false);
    setSelectedReturnItems((order.items || []).map((i) => i.id || i.productId));
  };

  const handleConfirmReturn = async () => {
    if (!returnModalOrder) return;
    if (!agreedToReturnPolicy) {
      toast.error("Please confirm agreement with the KLN Return Policy.");
      return;
    }
    const orderIdToReturn = returnModalOrder.orderId || returnModalOrder.id || returnModalOrder.orderNumber;
    const finalReason = selectedReturnReason === "Other Reason" ? (returnNotes.trim() || "Other reason") : selectedReturnReason;

    setIsSubmittingReturn(true);
    try {
      await requestReturnOrder(orderIdToReturn, {
        reason: finalReason,
        notes: returnNotes,
        itemIds: selectedReturnItems,
      });
      setReturnModalOrder(null);
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const isReturnEligible = (order) => {
    const s = (order.status || order.deliveryStatus || "").toUpperCase();
    if (s === "RETURN_REQUESTED" || s === "RETURNED") return false;
    if (s !== "DELIVERED") return false;

    // Check 7-day policy window
    if (order.orderDate || order.createdAt) {
      const dateVal = new Date(order.orderDate || order.createdAt);
      if (!isNaN(dateVal.getTime())) {
        const diffDays = Math.floor((Date.now() - dateVal.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 7) return false;
      }
    }
    return true;
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "DELIVERED") {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" /> {t("orders.delivered", {}, "Delivered")}
        </span>
      );
    }
    if (s === "RETURN_REQUESTED" || s === "RETURNED") {
      return (
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
          <RotateCcw className="w-3.5 h-3.5" /> {t("orders.returnRequested", {}, "Return Requested")}
        </span>
      );
    }
    if (s === "SHIPPED" || s === "IN TRANSIT") {
      return (
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" /> {t("orders.shipped", {}, "Shipped")}
        </span>
      );
    }
    if (s === "CANCELLED" || s === "CANCELED") {
      return (
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
          <XCircle className="w-3.5 h-3.5" /> {t("orders.cancelled", {}, "Cancelled")}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" /> {t("orders.processing", {}, "Processing")}
      </span>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            {t("profilePage.myOrders", {}, "My Orders")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            {t("profilePage.ordersDesc", {}, "View order status, request cancellations or returns according to policy.")}
          </p>
        </div>
        <span className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34]">
          <PackageCheck className="w-5 h-5" />
        </span>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/80 rounded-2xl border border-dashed border-gray-300">
          <PackageCheck className="w-14 h-14 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#222123]">{t("profilePage.noOrdersFound", {}, "No Orders Found")}</h3>
          <p className="text-xs text-gray-500 font-paragraph mt-1 mb-4">
            {t("profilePage.noOrdersDesc", {}, "You haven't placed any orders with KLN Ayurveda yet.")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderStatus = (order.status || order.deliveryStatus || "").toUpperCase();
            const isCancelled = orderStatus === "CANCELLED" || orderStatus === "CANCELED";
            const isDelivered = orderStatus === "DELIVERED";
            const isShipped = orderStatus === "SHIPPED" || orderStatus === "IN TRANSIT";
            const canCancel = !isShipped && !isDelivered && !isCancelled && orderStatus !== "RETURN_REQUESTED";
            const canReturn = isDelivered && orderStatus !== "RETURN_REQUESTED";

            return (
              <div
                key={order.id || order.orderNumber}
                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Order ID
                      </span>
                      <span className="text-sm font-bold text-[#2F5D34]">
                        #{order.orderNumber || order.id}
                      </span>
                    </div>

                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Order Date
                      </span>
                      <span className="text-xs font-semibold text-gray-700">
                        {order.orderDate}
                      </span>
                    </div>

                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Payment
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {order.paymentStatus || "PAID"} ({order.paymentMethod || "ONLINE"})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(orderStatus)}
                    <span className="text-base font-bold text-[#222123]">
                      ₹{order.totals?.grandTotal || order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Cancel or Return Reason Callout Banner if present */}
                {order.cancelReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                    <strong>Cancellation Reason:</strong> {order.cancelReason}
                  </div>
                )}
                {order.returnReason && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800">
                    <strong>Return Reason Logged:</strong> {order.returnReason}
                  </div>
                )}

                {/* Order Items List */}
                <div className="divide-y divide-gray-50">
                  {(order.items || []).map((item) => (
                    <div key={item.id || item.productId} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 relative overflow-hidden flex-none">
                          <Image
                            src={item.image || (item.product?.images?.[0]) || "/images/products/hairoil/oilf.jpeg"}
                            alt={item.name || item.product?.name || "Formulation"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-[#222123] line-clamp-1">
                            {item.name || item.product?.name || "Ayurvedic Formulation"}
                          </h4>
                          <p className="text-xs text-gray-500 font-paragraph">
                            Category: {item.category || "Hair Care"} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-none">
                        <span className="text-sm font-bold text-[#2F5D34]">
                          ₹{(item.price || item.product?.price || 0) * (item.quantity || 1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Track Order */}
                    <button
                      onClick={() => setSelectedTracking(order)}
                      className="px-4 py-2 rounded-xl bg-[#E7F0E4] text-[#2F5D34] font-bold text-xs uppercase tracking-wider hover:bg-[#2F5D34] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </button>

                    {/* View Invoice */}
                    <button
                      onClick={() => setSelectedInvoice(order)}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Invoice</span>
                    </button>

                    {/* Cancel Order Button */}
                    {canCancel && (
                      <button
                        onClick={() => handleOpenCancelModal(order)}
                        className="px-4 py-2 rounded-xl bg-red-50 text-red-700 font-bold text-xs uppercase tracking-wider hover:bg-red-100 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    )}

                    {/* Return Product Button */}
                    {canReturn && (
                      <button
                        onClick={() => handleOpenReturnModal(order)}
                        className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs uppercase tracking-wider hover:bg-purple-100 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return Product</span>
                      </button>
                    )}
                  </div>

                  {/* Reorder Button */}
                  <button
                    onClick={() => handleReorder(order)}
                    className="px-5 py-2 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Cancel Order Reason Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-white max-h-[90vh] overflow-y-auto animate-fadeIn">
            <button
              onClick={() => setCancelModalOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
              <span className="p-3 rounded-2xl bg-red-100 text-red-600">
                <XCircle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#222123]">
                  Cancel Order #{cancelModalOrder.orderNumber || cancelModalOrder.id}
                </h3>
                <p className="text-xs text-gray-500">Please tell us why you want to cancel this order.</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Select Cancellation Reason <span className="text-red-500">*</span>
              </label>

              <div className="space-y-2">
                {CANCEL_REASONS.map((reasonText) => (
                  <label
                    key={reasonText}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      selectedCancelReason === reasonText
                        ? "border-red-500 bg-red-50/60 font-bold text-red-900 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReasonRadio"
                      checked={selectedCancelReason === reasonText}
                      onChange={() => setSelectedCancelReason(reasonText)}
                      className="accent-red-600 size-4"
                    />
                    <span>{reasonText}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Additional Details / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={cancelNotes}
                  onChange={(e) => setCancelNotes(e.target.value)}
                  placeholder="Provide any additional comments about your cancellation..."
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs outline-none focus:border-red-500 bg-gray-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isSubmittingCancel}
                className="px-6 py-2.5 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {isSubmittingCancel ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Return Product Modal (Return Policy Compliant) */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-white max-h-[90vh] overflow-y-auto animate-fadeIn">
            <button
              onClick={() => setReturnModalOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <span className="p-3 rounded-2xl bg-purple-100 text-purple-700">
                <RotateCcw className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#222123]">
                  Return Product for Order #{returnModalOrder.orderNumber || returnModalOrder.id}
                </h3>
                <p className="text-xs text-purple-700 font-medium">KLN 7-Day Return Policy Compliant</p>
              </div>
            </div>

            {/* Return Policy Notice */}
            <div className="mb-5 p-3.5 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-950">
                <ShieldAlert className="w-4 h-4 text-purple-700" />
                <span>Return Policy Summary:</span>
              </div>
              <p className="leading-relaxed font-paragraph">
                Items can be returned within 7 days of delivery if unopened, unused, and in their original packaging with seal intact.
              </p>
              <Link href="/return-policy" target="_blank" className="font-bold underline text-purple-800 inline-block pt-0.5">
                Read Full Return Policy →
              </Link>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Select Reason for Return <span className="text-purple-600">*</span>
              </label>

              <div className="space-y-2">
                {RETURN_REASONS.map((reasonText) => (
                  <label
                    key={reasonText}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      selectedReturnReason === reasonText
                        ? "border-purple-500 bg-purple-50/70 font-bold text-purple-900 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="returnReasonRadio"
                      checked={selectedReturnReason === reasonText}
                      onChange={() => setSelectedReturnReason(reasonText)}
                      className="accent-purple-600 size-4"
                    />
                    <span>{reasonText}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Describe Issue / Remarks (Optional)
                </label>
                <textarea
                  rows={3}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Please specify any defect or damage details to assist our quality team..."
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs outline-none focus:border-purple-500 bg-gray-50"
                />
              </div>

              {/* Policy Agreement Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="returnPolicyCheckbox"
                  checked={agreedToReturnPolicy}
                  onChange={(e) => setAgreedToReturnPolicy(e.target.checked)}
                  className="mt-0.5 size-4 rounded accent-purple-600 focus:ring-purple-600 cursor-pointer"
                />
                <label htmlFor="returnPolicyCheckbox" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  I confirm that the product is in original condition and complies with KLN Ayurveda&apos;s Return Policy. *
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                disabled={isSubmittingReturn}
                className="px-6 py-2.5 rounded-full bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-purple-800 transition-all disabled:opacity-50"
              >
                {isSubmittingReturn ? "Submitting..." : "Submit Return Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#2F5D34]">KLN AYURVEDA INVOICE</h3>
                  <p className="text-xs text-gray-500">Authentic Herbal Formulations</p>
                </div>
                <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  {selectedInvoice.orderNumber || selectedInvoice.invoiceNo}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-paragraph mb-6 bg-gray-50 p-4 rounded-2xl">
              <div>
                <p className="text-gray-400 font-bold uppercase">Customer Details</p>
                <p className="font-bold text-gray-800">{user?.fullName || "Customer"}</p>
                <p className="text-gray-600">{user?.email || ""}</p>
                <p className="text-gray-600">{user?.phone || ""}</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase">Order Meta</p>
                <p className="text-gray-600">Date: {selectedInvoice.orderDate}</p>
                <p className="text-gray-600">Payment: {selectedInvoice.paymentMethod || "Online"}</p>
                <p className="text-gray-600">Status: {selectedInvoice.paymentStatus || "PAID"}</p>
              </div>
            </div>

            {/* Table */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Itemized Summary</p>
              {(selectedInvoice.items || []).map((item) => (
                <div key={item.id || item.productId} className="flex justify-between items-center text-xs py-2 border-b border-gray-100">
                  <div>
                    <p className="font-bold text-gray-800">{item.name || item.product?.name || "Formulation"}</p>
                    <p className="text-gray-500">Qty: {item.quantity} x ₹{item.price || item.product?.price || 0}</p>
                  </div>
                  <span className="font-bold text-gray-800">₹{(item.price || item.product?.price || 0) * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{selectedInvoice.totals?.grandTotal || selectedInvoice.totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST Tax (5%):</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee:</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#2F5D34] pt-2 border-t">
                <span>Grand Total:</span>
                <span>₹{selectedInvoice.totals?.grandTotal || selectedInvoice.totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                onClick={() => {
                  toast.success("Downloading PDF Invoice...", { icon: "📥" });
                  setSelectedInvoice(null);
                }}
                className="px-6 py-2.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow"
              >
                Download PDF Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {selectedTracking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-white">
            <button
              onClick={() => setSelectedTracking(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34]">
                <Truck className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#222123]">
                  Track Order #{selectedTracking.orderNumber || selectedTracking.id}
                </h3>
                <p className="text-xs text-gray-500">
                  Carrier: <strong>{selectedTracking.carrier || "Express Courier"}</strong> • AWB: {selectedTracking.trackingNumber || `AWB${Math.floor(1000000 + Math.random() * 9000000)}`}
                </p>
              </div>
            </div>

            {/* Tracking Steps Timeline */}
            <div className="space-y-6 relative pl-6 border-l-2 border-emerald-200 my-6">
              {(() => {
                const s = (selectedTracking.status || selectedTracking.deliveryStatus || "").toUpperCase();
                const isCancelled = s === "CANCELLED" || s === "CANCELED";
                const isShipped = s === "SHIPPED" || s === "IN TRANSIT" || s === "DELIVERED";
                const isDelivered = s === "DELIVERED";
                const isProcessing = s === "PROCESSING" || isShipped || isDelivered;

                const steps = isCancelled
                  ? [
                      { label: "Order Placed", date: selectedTracking.orderDate || "Completed", completed: true },
                      { label: "Order Cancelled", date: selectedTracking.cancelReason || "Status Updated", completed: true, cancelled: true },
                    ]
                  : [
                      { label: "Order Placed & Confirmed", date: selectedTracking.orderDate || "Completed", completed: true },
                      { label: "Ayurvedic Quality Check & Processing", date: isProcessing ? "Completed" : "In Progress", completed: isProcessing },
                      { label: "Dispatched with Courier Partner", date: isShipped ? "Dispatched" : "Pending Dispatch", completed: isShipped },
                      { label: "Delivered to Shipping Address", date: isDelivered ? "Delivered" : "Estimated 3-5 Days", completed: isDelivered },
                    ];

                return steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span
                      className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow ${
                        step.cancelled ? "bg-red-500" : step.completed ? "bg-[#2F5D34]" : "bg-gray-300"
                      }`}
                    />
                    <h4 className={`text-xs sm:text-sm font-bold ${step.cancelled ? "text-red-600" : step.completed ? "text-[#2F5D34]" : "text-gray-400"}`}>
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-paragraph">{step.date}</p>
                  </div>
                ));
              })()}
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl text-xs font-paragraph text-[#2F5D34] flex items-center justify-between">
              <span>Estimated Delivery:</span>
              <strong className="font-bold">{selectedTracking.estimatedDelivery || "3-5 Business Days"}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
