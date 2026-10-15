"use client";

import React from "react";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import { Printer, User, MapPin, Truck, CreditCard } from "lucide-react";

export default function InvoiceModal({ isOpen, onClose, order }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const customerName =
    (order.user?.firstName || order.user?.lastName)
      ? `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim()
      : (order.shippingAddress?.fullName || order.shippingAddress?.name || order.customerName || "Valued Customer");
  const customerEmail = order.user?.email || order.shippingAddress?.email || order.customerEmail || "N/A";
  const customerPhone = order.user?.phone || order.shippingAddress?.phone || order.customerPhone || "N/A";

  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const methodUpper = String(order.paymentMethod || order.payment?.provider || "ONLINE").toUpperCase();
  const isCod = methodUpper.includes("COD") || methodUpper.includes("CASH");
  const isPaid = String(order.paymentStatus || order.payment?.status || "").toUpperCase() === "PAID";
  const displayPaymentStatus = isPaid
    ? "PAID"
    : isCod
    ? "UNPAID (Pay on Delivery)"
    : (order.paymentStatus || "PENDING");

  const subtotalNum = Number(order.subtotal ?? order.totalAmount ?? 0);
  const shippingNum = Number(order.shippingFee ?? 0);
  const taxNum = Number(order.tax ?? 0);
  const discountNum = Number(order.discount ?? 0);
  const totalNum = Number(order.totalAmount ?? (subtotalNum + shippingNum + taxNum - discountNum));

  const items = Array.isArray(order.items) ? order.items : [];

  const renderAddress = (addr) => {
    if (!addr) {
      return <div className="text-xs text-gray-500">Standard Shipping Address</div>;
    }
    if (typeof addr === "string") {
      try {
        const parsed = JSON.parse(addr);
        if (typeof parsed === "object") return renderAddress(parsed);
      } catch (e) {
        return <div className="text-xs text-gray-600">{addr}</div>;
      }
    }
    const street = addr.street || addr.addressLine1 || addr.address || "";
    const city = addr.city || "";
    const state = addr.state || "";
    const zip = addr.postalCode || addr.pincode || addr.zip || "";
    const country = addr.country || "India";

    return (
      <div className="text-xs text-gray-600 leading-relaxed">
        {addr.fullName && <div className="font-bold text-[#1B351E]">{addr.fullName}</div>}
        {street && <div>{street}</div>}
        {(city || state || zip) && <div>{[city, state].filter(Boolean).join(", ")} {zip}</div>}
        <div>{country}</div>
        {addr.phone && <div className="mt-1 text-gray-500">Phone: {addr.phone}</div>}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tax Invoice — ${order.orderNumber || order.id || "KLN-ORDER"}`}
      maxWidth="780px"
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
            <div className="text-xs text-gray-500 mt-1">Email: ayurvedakln@gmail.com | Web: www.klnayurveda.com</div>
          </div>
          <div className="text-right">
            <h3 className="text-base font-bold text-[#1B351E]">TAX INVOICE</h3>
            <div className="text-sm font-bold text-[#2F5D34]">#{order.orderNumber || order.id}</div>
            <div className="text-xs text-gray-500">Date: {orderDate}</div>
            <div className="mt-2 flex justify-end gap-1.5">
              <Badge type={order.status || "PENDING"} text={`Order: ${order.status || "PENDING"}`} />
              <Badge type={displayPaymentStatus} text={`Payment: ${displayPaymentStatus}`} />
            </div>
          </div>
        </div>

        {/* Addresses & Shipment Tracking Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-[#F7F4EE] p-4 rounded-xl border border-[#2F5D34]/15">
          <div>
            <h4 className="text-xs uppercase font-bold text-[#5B7C3A] mb-2 flex items-center gap-1.5">
              <User size={13} />
              <span>Billed To & Customer</span>
            </h4>
            <div className="font-bold text-[#1B351E]">{customerName}</div>
            <div className="text-xs text-gray-600">Email: {customerEmail}</div>
            <div className="text-xs text-gray-600">Phone: {customerPhone}</div>
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-[#5B7C3A] mb-2 flex items-center gap-1.5">
              <MapPin size={13} />
              <span>Shipping Address</span>
            </h4>
            {renderAddress(order.shippingAddress || order.billingAddress)}
          </div>
        </div>

        {/* Shipment & Logistics */}
        <div className="mb-6 bg-[rgba(47,93,52,0.06)] p-3.5 rounded-xl border border-[#2F5D34]/20">
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div>
              <div className="text-[11px] text-gray-500 uppercase font-semibold">Carrier</div>
              <div className="font-bold text-[#1B351E]">{order.carrier || "BlueDart Express"}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase font-semibold">Tracking #</div>
              <div className="font-bold text-[#2F5D34] font-mono">
                {order.trackingNumber || `TRK-${String(order.orderNumber || order.id || '').replace(/[^0-9]/g, '') || '90812344'}`}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase font-semibold">Payment Mode</div>
              <div className="font-bold text-[#1B351E]">{methodUpper}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase font-semibold">Estimated Delivery</div>
              <div className="font-bold text-[#1B351E]">{order.estimatedDelivery || "3-5 Business Days"}</div>
            </div>
          </div>
          {(order.payment?.transactionId || order.transactionId) && (
            <div className="mt-2 pt-2 border-t border-[#2F5D34]/15 text-[11px] text-gray-600">
              Transaction ID: <span className="font-mono font-bold text-[#1B351E]">{order.payment?.transactionId || order.transactionId}</span>
            </div>
          )}
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
            {items.length > 0 ? (
              items.map((item, idx) => {
                const prod = item.product || {};
                const itemName = prod.name || item.name || item.title || "Ayurvedic Product";
                const itemDesc = prod.shortDesc || prod.description || prod.fullDesc || item.description || item.shortDesc || "";
                const itemCategory = prod.category?.name || item.category || prod.type || "";
                const itemSku = prod.id || item.productId || item.sku ? String(prod.id || item.productId || item.sku).slice(0, 12) : `SKU-${idx + 1}`;
                const itemBadge = prod.badge || item.badge || "";
                const itemQty = Number(item.quantity || 1);
                const itemPrice = Number(item.price || item.unitPrice || prod.price || 0);
                const itemTotal = Number(item.total || (itemPrice * itemQty));

                return (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-[#F4F8F3] transition-colors">
                    <td className="p-3 align-top">
                      <div className="font-bold text-[#1B351E] text-sm mb-1">{itemName}</div>
                      {itemDesc && (
                        <div className="text-xs text-gray-600 leading-relaxed mb-1.5 max-w-sm">
                          {itemDesc}
                        </div>
                      )}
                      <div className="flex gap-2 text-[11px] text-[#5B7C3A] items-center flex-wrap">
                        <span><strong>SKU:</strong> {itemSku}</span>
                        {itemCategory && <span>• <strong>Category:</strong> {itemCategory}</span>}
                        {itemBadge && (
                          <span className="bg-[#E7F0E4] px-1.5 py-0.5 rounded text-[10px] font-bold text-[#2F5D34]">
                            {itemBadge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center align-top font-bold text-[#1B351E]">{itemQty}</td>
                    <td className="p-3 text-right align-top text-[#1B351E]">₹{itemPrice.toFixed(2)}</td>
                    <td className="p-3 text-right align-top font-bold text-[#2F5D34]">₹{itemTotal.toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No items listed for this order.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 bg-[#F7F4EE] p-4 rounded-xl border border-[#2F5D34]/15 shadow-sm">
            <div className="flex justify-between mb-1.5 text-xs text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#1B351E]">₹{subtotalNum.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1.5 text-xs text-gray-600">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-[#1B351E]">{shippingNum === 0 ? "FREE" : `₹${shippingNum.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between mb-1.5 text-xs text-gray-600">
              <span>Tax (GST 5%):</span>
              <span className="font-semibold text-[#1B351E]">₹{taxNum.toFixed(2)}</span>
            </div>
            {discountNum > 0 && (
              <div className="flex justify-between mb-1.5 text-xs text-emerald-600 font-bold">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}:</span>
                <span>-₹{discountNum.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-[#2F5D34]/20 font-extrabold text-sm text-[#2F5D34]">
              <span>Grand Total:</span>
              <span>₹{totalNum.toFixed(2)}</span>
            </div>
            {Number(order.walletAmount || 0) > 0 && (
              <div className="flex justify-between mt-1.5 pt-1.5 border-t border-dashed border-[#2F5D34]/30 text-xs text-[#2F5D34] font-bold">
                <span>KLN Wallet Paid:</span>
                <span>-₹{Number(order.walletAmount).toFixed(2)}</span>
              </div>
            )}
            {Number(order.walletAmount || 0) > 0 && (
              <div className="flex justify-between mt-1 text-xs font-bold text-stone-800">
                <span>Net Amount Due:</span>
                <span>₹{Math.max(0, totalNum - Number(order.walletAmount)).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
