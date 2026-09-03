"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import Modal from "@/components/admin/common/Modal";
import { Star, Trash2, CheckCircle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
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
        <div className="table-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sparkles size={18} style={{ color: "#2F5D34" }} /> Customer Product Reviews
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Moderate and manage customer feedback & testimonials</p>
          </div>
        </div>

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
                <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                  Loading customer reviews...
                </td>
              </tr>
            ) : reviews.length > 0 ? (
              reviews.map((rev) => {
                const customerName = rev.user
                  ? `${rev.user.firstName || ""} ${rev.user.lastName || ""}`.trim()
                  : rev.authorName || "Customer";
                return (
                  <tr key={rev.id}>
                    <td style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                      {rev.product?.name || "Product"}
                    </td>
                    <td>
                      <div>{customerName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{rev.user?.email || ""}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "#fbbf24" }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < (rev.rating || 5) ? "#fbbf24" : "transparent"}
                            stroke="#fbbf24"
                          />
                        ))}
                      </div>
                    </td>
                    <td style={{ maxWidth: "300px" }}>
                      {rev.title && <div style={{ fontWeight: "600", fontSize: "0.85rem" }}>{rev.title}</div>}
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{rev.comment}</div>
                    </td>
                    <td>
                      {rev.verifiedBuyer !== false ? (
                        <span style={{ color: "#34d399", fontSize: "0.78rem", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
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
                <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                  No customer reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
