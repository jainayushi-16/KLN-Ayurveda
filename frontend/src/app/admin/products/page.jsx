"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import Badge from "@/components/admin/common/Badge";
import Modal from "@/components/admin/common/Modal";
import Pagination from "@/components/admin/common/Pagination";
import { Search, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Form State
  const initialForm = {
    name: "",
    slug: "",
    shortDesc: "",
    fullDesc: "",
    price: "",
    originalPrice: "",
    discountPercent: "",
    categoryId: "",
    type: "Oil",
    badge: "Bestseller",
    stockQuantity: 100,
    inStock: true,
    isFeatured: false,
    imageUrl: "",
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/admin/products?page=${page}&limit=10&search=${search}&categoryId=${selectedCategory}`);
      if (res.success) {
        setProducts(res.data || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, totalItems: res.data?.length || 0 });
      }
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/categories");
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [search, selectedCategory]);

  const handleSlugGen = (nameVal) => {
    return nameVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const openCreateModal = () => {
    setFormData({
      ...initialForm,
      categoryId: categories.length > 0 ? categories[0].id : "",
    });
    setIsCreateOpen(true);
  };

  const openEditModal = (product) => {
    const primaryImg = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || "";
    setFormData({
      name: product.name,
      slug: product.slug,
      shortDesc: product.shortDesc || "",
      fullDesc: product.fullDesc || "",
      price: product.price,
      originalPrice: product.originalPrice || "",
      discountPercent: product.discountPercent || "",
      categoryId: product.categoryId,
      type: product.type || "Oil",
      badge: product.badge || "",
      stockQuantity: product.stockQuantity,
      inStock: product.inStock,
      isFeatured: product.isFeatured,
      imageUrl: primaryImg,
    });
    setEditingProduct(product);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        discountPercent: formData.discountPercent ? parseInt(formData.discountPercent, 10) : null,
        stockQuantity: parseInt(formData.stockQuantity, 10),
        images: formData.imageUrl ? [{ url: formData.imageUrl, isPrimary: true }] : [],
      };

      if (editingProduct) {
        await axiosClient.put(`/admin/products/${editingProduct.id}`, payload);
        toast.success("Product updated successfully!");
      } else {
        await axiosClient.post("/admin/products", payload);
        toast.success("Product created successfully!");
      }

      setIsCreateOpen(false);
      setEditingProduct(null);
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error(err.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProductId) return;
    try {
      await axiosClient.delete(`/admin/products/${deletingProductId}`);
      toast.success("Product deleted successfully");
      setDeletingProductId(null);
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2 pl-9 pr-4 rounded-xl bg-[#08120e] border border-[#c9a66b]/20 text-xs text-[#f5f8f6] outline-none focus:border-[#c9a66b]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 rounded-xl bg-[#08120e] border border-[#c9a66b]/20 text-xs text-[#f5f8f6] outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button className="btn-primary" onClick={openCreateModal}>
            <Plus size={18} />
            <span>Create Product</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badge</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-6">
                    Loading products list...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((prod) => {
                  const img = prod.images?.find((i) => i.isPrimary)?.url || prod.images?.[0]?.url;
                  return (
                    <tr key={prod.id}>
                      <td>
                        {img ? (
                          <img src={img} alt={prod.name} className="w-10 h-10 object-cover rounded-lg" />
                        ) : (
                          <div className="w-10 h-10 bg-[#0e1c16] rounded-lg flex items-center justify-center text-gray-400">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="font-bold text-[#f5f8f6]">{prod.name}</div>
                        <div className="text-[11px] text-[#6b8277]">Slug: {prod.slug}</div>
                      </td>
                      <td className="text-xs text-[#a3b8ad]">
                        {prod.category?.name || "General"}
                      </td>
                      <td>
                        <div className="font-bold text-xs">₹{prod.price.toFixed(2)}</div>
                        {prod.originalPrice && (
                          <div className="text-[11px] line-through text-[#6b8277]">
                            ₹{prod.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td>
                        {prod.stockQuantity <= 10 ? (
                          <Badge type="lowstock" text={`${prod.stockQuantity} Left`} />
                        ) : (
                          <Badge type="instock" text={`${prod.stockQuantity} In Stock`} />
                        )}
                      </td>
                      <td>
                        {prod.badge ? <Badge type="pending" text={prod.badge} /> : "-"}
                      </td>
                      <td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openEditModal(prod)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 cursor-pointer">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => setDeletingProductId(prod.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination pagination={pagination} onPageChange={fetchProducts} />
      </div>

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={isCreateOpen || Boolean(editingProduct)}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Product" : "Create New Product"}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-300 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  name: val,
                  slug: editingProduct ? formData.slug : handleSlugGen(val),
                });
              }}
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-gray-300 mb-1">Category *</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-300 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Original Price (MRP ₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Short Summary *</label>
            <input
              type="text"
              required
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Full Description *</label>
            <textarea
              rows={3}
              required
              value={formData.fullDesc}
              onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Primary Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 rounded-xl bg-[#08120e] border border-[#c9a66b]/30 text-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingProductId)}
        onClose={() => setDeletingProductId(null)}
        title="Confirm Delete Product"
        maxWidth="420px"
      >
        <p className="text-xs text-gray-300 mb-4">
          Are you sure you want to permanently delete this product? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setDeletingProductId(null)}>Cancel</button>
          <button className="p-2 px-4 rounded-xl bg-red-600 text-white font-bold text-xs" onClick={handleDeleteProduct}>Delete Product</button>
        </div>
      </Modal>
    </div>
  );
}
