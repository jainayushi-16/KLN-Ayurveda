'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Badge from '../../../components/common/Badge';
import Pagination from '../../../components/common/Pagination';
import InvoiceModal from '../../../components/invoices/InvoiceModal';
import { Eye, Search, Filter, RotateCcw, CreditCard, ShoppingBag, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const paymentStatuses = ['PAID', 'PENDING', 'FAILED', 'REFUNDED'];
const paymentMethods = ['UPI', 'CREDIT_CARD', 'NET_BANKING', 'COD'];

export default function PaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [search, setSearch] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        search,
        paymentStatus: selectedPaymentStatus,
        paymentMethod: selectedPaymentMethod,
      }).toString();

      const res = await axiosClient.get(`/admin/orders?${queryParams}`);
      if (res.success) {
        setOrders(res.data || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, totalItems: res.data?.length || 0 });
      }
    } catch (err) {
      toast.error('Failed to load payment transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, [search, selectedPaymentStatus, selectedPaymentMethod]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedPaymentStatus('');
    setSelectedPaymentMethod('');
  };

  const getMethodBadge = (method) => {
    switch (method) {
      case 'UPI':
        return { label: 'UPI Instant', bg: '#E0F2FE', color: '#0369A1' };
      case 'CREDIT_CARD':
        return { label: 'Credit Card', bg: '#F3E8FF', color: '#7E22CE' };
      case 'NET_BANKING':
        return { label: 'Net Banking', bg: '#FEF3C7', color: '#B45309' };
      case 'COD':
        return { label: 'Cash on Delivery', bg: '#F3F4F6', color: '#374151' };
      default:
        return { label: method || 'Card / UPI', bg: '#F3F4F6', color: '#374151' };
    }
  };

  return (
    <div>
      <div className="card-table-wrapper" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid rgba(47, 93, 52, 0.16)', boxShadow: '0 12px 32px rgba(47, 93, 52, 0.06)', overflow: 'hidden' }}>
        {/* Filter Toolbar */}
        <div className="table-toolbar" style={{ padding: '1rem 1.25rem', background: '#F9FAF7', borderBottom: '1px solid rgba(47, 93, 52, 0.12)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
              {/* Search Box */}
              <div className="search-input-box" style={{ minWidth: '240px', flex: 1 }}>
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Search order #, customer name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Payment Status Filter */}
              <select
                className="form-control"
                style={{ width: '160px', borderRadius: '12px', borderColor: 'rgba(47, 93, 52, 0.2)', fontWeight: '600' }}
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              >
                <option value="">All Payment Status</option>
                {paymentStatuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              {/* Payment Method Filter */}
              <select
                className="form-control"
                style={{ width: '160px', borderRadius: '12px', borderColor: 'rgba(47, 93, 52, 0.2)', fontWeight: '600' }}
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="">All Methods</option>
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>{m.replace('_', ' ')}</option>
                ))}
              </select>

              {/* Clear Filters Button */}
              {(search || selectedPaymentStatus || selectedPaymentMethod) && (
                <button
                  onClick={handleClearFilters}
                  style={{
                    background: '#FFE4E6',
                    color: '#E11D48',
                    border: '1px solid rgba(225, 29, 72, 0.2)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                  }}
                  title="Clear all active filters"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2F5D34', background: '#E7F0E4', padding: '0.35rem 0.85rem', borderRadius: '20px', whiteSpace: 'nowrap' }}>
              Total Payments: {pagination.totalItems || orders.length}
            </div>
          </div>
        </div>

        {/* Frame Table Container (No Horizontal Scrollbar) */}
        <div style={{ overflowX: 'hidden', width: '100%' }}>
          <table className="custom-table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0' }}>
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '6%' }} />
            </colgroup>
            <thead>
              <tr style={{ background: '#F4F7F2' }}>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Order #</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Customer</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Date</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Amount</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Method</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Status</th>
                <th style={{ padding: '0.9rem 0.4rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34', textAlign: 'center' }}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#6B7280', padding: '3rem 1rem', fontWeight: '600' }}>
                    Loading payment records...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => {
                  const customerName = ord.user
                    ? `${ord.user.firstName || ''} ${ord.user.lastName || ''}`.trim()
                    : ord.shippingAddress?.fullName || 'Customer';
                  const customerInitial = customerName ? customerName[0].toUpperCase() : 'C';
                  const methodStyle = getMethodBadge(ord.paymentMethod);

                  return (
                    <tr key={ord.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.2s ease' }} className="hover:bg-[#F9FAF7]">
                      {/* Order Number */}
                      <td style={{ padding: '0.85rem 0.6rem', verticalAlign: 'middle', overflow: 'hidden' }}>
                        <div style={{ fontWeight: '700', color: '#2F5D34', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <ShoppingBag size={14} className="text-[#C9A66B] flex-none" />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>#{ord.orderNumber}</span>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td style={{ padding: '0.85rem 0.6rem', verticalAlign: 'middle', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #2F5D34, #5B7C3A)', color: '#FFFFFF', fontWeight: '700', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {customerInitial}
                          </div>
                          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            <div style={{ fontWeight: '700', color: '#222123', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customerName}</div>
                            <div style={{ fontSize: '0.7rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ord.user?.email || ord.shippingAddress?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Order Date */}
                      <td style={{ padding: '0.85rem 0.6rem', verticalAlign: 'middle', color: '#4B5563', fontSize: '0.78rem', fontWeight: '500', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={12} style={{ color: '#9CA3AF' }} />
                          <span>{new Date(ord.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td style={{ padding: '0.85rem 0.6rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: '800', color: '#2F5D34', fontSize: '0.9rem' }}>
                          ₹{Number(ord.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Payment Method Badge */}
                      <td style={{ padding: '0.85rem 0.6rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: methodStyle.color, background: methodStyle.bg, padding: '0.25rem 0.55rem', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CreditCard size={11} />
                          <span>{methodStyle.label}</span>
                        </span>
                      </td>

                      {/* Payment Status Badge */}
                      <td style={{ padding: '0.85rem 0.6rem', verticalAlign: 'middle' }}>
                        <Badge type={ord.paymentStatus} text={ord.paymentStatus} />
                      </td>

                      {/* Invoice Button */}
                      <td style={{ padding: '0.85rem 0.4rem', verticalAlign: 'middle', textAlign: 'center' }}>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          style={{
                            background: '#E7F0E4',
                            color: '#2F5D34',
                            border: '1px solid rgba(47, 93, 52, 0.2)',
                            padding: '0.35rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                          }}
                          className="hover:bg-[#2F5D34] hover:text-white"
                          title="View / Print Tax Invoice"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#6B7280', padding: '3rem 1rem', fontWeight: '600' }}>
                    No payment records match selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Container */}
        <div style={{ padding: '0.85rem 1.25rem', background: '#F9FAF7', borderTop: '1px solid rgba(47, 93, 52, 0.12)' }}>
          <Pagination
            pagination={pagination}
            onPageChange={(page) => fetchPayments(page)}
          />
        </div>
      </div>

      {selectedOrder && (
        <InvoiceModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
