"use client";

import { useState, useEffect } from "react";
import { Star, Plus, Trash2, CheckCircle2, MessageSquare, ShieldAlert, Sparkles, Filter, X } from "lucide-react";
import toast from "react-hot-toast";
import { PRODUCTS } from "@/constants/products";
import { INITIAL_REVIEWS } from "@/constants/reviews";
import { adminApi } from "@/services/admin.api";

export default function ReviewsManagerSection() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterProductId, setFilterProductId] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom Review Form State
  const [formData, setFormData] = useState({
    productId: "kln-hair-oil-01",
    authorName: "Dr. Ananya Sharma",
    rating: 5,
    title: "Remarkable results in hair density and root strength!",
    comment: "I have been recommending this authentic Kshirapaka formulation to my clients. The natural herbs deeply nourish scalp follicles without clogging pores.",
    verifiedBuyer: true,
    helpfulCount: 24,
    date: "August 25, 2026",
  });

  // Load reviews on mount
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    let customReviews = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kln_custom_reviews");
        if (stored) {
          customReviews = JSON.parse(stored);
        }
      } catch (e) {}
    }

    try {
      const res = await adminApi.getReviews();
      const apiList = res?.data || [];
      const combined = [...customReviews, ...apiList];
      
      // Deduplicate by ID
      const unique = Array.from(new Map(combined.map((item) => [item.id || item._id, item])).values());
      setReviews(unique.length > 0 ? unique : [...customReviews, ...INITIAL_REVIEWS]);
    } catch (e) {
      setReviews(customReviews.length > 0 ? [...customReviews, ...INITIAL_REVIEWS] : INITIAL_REVIEWS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomReview = async (e) => {
    e.preventDefault();

    if (!formData.authorName.trim() || !formData.comment.trim()) {
      toast.error("Please enter author name and review text.");
      return;
    }

    const matchedProduct = PRODUCTS.find((p) => p.id === formData.productId) || PRODUCTS[0];
    const newReview = {
      id: `rev-custom-${Date.now()}`,
      productId: matchedProduct.id,
      productName: matchedProduct.name,
      userName: formData.authorName,
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      rating: Number(formData.rating),
      date: formData.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      verifiedPurchase: formData.verifiedBuyer,
      title: formData.title || "Custom Review",
      comment: formData.comment,
      helpfulCount: Number(formData.helpfulCount) || 12,
      isCustomAdmin: true,
    };

    // Save to local storage for instant PDP display
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kln_custom_reviews");
        const currentList = stored ? JSON.parse(stored) : [];
        const updatedList = [newReview, ...currentList];
        localStorage.setItem("kln_custom_reviews", JSON.stringify(updatedList));
      } catch (e) {}
    }

    // Try saving to backend API
    try {
      await adminApi.createReview({
        productId: matchedProduct.id,
        authorName: formData.authorName,
        userName: formData.authorName,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        verifiedBuyer: formData.verifiedBuyer,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Backend admin review API note:", e);
    }

    setReviews((prev) => [newReview, ...prev]);
    toast.success("Custom review published successfully! ✨", { icon: "⭐" });
    setIsModalOpen(false);

    // Reset form
    setFormData({
      productId: "kln-hair-oil-01",
      authorName: "Ananya Sharma",
      rating: 5,
      title: "Excellent formulation and soothing aroma!",
      comment: "Very pleased with the noticeable hair growth and shine.",
      verifiedBuyer: true,
      helpfulCount: 15,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    });
  };

  const handleDeleteReview = async (id) => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("kln_custom_reviews");
        if (stored) {
          const currentList = JSON.parse(stored);
          const updated = currentList.filter((r) => r.id !== id);
          localStorage.setItem("kln_custom_reviews", JSON.stringify(updated));
        }
      }

      await adminApi.deleteReview(id).catch(() => {});
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review removed.", { icon: "🗑️" });
    } catch (e) {
      toast.error("Failed to delete review.");
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterProductId === "all") return true;
    return r.productId === filterProductId || r.product?.id === filterProductId;
  });

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#2F5D34] text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Admin Tools
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123] mt-1">
            Reviews & Testimonials Manager
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-0.5">
            Curate, add custom testimonials under any reviewer name, and manage product reviews.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Custom Review</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600">
          <Filter className="w-4 h-4 text-[#2F5D34]" />
          <span>Filter Formulation:</span>
        </div>

        <select
          value={filterProductId}
          onChange={(e) => setFilterProductId(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#222123] outline-none focus:border-[#2F5D34]"
        >
          <option value="all">🌿 All Products ({reviews.length} Reviews)</option>
          {PRODUCTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews Table / Cards */}
      {isLoading ? (
        <div className="text-center py-12">
          <span className="text-4xl animate-bounce">🌿</span>
          <p className="text-xs font-bold text-[#2F5D34] mt-2">Loading Reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-gray-700">No Reviews Found</h4>
          <p className="text-xs text-gray-500 font-paragraph mt-1">Click "+ Add Custom Review" to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const matchedP = PRODUCTS.find((p) => p.id === rev.productId) || rev.product;
            const author = rev.userName || rev.authorName || rev.user?.firstName || "Customer";
            const ratingNum = Number(rev.rating) || 5;

            return (
              <div
                key={rev.id || rev._id}
                className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-[#2F5D34]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8F2E3] text-[#2F5D34] text-[10px] font-bold uppercase tracking-wider">
                      {matchedP?.name || "Ayurvedic Product"}
                    </span>
                    {rev.verifiedPurchase && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                    {rev.isCustomAdmin && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                        ⭐ Admin Curated
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-[#222123]">{author}</h4>
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < ratingNum ? "fill-amber-400 text-amber-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 font-paragraph">{rev.date || "August 2026"}</span>
                  </div>

                  {rev.title && <p className="text-xs font-bold text-gray-800">{rev.title}</p>}
                  <p className="text-xs text-gray-600 font-paragraph leading-relaxed">{rev.comment}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleDeleteReview(rev.id || rev._id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white transition-all text-rose-600 cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#2F5D34] text-white text-[10px] font-bold uppercase tracking-widest">
                ⭐ Admin Panel Review Creator
              </span>
            </div>

            <h3 className="text-2xl font-bold text-[#222123] mb-1">
              Add Custom Customer Review
            </h3>
            <p className="text-xs text-gray-500 font-paragraph mb-6">
              Create a custom testimonial under any reviewer name to highlight key benefits.
            </p>

            <form onSubmit={handleAddCustomReview} className="space-y-4">
              {/* Product Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Target Product Formulation *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-[#222123] outline-none focus:border-[#2F5D34]"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Author / Reviewer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Reviewer / Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="e.g. Dr. Sneha Sharma, Aarav Patel, Priya V."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                />
              </div>

              {/* Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Star Rating (1 to 5 Stars) *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        formData.rating === star
                          ? "bg-[#2F5D34] text-white border-[#2F5D34]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span>{star}</span>
                      <Star className={`w-3.5 h-3.5 ${formData.rating === star ? "fill-amber-300 text-amber-300" : "text-amber-400"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Headline */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Review Headline / Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Visible reduction in hair fall within 3 weeks!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Review Body / Testimonial *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Write the custom review content here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-[#2F5D34]"
                />
              </div>

              {/* Verified Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="verifiedBuyer"
                  checked={formData.verifiedBuyer}
                  onChange={(e) => setFormData({ ...formData, verifiedBuyer: e.target.checked })}
                  className="w-4 h-4 accent-[#2F5D34] cursor-pointer"
                />
                <label htmlFor="verifiedBuyer" className="text-xs font-bold text-gray-700 cursor-pointer">
                  Mark as Verified Purchase Badge
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-full border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#2F5D34] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#224426] transition-all"
                >
                  Publish Custom Review ⭐
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
