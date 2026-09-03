"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "@/services/axiosClient";
import Badge from "@/components/admin/common/Badge";
import InvoiceModal from "@/components/admin/invoices/InvoiceModal";
import { CreditCard, Eye, Search, Filter, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function PaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/orders?limit=100");
      if (res && (res.success || res.data)) {
        setOrders(res.data || res.orders || []);
      }
    } catch (err) {
      toast.error("Failed to load payment transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Client-side dynamic multi-filter matching
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Payment status filter
      if (statusFilter !== "ALL" && ord.paymentStatus !== statusFilter) return false;

      // Method filter
      if (methodFilter !== "ALL" && (ord.paymentMethod || "").toLowerCase() !== methodFilter.toLowerCase()) return false;

      // Search query
      if (search) {
        const term = search.toLowerCase();
        const num = (ord.orderNumber || "").toLowerCase();
        const custName = (ord.user ? `${ord.user.firstName || ""} ${ord.user.lastName || ""}` : "").toLowerCase();
        if (!num.includes(term) && !custName.includes(term)) return false;
      }

      return true;
    });
  }, [orders, search, statusFilter, methodFilter]);

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="search-input-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search payment logs by Order # or Customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              style={{ width: "170px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">💳 All Payment Statuses</option>
              {paymentStatuses.map((ps) => (
                <option key={ps} value={ps}>{ps}</option>
              ))}
            </select>

            <select
              className="form-control"
              style={{ width: "160px" }}
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="ALL">🌐 All Gateways</option>
              <option value="Online">Online / Card / UPI</option>
              <option value="COD">Cash On Delivery (COD)</option>
            </select>
          </div>

          <button className="btn-secondary" onClick={fetchPayments}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Payment Gateway</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    Loading payment transaction logs...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td style={{ fontWeight: "800", color: "var(--accent-emerald)", fontFamily: "monospace" }}>#{ord.orderNumber}</td>
                    <td style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                      {ord.user ? `${ord.user.firstName || ""} ${ord.user.lastName || ""}`.trim() : "Customer"}
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      <span style={{ display: "inline-flex", items: "center", gap: "0.25rem" }}>
                        <CreditCard size={14} style={{ color: "var(--accent-emerald)" }} />
                        <span>{ord.paymentMethod || "Online Gateway"}</span>
                      </span>
                    </td>
                    <td style={{ fontWeight: "800", color: "var(--text-primary)" }}>₹{ord.totalAmount.toFixed(2)}</td>
                    <td>
                      <Badge type={ord.paymentStatus} text={ord.paymentStatus} />
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="btn-secondary"
                        style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                      >
                        <Eye size={14} />
                        <span>Tax Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    No payment logs found matching active filters.
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
