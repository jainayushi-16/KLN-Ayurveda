"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "@/services/axiosClient";
import Badge from "@/components/admin/common/Badge";
import InvoiceModal from "@/components/admin/invoices/InvoiceModal";
import { CreditCard, Eye, Search, Filter, RefreshCw, RotateCcw } from "lucide-react";
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
      const methodUpper = String(ord.paymentMethod || "").trim().toUpperCase();
      const isCod = methodUpper.includes("COD") || methodUpper.includes("CASH");
      const isOnline = !isCod;
      const statusUpper = String(ord.paymentStatus || "PENDING").trim().toUpperCase();
      const isPaid = statusUpper === "PAID";

      // 1. Payment Gateway / Method filter
      if (methodFilter !== "ALL") {
        if (methodFilter === "COD") {
          if (!isCod) return false;
        } else if (methodFilter === "Online") {
          if (!isOnline) return false;
        } else {
          // Specific method match (e.g. UPI, CARD, etc.)
          if (!methodUpper.includes(methodFilter.toUpperCase())) return false;
        }
      }

      // 2. Payment status filter
      if (statusFilter !== "ALL") {
        const target = statusFilter.toUpperCase();
        if (target === "PAID") {
          if (!isPaid) return false;
        } else if (target === "PENDING" || target === "UNPAID") {
          if (isPaid || statusUpper === "FAILED" || statusUpper === "REFUNDED") return false;
        } else if (target === "FAILED") {
          if (statusUpper !== "FAILED") return false;
        } else if (target === "REFUNDED") {
          if (statusUpper !== "REFUNDED") return false;
        } else if (statusUpper !== target) {
          return false;
        }
      }

      // 3. Search query (supports Order # with or without '#', Customer Name, Email, Phone, Txn ID)
      if (search && search.trim() !== "") {
        const rawTerm = search.toLowerCase().trim();
        const cleanTerm = rawTerm.startsWith("#") ? rawTerm.slice(1).trim() : rawTerm;
        const num = String(ord.orderNumber || "").toLowerCase();
        const custFirst = String(ord.user?.firstName || "").toLowerCase();
        const custLast = String(ord.user?.lastName || "").toLowerCase();
        const custFull = `${custFirst} ${custLast}`.trim();
        const shipName = String(ord.shippingAddress?.fullName || "").toLowerCase();
        const email = String(ord.user?.email || ord.shippingAddress?.email || "").toLowerCase();
        const phone = String(ord.user?.phone || ord.shippingAddress?.phone || "").toLowerCase();
        const method = methodUpper.toLowerCase();
        const txnId = String(ord.transactionId || ord.payment?.transactionId || "").toLowerCase();

        const matches =
          num.includes(cleanTerm) ||
          num.includes(rawTerm) ||
          custFull.includes(cleanTerm) ||
          shipName.includes(cleanTerm) ||
          email.includes(cleanTerm) ||
          phone.includes(cleanTerm) ||
          method.includes(cleanTerm) ||
          txnId.includes(cleanTerm);

        if (!matches) return false;
      }

      return true;
    });
  }, [orders, search, statusFilter, methodFilter]);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setMethodFilter("ALL");
  };

  const hasActiveFilters = Boolean(search || statusFilter !== "ALL" || methodFilter !== "ALL");

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
              style={{ width: "175px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">💳 All Payment Statuses</option>
              <option value="PAID">PAID</option>
              <option value="PENDING">PENDING / UNPAID</option>
              <option value="FAILED">FAILED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>

            <select
              className="form-control"
              style={{ width: "165px" }}
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="ALL">🌐 All Gateways</option>
              <option value="Online">Online / Card / UPI</option>
              <option value="COD">Cash On Delivery (COD)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="btn-secondary"
                style={{
                  background: "#FFE4E6",
                  color: "#E11D48",
                  borderColor: "rgba(225, 29, 72, 0.25)",
                  padding: "0.45rem 0.75rem",
                  fontSize: "0.78rem",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  cursor: "pointer",
                }}
                title="Reset all active filters"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#2F5D34", background: "#E7F0E4", padding: "0.35rem 0.85rem", borderRadius: "20px", whiteSpace: "nowrap" }}>
              Payments: {filteredOrders.length} / {orders.length}
            </span>

            <button className="btn-secondary" onClick={fetchPayments} title="Reload payment logs">
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
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
                filteredOrders.map((ord) => {
                  const methodUpper = (ord.paymentMethod || "").toUpperCase();
                  const isCod = methodUpper.includes("COD") || methodUpper.includes("CASH");
                  const isPaid = (ord.paymentStatus || "").toUpperCase() === "PAID";
                  const displayPaymentStatus = isPaid
                    ? "PAID"
                    : isCod
                    ? "UNPAID (Pay on Delivery)"
                    : (ord.paymentStatus || "PENDING");

                  return (
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
                        <Badge type={displayPaymentStatus} text={displayPaymentStatus} />
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
                );
              })
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
