'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axiosClient from '../../../api/axiosClient';
import Modal from '../../../components/common/Modal';
import Badge from '../../../components/common/Badge';
import {
  Tag,
  Percent,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  Users,
  Copy,
  Check,
  Package,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [metrics, setMetrics] = useState({
    totalOffers: 0,
    activeOffers: 0,
    scheduledOffers: 0,
    expiredOffers: 0,
    totalUsages: 0,
    totalDiscountGiven: 0,
    discountedOrdersCount: 0,
    discountedRevenueGenerated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Database options for product & category selectors
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [viewingOffer, setViewingOffer] = useState(null);
  const [deletingOffer, setDeletingOffer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
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
    applicability: 'ALL', // ALL, PRODUCTS, CATEGORIES
    productIds: [],
    categoryIds: [],
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  // Fetch Offers & Metrics
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);
      if (search) queryParams.append('search', search);
      if (statusFilter !== 'ALL') queryParams.append('status', statusFilter);
      if (typeFilter !== 'ALL') queryParams.append('type', typeFilter);

      const res = await axiosClient.get(`/admin/offers?${queryParams.toString()}`);
      if (res.success && res.data) {
        setOffers(res.data.offers || []);
        setPagination(res.data.pagination || { total: 0, totalPages: 1 });
        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        }
      }
    } catch (err) {
      console.error('Failed to fetch offers:', err);
      toast.error('Failed to load offers & discounts.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch Products & Categories for selector dropdowns
  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      const [prodRes, catRes] = await Promise.all([
        axiosClient.get('/admin/products?limit=100').catch(() => axiosClient.get('/products?limit=100')).catch(() => ({ data: [] })),
        axiosClient.get('/categories').catch(() => ({ data: [] })),
      ]);

      const prods = prodRes.data?.products || prodRes.data || prodRes.products || [];
      const cats = catRes.data?.categories || catRes.data || catRes.categories || [];

      setAvailableProducts(Array.isArray(prods) ? prods : []);
      setAvailableCategories(Array.isArray(cats) ? cats : []);
    } catch (e) {
      console.error('Failed to load products/categories options:', e);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchOptions();
  }, [page, statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOffers();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOffers();
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code '${code}' copied!`);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingOffer(null);
    const now = new Date();
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    setFormData({
      name: '',
      description: '',
      code: 'KLN' + Math.floor(10 + Math.random() * 90),
      type: 'PERCENTAGE',
      value: 20,
      maxDiscount: '',
      minimumOrderValue: 0,
      startAt: new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      endAt: new Date(nextMonth.getTime() - nextMonth.getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      status: 'ACTIVE',
      usageLimit: '',
      perCustomerLimit: 1,
      isActive: true,
      isFeatured: false,
      applicability: 'ALL',
      productIds: [],
      categoryIds: [],
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (offer) => {
    setEditingOffer(offer);
    const startStr = offer.startAt ? new Date(offer.startAt).toISOString().slice(0, 16) : '';
    const endStr = offer.endAt ? new Date(offer.endAt).toISOString().slice(0, 16) : '';

    let appScope = 'ALL';
    if (offer.selectedProducts && offer.selectedProducts.length > 0) appScope = 'PRODUCTS';
    else if (offer.selectedCategories && offer.selectedCategories.length > 0) appScope = 'CATEGORIES';

    setFormData({
      name: offer.name || '',
      description: offer.description || '',
      code: offer.code || '',
      type: offer.type || 'PERCENTAGE',
      value: offer.value || 0,
      maxDiscount: offer.maxDiscount !== null ? offer.maxDiscount : '',
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
        const res = await axiosClient.put(`/admin/offers/${editingOffer.id}`, payload);
        if (res.success) {
          toast.success('Offer updated successfully!');
          setIsAddModalOpen(false);
          fetchOffers();
        }
      } else {
        const res = await axiosClient.post('/admin/offers', payload);
        if (res.success) {
          toast.success('Offer created successfully!');
          setIsAddModalOpen(false);
          fetchOffers();
        }
      }
    } catch (err) {
      console.error('Failed to save offer:', err);
      toast.error(err.message || 'Failed to save offer.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (offer) => {
    const newActiveState = !offer.isActive;
    try {
      const res = await axiosClient.patch(`/admin/offers/${offer.id}/status`, { isActive: newActiveState });
      if (res.success) {
        toast.success(`Offer '${offer.code}' ${newActiveState ? 'activated' : 'deactivated'}.`);
        setOffers((prev) =>
          prev.map((o) => (o.id === offer.id ? { ...o, isActive: newActiveState, effectiveStatus: res.data.effectiveStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update offer status.');
    }
  };

  // Delete Offer
  const handleDeleteOffer = async () => {
    if (!deletingOffer) return;
    try {
      const res = await axiosClient.delete(`/admin/offers/${deletingOffer.id}`);
      if (res.success) {
        toast.success(`Offer '${deletingOffer.code}' deleted.`);
        setDeletingOffer(null);
        fetchOffers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete offer.');
    }
  };

  const getStatusBadge = (effectiveStatus, isActive) => {
    if (!isActive) return <Badge variant="secondary">INACTIVE</Badge>;
    switch (effectiveStatus) {
      case 'ACTIVE':
        return <Badge variant="success">ACTIVE</Badge>;
      case 'SCHEDULED':
        return <Badge variant="warning">SCHEDULED</Badge>;
      case 'EXPIRED':
        return <Badge variant="danger">EXPIRED</Badge>;
      case 'EXHAUSTED':
        return <Badge variant="dark">EXHAUSTED</Badge>;
      case 'DRAFT':
        return <Badge variant="outline">DRAFT</Badge>;
      default:
        return <Badge variant="info">{effectiveStatus}</Badge>;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'PERCENTAGE':
        return 'Percentage OFF';
      case 'FLAT':
        return 'Flat Amount OFF';
      case 'PRODUCT_SPECIFIC':
        return 'Product Specific';
      case 'CATEGORY_SPECIFIC':
        return 'Category Specific';
      case 'CART_VALUE':
        return 'Cart Minimum Discount';
      case 'FREE_SHIPPING':
        return 'Free Express Shipping';
      default:
        return type;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1B351E] via-[#2F5D34] to-[#1B351E] p-6 rounded-3xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#C9A66B]" />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Offers & Discounts</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-200 mt-1">
            Enterprise coupon codes, promotional campaigns, usage analytics, and discount rules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center justify-center"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-2xl bg-[#C9A66B] hover:bg-[#b59359] text-[#1B351E] font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Offer
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#2F5D34]/10 text-[#2F5D34]">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Offers</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">{metrics.totalOffers}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Deals</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">{metrics.activeOffers}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Discounts Given</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">₹{metrics.totalDiscountGiven.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Promo Revenue</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">₹{metrics.discountedRevenueGenerated.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search offer name, code (e.g. KLN20), or details..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D34]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2F5D34] bg-white cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="INACTIVE">Inactive</option>
              <option value="EXPIRED">Expired</option>
              <option value="EXHAUSTED">Exhausted</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2F5D34] bg-white cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="PERCENTAGE">Percentage OFF</option>
              <option value="FLAT">Flat Amount OFF</option>
              <option value="PRODUCT_SPECIFIC">Product Specific</option>
              <option value="CATEGORY_SPECIFIC">Category Specific</option>
              <option value="FREE_SHIPPING">Free Shipping</option>
            </select>

            {(search || statusFilter !== 'ALL' || typeFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('ALL');
                  setTypeFilter('ALL');
                  setPage(1);
                }}
                className="px-3 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                <th className="py-4 px-5">Offer Name & Code</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Discount Value</th>
                <th className="py-4 px-4">Applicable To</th>
                <th className="py-4 px-4">Valid Period</th>
                <th className="py-4 px-4">Usage</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-5"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-5 text-right"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    <Tag className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="font-bold text-gray-700">No offers found</p>
                    <p className="text-xs text-gray-500 mt-0.5">Try adjusting search filters or create a new offer.</p>
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 text-sm leading-snug">{offer.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(offer.code)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#2F5D34]/10 text-[#2F5D34] font-mono font-black text-xs hover:bg-[#2F5D34]/20 transition-all cursor-pointer"
                            title="Click to copy code"
                          >
                            {offer.code}
                            {copiedCode === offer.code ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#2F5D34]" />}
                          </button>
                          {offer.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase flex items-center gap-0.5">
                              <Sparkles className="w-3 h-3 text-amber-600" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-gray-700">
                      {getTypeLabel(offer.type)}
                    </td>

                    <td className="py-4 px-4 font-black text-gray-900">
                      {offer.type === 'FREE_SHIPPING' ? (
                        <span className="text-emerald-700 font-bold">Free Shipping</span>
                      ) : offer.type === 'PERCENTAGE' ? (
                        <div>
                          <span>{offer.value}% OFF</span>
                          {offer.maxDiscount ? <div className="text-[10px] text-gray-500 font-normal">Max ₹{offer.maxDiscount}</div> : null}
                        </div>
                      ) : (
                        <span>₹{offer.value} OFF</span>
                      )}
                      {offer.minimumOrderValue > 0 && (
                        <div className="text-[10px] text-gray-500 font-normal mt-0.5">Min: ₹{offer.minimumOrderValue}</div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-gray-600">
                      {offer.selectedProducts && offer.selectedProducts.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">
                          <Package className="w-3.5 h-3.5" /> {offer.selectedProducts.length} Product(s)
                        </span>
                      ) : offer.selectedCategories && offer.selectedCategories.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg">
                          <Layers className="w-3.5 h-3.5" /> {offer.selectedCategories.length} Category(ies)
                        </span>
                      ) : (
                        <span className="text-gray-500 font-bold">All Products</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-gray-600">
                      <div className="flex flex-col text-[11px]">
                        <span>{new Date(offer.startAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                        <span className="text-gray-400">to {new Date(offer.endAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-extrabold text-gray-800">
                          {offer.usageCount} / {offer.usageLimit ? offer.usageLimit : '∞'}
                        </span>
                        <span className="text-[10px] text-gray-400">Limit: {offer.perCustomerLimit}/user</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {getStatusBadge(offer.effectiveStatus, offer.isActive)}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingOffer(offer)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                          title="View Offer Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(offer)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                          title="Edit Offer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(offer)}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            offer.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={offer.isActive ? 'Deactivate Offer' : 'Activate Offer'}
                        >
                          {offer.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingOffer(offer)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete Offer"
                        >
                          <Trash2 className="w-4 h-4" />
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
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT OFFER MODAL */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={editingOffer ? `Edit Offer: ${editingOffer.code}` : 'Create New Offer & Coupon'}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSaveOffer} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Offer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Festival Special 20% OFF"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D34]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Coupon Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. KLN20"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 font-mono font-black text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#2F5D34]"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, code: 'KLN' + Math.floor(10 + Math.random() * 90) })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#2F5D34] bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Offer Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2F5D34] bg-white cursor-pointer"
                >
                  <option value="PERCENTAGE">Percentage OFF (%)</option>
                  <option value="FLAT">Flat Amount OFF (₹)</option>
                  <option value="PRODUCT_SPECIFIC">Product Specific Discount</option>
                  <option value="CATEGORY_SPECIFIC">Category Specific Discount</option>
                  <option value="FREE_SHIPPING">Free Express Shipping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Discount Value ({formData.type === 'PERCENTAGE' ? '%' : '₹'}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  disabled={formData.type === 'FREE_SHIPPING'}
                  value={formData.type === 'FREE_SHIPPING' ? 0 : formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={formData.type === 'PERCENTAGE' ? '20' : '200'}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2F5D34] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Max Discount Cap (₹) <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  placeholder="e.g. 500 (Max cap for %)"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D34]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.minimumOrderValue}
                  onChange={(e) => setFormData({ ...formData, minimumOrderValue: e.target.value })}
                  placeholder="0 (No minimum)"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D34]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Total Usage Limit <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="e.g. 500 (Blank = unlimited)"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D34]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Per-Customer Usage Limit
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.perCustomerLimit}
                  onChange={(e) => setFormData({ ...formData, perCustomerLimit: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D34]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Start Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startAt}
                  onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D34]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  End Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endAt}
                  onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D34]"
                />
              </div>

              {/* Applicability Scope */}
              <div className="sm:col-span-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Product & Category Applicability
                </label>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="applicability"
                      value="ALL"
                      checked={formData.applicability === 'ALL'}
                      onChange={() => setFormData({ ...formData, applicability: 'ALL', productIds: [], categoryIds: [] })}
                      className="text-[#2F5D34] focus:ring-[#2F5D34]"
                    />
                    All Products
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="applicability"
                      value="PRODUCTS"
                      checked={formData.applicability === 'PRODUCTS'}
                      onChange={() => setFormData({ ...formData, applicability: 'PRODUCTS', categoryIds: [] })}
                      className="text-[#2F5D34] focus:ring-[#2F5D34]"
                    />
                    Selected Products
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="applicability"
                      value="CATEGORIES"
                      checked={formData.applicability === 'CATEGORIES'}
                      onChange={() => setFormData({ ...formData, applicability: 'CATEGORIES', productIds: [] })}
                      className="text-[#2F5D34] focus:ring-[#2F5D34]"
                    />
                    Selected Categories
                  </label>
                </div>

                {formData.applicability === 'PRODUCTS' && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-2xl max-h-40 overflow-y-auto space-y-1.5 border border-gray-200">
                    {availableProducts.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:bg-white p-1 rounded">
                        <input
                          type="checkbox"
                          value={p.id}
                          checked={formData.productIds.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, productIds: [...formData.productIds, p.id] });
                            } else {
                              setFormData({ ...formData, productIds: formData.productIds.filter((id) => id !== p.id) });
                            }
                          }}
                          className="rounded text-[#2F5D34] focus:ring-[#2F5D34]"
                        />
                        <span>{p.name} (₹{p.price})</span>
                      </label>
                    ))}
                  </div>
                )}

                {formData.applicability === 'CATEGORIES' && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-2xl max-h-40 overflow-y-auto space-y-1.5 border border-gray-200">
                    {availableCategories.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:bg-white p-1 rounded">
                        <input
                          type="checkbox"
                          value={c.id}
                          checked={formData.categoryIds.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, categoryIds: [...formData.categoryIds, c.id] });
                            } else {
                              setFormData({ ...formData, categoryIds: formData.categoryIds.filter((id) => id !== c.id) });
                            }
                          }}
                          className="rounded text-[#2F5D34] focus:ring-[#2F5D34]"
                        />
                        <span>{c.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 text-xs text-gray-500">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Public description or internal notes about this promotional campaign..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D34]"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[#2F5D34] focus:ring-[#2F5D34]"
                  />
                  Active Offer
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-[#2F5D34] focus:ring-[#2F5D34]"
                  />
                  Show on Storefront Active Banner
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-6 py-2.5 rounded-2xl bg-[#2F5D34] hover:bg-[#1B351E] text-white text-xs font-extrabold uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
              >
                {formSubmitting ? 'Saving...' : editingOffer ? 'Update Offer' : 'Create Offer'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW OFFER DRAWER / DETAIL MODAL */}
      {viewingOffer && (
        <Modal
          isOpen={Boolean(viewingOffer)}
          onClose={() => setViewingOffer(null)}
          title={`Offer Details: ${viewingOffer.code}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs text-gray-700">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-gray-900">{viewingOffer.name}</span>
                {getStatusBadge(viewingOffer.effectiveStatus, viewingOffer.isActive)}
              </div>
              <p className="text-gray-600 leading-relaxed">{viewingOffer.description || 'No description provided.'}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-medium">
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Coupon Code</span>
                <p className="font-mono font-black text-sm text-[#2F5D34]">{viewingOffer.code}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Offer Type</span>
                <p className="font-bold">{getTypeLabel(viewingOffer.type)}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Discount Value</span>
                <p className="font-black text-sm">{viewingOffer.type === 'PERCENTAGE' ? `${viewingOffer.value}% OFF` : `₹${viewingOffer.value} OFF`}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Min Order</span>
                <p className="font-bold">₹{viewingOffer.minimumOrderValue}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Total Usages</span>
                <p className="font-bold">{viewingOffer.usageCount} / {viewingOffer.usageLimit || 'Unlimited'}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">User Limit</span>
                <p className="font-bold">{viewingOffer.perCustomerLimit} order(s)/user</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <h4 className="font-black text-gray-900 mb-2 uppercase tracking-wider text-[10px]">Recent Customer Redemption Log</h4>
              {viewingOffer.usages && viewingOffer.usages.length > 0 ? (
                <div className="max-h-48 overflow-y-auto space-y-1.5">
                  {viewingOffer.usages.map((u) => (
                    <div key={u.id} className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900">{u.user?.firstName} {u.user?.lastName}</span>
                        <span className="text-gray-400 text-[10px] ml-2">({u.user?.email})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700">-₹{u.discountAmount}</span>
                        <div className="text-[10px] text-gray-400">{new Date(u.usedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No customer usage records recorded yet.</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingOffer && (
        <Modal
          isOpen={Boolean(deletingOffer)}
          onClose={() => setDeletingOffer(null)}
          title="Confirm Offer Deletion"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs text-gray-700">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-none mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">Are you sure you want to delete this offer?</p>
                <p className="text-rose-700 mt-1">
                  Offer <strong className="font-mono">{deletingOffer.code}</strong> ({deletingOffer.name}) will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingOffer(null)}
                className="px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOffer}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold cursor-pointer"
              >
                Delete Offer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
