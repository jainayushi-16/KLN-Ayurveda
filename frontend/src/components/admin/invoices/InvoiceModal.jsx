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
      <div className="invoice-printable p-2 text-[#1B351E] bg-[#FFFFFF]">
        {/* Header */}
        <div className="flex justify-between border-b-2 border-[#2F5D34]/30 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#2F5D34] mb-1">KLN Ayurveda</h2>
            <div className="text-xs text-[#5B7C3A] font-semibold">Authentic Ayurvedic Formulations</div>
            <div className="text-xs text-gray-500">Email: support@klnayurveda.com | Web: www.klnayurveda.com</div>
          </div>
          <div className="text-right">
            <h3 className="text-base font-bold text-[#1B351E]">INVOICE</h3>
            <div className="text-sm font-bold text-[#2F5D34]">#{order.orderNumber}</div>
            <div className="text-xs text-gray-500">Date: {orderDate}</div>
            <div className="mt-2">
              <Badge type={order.paymentStatus} text={`Payment: ${order.paymentStatus}`} />
            </div>
          </div>
        </div>

        {/* Addresses & Shipment Tracking Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-[#F7F4EE] p-4 rounded-xl border border-[#2F5D34]/15">
          <div>
            <h4 className="text-xs uppercase font-bold text-[#5B7C3A] mb-2">Billed To & Customer</h4>
            <div className="font-bold text-[#1B351E]">{customerName}</div>
            <div className="text-xs text-gray-600">{customerEmail}</div>
            <div className="text-xs text-gray-600">Phone: {customerPhone}</div>
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-[#5B7C3A] mb-2">Shipping Address</h4>
            {order.shippingAddress ? (
              <div className="text-xs text-gray-600 leading-relaxed">
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode || order.shippingAddress.pincode}</div>
                <div>{order.shippingAddress.country || "India"}</div>
              </div>
            ) : (
              <div className="text-xs text-gray-500">Standard Shipping Address</div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse mb-6 text-xs">
          <thead>
            <tr className="bg-[#E7F0E4] border-b border-[#2F5D34]/20 text-[#2F5D34]">
              <th className="p-3 text-left font-bold">Item Description</th>
              <th className="p-3 text-center font-bold">Qty</th>
              <th className="p-3 text-right font-bold">Price</th>
              <th className="p-3 text-right font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-[#F4F8F3] transition-colors">
                <td className="p-3">
                  <div className="font-bold text-[#1B351E]">{item.product?.name || "Ayurvedic Product"}</div>
                  <div className="text-[11px] text-gray-500">SKU: {item.productId?.slice(0, 8)}</div>
                </td>
                <td className="p-3 text-center text-[#1B351E]">{item.quantity}</td>
                <td className="p-3 text-right text-[#1B351E]">₹{item.price?.toFixed(2)}</td>
                <td className="p-3 text-right font-bold text-[#2F5D34]">₹{(item.total || item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 bg-[#F7F4EE] p-4 rounded-xl border border-[#2F5D34]/15 shadow-sm">
            <div className="flex justify-between mb-1.5 text-xs text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#1B351E]">₹{(order.subtotal || order.totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1.5 text-xs text-gray-600">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-[#1B351E]">₹{(order.shippingFee || 0).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between mb-1.5 text-xs text-emerald-600 font-bold">
                <span>Discount:</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-[#2F5D34]/20 font-extrabold text-sm text-[#2F5D34]">
              <span>Grand Total:</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
