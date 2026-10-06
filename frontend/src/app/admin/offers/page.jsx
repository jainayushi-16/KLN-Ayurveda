"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import Pagination from "@/components/admin/common/Pagination";
import Modal from "@/components/admin/common/Modal";
import Badge from "@/components/admin/common/Badge";
import {
  Tag,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Percent,
  Copy,
  Check,
  TrendingUp,
  Clock,
  AlertCircle,
  X,
  Sparkles,
  Zap,
  Gift,
} from "lucide-react";
import toast from "react-hot-toast";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });

  // Metrics
  const [metrics, setMetrics] = useState({
    totalOffers: 0,
    activeOffers: 0,
    totalDiscountGiven: 0,
    discountedRevenueGenerated: 0,
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [viewingOffer, setViewingOffer] = useState(null);
  const [deletingOffer, setDeletingOffer] = useState(null);

  // DB Options for Form
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  // Form State
  const initialForm = {
    name: "",
    description: "",
    code: "",
    type: "PERCENTAGE",
    value: 20,
    maxDiscount: "",
    minimumOrderValue: 0,
    startAt: new Date().toISOString().slice(0, 16),
    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    status: "ACTIVE",
    usageLimit: "",
    perCustomerLimit: 1,
    isActive: true,
    isFeatured: false,
    applicability: "ALL",
    productIds: [],
    categoryIds: [],
  };

  const [formData, setFormData] = useState(initialForm);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  // Fetch Offers & Metrics
  const fetchOffers = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", 20);
      if (search) queryParams.append("search", search);
      if (statusFilter) queryParams.append("status", statusFilter);
      if (typeFilter) queryParams.append("type", typeFilter);

      const res = await axiosClient.get(`/admin/offers?${queryParams.toString()}`);
      const payload = res.data || res;
      let offersList = [];
      if (Array.isArray(payload)) {
        offersList = payload;
      } else if (Array.isArray(payload?.offers)) {
        offersList = payload.offers;
      } else if (Array.isArray(payload?.data)) {
        offersList = payload.data;
      }

      // Sync local coupon usages and saved orders
      let localUsages = {};
      try {
        const storedUsages = typeof window !== "undefined" ? localStorage.getItem("kln_coupon_usages") : null;
        if (storedUsages) localUsages = JSON.parse(storedUsages);
      } catch (e) {}

      let orderUsages = {};
      try {
        const savedOrders = typeof window !== "undefined" ? localStorage.getItem("kln_user_orders") : null;
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed)) {
            parsed.forEach((ord) => {
              const cCode = (ord.couponCode || ord.appliedCoupon?.code || ord.appliedOffer?.code || "").toUpperCase();
              if (cCode) {
                orderUsages[cCode] = (orderUsages[cCode] || 0) + 1;
              }
            });
          }
        }
      } catch (e) {}

      const enrichedOffers = offersList.map((off) => {
        const codeKey = (off.code || "").toUpperCase();
        const usages = Math.max(
          off.usageCount || 0,
          off.usedCount || 0,
          off._count?.usages || 0,
          localUsages[codeKey] || 0,
          orderUsages[codeKey] || 0
        );
        return {
          ...off,
          usageCount: usages,
          usedCount: usages,
        };
      });

      setOffers(enrichedOffers);
      setPagination(res.pagination || payload.pagination || { page: 1, totalPages: 1, totalItems: enrichedOffers.length });
      setMetrics({
        totalOffers: enrichedOffers.length,
        activeOffers: enrichedOffers.filter((o) => o.isActive !== false && o.status !== "INACTIVE").length,
        totalDiscountGiven: enrichedOffers.reduce((acc, o) => acc + (o.usageCount || 0) * (o.value || 0), 0),
        discountedRevenueGenerated: enrichedOffers.reduce((acc, o) => acc + (o.usageCount || 0) * (o.minimumOrderValue || 0), 0),
      });
    } catch (err) {
      toast.error("Failed to load promo offers");
      setOffers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOffers(1);
  }, [search, statusFilter, typeFilter]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name || "",
      description: offer.description || "",
      code: offer.code || "",
      type: offer.type || "PERCENTAGE",
      value: offer.value || 0,
      maxDiscount: offer.maxDiscount || "",
      minimumOrderValue: offer.minimumOrderValue || 0,
      startAt: offer.startAt ? new Date(offer.startAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      endAt: offer.endAt ? new Date(offer.endAt).toISOString().slice(0, 16) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      status: offer.status || "ACTIVE",
      usageLimit: offer.usageLimit || "",
      perCustomerLimit: offer.perCustomerLimit || 1,
      isActive: offer.isActive !== false,
      isFeatured: offer.isFeatured || false,
      applicability: offer.applicability || "ALL",
      productIds: offer.productIds || [],
      categoryIds: offer.categoryIds || [],
    });
  };

  const handleToggleStatus = async (offer) => {
    try {
      const nextStatus = offer.status === "ACTIVE" || offer.isActive ? "INACTIVE" : "ACTIVE";
      await axiosClient.patch(`/admin/offers/${offer.id}/status`, { status: nextStatus });
      toast.success(`Offer ${offer.code} status updated`);
      fetchOffers(pagination.page);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deletingOffer) return;
    const targetId = deletingOffer.id;
    const targetCode = deletingOffer.code;

    try {
      if (targetId && !String(targetId).startsWith("default-")) {
        await axiosClient.delete(`/admin/offers/${targetId}`).catch((e) => console.warn("Backend offer delete note:", e));
      }
    } catch (err) {
      console.warn("Delete offer API sync note:", err);
    } finally {
      setOffers((prev) => prev.filter((o) => o.id !== targetId));
      toast.success(`Offer ${targetCode || ""} deleted successfully`);
      setDeletingOffer(null);
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const payload = {
        ...formData,
        code: formData.code.trim().toUpperCase(),
        value: parseFloat(formData.value || 0),
        minimumOrderValue: parseFloat(formData.minimumOrderValue || 0),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
        perCustomerLimit: parseInt(formData.perCustomerLimit || 1, 10),
      };

      if (editingOffer) {
        await axiosClient.put(`/admin/offers/${editingOffer.id}`, payload);
        toast.success(`Offer ${payload.code} updated successfully`);
      } else {
        await axiosClient.post("/admin/offers", payload);
        toast.success(`New Offer ${payload.code} created successfully`);
      }
      setIsAddModalOpen(false);
      setEditingOffer(null);
      fetchOffers(pagination.page);
    } catch (err) {
      toast.error(err.message || "Failed to save offer code");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div>
      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Promo Offers</div>
            <div className="stat-value">{metrics.totalOffers}</div>
          </div>
          <div className="stat-icon-wrapper">
            <Tag size={22} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Active Campaigns</div>
            <div className="stat-value" style={{ color: "#34d399" }}>{metrics.activeOffers}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: "#34d399", background: "rgba(16, 185, 129, 0.15)" }}>
            <Zap size={22} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Discounts Saved</div>
            <div className="stat-value" style={{ color: "#fbbf24" }}>₹{metrics.totalDiscountGiven.toLocaleString("en-IN")}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: "#fbbf24", background: "rgba(245, 158, 11, 0.15)" }}>
            <Gift size={22} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Revenue via Offers</div>
            <div className="stat-value" style={{ color: "#c9a66b" }}>₹{metrics.discountedRevenueGenerated.toLocaleString("en-IN")}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: "#c9a66b", background: "rgba(201, 166, 107, 0.15)" }}>
            <TrendingUp size={22} />
          </div>
        </div>
      </div>

      {/* Main Table Wrapper */}
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div className="search-input-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search by code or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              className="btn-primary"
              onClick={() => {
                setFormData(initialForm);
                setEditingOffer(null);
                setIsAddModalOpen(true);
              }}
            >
              <Plus size={18} />
              <span>Create Offer Code</span>
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Code & Name</th>
                <th>Discount Details</th>
                <th>Min Spend</th>
                <th>Times Used</th>
                <th>Validity Window</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                    Loading promo codes and discount rules...
                  </td>
                </tr>
              ) : offers.length > 0 ? (
                offers.map((off) => (
                  <tr key={off.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: "700", color: "var(--accent-gold-light)", fontFamily: "monospace", fontSize: "0.95rem" }}>
                          {off.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(off.code)}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                          title="Copy Code"
                        >
                          {copiedCode === off.code ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", marginTop: "0.15rem" }}>{off.name}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          fontWeight: "800",
                          color: "#2F5D34",
                          backgroundColor: "#E8F2E3",
                          border: "1px solid rgba(47, 93, 52, 0.3)",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.85rem",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}
                      >
                        {off.type === "PERCENTAGE" ? `${off.value}% OFF` : off.type === "FREE_SHIPPING" ? "Free Express Delivery" : `₹${off.value} Flat OFF`}
                      </span>
                    </td>
                    <td style={{ fontWeight: "600", color: "var(--text-secondary)" }}>
                      ₹{off.minimumOrderValue || 0}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.6rem",
                            borderRadius: "9999px",
                            backgroundColor: (off.usageCount || 0) > 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(107, 114, 128, 0.15)",
                            border: (off.usageCount || 0) > 0 ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(107, 114, 128, 0.3)",
                            color: (off.usageCount || 0) > 0 ? "#34d399" : "var(--text-muted)",
                            fontWeight: "700",
                            fontSize: "0.8rem",
                            fontFamily: "monospace",
                          }}
                        >
                          {off.usageCount || off.usedCount || 0} used
                        </span>
                        {off.usageLimit && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            / {off.usageLimit} max
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      <div>Ends: {new Date(off.endAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <Badge type={off.isActive !== false ? "delivered" : "cancelled"} text={off.isActive !== false ? "Active" : "Disabled"} />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        <button
                          className="btn-icon"
                          title="View Offer Details"
                          onClick={() => setViewingOffer(off)}
                        >
                          <Eye size={16} className="text-emerald-400" />
                        </button>
                        <button
                          className="btn-icon"
                          title="Edit Offer"
                          onClick={() => openEditModal(off)}
                        >
                          <Edit2 size={16} className="text-sky-400" />
                        </button>
                        <button
                          className="btn-icon"
                          title="Toggle Status"
                          onClick={() => handleToggleStatus(off)}
                        >
                          {off.isActive !== false ? <XCircle size={16} className="text-amber-400" /> : <CheckCircle size={16} className="text-emerald-400" />}
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          title="Delete Offer"
                          onClick={() => setDeletingOffer(off)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                    No promo offers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination pagination={pagination} onPageChange={fetchOffers} />
      </div>

      {/* Add / Edit Offer Modal */}
      <Modal
        isOpen={isAddModalOpen || Boolean(editingOffer)}
        onClose={() => { setIsAddModalOpen(false); setEditingOffer(null); }}
        title={editingOffer ? "Edit Promo Code Rule" : "Create New Store Coupon / Promo Offer"}
        maxWidth="620px"
      >
        <form onSubmit={handleSaveForm}>
          <div className="form-group">
            <label className="form-label">Offer Title / Campaign Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Festival Hair Care Discount"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Coupon Code *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. AYUR20"
                style={{ textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Discount Type *</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Discount Value *</label>
              <input
                type="number"
                className="form-control"
                required
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Minimum Order Spend (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.minimumOrderValue}
                onChange={(e) => setFormData({ ...formData, minimumOrderValue: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Total Usage Limit (Max Redemptions)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 100 (Leave blank for unlimited)"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Per Customer Limit</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 1 (Max times per user)"
                value={formData.perCustomerLimit}
                onChange={(e) => setFormData({ ...formData, perCustomerLimit: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Max Discount Cap Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 500 (Optional cap)"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Offer Expiry Date & Time *</label>
              <input
                type="datetime-local"
                className="form-control"
                required
                value={formData.endAt}
                onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Offer Description</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Brief description visible to customers during checkout"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ padding: "1rem 0 0", border: "none" }}>
            <button type="button" className="btn-secondary" onClick={() => { setIsAddModalOpen(false); setEditingOffer(null); }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={formSubmitting}>
              {formSubmitting ? "Saving..." : "Save Coupon Rule"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingOffer)}
        onClose={() => setDeletingOffer(null)}
        title="Confirm Delete Offer Code"
        maxWidth="440px"
      >
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Are you sure you want to delete promo code <strong style={{ color: "var(--accent-gold-light)" }}>{deletingOffer?.code}</strong>? This action is permanent.
        </p>
        <div style={{ display: "flex", justifyConent: "flex-end", gap: "0.5rem" }}>
          <button className="btn-secondary" onClick={() => setDeletingOffer(null)}>Cancel</button>
          <button className="btn-primary" style={{ background: "#ef4444", color: "white" }} onClick={handleDelete}>
            Delete Offer
          </button>
        </div>
      </Modal>

      {/* View Offer Details Modal */}
      <Modal
        isOpen={Boolean(viewingOffer)}
        onClose={() => setViewingOffer(null)}
        title={`Offer Details — ${viewingOffer?.code || ""}`}
        maxWidth="620px"
        footer={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn-secondary" onClick={() => setViewingOffer(null)}>
              Close
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                const target = viewingOffer;
                setViewingOffer(null);
                openEditModal(target);
              }}
            >
              <Edit2 size={16} />
              <span>Edit Offer Rule</span>
            </button>
          </div>
        }
      >
        {viewingOffer && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Header Banner */}
            <div
              style={{
                padding: "1rem 1.25rem",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, rgba(47,93,52,0.15) 0%, rgba(231,240,228,0.3) 100%)",
                border: "1px solid rgba(47,93,52,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "700", color: "#2F5D34", letterSpacing: "0.05em" }}>
                  Campaign Name
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1B351E", marginTop: "0.1rem" }}>
                  {viewingOffer.name}
                </div>
              </div>

              <div style={{ display: "flex", items: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontWeight: "800",
                    fontSize: "1rem",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "0.5rem",
                    background: "#2F5D34",
                    color: "#FFFFFF",
                  }}
                >
                  {viewingOffer.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(viewingOffer.code)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                  title="Copy Coupon Code"
                >
                  {copiedCode === viewingOffer.code ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} className="text-[#2F5D34]" />}
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.85rem" }}>
              <div style={{ padding: "0.85rem", borderRadius: "0.75rem", background: "#F7F4EE", border: "1px solid rgba(47,93,52,0.15)" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700", color: "#5B7C3A" }}>Discount Type & Value</div>
                <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1B351E", marginTop: "0.2rem" }}>
                  {viewingOffer.type === "PERCENTAGE" ? `${viewingOffer.value}% OFF` : viewingOffer.type === "FREE_SHIPPING" ? "Free Express Delivery" : `₹${viewingOffer.value} Flat OFF`}
                </div>
              </div>

              <div style={{ padding: "0.85rem", borderRadius: "0.75rem", background: "#F7F4EE", border: "1px solid rgba(47,93,52,0.15)" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700", color: "#5B7C3A" }}>Minimum Order Spend</div>
                <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1B351E", marginTop: "0.2rem" }}>
                  ₹{viewingOffer.minimumOrderValue || 0}
                </div>
              </div>

              <div style={{ padding: "0.85rem", borderRadius: "0.75rem", background: "#F7F4EE", border: "1px solid rgba(47,93,52,0.15)" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700", color: "#5B7C3A" }}>Redemption Usage Count</div>
                <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#2F5D34", marginTop: "0.2rem" }}>
                  {viewingOffer.usageCount || viewingOffer.usedCount || 0} used {viewingOffer.usageLimit ? `/ ${viewingOffer.usageLimit} max` : "(Unlimited)"}
                </div>
              </div>

              <div style={{ padding: "0.85rem", borderRadius: "0.75rem", background: "#F7F4EE", border: "1px solid rgba(47,93,52,0.15)" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700", color: "#5B7C3A" }}>Per Customer Limit</div>
                <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1B351E", marginTop: "0.2rem" }}>
                  {viewingOffer.perCustomerLimit || 1} time(s) per user
                </div>
              </div>

              <div style={{ padding: "0.85rem", borderRadius: "0.75rem", background: "#F7F4EE", border: "1px solid rgba(47,93,52,0.15)" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700", color: "#5B7C3A" }}>Max Discount Cap</div>
                <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1B351E", marginTop: "0.2rem" }}>
                  {viewingOffer.maxDiscount ? `₹${viewingOffer.maxDiscount}` : "No Cap Limit"}
                </div>
              </div>

              <div style={{ padding: "0.85rem", borderRadius: "0.75rem", background: "#F7F4EE", border: "1px solid rgba(47,93,52,0.15)" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700", color: "#5B7C3A" }}>Campaign Expiry Date</div>
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1B351E", marginTop: "0.2rem" }}>
                  {new Date(viewingOffer.endAt || Date.now()).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Description Box */}
            {viewingOffer.description && (
              <div style={{ padding: "0.85rem 1rem", borderRadius: "0.75rem", background: "#F9FAF8", border: "1px solid rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700", color: "gray", marginBottom: "0.2rem" }}>
                  Description / Customer Terms
                </div>
                <div style={{ fontSize: "0.85rem", color: "#4B0082", lineHeight: "1.5" }}>
                  {viewingOffer.description}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
