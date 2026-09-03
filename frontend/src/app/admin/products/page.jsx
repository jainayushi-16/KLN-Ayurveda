"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "@/services/axiosClient";
import Badge from "@/components/admin/common/Badge";
import Modal from "@/components/admin/common/Modal";
import Pagination from "@/components/admin/common/Pagination";
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Leaf, Filter, RefreshCw, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("ALL"); // ALL, INSTOCK, LOWSTOCK, OUTOFSTOCK
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL, Oil, Shampoo, Serum, Treatment
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
      const res = await axiosClient.get(`/admin/products?page=${page}&limit=50&search=${search}&categoryId=${selectedCategory}`);
      if (res && (res.success || res.data)) {
        const list = res.data || res.products || [];
        setProducts(list);
        setPagination(res.pagination || { page: 1, totalPages: 1, totalItems: list.length });
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
      if (res && (res.success || res.data)) {
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

  // Client-side dynamic multi-filter matching
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Stock filter
      if (stockFilter === "LOWSTOCK" && prod.stockQuantity > 10) return false;
      if (stockFilter === "INSTOCK" && prod.stockQuantity <= 10) return false;
      if (stockFilter === "OUTOFSTOCK" && prod.stockQuantity > 0) return false;

      // Type filter
      if (typeFilter !== "ALL" && (prod.type || "").toLowerCase() !== typeFilter.toLowerCase()) return false;

      return true;
    });
  }, [products, stockFilter, typeFilter]);

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
        toast.success("Product updated successfully! 🌿");
      } else {
        await axiosClient.post("/admin/products", payload);
        toast.success("Product created successfully! 🌿");
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
      {/* Table Toolbar & Dynamic Ayurvedic Filters */}
      <div className="card-table-wrapper">
        <div className="table-toolbar flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            {/* Search */}
            <div className="search-input-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search products by herbal name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="form-control"
              style={{ width: "170px" }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">🌿 All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Stock Condition Filter */}
            <select
              className="form-control"
              style={{ width: "160px" }}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="ALL">📦 All Stock Levels</option>
              <option value="INSTOCK">Sufficient Stock (&gt;10)</option>
              <option value="LOWSTOCK">⚠️ Low Stock (≤10)</option>
              <option value="OUTOFSTOCK">❌ Out of Stock (0)</option>
            </select>

            {/* Form Type Filter */}
            <select
              className="form-control"
              style={{ width: "150px" }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">🧪 All Formulations</option>
              <option value="Oil">Hair Oil</option>
              <option value="Shampoo">Herbal Shampoo</option>
              <option value="Serum">Scalp Serum</option>
              <option value="Treatment">Intensive Treatment</option>
            </select>
          </div>

          <button className="btn-primary" onClick={openCreateModal}>
            <Plus size={18} />
            <span>Create Herbal Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name & Slug</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Formulation</th>
                <th>Stock Level</th>
                <th>Badge</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    Loading Ayurvedic product catalog...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => {
                  const img = prod.images?.find((i) => i.isPrimary)?.url || prod.images?.[0]?.url;
                  return (
                    <tr key={prod.id}>
                      <td>
                        {img ? (
                          <img src={img} alt={prod.name} style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border-color)" }} />
                        ) : (
                          <div style={{ width: "42px", height: "42px", background: "var(--bg-surface)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", border: "1px solid var(--border-color)" }}>
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>{prod.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>slug: {prod.slug}</div>
                      </td>
                      <td style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
                        {prod.category?.name || "General"}
                      </td>
                      <td>
                        <div style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>₹{prod.price.toFixed(2)}</div>
                        {prod.originalPrice && (
                          <div style={{ fontSize: "0.75rem", textDecoration: "line-through", color: "var(--text-muted)" }}>
                            ₹{prod.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                          <Leaf size={14} style={{ color: "var(--accent-emerald)" }} />
                          <span>{prod.type || "Oil"}</span>
                        </span>
                      </td>
                      <td>
                        {prod.stockQuantity <= 0 ? (
                          <Badge type="outstock" text="0 Out of Stock" />
                        ) : prod.stockQuantity <= 10 ? (
                          <Badge type="lowstock" text={`${prod.stockQuantity} Low Stock`} />
                        ) : (
                          <Badge type="instock" text={`${prod.stockQuantity} In Stock`} />
                        )}
                      </td>
                      <td>
                        {prod.badge ? <Badge type="pending" text={prod.badge} /> : "-"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                          <button className="btn-icon" title="Edit Product" onClick={() => openEditModal(prod)}>
                            <Edit size={16} />
                          </button>
                          <button className="btn-icon btn-icon-danger" title="Delete Product" onClick={() => setDeletingProductId(prod.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    No products found matching active filters.
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
        title={editingProduct ? "Edit Herbal Product" : "Create New Ayurvedic Product"}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveProduct}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Kshirapaka Herbal Hair Oil"
              value={formData.name}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  name: val,
                  slug: editingProduct ? formData.slug : handleSlugGen(val),
                });
              }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">URL Slug *</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-control"
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Original Price (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                className="form-control"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Summary *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Crafted with 100% natural herbs for healthy scalp & hair fall reduction"
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Ayurvedic Description *</label>
            <textarea
              className="form-control"
              rows={3}
              required
              value={formData.fullDesc}
              onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Image URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ padding: "1rem 0 0", border: "none" }}>
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
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Are you sure you want to permanently delete this product? This action cannot be undone.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button className="btn-secondary" onClick={() => setDeletingProductId(null)}>Cancel</button>
          <button className="btn-primary" style={{ background: "#ef4444", color: "white" }} onClick={handleDeleteProduct}>Delete Product</button>
        </div>
      </Modal>
    </div>
  );
}
