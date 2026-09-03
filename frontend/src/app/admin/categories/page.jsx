"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import Modal from "@/components/admin/common/Modal";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const initialForm = { name: "", slug: "", description: "", image: "" };
  const [formData, setFormData] = useState(initialForm);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/categories");
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setFormData(initialForm);
    setIsCreateOpen(true);
  };

  const openEdit = (cat) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
    });
    setEditingCategory(cat);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axiosClient.put(`/admin/categories/${editingCategory.id}`, formData);
        toast.success("Category updated successfully");
      } else {
        await axiosClient.post("/admin/categories", formData);
        toast.success("Category created successfully");
      }
      setIsCreateOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await axiosClient.delete(`/admin/categories/${deletingId}`);
      toast.success("Category deleted successfully");
      setDeletingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div>
            <h3 className="text-base font-bold text-[#f5f8f6]">Product Categories</h3>
            <p className="text-xs text-[#6b8277]">Manage store taxonomy and product groupings</p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 py-6">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <div className="w-10 h-10 bg-[#0e1c16] rounded-lg flex items-center justify-center text-gray-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className="font-bold text-[#f5f8f6]">{cat.name}</td>
                    <td className="text-xs text-[#e8c88a]">{cat.slug}</td>
                    <td className="text-xs text-[#a3b8ad] max-w-xs truncate">
                      {cat.description || "-"}
                    </td>
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(cat)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 cursor-pointer">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => setDeletingId(cat.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isCreateOpen || Boolean(editingCategory)}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? "Edit Category" : "Create Category"}
        maxWidth="500px"
      >
        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-300 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  name: val,
                  slug: editingCategory ? formData.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                });
              }}
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Slug *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Image URL</label>
            <input
              type="text"
              placeholder="/images/products/hairoil/oilf.jpeg"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingCategory(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Confirm Delete Category"
        maxWidth="450px"
      >
        <p className="text-xs text-gray-300 mb-4">
          Are you sure you want to delete this category? Products linked to this category may need reassignment.
        </p>
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setDeletingId(null)}>Cancel</button>
          <button className="p-2 px-4 rounded-xl bg-red-600 text-white font-bold text-xs" onClick={handleDelete}>Delete Category</button>
        </div>
      </Modal>
    </div>
  );
}
