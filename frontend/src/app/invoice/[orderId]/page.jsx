"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrderStore } from "@/store/useOrderStore";
import { PRODUCTS } from "@/constants/products";
import { orderApi } from "@/services/order.api";
import toast from "react-hot-toast";

export default function InvoicePage({ params }) {
  const resolvedParams = params && typeof params.then === "function" ? use(params) : (params || {});
  const orderId = resolvedParams?.orderId;
  const { getOrderById, fetchOrderById } = useOrderStore();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch order from backend if not in local store
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
    invoiceNo: orderId || "INV-KLN",
    orderDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    items: [],
    totals: { subtotal: 0, shipping: 0, tax: 0, discount: 0, grandTotal: 0 },
    shippingAddress: {},
    paymentMethod: "UPI",
    paymentDetails: "Completed Online",
    paymentStatus: "PAID",
  };

  const addr = order.shippingAddress || {};
  const customerName = addr.fullName || addr.name || "Customer";
  const streetAddress = addr.street || addr.addressLine1 || "";
  const cityStateZip = [addr.city, addr.state].filter(Boolean).join(", ") + (addr.pincode || addr.postalCode ? ` - ${addr.pincode || addr.postalCode}` : "");
  const countryName = addr.country || "India";
  const customerPhone = addr.phone || "";
  const customerEmail = addr.email || "";

  const subtotal = Number(order.totals?.subtotal ?? order.subtotal ?? 0);
  const shippingCost = Number(order.totals?.shipping ?? order.shippingFee ?? 0);
  const discountAmount = Number(order.totals?.discount ?? order.discount ?? 0);
  const taxAmount = Number(order.totals?.tax ?? order.tax ?? 0);
  const grandTotal = Number(order.totals?.grandTotal ?? order.totalAmount ?? (Math.max(0, subtotal - discountAmount + shippingCost + taxAmount)));
  const appliedCode = order.couponCode || order.totals?.couponCode || null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F4EC]">
        <div className="text-center">
          <span className="text-4xl animate-bounce">🌿</span>
          <p className="mt-2 text-sm font-bold text-[#2F5D34]">Loading Invoice...</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#F7F4EC] text-[#222123] py-10 px-4 sm:px-8">
      {/* Print Controls (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between no-print">
        <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#2F5D34] hover:underline flex items-center gap-2">
          <span>← Back to Shop</span>
        </Link>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#224426] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>🖨️ Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-200 print:shadow-none print:border-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b-2 border-[#2F5D34]/20 gap-6">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/images/logo.svg" alt="KLN Ayurveda" width={60} height={60} className="w-14" />
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-wider text-[#2F5D34]">KLN Ayurveda</h1>
                <p className="text-[10px] uppercase tracking-widest text-[#5B7C3A] font-bold">Pure Herbal Formulations</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-paragraph mt-2">
              KLN Botanical Labs Pvt Ltd • Bandra Kurla Complex, Mumbai, Maharashtra 400051
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-[#2F5D34] text-white text-[10px] font-bold uppercase tracking-widest mb-2">
              Tax Invoice / Bill
            </span>
            <h2 className="text-lg font-bold text-[#222123]">{order.invoiceNo || order.orderNumber || order.orderId}</h2>
            <p className="text-xs text-gray-500 font-paragraph">Order ID: <span className="font-bold text-[#2F5D34]">{order.orderNumber || order.orderId}</span></p>
            <p className="text-xs text-gray-500 font-paragraph">Date: {order.orderDate || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 text-xs font-paragraph">
          <div className="bg-[#F7F4EC] p-5 rounded-2xl border border-gray-200">
            <h3 className="font-bold uppercase text-[#2F5D34] tracking-wider mb-2">Customer Details (Billed & Shipped To):</h3>
            <p className="font-bold text-[#222123] text-sm">{customerName}</p>
            {streetAddress && <p>{streetAddress}</p>}
            {cityStateZip && <p>{cityStateZip}</p>}
            <p>Country: {countryName}</p>
            {customerEmail && <p className="mt-1">Email: {customerEmail}</p>}
            {customerPhone && <p>Phone: {customerPhone}</p>}
          </div>

          <div className="bg-[#F7F4EC] p-5 rounded-2xl border border-gray-200">
            <h3 className="font-bold uppercase text-[#2F5D34] tracking-wider mb-2">Payment & Offer Details:</h3>
            <p className="font-bold text-[#222123] text-sm">Method: {order.paymentMethod || "Online Payment"}</p>
            {appliedCode && (
              <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F2E3] text-[#2F5D34] text-xs font-bold border border-[#2F5D34]/30 shadow-xs">
                <span>🎟️ Offer Applied:</span>
                <span className="font-extrabold uppercase tracking-wider">{appliedCode}</span>
              </div>
            )}
            <p className="text-gray-600 mt-1">{order.paymentDetails || "Payment Completed"}</p>
            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider">
              Status: {order.paymentStatus || "PAID"}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto my-8">
          <table className="w-full text-left text-xs font-paragraph border-collapse">
            <thead>
              <tr className="bg-[#2F5D34] text-white uppercase text-[11px] font-bold tracking-wider">
                <th className="p-3.5 rounded-l-xl">#</th>
                <th className="p-3.5">Product Description</th>
                <th className="p-3.5 text-center">Qty</th>
                <th className="p-3.5 text-right">Unit Price</th>
                <th className="p-3.5 text-right rounded-r-xl">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => {
                const matched = PRODUCTS.find((p) => p.id === item.productId);
                const name = matched ? matched.name : item.name || "Ayurvedic Product";
                const unitPrice = Number(item.price || item.product?.price || matched?.price || 0);
                const qty = Math.max(1, Number(item.quantity) || 1);
                const total = unitPrice * qty;
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3.5 font-bold text-gray-500">{idx + 1}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#222123] text-sm">{name}</div>
                      <div className="text-[10px] text-[#5B7C3A] font-bold uppercase">{matched?.category || item.category || "Hair Care"}</div>
                    </td>
                    <td className="p-3.5 text-center font-bold text-[#222123]">{qty}</td>
                    <td className="p-3.5 text-right">₹{unitPrice.toFixed(2)}</td>
                    <td className="p-3.5 text-right font-bold text-[#2F5D34]">₹{total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-6 border-t-2 border-[#2F5D34]/20 gap-6">
          <div className="text-xs text-gray-500 font-paragraph max-w-sm">
            <p className="font-bold text-[#2F5D34] uppercase tracking-wider mb-1">Terms & Conditions:</p>
            <p>Goods once sold can be returned within 10 days of delivery. For queries, contact support@klnayurveda.com.</p>
          </div>

          <div className="w-full sm:w-72 bg-[#F7F4EC] p-5 rounded-2xl border border-gray-200 text-xs font-paragraph flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-bold">{shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax (5%):</span>
              <span className="font-bold">₹{taxAmount.toFixed(2)}</span>
            </div>
            {(discountAmount > 0 || appliedCode) && (
              <div className="flex justify-between text-[#2F5D34] font-bold">
                <span>Offer Discount {appliedCode ? `(${appliedCode})` : ''}:</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-gray-300 flex justify-between items-baseline text-base font-bold text-[#2F5D34]">
              <span>Grand Total:</span>
              <span className="text-xl">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Printable CSS */}
        <style jsx global>{`
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </main>
  );
}
