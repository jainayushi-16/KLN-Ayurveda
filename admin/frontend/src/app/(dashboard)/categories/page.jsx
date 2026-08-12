'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Modal from '../../../components/common/Modal';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const initialForm = { name: '', slug: '', description: '', image: '' };
  const [formData, setFormData] = useState(initialForm);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/categories');
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load categories');
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
      description: cat.description || '',
      image: cat.image || '',
    });
    setEditingCategory(cat);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axiosClient.put(`/admin/categories/${editingCategory.id}`, formData);
        toast.success('Category updated successfully');
      } else {
        await axiosClient.post('/admin/categories', formData);
        toast.success('Category created successfully');
      }
      setIsCreateOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await axiosClient.delete(`/admin/categories/${deletingId}`);
      toast.success('Category deleted successfully');
      setDeletingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Product Categories</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage store taxonomy and product groupings</p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Category Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  Loading categories...
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: 'var(--bg-surface)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: '600' }}>{cat.name}</td>
                  <td style={{ color: 'var(--accent-gold-light)', fontSize: '0.85rem' }}>{cat.slug}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '300px' }}>
                    {cat.description || '-'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(cat)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-icon-danger" title="Delete" onClick={() => setDeletingId(cat.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isCreateOpen || !!editingCategory}
        onClose={() => { setIsCreateOpen(false); setEditingCategory(null); }}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        maxWidth="500px"
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
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
                  slug: editingCategory ? formData.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                });
              }}
            />
          </div>

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
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="/images/products/hairoil/oilf.jpeg"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none' }}>
            <button type="button" className="btn-secondary" onClick={() => { setIsCreateOpen(false); setEditingCategory(null); }}>
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
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Delete Category"
        maxWidth="450px"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDeletingId(null)}>Cancel</button>
            <button className="btn-primary" style={{ background: '#ef4444', color: 'white' }} onClick={handleDelete}>
              Delete Category
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete this category? Products linked to this category may need reassignment.
        </p>
      </Modal>
    </div>
  );
}
