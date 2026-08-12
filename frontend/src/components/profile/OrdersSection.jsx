"use client";

import { useState } from "react";
import Image from "next/image";
import { PackageCheck, Truck, FileText, Repeat, CheckCircle, Clock, ArrowRight, X, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";

export default function OrdersSection({ user, orders, onSelectTrackOrder }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const { addToCart } = useCartStore();

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item.id, item.quantity || 1);
    });
    toast.success(`Reordered ${order.items.length} item(s) from #${order.id}! Added to Cart.`, {
      icon: "🛍️",
      style: {
        borderRadius: "16px",
        background: "#2F5D34",
        color: "#fff",
      },
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "In Transit":
        return (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> In Transit
          </span>
        );
      case "Processing":
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            My Orders
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            View your order history, track deliveries, download invoices, and reorder.
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
          <h3 className="text-lg font-bold text-[#222123]">No Orders Found</h3>
          <p className="text-xs text-gray-500 font-paragraph mt-1 mb-4">
            You haven&apos;t placed any orders with KLN Ayurveda yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
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
                      #{order.id}
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
                      {order.paymentStatus} ({order.paymentMethod})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.deliveryStatus)}
                  <span className="text-base font-bold text-[#222123]">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 relative overflow-hidden flex-none">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#222123] line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-paragraph">
                          Category: {item.category} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-none">
                      <span className="text-sm font-bold text-[#2F5D34]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
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
          ))}
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
                  {selectedInvoice.invoiceNo}
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
                <p className="text-gray-600">Payment: {selectedInvoice.paymentMethod}</p>
                <p className="text-gray-600">Status: {selectedInvoice.paymentStatus}</p>
              </div>
            </div>

            {/* Table */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Itemized Summary</p>
              {selectedInvoice.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs py-2 border-b border-gray-100">
                  <div>
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity} x ₹{item.price}</p>
                  </div>
                  <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{selectedInvoice.totalAmount}</span>
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
                <span>₹{selectedInvoice.totalAmount}</span>
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
                  Track Order #{selectedTracking.id}
                </h3>
                <p className="text-xs text-gray-500">
                  Carrier: <strong>{selectedTracking.carrier}</strong> • AWB: {selectedTracking.trackingNumber}
                </p>
              </div>
            </div>

            {/* Tracking Steps Timeline */}
            <div className="space-y-6 relative pl-6 border-l-2 border-emerald-200 my-6">
              {selectedTracking.trackingSteps?.map((step, idx) => (
                <div key={idx} className="relative">
                  <span
                    className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow ${
                      step.completed ? "bg-[#2F5D34]" : "bg-gray-300"
                    }`}
                  />
                  <h4 className={`text-xs sm:text-sm font-bold ${step.completed ? "text-[#2F5D34]" : "text-gray-400"}`}>
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-paragraph">{step.date}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl text-xs font-paragraph text-[#2F5D34] flex items-center justify-between">
              <span>Estimated Delivery:</span>
              <strong className="font-bold">{selectedTracking.estimatedDelivery}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
