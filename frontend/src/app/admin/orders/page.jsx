"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "@/services/axiosClient";
import Pagination from "@/components/admin/common/Pagination";
import InvoiceModal from "@/components/admin/invoices/InvoiceModal";
import Badge from "@/components/admin/common/Badge";
import { Search, Eye, ShoppingBag, Truck, CheckCircle2, RotateCcw, Filter } from "lucide-react";
import toast from "react-hot-toast";

const orderStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [returnFilter, setReturnFilter] = useState("ALL"); // ALL, RETURN_REQUESTED
  const [loading, setLoading] = useState(true);

  const [viewingOrder, setViewingOrder] = useState(null);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/admin/orders?page=${page}&limit=50&status=${selectedStatus}&search=${search}`);
      if (res && (res.success || res.data)) {
        const list = res.data || res.orders || [];
        setOrders(list);
        setPagination(res.pagination || { page: 1, totalPages: 1, totalItems: list.length });
      }
    } catch (err) {
      toast.error("Failed to load store orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [search, selectedStatus]);

  // Client-side dynamic multi-filter matching
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Payment status filter
      if (selectedPaymentStatus && ord.paymentStatus !== selectedPaymentStatus) return false;

      // Return filter
      if (returnFilter === "RETURN_REQUESTED" && !ord.returnReason) return false;

      return true;
    });
  }, [orders, selectedPaymentStatus, returnFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus} 🌿`);
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
      toast.success(isApproved ? "Return request APPROVED! Refund processed." : "Return request REJECTED.");
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.message || "Failed to process return request");
    }
  };

  return (
    <div>
      {/* Table Toolbar with Multi-Filter controls */}
      <div className="card-table-wrapper">
        <div className="table-toolbar flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            {/* Search */}
            <div className="search-input-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search by Order # or Customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Delivery Status Filter */}
            <select
              className="form-control"
              style={{ width: "170px" }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">🚚 All Delivery Statuses</option>
              {orderStatuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* Payment Status Filter */}
            <select
              className="form-control"
              style={{ width: "170px" }}
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            >
              <option value="">💳 All Payment Statuses</option>
              {paymentStatuses.map((ps) => (
                <option key={ps} value={ps}>{ps}</option>
              ))}
            </select>

            {/* Return Filter */}
            <select
              className="form-control"
              style={{ width: "160px" }}
              value={returnFilter}
              onChange={(e) => setReturnFilter(e.target.value)}
            >
              <option value="ALL">🔄 All Orders</option>
              <option value="RETURN_REQUESTED">Return Requested</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer Details</th>
                <th>Date</th>
                <th>Total (₹)</th>
                <th>Payment Status</th>
                <th>Order Delivery Status</th>
                <th>Return Requests</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    Loading store orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => {
                  const customerName = ord.user
                    ? `${ord.user.firstName || ""} ${ord.user.lastName || ""}`.trim()
                    : "Customer";
                  return (
                    <tr key={ord.id}>
                      <td style={{ fontWeight: "800", color: "var(--accent-emerald)", fontFamily: "monospace" }}>
                        #{ord.orderNumber}
                      </td>
                      <td>
                        <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>{customerName}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{ord.user?.email}</div>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ fontWeight: "800", color: "var(--text-primary)" }}>
                        ₹{ord.totalAmount.toFixed(2)}
                      </td>
                      <td>
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value)}
                          className="form-control"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", fontWeight: "700", width: "120px" }}
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
                          className="form-control"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", fontWeight: "700", width: "135px" }}
                        >
                          {orderStatuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {ord.returnReason ? (
                          <div style={{ fontSize: "0.75rem" }}>
                            <div style={{ color: "#D97706", fontWeight: "700", marginBottom: "0.2rem" }}>
                              Reason: {ord.returnReason}
                            </div>
                            <div style={{ display: "flex", gap: "0.25rem" }}>
                              <button
                                onClick={() => handleReturnAction(ord.id, true)}
                                style={{ padding: "0.2rem 0.5rem", borderRadius: "6px", background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", fontSize: "0.7rem", fontWeight: "800", cursor: "pointer" }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReturnAction(ord.id, false)}
                                style={{ padding: "0.2rem 0.5rem", borderRadius: "6px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", fontSize: "0.7rem", fontWeight: "800", cursor: "pointer" }}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>None</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => setViewingOrder(ord)}
                          className="btn-secondary"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                        >
                          <Eye size={14} />
                          <span>Tax Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    No orders found matching active filters.
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
