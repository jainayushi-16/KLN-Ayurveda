"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import Badge from "@/components/admin/common/Badge";
import InvoiceModal from "@/components/admin/invoices/InvoiceModal";
import { CreditCard, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/admin/orders?limit=50");
        if (res.success) {
          setOrders(res.data || []);
        }
      } catch (err) {
        toast.error("Failed to load payment transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div>
            <h3 className="text-base font-bold text-[#f5f8f6]">Payment & Invoice History</h3>
            <p className="text-xs text-[#6b8277]">Store gateway transactions, payment statuses, and tax invoices</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Payment Gateway</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-6">
                    Loading payment records...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="font-bold text-[#e8c88a]">#{ord.orderNumber}</td>
                    <td className="text-xs text-gray-200">
                      {ord.user ? `${ord.user.firstName || ""} ${ord.user.lastName || ""}`.trim() : "Customer"}
                    </td>
                    <td className="text-xs text-gray-400 flex items-center gap-1">
                      <CreditCard size={14} />
                      <span>{ord.paymentMethod || "Online Gateway"}</span>
                    </td>
                    <td className="font-bold text-xs">₹{ord.totalAmount.toFixed(2)}</td>
                    <td>
                      <Badge type={ord.paymentStatus} text={ord.paymentStatus} />
                    </td>
                    <td className="text-xs text-gray-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="btn-secondary py-1 px-2.5 text-xs"
                      >
                        <Eye size={14} />
                        <span>Tax Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
