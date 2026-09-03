"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "@/services/axiosClient";
import Modal from "@/components/admin/common/Modal";
import Badge from "@/components/admin/common/Badge";
import { Star, Trash2, CheckCircle, Sparkles, Search, Filter, RefreshCw, Leaf } from "lucide-react";
import toast from "react-hot-toast";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL"); // ALL, 5, 4, 3, 2, 1
  const [verifiedFilter, setVerifiedFilter] = useState("ALL"); // ALL, VERIFIED, UNVERIFIED
  const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    let loadedApiReviews = [];
    try {
      const res = await axiosClient.get("/admin/reviews");
      if (res && res.data) {
        loadedApiReviews = Array.isArray(res.data) ? res.data : (res.data.data || []);
      }
    } catch (err) {
      try {
        const publicRes = await axiosClient.get("/reviews");
        if (publicRes && publicRes.data) {
          loadedApiReviews = Array.isArray(publicRes.data) ? publicRes.data : (publicRes.data.data || []);
        }
      } catch (e) {}
    }

    let localReviews = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kln_custom_reviews");
        if (stored) localReviews = JSON.parse(stored);
      } catch (e) {}
    }

    const merged = [...localReviews, ...loadedApiReviews];
    const unique = Array.from(new Map(merged.map((r) => [r.id || r._id || r.comment, r])).values());
    setReviews(unique);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Client-side dynamic multi-filter matching
  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      // Rating filter
      if (ratingFilter !== "ALL" && Number(rev.rating) !== Number(ratingFilter)) return false;

      // Verified filter
      if (verifiedFilter === "VERIFIED" && rev.verifiedBuyer === false) return false;
      if (verifiedFilter === "UNVERIFIED" && rev.verifiedBuyer !== false) return false;

      // Search query
      if (search) {
        const term = search.toLowerCase();
        const custName = (rev.user ? `${rev.user.firstName || ""} ${rev.user.lastName || ""}` : rev.authorName || "").toLowerCase();
        const prodName = (rev.product?.name || "").toLowerCase();
        const comment = (rev.comment || "").toLowerCase();
        if (!custName.includes(term) && !prodName.includes(term) && !comment.includes(term)) {
          return false;
        }
      }

      return true;
    });
  }, [reviews, search, ratingFilter, verifiedFilter]);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("kln_custom_reviews");
          if (stored) {
            const list = JSON.parse(stored);
            const updated = list.filter((r) => r.id !== deletingId);
            localStorage.setItem("kln_custom_reviews", JSON.stringify(updated));
          }
        } catch (e) {}
      }

      await axiosClient.delete(`/admin/reviews/${deletingId}`).catch(() => {});
      toast.success("Review deleted successfully");
      setDeletingId(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            {/* Search */}
            <div className="search-input-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search reviews by customer or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Rating Filter */}
            <select
              className="form-control"
              style={{ width: "160px" }}
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="ALL">⭐ All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars Only</option>
              <option value="3">3 Stars Only</option>
              <option value="2">2 Stars Only</option>
              <option value="1">1 Star Only</option>
            </select>

            {/* Verified Buyer Filter */}
            <select
              className="form-control"
              style={{ width: "170px" }}
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
            >
              <option value="ALL">✔️ All Buyers</option>
              <option value="VERIFIED">Verified Buyers Only</option>
              <option value="UNVERIFIED">Unverified Only</option>
            </select>
          </div>

          <button className="btn-secondary" onClick={fetchReviews}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review Comment</th>
                <th>Verified Buyer</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    Loading customer reviews...
                  </td>
                </tr>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => {
                  const customerName = rev.user
                    ? `${rev.user.firstName || ""} ${rev.user.lastName || ""}`.trim()
                    : rev.authorName || "Customer";
                  return (
                    <tr key={rev.id}>
                      <td style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                        {rev.product?.name || "Ayurvedic Product"}
                      </td>
                      <td>
                        <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{customerName}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{rev.user?.email || ""}</div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "#D97706" }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < (rev.rating || 5) ? "#D97706" : "transparent"}
                              stroke="#D97706"
                            />
                          ))}
                        </div>
                      </td>
                      <td style={{ maxWidth: "300px" }}>
                        {rev.title && <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "var(--text-primary)" }}>{rev.title}</div>}
                        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{rev.comment}</div>
                      </td>
                      <td>
                        {rev.verifiedBuyer !== false ? (
                          <span style={{ color: "#059669", fontSize: "0.78rem", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                            <CheckCircle size={14} /> Verified Purchase
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Unverified</span>
                        )}
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                        {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn-icon btn-icon-danger"
                          title="Delete Review"
                          onClick={() => setDeletingId(rev.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    No customer reviews found matching active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Confirm Delete Review"
        maxWidth="450px"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDeletingId(null)}>Cancel</button>
            <button className="btn-primary" style={{ background: "#ef4444", color: "white" }} onClick={handleDelete}>
              Delete Review
            </button>
          </>
        }
      >
        <p style={{ color: "var(--text-secondary)" }}>
          Are you sure you want to delete this customer review?
        </p>
      </Modal>
    </div>
  );
}
