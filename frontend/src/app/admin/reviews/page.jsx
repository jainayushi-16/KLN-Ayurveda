"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import Badge from "@/components/admin/common/Badge";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/reviews");
      if (res.success) {
        setReviews(res.data || []);
      }
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/reviews/${id}`);
      toast.success("Review removed successfully");
      fetchReviews();
    } catch (err) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div>
            <h3 className="text-base font-bold text-[#f5f8f6]">Review Moderation</h3>
            <p className="text-xs text-[#6b8277]">Customer product ratings, photos, videos, and comments</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Review Comment</th>
                <th>Media</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-6">
                    Loading customer reviews...
                  </td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((rev) => (
                  <tr key={rev.id}>
                    <td className="font-bold text-[#f5f8f6]">
                      {rev.user ? `${rev.user.firstName || ""} ${rev.user.lastName || ""}`.trim() : rev.userName || "Customer"}
                    </td>
                    <td className="text-xs text-[#e8c88a]">{rev.product?.name || "Ayurvedic Hair Product"}</td>
                    <td>
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                        <Star size={14} className="fill-current" />
                        <span>{rev.rating} / 5</span>
                      </div>
                    </td>
                    <td className="text-xs text-gray-300 max-w-sm leading-relaxed">
                      {rev.comment}
                    </td>
                    <td className="text-xs">
                      {rev.images?.length > 0 || rev.videos?.length > 0 ? (
                        <span className="text-emerald-400 font-bold">
                          📷 {rev.images?.length || 0} Photos, 🎥 {rev.videos?.length || 0} Videos
                        </span>
                      ) : (
                        <span className="text-gray-500">Text only</span>
                      )}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No customer reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
