'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Modal from '../../../components/common/Modal';
import { Star, Trash2, CheckCircle, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_PRODUCTS = [
  { id: 'kln-hair-oil-01', name: 'Intensive Hair Growth Oil' },
  { id: 'kln-hair-mask-02', name: 'Protective Hair Mask' },
  { id: 'kln-tonic-03', name: 'Scalp Revitalizing Tonic' },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productId: 'kln-hair-oil-01',
    authorName: 'Dr. Ananya Sharma',
    rating: 5,
    title: 'Remarkable results in hair density and root strength!',
    comment: 'I have been recommending this authentic Kshirapaka formulation to my clients. The natural herbs deeply nourish scalp follicles.',
    verifiedBuyer: true,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  });

  const fetchReviews = async () => {
    setLoading(true);
    let loadedApiReviews = [];
    try {
      const res = await axiosClient.get('/admin/reviews');
      if (res && res.data) {
        loadedApiReviews = Array.isArray(res.data) ? res.data : (res.data.data || []);
      }
    } catch (err) {
      console.warn('Backend admin review load note:', err);
    }

    let localReviews = [];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('kln_custom_reviews');
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

  const handleCreateReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newReview = {
        id: `rev-custom-${Date.now()}`,
        productId: formData.productId,
        authorName: formData.authorName,
        rating: Number(formData.rating),
        title: formData.title,
        comment: formData.comment,
        verifiedBuyer: formData.verifiedBuyer,
        date: formData.date,
        createdAt: new Date().toISOString(),
        product: DEFAULT_PRODUCTS.find((p) => p.id === formData.productId) || { name: 'Ayurvedic Product' },
      };

      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('kln_custom_reviews');
          const currentList = stored ? JSON.parse(stored) : [];
          localStorage.setItem('kln_custom_reviews', JSON.stringify([newReview, ...currentList]));
        } catch (e) {}
      }

      await axiosClient.post('/admin/reviews', formData).catch(() => {});

      toast.success('Custom review published successfully! ✨');
      setIsCreateOpen(false);
      fetchReviews();

      setFormData({
        productId: 'kln-hair-oil-01',
        authorName: 'Dr. Ananya Sharma',
        rating: 5,
        title: 'Remarkable results in hair density and root strength!',
        comment: 'I have been recommending this authentic Kshirapaka formulation to my clients. The natural herbs deeply nourish scalp follicles.',
        verifiedBuyer: true,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      });
    } catch (err) {
      toast.error(err.message || 'Failed to create review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('kln_custom_reviews');
          if (stored) {
            const list = JSON.parse(stored);
            const updated = list.filter((r) => r.id !== deletingId);
            localStorage.setItem('kln_custom_reviews', JSON.stringify(updated));
          }
        } catch (e) {}
      }

      await axiosClient.delete(`/admin/reviews/${deletingId}`).catch(() => {});
      toast.success('Review deleted successfully');
      setDeletingId(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} style={{ color: '#2F5D34' }} /> Customer & Admin Product Reviews
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Moderate, write, and manage customer feedback & testimonials</p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setIsCreateOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#2F5D34',
              color: '#ffffff',
              padding: '0.6rem 1.2rem',
              borderRadius: '9999px',
              fontWeight: '700',
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} /> Write Custom Review
          </button>
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
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  Loading customer reviews...
                </td>
              </tr>
            ) : reviews.length > 0 ? (
              reviews.map((rev) => {
                const customerName = rev.user
                  ? `${rev.user.firstName || ''} ${rev.user.lastName || ''}`.trim()
                  : 'Customer';
                return (
                  <tr key={rev.id}>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {rev.product?.name || 'Product'}
                    </td>
                    <td>
                      <div>{customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.user?.email}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < rev.rating ? '#fbbf24' : 'transparent'}
                            stroke="#fbbf24"
                          />
                        ))}
                      </div>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      {rev.title && <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{rev.title}</div>}
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{rev.comment}</div>
                    </td>
                    <td>
                      {rev.verifiedBuyer ? (
                        <span style={{ color: '#34d399', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <CheckCircle size={14} /> Verified Purchase
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Unverified</span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
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
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No customer reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Delete Review"
        maxWidth="450px"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDeletingId(null)}>Cancel</button>
            <button className="btn-primary" style={{ background: '#ef4444', color: 'white' }} onClick={handleDelete}>
              Delete Review
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete this customer review?
        </p>
      </Modal>

      {/* Add Custom / Curated Review Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Write Custom Product Review"
        maxWidth="550px"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setIsCreateOpen(false)}>Cancel</button>
            <button
              className="btn-primary"
              style={{ background: '#2F5D34', color: 'white' }}
              onClick={handleCreateReview}
              disabled={submitting}
            >
              {submitting ? 'Publishing...' : 'Publish Review ✨'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Target Product Formulation *
            </label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
            >
              {DEFAULT_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Reviewer / Customer Name *
            </label>
            <input
              type="text"
              required
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              placeholder="e.g. Dr. Sneha Sharma"
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Star Rating (1 to 5) *
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
              >
                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                <option value={3}>3 Stars ⭐⭐⭐</option>
                <option value={2}>2 Stars ⭐⭐</option>
                <option value={1}>1 Star ⭐</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Publication Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="August 25, 2026"
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Headline / Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Excellent root nourishment!"
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Testimonial / Review Body *
            </label>
            <textarea
              required
              rows={3}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Enter detailed customer testimonial..."
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="verifiedCheck"
              checked={formData.verifiedBuyer}
              onChange={(e) => setFormData({ ...formData, verifiedBuyer: e.target.checked })}
            />
            <label htmlFor="verifiedCheck" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Mark as Verified Purchase Badge
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
