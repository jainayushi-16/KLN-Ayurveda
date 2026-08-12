'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import Pagination from '../../../components/common/Pagination';
import { Search, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    price: '',
    originalPrice: '',
    discountPercent: '',
    categoryId: '',
    badge: 'Bestseller',
    stockQuantity: 100,
    inStock: true,
    isFeatured: false,
    imageUrl: '',
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
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get('/categories');
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [search, selectedCategory]);

  const handleSlugGen = (nameVal) => {
    return nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const openCreateModal = () => {
    setFormData({
      ...initialForm,
      categoryId: categories.length > 0 ? categories[0].id : '',
    });
    setIsCreateOpen(true);
  };

  const openEditModal = (product) => {
    const primaryImg = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || '';
    setFormData({
      name: product.name,
      slug: product.slug,
      shortDesc: product.shortDesc || '',
      fullDesc: product.fullDesc || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      discountPercent: product.discountPercent || '',
      categoryId: product.categoryId,
      badge: product.badge || '',
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
        toast.success('Product updated successfully!');
      } else {
        await axiosClient.post('/admin/products', payload);
        toast.success('Product created successfully!');
      }

      setIsCreateOpen(false);
      setEditingProduct(null);
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProductId) return;
    try {
      await axiosClient.delete(`/admin/products/${deletingProductId}`);
      toast.success('Product deleted successfully');
      setDeletingProductId(null);
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      {/* Table Toolbar */}
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-input-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              style={{ width: '200px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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

        {/* Products Table */}
        <table className="custom-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Badge</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
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
                        <img src={img} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', background: 'var(--bg-surface)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slug: {prod.slug}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {prod.category?.name || 'General'}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>₹{prod.price.toFixed(2)}</div>
                      {prod.originalPrice && (
                        <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
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
                      {prod.badge ? <Badge type="pending" text={prod.badge} /> : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button className="btn-icon" title="Edit" onClick={() => openEditModal(prod)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn-icon btn-icon-danger" title="Delete" onClick={() => setDeletingProductId(prod.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          pagination={pagination}
          onPageChange={(page) => fetchProducts(page)}
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isCreateOpen || !!editingProduct}
        onClose={() => { setIsCreateOpen(false); setEditingProduct(null); }}
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
        maxWidth="650px"
      >
        <form onSubmit={handleSaveProduct}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
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
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Slug</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Selling Price (₹)</label>
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
              <label className="form-label">Original MRP Price (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                className="form-control"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Badge Label</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Bestseller, Organic, New"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Image URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="/images/products/hairoil/oilf.jpeg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Description</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Description</label>
            <textarea
              className="form-control"
              rows="3"
              required
              value={formData.fullDesc}
              onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
            ></textarea>
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none' }}>
            <button type="button" className="btn-secondary" onClick={() => { setIsCreateOpen(false); setEditingProduct(null); }}>
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
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        title="Confirm Delete Product"
        maxWidth="450px"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDeletingProductId(null)}>Cancel</button>
            <button className="btn-primary" style={{ background: '#ef4444', color: 'white' }} onClick={handleDeleteProduct}>
              Delete Product
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to permanently delete this product? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
