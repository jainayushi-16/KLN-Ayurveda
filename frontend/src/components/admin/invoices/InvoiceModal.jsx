"use client";

import React from "react";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import { Printer } from "lucide-react";

export default function InvoiceModal({ isOpen, onClose, order }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const customerName = order.user
    ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
    : "Valued Customer";
  const customerEmail = order.user?.email || "N/A";
  const customerPhone = order.user?.phone || "N/A";

  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tax Invoice — ${order.orderNumber}`}
      maxWidth="750px"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Invoice</span>
          </button>
        </>
      }
    >
      <div className="invoice-printable p-2 text-[#f5f8f6]">
        {/* Header */}
        <div className="flex justify-between border-b-2 border-[#c9a66b] pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#c9a66b] mb-1">KLN Ayurveda</h2>
            <div className="text-xs text-gray-300">Authentic Ayurvedic Formulations</div>
            <div className="text-xs text-gray-400">Email: support@klnayurveda.com | Web: www.klnayurveda.com</div>
          </div>
          <div className="text-right">
            <h3 className="text-base font-bold">INVOICE</h3>
            <div className="text-sm font-bold text-[#e8c88a]">#{order.orderNumber}</div>
            <div className="text-xs text-gray-300">Date: {orderDate}</div>
            <div className="mt-2">
              <Badge type={order.paymentStatus} text={`Payment: ${order.paymentStatus}`} />
            </div>
          </div>
        </div>

        {/* Addresses & Shipment Tracking Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-[#0e1c16] p-4 rounded-xl border border-[#c9a66b]/20">
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Billed To & Customer</h4>
            <div className="font-bold text-white">{customerName}</div>
            <div className="text-xs text-gray-300">{customerEmail}</div>
            <div className="text-xs text-gray-300">Phone: {customerPhone}</div>
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Shipping Address</h4>
            {order.shippingAddress ? (
              <div className="text-xs text-gray-300 leading-relaxed">
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode || order.shippingAddress.pincode}</div>
                <div>{order.shippingAddress.country || "India"}</div>
              </div>
            ) : (
              <div className="text-xs text-gray-400">Standard Shipping Address</div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse mb-6 text-xs">
          <thead>
            <tr className="bg-[#0e1c16] border-b border-white/10 text-gray-400">
              <th className="p-3 text-left">Item Description</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.map((item, idx) => (
              <tr key={idx} className="border-b border-white/10">
                <td className="p-3">
                  <div className="font-bold">{item.product?.name || "Ayurvedic Product"}</div>
                  <div className="text-[11px] text-gray-400">SKU: {item.productId?.slice(0, 8)}</div>
                </td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">₹{item.price?.toFixed(2)}</td>
                <td className="p-3 text-right font-bold">₹{(item.total || item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 bg-[#0e1c16] p-4 rounded-xl border border-[#c9a66b]/20">
            <div className="flex justify-between mb-1.5 text-xs text-gray-300">
              <span>Subtotal:</span>
              <span>₹{(order.subtotal || order.totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1.5 text-xs text-gray-300">
              <span>Shipping Fee:</span>
              <span>₹{(order.shippingFee || 0).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between mb-1.5 text-xs text-emerald-400">
                <span>Discount:</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-sm text-[#c9a66b]">
              <span>Grand Total:</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
