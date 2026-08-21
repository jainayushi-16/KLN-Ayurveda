'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axiosClient from '../../../api/axiosClient';
import Modal from '../../../components/common/Modal';
import Badge from '../../../components/common/Badge';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  ShoppingBag,
  IndianRupee,
  UserPlus,
  RefreshCw,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  PackageCheck,
  AlertCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filterActivity, setFilterActivity] = useState('ALL'); // ALL, ACTIVE, INACTIVE
  const [sortBy, setSortBy] = useState('NEWEST'); // NEWEST, OLDEST, MOST_ORDERS, MOST_SPENT

  // Selected customer modals
  const [viewCustomer, setViewCustomer] = useState(null);
  const [detailedCustomer, setDetailedCustomer] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('overview'); // overview, addresses, orders, reviews

  const [editCustomer, setEditCustomer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomers = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await axiosClient.get('/admin/customers');
      if (res && (res.success || Array.isArray(res.data))) {
        setCustomers(res.data || []);
        if (showToast) toast.success('Customer directory refreshed!');
      }
    } catch (err) {
      console.error('Fetch customers error:', err);
      toast.error(err?.message || 'Failed to load customers from backend');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch full detailed customer on View click
  const handleOpenViewModal = async (cust) => {
    setViewCustomer(cust);
    setDetailedCustomer(cust);
    setActiveDetailTab('overview');
    setLoadingDetail(true);
    try {
      const res = await axiosClient.get(`/admin/customers/${cust.id}`);
      if (res && res.data) {
        setDetailedCustomer(res.data);
      }
    } catch (err) {
      console.warn('Customer detailed fetch note:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (cust) => {
    setEditCustomer(cust);
    setEditFormData({
      firstName: cust.firstName || '',
      lastName: cust.lastName || '',
      email: cust.email || '',
      phone: cust.phone || '',
      role: cust.role || 'CUSTOMER',
    });
  };

  // Submit Edit Form
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!editCustomer) return;
    setSubmittingEdit(true);
    try {
      const res = await axiosClient.put(`/admin/customers/${editCustomer.id}`, editFormData);
      if (res && (res.success || res.data)) {
        toast.success('Customer profile updated successfully!');
        setEditCustomer(null);
        fetchCustomers();
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to update customer profile');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Confirm Delete
  const handleDeleteCustomer = async () => {
    if (!deleteCustomerId) return;
    setDeleting(true);
    try {
      await axiosClient.delete(`/admin/customers/${deleteCustomerId}`);
      toast.success('Customer account deleted successfully');
      setDeleteCustomerId(null);
      fetchCustomers();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  // Computed Stat Metrics
  const stats = useMemo(() => {
    const totalCount = customers.length;
    const activeCount = customers.filter(
      (c) => (c._count?.orders || (c.orders && c.orders.length) || 0) > 0
    ).length;

    const totalRevenue = customers.reduce((sum, c) => {
      const spent = c.totalSpent || 0;
      return sum + spent;
    }, 0);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const newThisMonth = customers.filter(
      (c) => new Date(c.createdAt) >= thirtyDaysAgo
    ).length;

    return { totalCount, activeCount, totalRevenue, newThisMonth };
  }, [customers]);

  // Filtered & Sorted Customer List
  const processedCustomers = useMemo(() => {
    let result = [...customers];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((c) => {
        const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
        const email = (c.email || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q);
      });
    }

    // Activity filter
    if (filterActivity === 'ACTIVE') {
      result = result.filter(
        (c) => (c._count?.orders || (c.orders && c.orders.length) || 0) > 0
      );
    } else if (filterActivity === 'INACTIVE') {
      result = result.filter(
        (c) => (c._count?.orders || (c.orders && c.orders.length) || 0) === 0
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'OLDEST') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'MOST_ORDERS') {
        const cntA = a._count?.orders || (a.orders && a.orders.length) || 0;
        const cntB = b._count?.orders || (b.orders && b.orders.length) || 0;
        return cntB - cntA;
      } else if (sortBy === 'MOST_SPENT') {
        return (b.totalSpent || 0) - (a.totalSpent || 0);
      }
      return 0;
    });

    return result;
  }, [customers, search, filterActivity, sortBy]);

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {/* Top Banner Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            Customer Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            View, manage, edit, and inspect all registered customers connected with your database.
          </p>
        </div>

        <button
          onClick={() => fetchCustomers(true)}
          disabled={refreshing || loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={15} className={refreshing ? 'spin-anim' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Directory'}</span>
        </button>
      </div>

      {/* Analytics Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        {/* Card 1: Total Customers */}
        <div style={{
          background: 'var(--bg-card, #1A1D24)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total Customers</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.totalCount}</div>
          </div>
        </div>

        {/* Card 2: Active Buyers */}
        <div style={{
          background: 'var(--bg-card, #1A1D24)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Active Buyers</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.activeCount}</div>
          </div>
        </div>

        {/* Card 3: Customer Lifetime Value */}
        <div style={{
          background: 'var(--bg-card, #1A1D24)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total Customer Value</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              ₹{stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Card 4: New This Month */}
        <div style={{
          background: 'var(--bg-card, #1A1D24)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#c084fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserPlus size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>New (Last 30 Days)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.newThisMonth}</div>
          </div>
        </div>
      </div>

      {/* Main Table Card Wrapper */}
      <div className="card-table-wrapper" style={{
        background: 'var(--bg-card, #1A1D24)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        overflow: 'hidden'
      }}>
        {/* Toolbar Controls */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '0.5rem 1rem',
            minWidth: '280px',
            flex: '1 max-content'
          }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                width: '100%'
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter & Sort Dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Filter by Activity */}
            <select
              value={filterActivity}
              onChange={(e) => setFilterActivity(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                padding: '0.55rem 0.85rem',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL" style={{ background: '#1A1D24' }}>All Activity</option>
              <option value="ACTIVE" style={{ background: '#1A1D24' }}>With Orders</option>
              <option value="INACTIVE" style={{ background: '#1A1D24' }}>No Orders Yet</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                padding: '0.55rem 0.85rem',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="NEWEST" style={{ background: '#1A1D24' }}>Newest Joined</option>
              <option value="OLDEST" style={{ background: '#1A1D24' }}>Oldest Joined</option>
              <option value="MOST_ORDERS" style={{ background: '#1A1D24' }}>Most Orders</option>
              <option value="MOST_SPENT" style={{ background: '#1A1D24' }}>Highest Total Spent</option>
            </select>
          </div>
        </div>

        {/* Customer Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.15)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left' }}>Contact Info</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left' }}>Joined Date</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Total Orders</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Total Spent</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <RefreshCw size={24} className="spin-anim" style={{ color: 'var(--accent-gold)' }} />
                      <span>Fetching customer profiles from backend...</span>
                    </div>
                  </td>
                </tr>
              ) : processedCustomers.length > 0 ? (
                processedCustomers.map((cust) => {
                  const fullName = `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || 'Customer';
                  const initial = (cust.firstName?.[0] || cust.email?.[0] || 'C').toUpperCase();
                  const orderCount = cust._count?.orders || (cust.orders && cust.orders.length) || 0;
                  const totalSpent = cust.totalSpent || 0;

                  return (
                    <tr key={cust.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}>
                      {/* Name & Avatar */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {cust.avatar ? (
                            <img
                              src={cust.avatar}
                              alt={fullName}
                              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #2F5D34, #1e3d22)',
                              color: '#ffffff',
                              fontWeight: '700',
                              fontSize: '0.95rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}>
                              {initial}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                              {fullName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span style={{
                                padding: '0.1rem 0.4rem',
                                borderRadius: '6px',
                                background: cust.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                                color: cust.role === 'ADMIN' ? '#f87171' : 'var(--text-muted)',
                                fontWeight: '600',
                                fontSize: '0.7rem'
                              }}>
                                {cust.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{cust.email}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cust.phone || 'No phone'}</div>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {new Date(cust.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Orders Count */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <span style={{
                          background: orderCount > 0 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.06)',
                          color: orderCount > 0 ? '#60a5fa' : 'var(--text-muted)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <ShoppingBag size={12} /> {orderCount} {orderCount === 1 ? 'Order' : 'Orders'}
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: '700', color: totalSpent > 0 ? '#34d399' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                        ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            className="btn-icon"
                            title="View Full Customer Details"
                            onClick={() => handleOpenViewModal(cust)}
                            style={{
                              padding: '0.45rem',
                              borderRadius: '8px',
                              background: 'rgba(59, 130, 246, 0.12)',
                              color: '#60a5fa',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn-icon"
                            title="Edit Customer Profile"
                            onClick={() => handleOpenEditModal(cust)}
                            style={{
                              padding: '0.45rem',
                              borderRadius: '8px',
                              background: 'rgba(245, 158, 11, 0.12)',
                              color: '#fbbf24',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="btn-icon"
                            title="Delete Customer Account"
                            onClick={() => setDeleteCustomerId(cust.id)}
                            style={{
                              padding: '0.45rem',
                              borderRadius: '8px',
                              background: 'rgba(239, 68, 68, 0.12)',
                              color: '#f87171',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
                    <AlertCircle size={32} style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.5 }} />
                    <div style={{ fontWeight: '600' }}>No customers found</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      Try adjusting your search query or filter criteria.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Customer Detailed View Drawer / Modal */}
      {viewCustomer && (
        <Modal
          isOpen={!!viewCustomer}
          onClose={() => setViewCustomer(null)}
          title={`Customer File — ${detailedCustomer?.firstName || ''} ${detailedCustomer?.lastName || viewCustomer.email}`}
          maxWidth="700px"
        >
          {loadingDetail ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="spin-anim" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
              Loading complete customer details from database...
            </div>
          ) : (
            <div>
              {/* Header Info Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '12px',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2F5D34, #1e3d22)',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {(detailedCustomer?.firstName?.[0] || detailedCustomer?.email?.[0] || 'C').toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {detailedCustomer?.firstName} {detailedCustomer?.lastName}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                    <span><Mail size={12} style={{ display: 'inline', marginRight: '3px' }} /> {detailedCustomer?.email}</span>
                    {detailedCustomer?.phone && <span><Phone size={12} style={{ display: 'inline', marginRight: '3px' }} /> {detailedCustomer?.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Detail Navigation Tabs */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '1.25rem'
              }}>
                <button
                  onClick={() => setActiveDetailTab('overview')}
                  style={{
                    padding: '0.6rem 1rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeDetailTab === 'overview' ? '2px solid var(--accent-gold, #fbbf24)' : '2px solid transparent',
                    color: activeDetailTab === 'overview' ? 'var(--accent-gold, #fbbf24)' : 'var(--text-muted)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveDetailTab('addresses')}
                  style={{
                    padding: '0.6rem 1rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeDetailTab === 'addresses' ? '2px solid var(--accent-gold, #fbbf24)' : '2px solid transparent',
                    color: activeDetailTab === 'addresses' ? 'var(--accent-gold, #fbbf24)' : 'var(--text-muted)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Addresses ({detailedCustomer?.addresses?.length || 0})
                </button>
                <button
                  onClick={() => setActiveDetailTab('orders')}
                  style={{
                    padding: '0.6rem 1rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeDetailTab === 'orders' ? '2px solid var(--accent-gold, #fbbf24)' : '2px solid transparent',
                    color: activeDetailTab === 'orders' ? 'var(--accent-gold, #fbbf24)' : 'var(--text-muted)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Orders ({detailedCustomer?.orders?.length || 0})
                </button>
                <button
                  onClick={() => setActiveDetailTab('reviews')}
                  style={{
                    padding: '0.6rem 1rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeDetailTab === 'reviews' ? '2px solid var(--accent-gold, #fbbf24)' : '2px solid transparent',
                    color: activeDetailTab === 'reviews' ? 'var(--accent-gold, #fbbf24)' : 'var(--text-muted)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Reviews ({detailedCustomer?.reviews?.length || 0})
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeDetailTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Account Role</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{detailedCustomer?.role}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Date of Birth</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{detailedCustomer?.dateOfBirth || 'Not specified'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Gender</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{detailedCustomer?.gender || 'Not specified'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Registration Date</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      {new Date(detailedCustomer?.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', gridColumn: 'span 2' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Lifetime Spending</div>
                    <div style={{ fontWeight: '700', color: '#34d399', fontSize: '1.2rem', marginTop: '0.2rem' }}>
                      ₹{(detailedCustomer?.totalSpent || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Addresses */}
              {activeDetailTab === 'addresses' && (
                <div>
                  {detailedCustomer?.addresses && detailedCustomer.addresses.length > 0 ? (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {detailedCustomer.addresses.map((addr) => (
                        <div key={addr.id} style={{
                          padding: '0.85rem',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '10px',
                          borderLeft: addr.isDefault ? '4px solid #2F5D34' : '4px solid transparent'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                              <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                              {addr.street}
                            </span>
                            {addr.isDefault && (
                              <span style={{ background: '#2F5D34', color: '#fff', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: '700' }}>
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem' }}>
                      No delivery addresses saved for this customer.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Orders History */}
              {activeDetailTab === 'orders' && (
                <div>
                  {detailedCustomer?.orders && detailedCustomer.orders.length > 0 ? (
                    <table className="custom-table" style={{ width: '100%', fontSize: '0.85rem' }}>
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedCustomer.orders.map((ord) => (
                          <tr key={ord.id}>
                            <td style={{ fontWeight: '600', color: 'var(--accent-gold-light, #fbbf24)' }}>#{ord.orderNumber}</td>
                            <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                            <td style={{ fontWeight: '700' }}>₹{ord.totalAmount.toFixed(2)}</td>
                            <td><Badge type={ord.status} text={ord.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem' }}>
                      No orders placed by this customer yet.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Reviews */}
              {activeDetailTab === 'reviews' && (
                <div>
                  {detailedCustomer?.reviews && detailedCustomer.reviews.length > 0 ? (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {detailedCustomer.reviews.map((rev) => (
                        <div key={rev.id} style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                            <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                              Product: {rev.product?.name || 'Item'}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: '700' }}>
                              <Star size={12} fill="#fbbf24" /> {rev.rating}/5
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem' }}>
                      No product reviews written by this customer yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal>
      )}

      {/* 2. Edit Customer Modal */}
      {editCustomer && (
        <Modal
          isOpen={!!editCustomer}
          onClose={() => setEditCustomer(null)}
          title={`Edit Customer — ${editCustomer.email}`}
          maxWidth="500px"
        >
          <form onSubmit={handleSaveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                First Name
              </label>
              <input
                type="text"
                required
                value={editFormData.firstName}
                onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Last Name
              </label>
              <input
                type="text"
                required
                value={editFormData.lastName}
                onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Account Role
              </label>
              <select
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  background: '#1A1D24',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setEditCustomer(null)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '10px',
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingEdit}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '10px',
                  background: '#2F5D34',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  opacity: submittingEdit ? 0.6 : 1
                }}
              >
                {submittingEdit ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. Delete Confirmation Modal */}
      {deleteCustomerId && (
        <Modal
          isOpen={!!deleteCustomerId}
          onClose={() => setDeleteCustomerId(null)}
          title="Confirm Account Deletion"
          maxWidth="450px"
        >
          <div style={{ padding: '0.5rem 0' }}>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
              Are you sure you want to permanently delete this customer account? This will remove all associated user profile data and addresses from the database.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setDeleteCustomerId(null)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '10px',
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
                disabled={deleting}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '10px',
                  background: '#ef4444',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  opacity: deleting ? 0.6 : 1
                }}
              >
                {deleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
