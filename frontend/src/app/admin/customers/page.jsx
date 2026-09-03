"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "@/services/axiosClient";
import Modal from "@/components/admin/common/Modal";
import Badge from "@/components/admin/common/Badge";
import { Search, Eye, Users, RefreshCw, Filter, ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL, CUSTOMER, ADMIN
  const [sortBy, setSortBy] = useState("NEWEST"); // NEWEST, OLDEST, MOST_ORDERS
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/customers");
      if (res && (res.success || res.data)) {
        setCustomers(res.data || res.customers || []);
      }
    } catch (err) {
      toast.error("Failed to load customer directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Client-side dynamic multi-filter matching & sorting
  const filteredCustomers = useMemo(() => {
    let list = customers.filter((c) => {
      // Role filter
      if (roleFilter !== "ALL" && (c.role || "").toUpperCase() !== roleFilter) return false;

      // Search query
      if (search) {
        const term = search.toLowerCase();
        const name = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
        const email = (c.email || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        if (!name.includes(term) && !email.includes(term) && !phone.includes(term)) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sortBy === "NEWEST") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "OLDEST") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "MOST_ORDERS") {
      list.sort((a, b) => (b._count?.orders || b.orders?.length || 0) - (a._count?.orders || a.orders?.length || 0));
    }

    return list;
  }, [customers, search, roleFilter, sortBy]);

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="search-input-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search by Customer name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              style={{ width: "160px" }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">👥 All User Roles</option>
              <option value="CUSTOMER">Customers Only</option>
              <option value="ADMIN">System Admins Only</option>
            </select>

            <select
              className="form-control"
              style={{ width: "160px" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="NEWEST">📅 Sort: Newest First</option>
              <option value="OLDEST">📅 Sort: Oldest First</option>
              <option value="MOST_ORDERS">🛒 Sort: Most Orders</option>
            </select>
          </div>

          <button className="btn-secondary" onClick={fetchCustomers}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Member Since</th>
                <th>Total Orders</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    Loading customer directory...
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => {
                  const fullName = `${cust.firstName || ""} ${cust.lastName || ""}`.trim() || "Customer";
                  return (
                    <tr key={cust.id}>
                      <td style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                        {fullName}
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{cust.email}</td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{cust.phone || "-"}</td>
                      <td>
                        <Badge type={cust.role} text={cust.role} />
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        {new Date(cust.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>
                        {cust._count?.orders || cust.orders?.length || 0} Orders
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="btn-secondary"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                        >
                          <Eye size={14} />
                          <span>View Record</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    No customer records found matching active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Record Modal */}
      <Modal
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title="Customer Directory Record"
        maxWidth="500px"
      >
        {selectedCustomer && (
          <div style={{ fontSize: "0.85rem" }}>
            <div style={{ background: "rgba(47, 93, 52, 0.05)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", marginBottom: "1rem" }}>
              <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </div>
              <div style={{ marginBottom: "0.3rem" }}>Email: <strong>{selectedCustomer.email}</strong></div>
              <div style={{ marginBottom: "0.3rem" }}>Phone: <strong>{selectedCustomer.phone || "N/A"}</strong></div>
              <div style={{ marginBottom: "0.3rem" }}>Role: <Badge type={selectedCustomer.role} text={selectedCustomer.role} /></div>
              <div>Joined: <strong>{new Date(selectedCustomer.createdAt).toLocaleDateString()}</strong></div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setSelectedCustomer(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
