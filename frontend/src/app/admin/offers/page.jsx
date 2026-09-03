"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import Modal from "@/components/admin/common/Modal";
import Badge from "@/components/admin/common/Badge";
import { Plus, Tag, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENTAGE",
    value: 10,
    minimumOrderValue: 0,
    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    isActive: true,
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/offers");
      if (res.success) {
        setOffers(res.data || []);
      }
    } catch (err) {
      toast.error("Failed to load active offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        value: parseFloat(form.value),
        minimumOrderValue: parseFloat(form.minimumOrderValue),
        endAt: new Date(form.endAt).toISOString(),
      };
      if (editingOffer) {
        await axiosClient.put(`/offers/${editingOffer.id}`, payload);
        toast.success("Offer code updated successfully");
      } else {
        await axiosClient.post("/offers", payload);
        toast.success("New offer code created");
      }
      setIsModalOpen(false);
      setEditingOffer(null);
      fetchOffers();
    } catch (err) {
      toast.error(err.message || "Failed to save offer");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/offers/${id}`);
      toast.success("Offer deleted successfully");
      fetchOffers();
    } catch (err) {
      toast.error(err.message || "Failed to delete offer");
    }
  };

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div>
            <h3 className="text-base font-bold text-[#f5f8f6]">Offers & Discount Codes</h3>
            <p className="text-xs text-[#6b8277]">Create and manage store promo codes & coupon rules</p>
          </div>
          <button className="btn-primary" onClick={() => { setForm({ code: "", type: "PERCENTAGE", value: 10, minimumOrderValue: 0, endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), isActive: true }); setIsModalOpen(true); }}>
            <Plus size={18} />
            <span>Create Promo Code</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Type</th>
                <th>Discount Value</th>
                <th>Min. Order</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-6">
                    Loading offer codes...
                  </td>
                </tr>
              ) : offers.length > 0 ? (
                offers.map((off) => (
                  <tr key={off.id}>
                    <td className="font-bold text-[#e8c88a] flex items-center gap-1.5">
                      <Tag size={14} />
                      <span>{off.code}</span>
                    </td>
                    <td className="text-xs text-gray-300">{off.type}</td>
                    <td className="font-bold text-xs">
                      {off.type === "PERCENTAGE" ? `${off.value}% OFF` : `₹${off.value} OFF`}
                    </td>
                    <td className="text-xs text-gray-300">₹{off.minimumOrderValue || 0}</td>
                    <td className="text-xs text-gray-300">
                      {new Date(off.endAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Badge type={off.isActive ? "active" : "inactive"} text={off.isActive ? "Active" : "Disabled"} />
                    </td>
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleDelete(off.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                          title="Delete Offer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No active discount codes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Store Promo Code"
        maxWidth="480px"
      >
        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-300 mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. KLN20"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white font-bold outline-none uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-1">Discount Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Discount Value *</label>
              <input
                type="number"
                required
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={form.minimumOrderValue}
                onChange={(e) => setForm({ ...form, minimumOrderValue: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Valid Until</label>
              <input
                type="date"
                required
                value={form.endAt}
                onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Promo Code</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
