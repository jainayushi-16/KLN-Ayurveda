'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Pagination from '../../../components/common/Pagination';
import {
  Tag,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Percent,
  Copy,
  Check,
  TrendingUp,
  Clock,
  AlertCircle,
  X,
  Sparkles,
  Zap,
  Gift,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });

  // Metrics
  const [metrics, setMetrics] = useState({
    totalOffers: 0,
    activeOffers: 0,
    totalDiscountGiven: 0,
    discountedRevenueGenerated: 0,
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [viewingOffer, setViewingOffer] = useState(null);
  const [deletingOffer, setDeletingOffer] = useState(null);

  // DB Options for Form
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  // Form State
  const initialForm = {
    name: '',
    description: '',
    code: '',
    type: 'PERCENTAGE',
    value: 20,
    maxDiscount: '',
    minimumOrderValue: 0,
    startAt: new Date().toISOString().slice(0, 16),
    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    status: 'ACTIVE',
    usageLimit: '',
    perCustomerLimit: 1,
    isActive: true,
    isFeatured: false,
    applicability: 'ALL',
    productIds: [],
    categoryIds: [],
  };

  const [formData, setFormData] = useState(initialForm);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  // Fetch Offers & Metrics
  const fetchOffers = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);
      if (search) queryParams.append('search', search);
      if (statusFilter) queryParams.append('status', statusFilter);
      if (typeFilter) queryParams.append('type', typeFilter);

      let res;
      try {
        res = await axiosClient.get(`/admin/offers?${queryParams.toString()}`);
      } catch (adminErr) {
        console.warn('Admin offers fetch failed/unauthorized, falling back to public active offers:', adminErr);
        res = await axiosClient.get('/offers/active');
      }

      const payload = res.data || res;
      let offersList = payload.offers || payload.data || (Array.isArray(payload) ? payload : []);
      
      let localUsages = {};
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("kln_coupon_usages");
          if (stored) localUsages = JSON.parse(stored);
        } catch (e) {}
      }

      offersList = offersList.map((off) => {
        const key = (off.code || "").toUpperCase();
        const localAdded = (key && localUsages[key]) ? Number(localUsages[key]) : Number(localUsages[off.id] || 0);
        const baseCount = Number(off.usageCount || off._count?.usages || 0);
        return {
          ...off,
          usageCount: Math.max(baseCount, localAdded),
        };
      });

      const pag = payload.pagination || { page: 1, totalPages: 1, totalItems: offersList.length };
      const met = payload.metrics || {
        totalOffers: offersList.length,
        activeOffers: offersList.filter((o) => o.isActive !== false).length,
        totalDiscountGiven: 0,
        discountedRevenueGenerated: 0,
      };

      setOffers(offersList);
      setPagination(pag);
      setMetrics(met);
    } catch (err) {
      console.error('Failed to fetch offers:', err);
      toast.error('Failed to load offers & discounts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch DB Options for selectors
  const fetchOptions = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosClient.get('/admin/products?limit=100').catch(() => axiosClient.get('/products?limit=100')).catch(() => ({ data: [] })),
        axiosClient.get('/categories').catch(() => ({ data: [] })),
      ]);

      const prods = prodRes.data?.products || prodRes.data || prodRes.products || [];
      const cats = catRes.data?.categories || catRes.data || catRes.categories || [];

      setProductsList(prods);
      setCategoriesList(cats);
    } catch (err) {
      console.error('Failed to fetch DB options:', err);
    }
  };

  useEffect(() => {
    fetchOffers(1);
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    if (isAddModalOpen) {
      fetchOptions();
    }
  }, [isAddModalOpen]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code '${code}' copied! 📋`);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleOpenAddModal = () => {
    setEditingOffer(null);
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (offer) => {
    setEditingOffer(offer);
    const startStr = offer.startAt ? new Date(offer.startAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
    const endStr = offer.endAt ? new Date(offer.endAt).toISOString().slice(0, 16) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

    let appScope = 'ALL';
    if (offer.type === 'PRODUCT_SPECIFIC' || (offer.selectedProducts && offer.selectedProducts.length > 0)) {
      appScope = 'PRODUCTS';
    } else if (offer.type === 'CATEGORY_SPECIFIC' || (offer.selectedCategories && offer.selectedCategories.length > 0)) {
      appScope = 'CATEGORIES';
    }

    setFormData({
      name: offer.name || '',
      description: offer.description || '',
      code: offer.code || '',
      type: offer.type || 'PERCENTAGE',
      value: offer.value !== undefined ? offer.value : 0,
      maxDiscount: offer.maxDiscount !== null && offer.maxDiscount !== undefined ? offer.maxDiscount : '',
      minimumOrderValue: offer.minimumOrderValue || 0,
      startAt: startStr,
      endAt: endStr,
      status: offer.status || 'ACTIVE',
      usageLimit: offer.usageLimit !== null ? offer.usageLimit : '',
      perCustomerLimit: offer.perCustomerLimit || 1,
      isActive: offer.isActive !== undefined ? offer.isActive : true,
      isFeatured: offer.isFeatured || false,
      applicability: appScope,
      productIds: offer.selectedProducts ? offer.selectedProducts.map((p) => p.productId || p.product?.id) : [],
      categoryIds: offer.selectedCategories ? offer.selectedCategories.map((c) => c.categoryId || c.category?.id) : [],
    });
    setIsAddModalOpen(true);
  };

  // Submit Add / Edit Form
  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || formData.value < 0) {
      toast.error('Please fill in required fields correctly.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        maxDiscount: formData.maxDiscount !== '' ? parseFloat(formData.maxDiscount) : null,
        minimumOrderValue: parseFloat(formData.minimumOrderValue || 0),
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt).toISOString(),
        status: formData.status,
        usageLimit: formData.usageLimit !== '' ? parseInt(formData.usageLimit) : null,
        perCustomerLimit: parseInt(formData.perCustomerLimit || 1),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        productIds: formData.applicability === 'PRODUCTS' ? formData.productIds : [],
        categoryIds: formData.applicability === 'CATEGORIES' ? formData.categoryIds : [],
      };

      if (editingOffer) {
        await axiosClient.put(`/admin/offers/${editingOffer.id}`, payload);
        toast.success('Offer updated successfully! 🌿');
        setIsAddModalOpen(false);
        fetchOffers(pagination.page);
      } else {
        await axiosClient.post('/admin/offers', payload);
        toast.success('Offer created successfully! 🎉');
        setIsAddModalOpen(false);
        fetchOffers(1);
      }
    } catch (err) {
      console.error('Failed to save offer:', err);
      toast.error(err.message || 'Failed to save offer');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (offer) => {
    const newActiveState = !offer.isActive;
    try {
      const res = await axiosClient.patch(`/admin/offers/${offer.id}/status`, { isActive: newActiveState });
      if (res.success) {
        toast.success(`Offer '${offer.code}' ${newActiveState ? 'activated' : 'deactivated'}`);
        setOffers((prev) =>
          prev.map((o) => (o.id === offer.id ? { ...o, isActive: newActiveState, effectiveStatus: res.data.effectiveStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update offer status');
    }
  };

  // Delete Offer
  const handleDeleteOffer = async () => {
    if (!deletingOffer) return;
    try {
      const res = await axiosClient.delete(`/admin/offers/${deletingOffer.id}`);
      if (res.success) {
        toast.success(`Offer '${deletingOffer.code}' deleted permanently`);
        setDeletingOffer(null);
        fetchOffers(pagination.page);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete offer');
    }
  };

  const getStatusBadge = (effectiveStatus, isActive) => {
    if (!isActive)
      return <span style={{ background: '#F3F4F6', color: '#6B7280', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>INACTIVE</span>;
    switch (effectiveStatus) {
      case 'ACTIVE':
        return <span style={{ background: '#E7F0E4', color: '#2F5D34', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>🟢 ACTIVE</span>;
      case 'EXPIRED':
        return <span style={{ background: '#FFE4E6', color: '#E11D48', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>🔴 EXPIRED</span>;
      case 'EXHAUSTED':
        return <span style={{ background: '#FEF3C7', color: '#D97706', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>⚠️ LIMIT REACHED</span>;
      case 'SCHEDULED':
        return <span style={{ background: '#E0F2FE', color: '#0284C7', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>⏳ SCHEDULED</span>;
      default:
        return <span style={{ background: '#F3F4F6', color: '#374151', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>{effectiveStatus || 'ACTIVE'}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1B351E, #2F5D34, #1F4224)', padding: '1.75rem 2rem', borderRadius: '24px', color: '#FFFFFF', boxShadow: '0 12px 32px rgba(47, 93, 52, 0.2)', border: '1px solid rgba(201, 166, 107, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(201, 166, 107, 0.2)', color: '#C9A66B', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Marketing & Promotions
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#FFFFFF', margin: '0 0 0.3rem 0' }}>Offers & Discounts Portal</h1>
          <p style={{ fontSize: '0.85rem', color: '#E8F2E3', margin: 0, opacity: 0.9 }}>Create promo codes, percentage discounts, minimum order value thresholds, and store deals.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => {
              setRefreshing(true);
              fetchOffers(pagination.page);
            }}
            disabled={refreshing}
            style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.65rem 1.25rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>

          <button
            onClick={handleOpenAddModal}
            style={{ background: 'linear-gradient(135deg, #C9A66B, #B89355)', color: '#1B351E', border: 'none', padding: '0.65rem 1.4rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(201, 166, 107, 0.3)' }}
          >
            <Plus size={16} style={{ strokeWidth: 3 }} /> Create Offer
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(47, 93, 52, 0.16)', boxShadow: '0 8px 24px rgba(47, 93, 52, 0.05)', borderLeft: '5px solid #2F5D34' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.04em' }}>Total Offers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#222123', margin: '0.2rem 0' }}>{metrics.totalOffers}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2F5D34', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Tag size={12} /> Database Synchronized
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(47, 93, 52, 0.16)', boxShadow: '0 8px 24px rgba(47, 93, 52, 0.05)', borderLeft: '5px solid #0284C7' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.04em' }}>Active Deals</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#222123', margin: '0.2rem 0' }}>{metrics.activeOffers}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0284C7', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Zap size={12} /> Live on Storefront
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(47, 93, 52, 0.16)', boxShadow: '0 8px 24px rgba(47, 93, 52, 0.05)', borderLeft: '5px solid #D97706' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.04em' }}>Total Discount Given</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#222123', margin: '0.2rem 0' }}>₹{metrics.totalDiscountGiven.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#D97706', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Gift size={12} /> Customer Savings
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(47, 93, 52, 0.16)', boxShadow: '0 8px 24px rgba(47, 93, 52, 0.05)', borderLeft: '5px solid #7E22CE' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.04em' }}>Promo Order Revenue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#222123', margin: '0.2rem 0' }}>₹{metrics.discountedRevenueGenerated.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7E22CE', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={12} /> Attributed Sales
          </div>
        </div>
      </div>

      {/* Main Table Card Wrapper */}
      <div className="card-table-wrapper" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid rgba(47, 93, 52, 0.16)', boxShadow: '0 12px 32px rgba(47, 93, 52, 0.06)', overflow: 'hidden' }}>
        {/* Toolbar Header */}
        <div className="table-toolbar" style={{ padding: '1rem 1.25rem', background: '#F9FAF7', borderBottom: '1px solid rgba(47, 93, 52, 0.12)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
              <div className="search-input-box" style={{ minWidth: '260px', flex: 1 }}>
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Search offer name or promo code (e.g. KLN20)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ width: '150px', borderRadius: '12px', borderColor: 'rgba(47, 93, 52, 0.2)', fontWeight: '600', fontSize: '0.8rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="EXPIRED">Expired</option>
                <option value="EXHAUSTED">Limit Reached</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              <select
                className="form-control"
                style={{ width: '160px', borderRadius: '12px', borderColor: 'rgba(47, 93, 52, 0.2)', fontWeight: '600', fontSize: '0.8rem' }}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
                <option value="PRODUCT_SPECIFIC">Product Specific</option>
                <option value="CATEGORY_SPECIFIC">Category Specific</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2F5D34', background: '#E7F0E4', padding: '0.35rem 0.85rem', borderRadius: '20px', whiteSpace: 'nowrap' }}>
              Total: {pagination.totalItems || offers.length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="custom-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
            <thead>
              <tr style={{ background: '#F4F7F2' }}>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Offer & Scope</th>
                <th style={{ padding: '0.9rem 0.75rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Coupon Code</th>
                <th style={{ padding: '0.9rem 0.75rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Discount</th>
                <th style={{ padding: '0.9rem 0.75rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Min. Order</th>
                <th style={{ padding: '0.9rem 0.75rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Valid Period</th>
                <th style={{ padding: '0.9rem 0.75rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Usage</th>
                <th style={{ padding: '0.9rem 0.75rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Status</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#6B7280', padding: '3rem 1rem', fontWeight: '600' }}>
                    Loading promotional offers...
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', maxWidth: '360px', margin: '0 auto' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#E7F0E4', color: '#2F5D34', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tag size={28} />
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#222123', margin: 0 }}>No Offers Found</h3>
                      <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>Create a new promotional offer to boost customer sales on storefront.</p>
                      <button
                        onClick={handleOpenAddModal}
                        style={{ background: '#2F5D34', color: '#FFFFFF', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginTop: '0.5rem' }}
                      >
                        <Plus size={14} /> Create First Offer
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} style={{ borderBottom: '1px solid #F3F4F6' }} className="hover:bg-[#F9FAF7]">
                    {/* Offer Name & Description */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: '800', color: '#222123', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {offer.name}
                        {offer.isFeatured && (
                          <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.65rem', fontWeight: '800', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>Featured</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginTop: '0.15rem' }}>
                        {offer.description || 'No description provided.'}
                      </div>
                    </td>

                    {/* Coupon Code */}
                    <td style={{ padding: '0.85rem 0.75rem', verticalAlign: 'middle' }}>
                      {offer.code ? (
                        <button
                          onClick={() => handleCopyCode(offer.code)}
                          style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.25rem 0.6rem', fontFamily: 'monospace', fontWeight: '800', color: '#2F5D34', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                          title="Click to copy code"
                        >
                          <span>{offer.code}</span>
                          {copiedCode === offer.code ? <Check size={12} color="#10B981" /> : <Copy size={12} color="#9CA3AF" />}
                        </button>
                      ) : (
                        <span style={{ color: '#9CA3AF', fontSize: '0.75rem', fontStyle: 'italic' }}>Auto Applied</span>
                      )}
                    </td>

                    {/* Discount Value */}
                    <td style={{ padding: '0.85rem 0.75rem', verticalAlign: 'middle' }}>
                      <span style={{ fontWeight: '800', color: '#2F5D34', fontSize: '0.88rem' }}>
                        {offer.type === 'PERCENTAGE'
                          ? `${offer.value}% OFF`
                          : offer.type === 'FLAT'
                          ? `₹${offer.value} OFF`
                          : offer.type === 'FREE_SHIPPING'
                          ? 'FREE SHIPPING'
                          : `₹${offer.value} OFF`}
                      </span>
                      {offer.maxDiscount && (
                        <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Cap: ₹{offer.maxDiscount}</div>
                      )}
                    </td>

                    {/* Minimum Order */}
                    <td style={{ padding: '0.85rem 0.75rem', verticalAlign: 'middle', fontWeight: '700', color: '#374151', fontSize: '0.82rem' }}>
                      {offer.minimumOrderValue > 0 ? `₹${offer.minimumOrderValue}` : 'None'}
                    </td>

                    {/* Valid Period */}
                    <td style={{ padding: '0.85rem 0.75rem', verticalAlign: 'middle', fontSize: '0.75rem', color: '#4B5563' }}>
                      <div>From: <strong>{new Date(offer.startAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</strong></div>
                      <div>To: <strong>{new Date(offer.endAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
                    </td>

                    {/* Usage Progress */}
                    <td style={{ padding: '0.85rem 0.75rem', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#374151' }}>
                        {offer.usageCount || 0} {offer.usageLimit ? `/ ${offer.usageLimit}` : 'used'}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '0.85rem 0.75rem', verticalAlign: 'middle' }}>
                      {getStatusBadge(offer.effectiveStatus, offer.isActive)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          onClick={() => setViewingOffer(offer)}
                          style={{ background: 'transparent', border: 'none', padding: '0.35rem', color: '#4B5563', borderRadius: '6px', cursor: 'pointer' }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(offer)}
                          style={{ background: 'transparent', border: 'none', padding: '0.35rem', color: '#4B5563', borderRadius: '6px', cursor: 'pointer' }}
                          title="Edit Offer"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(offer)}
                          style={{ background: offer.isActive ? '#E7F0E4' : '#F3F4F6', color: offer.isActive ? '#2F5D34' : '#6B7280', border: 'none', padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                        >
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </button>

                        <button
                          onClick={() => setDeletingOffer(offer)}
                          style={{ background: 'transparent', border: 'none', padding: '0.35rem', color: '#E11D48', borderRadius: '6px', cursor: 'pointer' }}
                          title="Delete Offer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div style={{ padding: '1rem', borderTop: '1px solid #F3F4F6' }}>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => fetchOffers(p)}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Offer Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(8, 18, 14, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(47, 93, 52, 0.2)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', sticky: 'top', background: '#FFFFFF' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#222123', margin: 0 }}>
                  {editingOffer ? 'Edit Offer Configuration' : 'Create New Promotional Offer'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '0.15rem 0 0 0' }}>Configure promo code, validity window, and discount parameters.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '0.4rem' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Offer Name & Code */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>Offer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Grand Festival 20% OFF"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem', fontWeight: '600' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. KLN20"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: '800', color: '#2F5D34', textTransform: 'uppercase' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Get 20% OFF on all authentic herbal formulations."
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem' }}
                ></textarea>
              </div>

              {/* Offer Type & Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>Offer Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem', fontWeight: '700' }}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                    <option value="PRODUCT_SPECIFIC">Product Specific</option>
                    <option value="CATEGORY_SPECIFIC">Category Specific</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>Discount Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="20"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem', fontWeight: '700' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>Max Cap (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="Optional 500"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem', fontWeight: '700' }}
                  />
                </div>
              </div>

              {/* Min Order & Usage Limit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={formData.minimumOrderValue}
                    onChange={(e) => setFormData({ ...formData, minimumOrderValue: e.target.value })}
                    placeholder="0"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem', fontWeight: '700' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>Total Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="Optional"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem', fontWeight: '700' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>Per Customer Limit</label>
                  <input
                    type="number"
                    value={formData.perCustomerLimit}
                    onChange={(e) => setFormData({ ...formData, perCustomerLimit: e.target.value })}
                    placeholder="1"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem', fontWeight: '700' }}
                  />
                </div>
              </div>

              {/* Start & End Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startAt}
                    onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' }}>End Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endAt}
                    onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Switches */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #F3F4F6' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '700' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#2F5D34' }}
                  />
                  <span>Is Active</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '700' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#2F5D34' }}
                  />
                  <span>Show as Featured Deal Banner</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #F3F4F6' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  style={{ background: '#2F5D34', color: '#FFFFFF', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  {formSubmitting ? 'Saving Offer...' : editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingOffer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(8, 18, 14, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', maxWidth: '420px', width: '100%', padding: '1.75rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(47, 93, 52, 0.2)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#FFE4E6', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <AlertCircle size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#222123', margin: '0 0 0.5rem 0' }}>Delete Offer Permanently?</h3>
            <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 1.5rem 0' }}>
              Are you sure you want to delete offer <strong>{deletingOffer.name}</strong> ({deletingOffer.code})?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setDeletingOffer(null)}
                style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOffer}
                style={{ background: '#E11D48', color: '#FFFFFF', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Offer Details Drawer */}
      {viewingOffer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(8, 18, 14, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: '#FFFFFF', maxWidth: '460px', width: '100%', height: '100%', padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '-10px 0 30px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#2F5D34', background: '#E7F0E4', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                  {viewingOffer.code}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#222123', margin: '0.5rem 0 0 0' }}>{viewingOffer.name}</h3>
              </div>
              <button onClick={() => setViewingOffer(null)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#4B5563', lineHeight: '1.5' }}>
              <strong>Description:</strong>
              <p style={{ color: '#6B7280', margin: '0.25rem 0 1rem 0' }}>{viewingOffer.description || 'No description provided'}</p>

              <div style={{ background: '#F9FAF7', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(47, 93, 52, 0.12)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: '700' }}>Discount Type</span>
                  <div style={{ fontWeight: '800', color: '#2F5D34' }}>{viewingOffer.type}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: '700' }}>Discount Value</span>
                  <div style={{ fontWeight: '800', color: '#2F5D34' }}>
                    {viewingOffer.type === 'PERCENTAGE' ? `${viewingOffer.value}%` : `₹${viewingOffer.value}`}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: '700' }}>Min. Order</span>
                  <div style={{ fontWeight: '700', color: '#222123' }}>₹{viewingOffer.minimumOrderValue}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: '700' }}>Max. Discount Cap</span>
                  <div style={{ fontWeight: '700', color: '#222123' }}>{viewingOffer.maxDiscount ? `₹${viewingOffer.maxDiscount}` : 'None'}</div>
                </div>
              </div>

              <strong>Validity Window:</strong>
              <div style={{ background: '#E7F0E4', padding: '0.75rem', borderRadius: '12px', color: '#2F5D34', fontWeight: '700', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                <div>From: {new Date(viewingOffer.startAt).toLocaleString('en-IN')}</div>
                <div>To: {new Date(viewingOffer.endAt).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
