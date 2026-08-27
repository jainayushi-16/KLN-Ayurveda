"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ShopNavBar from "@/components/shop/ShopNavBar";
import FooterSection from "@/app/(root)/FooterSection";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useOrderStore } from "@/store/useOrderStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { orderApi } from "@/services/order.api";
import toast from "react-hot-toast";

export default function OrderSuccessPage({ searchParams }) {
  const resolvedSearchParams = searchParams && typeof searchParams.then === "function" ? use(searchParams) : (searchParams || {});
  const orderId = resolvedSearchParams?.orderId || "KLN-984920";
  const { getOrderById, fetchOrderById } = useOrderStore();
  const { wishlistIds } = useWishlistStore();
  const [isLoading, setIsLoading] = useState(true);

  // Try to fetch order from backend if not in local store
  useEffect(() => {
    const loadOrder = async () => {
      const localOrder = getOrderById(orderId);
      if (!localOrder) {
        try {
          await fetchOrderById(orderId);
        } catch (err) {
          console.error("Failed to fetch order:", err);
        }
      }
      setIsLoading(false);
    };
    loadOrder();
  }, [orderId, getOrderById, fetchOrderById]);

  const activeOrder = getOrderById(orderId);

  const order = activeOrder || {
    orderId: orderId || "KLN-ORDER",
    orderNumber: orderId || "KLN-ORDER",
    orderDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    items: [],
    shippingAddress: {
      fullName: "Customer",
      street: "Address",
      city: "Indore",
      state: "Madhya Pradesh",
      pincode: "452010",
    },
    paymentMethod: "UPI",
    paymentStatus: "PAID",
    estimatedDelivery: "5-7 Business Days",
  };

  const subtotal = Number(order.totals?.subtotal ?? order.subtotal ?? 0);
  const shippingCost = Number(order.totals?.shipping ?? order.shippingFee ?? 0);
  const discountAmount = Number(order.totals?.discount ?? order.discount ?? 0);
  const taxAmount = Number(order.totals?.tax ?? order.tax ?? 0);
  const grandTotal = Number(order.totals?.grandTotal ?? order.totalAmount ?? (Math.max(0, subtotal - discountAmount + shippingCost + taxAmount)));
  const appliedCode = order.couponCode || order.totals?.couponCode || null;

  if (isLoading) {
    return (
      <ProtectedRoute pageTitle="Order Placed">
        <div className="min-h-screen flex items-center justify-center bg-[#F7F4EC]">
          <div className="text-center">
            <span className="text-4xl animate-bounce">🌿</span>
            <p className="mt-2 text-sm font-bold text-[#2F5D34]">Loading Order Details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute pageTitle="Order Placed">
      <main className="min-h-screen w-full relative bg-gradient-to-b from-[#F7F4EC] via-[#E8F2E3] to-[#F7F4EC] text-[#222123]">
        <ShopNavBar cartCount={0} wishlistCount={wishlistIds.length} />

        {/* Celebratory Content Section */}
        <section className="py-10 sm:py-16 px-6 md:px-12 max-w-[1200px] mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 sm:p-14 border border-white shadow-2xl text-center relative overflow-hidden">
            {/* Background Botanical Accent */}
            <Image src="/images/flower.svg" alt="" width={300} height={300} className="absolute -top-20 -right-20 opacity-15 pointer-events-none" />

            {/* Success Icon */}
            <div className="size-24 rounded-full bg-[#2F5D34] text-white flex items-center justify-center text-5xl mx-auto shadow-xl animate-bounce mb-6">
              ✓
            </div>

            <span className="inline-block px-4 py-1.5 rounded-full bg-[#5B7C3A]/15 text-[#5B7C3A] text-xs font-bold uppercase tracking-widest mb-3">
              Order Confirmed
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold uppercase text-[#2F5D34]">
              Thank You for Your Order!
            </h1>

            <p className="text-gray-600 font-paragraph text-base sm:text-lg mt-3 max-w-xl mx-auto">
              Your formulation request has been received. We are handcrafting your Ayurvedic order with fresh organic botanicals.
            </p>

            {/* Order Highlight Box */}
            <div className="mt-8 bg-[#F7F4EC] p-6 rounded-2xl border border-[#2F5D34]/15 max-w-xl mx-auto text-left grid grid-cols-2 gap-4 text-xs font-paragraph">
              <div>
                <span className="block text-gray-500 font-bold uppercase">Order Reference:</span>
                <span className="text-sm font-extrabold text-[#2F5D34]">{order.orderNumber || order.orderId}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase">Payment Status:</span>
                <span className="text-sm font-extrabold text-green-700">{order.paymentStatus}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase">Estimated Delivery:</span>
                <span className="text-sm font-bold text-[#222123]">{order.estimatedDelivery}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase">Total Amount:</span>
                <span className="text-sm font-extrabold text-[#2F5D34]">₹{grandTotal.toFixed(2)}</span>
                {appliedCode && (
                  <span className="block text-[10px] font-bold text-emerald-700 mt-0.5">
                    🎟️ Coupon '{appliedCode}' (-₹{discountAmount.toFixed(2)})
                  </span>
                )}
              </div>
            </div>

            {/* Customer Shipping Address Summary */}
            <div className="mt-6 text-left max-w-xl mx-auto text-xs font-paragraph text-gray-600 border-t border-gray-100 pt-4">
              <span className="font-bold text-[#2F5D34] uppercase tracking-wider block mb-1">Delivering To:</span>
              <p className="font-bold text-[#222123] text-sm">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/profile?tab=track-orders">
                <button className="px-8 py-4 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-[#224426] hover:scale-105 transition-all flex items-center gap-2">
                  <span>🚚</span>
                  <span>Track Shipment Live</span>
                </button>
              </Link>

              <Link href={`/invoice/${order.orderId}`}>
                <button className="px-8 py-4 rounded-full bg-[#E8F2E3] text-[#2F5D34] font-bold text-xs uppercase tracking-widest hover:bg-[#2F5D34] hover:text-white transition-all flex items-center gap-2">
                  <span>📄</span>
                  <span>View / Download Invoice</span>
                </button>
              </Link>

              <Link href="/shop">
                <button className="px-8 py-4 rounded-full border-2 border-[#2F5D34] text-[#2F5D34] font-bold text-xs uppercase tracking-widest hover:bg-[#2F5D34] hover:text-white transition-all">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </section>

        <FooterSection />
      </main>
    </ProtectedRoute>
  );
}
