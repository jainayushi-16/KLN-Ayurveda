"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import Pagination from "@/components/admin/common/Pagination";
import InvoiceModal from "@/components/admin/invoices/InvoiceModal";
import Badge from "@/components/admin/common/Badge";
import { Search, Eye, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

const orderStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [viewingOrder, setViewingOrder] = useState(null);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/admin/orders?page=${page}&limit=10&status=${selectedStatus}&search=${search}`);
      if (res.success) {
        setOrders(res.data || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, totalItems: res.data?.length || 0 });
      }
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [search, selectedStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.message || "Failed to update order status");
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await axiosClient.put(`/admin/orders/${orderId}/payment`, { paymentStatus: newPaymentStatus });
      toast.success(`Payment status updated to ${newPaymentStatus}`);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.message || "Failed to update payment status");
    }
  };

  const handleReturnAction = async (orderId, isApproved) => {
    try {
      await axiosClient.post(`/admin/orders/${orderId}/return-response`, { isApproved });
      toast.success(isApproved ? "Return request APPROVED! Refund initiated." : "Return request REJECTED.");
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.message || "Failed to process return request");
    }
  };

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by Order # or Customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2 pl-9 pr-4 rounded-xl bg-[#08120e] border border-[#c9a66b]/20 text-xs text-[#f5f8f6] outline-none focus:border-[#c9a66b]"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 rounded-xl bg-[#08120e] border border-[#c9a66b]/20 text-xs text-[#f5f8f6] outline-none"
            >
              <option value="">All Order Statuses</option>
              {orderStatuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Returns</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center text-gray-400 py-6">
                    Loading store orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => {
                  const customerName = ord.user
                    ? `${ord.user.firstName || ""} ${ord.user.lastName || ""}`.trim()
                    : "Customer";
                  return (
                    <tr key={ord.id}>
                      <td className="font-bold text-[#e8c88a]">
                        #{ord.orderNumber}
                      </td>
                      <td>
                        <div className="font-semibold text-[#f5f8f6]">{customerName}</div>
                        <div className="text-[11px] text-[#6b8277]">{ord.user?.email}</div>
                      </td>
                      <td className="text-xs text-[#a3b8ad]">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="font-bold">
                        ₹{ord.totalAmount.toFixed(2)}
                      </td>
                      <td>
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value)}
                          className="py-1 px-2 rounded-lg bg-[#08120e] border border-[#c9a66b]/20 text-[11px] text-amber-400 font-bold outline-none"
                        >
                          {paymentStatuses.map((ps) => (
                            <option key={ps} value={ps}>{ps}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className="py-1 px-2 rounded-lg bg-[#08120e] border border-[#c9a66b]/20 text-[11px] text-emerald-400 font-bold outline-none"
                        >
                          {orderStatuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {ord.returnReason ? (
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-amber-400 block">Requested: {ord.returnReason}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleReturnAction(ord.id, true)}
                                className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReturnAction(ord.id, false)}
                                className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-500">None</span>
                        )}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setViewingOrder(ord)}
                          className="btn-secondary py-1 px-2.5 text-xs"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination pagination={pagination} onPageChange={fetchOrders} />
      </div>

      <InvoiceModal
        isOpen={Boolean(viewingOrder)}
        onClose={() => setViewingOrder(null)}
        order={viewingOrder}
      />
    </div>
  );
}
