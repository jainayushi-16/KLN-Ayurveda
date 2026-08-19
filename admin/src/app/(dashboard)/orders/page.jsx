'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Pagination from '../../../components/common/Pagination';
import InvoiceModal from '../../../components/invoices/InvoiceModal';
import { Search, Eye, ShoppingBag, Truck, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const paymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const [viewingOrder, setViewingOrder] = useState(null);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/admin/orders?page=${page}&limit=10&status=${selectedStatus}&search=${search}`);
      if (res.success) {
        setOrders(res.data || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, totalItems: res.data?.length || 0 });
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [search, selectedStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await axiosClient.put(`/admin/orders/${orderId}/payment`, { paymentStatus: newPaymentStatus });
      toast.success(`Payment status updated to ${newPaymentStatus}`);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to update payment status');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'PAID':
        return { bg: '#E7F0E4', color: '#2F5D34', border: 'rgba(47, 93, 52, 0.3)' };
      case 'PROCESSING':
      case 'PENDING':
        return { bg: '#FEF3C7', color: '#D97706', border: 'rgba(217, 119, 6, 0.3)' };
      case 'SHIPPED':
        return { bg: '#F3E8FF', color: '#7E22CE', border: 'rgba(126, 34, 206, 0.3)' };
      case 'CANCELLED':
      case 'FAILED':
      case 'REFUNDED':
        return { bg: '#FFE4E6', color: '#E11D48', border: 'rgba(225, 29, 72, 0.3)' };
      default:
        return { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' };
    }
  };

  return (
    <div>
      <div className="card-table-wrapper" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid rgba(47, 93, 52, 0.16)', boxShadow: '0 12px 32px rgba(47, 93, 52, 0.06)', overflow: 'hidden' }}>
        {/* Toolbar Header */}
        <div className="table-toolbar" style={{ padding: '1rem 1.25rem', background: '#F9FAF7', borderBottom: '1px solid rgba(47, 93, 52, 0.12)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
              <div className="search-input-box" style={{ minWidth: '260px', flex: 1 }}>
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Search order #, customer name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ width: '160px', borderRadius: '12px', borderColor: 'rgba(47, 93, 52, 0.2)', fontWeight: '600' }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {orderStatuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2F5D34', background: '#E7F0E4', padding: '0.35rem 0.85rem', borderRadius: '20px', whiteSpace: 'nowrap' }}>
              Total Orders: {pagination.totalItems || orders.length}
            </div>
          </div>
        </div>

        {/* Frame-Adjusted Table (No Horizontal Scrollbar) */}
        <div style={{ overflowX: 'hidden', width: '100%' }}>
          <table className="custom-table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0' }}>
            <colgroup>
              <col style={{ width: '14%' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '4%' }} />
            </colgroup>
            <thead>
              <tr style={{ background: '#F4F7F2' }}>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Order #</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Customer</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Date</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Logistics / AWB</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Total</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Payment</th>
                <th style={{ padding: '0.9rem 0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34' }}>Status</th>
                <th style={{ padding: '0.9rem 0.4rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2F5D34', textAlign: 'center' }}>View</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#6B7280', padding: '3rem 1rem', fontWeight: '600' }}>
                    Loading customer orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => {
                  const customerName = ord.user
                    ? `${ord.user.firstName || ''} ${ord.user.lastName || ''}`.trim()
                    : ord.shippingAddress?.fullName || 'Customer';
                  const customerInitial = customerName ? customerName[0].toUpperCase() : 'C';
                  const carrier = ord.carrier || 'BlueDart Express';
                  const awbNumber = ord.trackingNumber || `TRK-${(ord.orderNumber || '').replace('KLN-', '')}`;

                  const pStyle = getStatusStyle(ord.paymentStatus);
                  const fStyle = getStatusStyle(ord.status);

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

                      {/* Logistics / AWB */}
                      <td style={{ padding: '0.85rem 0.6rem', verticalAlign: 'middle', overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.78rem', overflow: 'hidden' }}>
                          <div style={{ fontWeight: '700', color: '#222123', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Truck size={12} className="text-[#2F5D34] flex-none" />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{carrier}</span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#C9A66B', fontFamily: 'monospace', fontWeight: '700', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {awbNumber}
                          </div>
                        </div>
                      </td>

                      {/* Total Price */}
                      <td style={{ padding: '0.85rem 0.6rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: '800', color: '#2F5D34', fontSize: '0.85rem' }}>
                          ₹{Number(ord.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Payment Status Dropdown Pill */}
                      <td style={{ padding: '0.85rem 0.4rem', verticalAlign: 'middle' }}>
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value)}
                          style={{
                            background: pStyle.bg,
                            color: pStyle.color,
                            border: `1px solid ${pStyle.border}`,
                            borderRadius: '20px',
                            padding: '0.25rem 0.4rem',
                            fontSize: '0.68rem',
                            fontWeight: '700',
                            outline: 'none',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            width: '100%',
                          }}
                        >
                          {paymentStatuses.map((ps) => (
                            <option key={ps} value={ps} style={{ background: '#FFFFFF', color: '#222123' }}>{ps}</option>
                          ))}
                        </select>
                      </td>

                      {/* Fulfillment Status Dropdown Pill */}
                      <td style={{ padding: '0.85rem 0.4rem', verticalAlign: 'middle' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          style={{
                            background: fStyle.bg,
                            color: fStyle.color,
                            border: `1px solid ${fStyle.border}`,
                            borderRadius: '20px',
                            padding: '0.25rem 0.4rem',
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            outline: 'none',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            width: '100%',
                          }}
                        >
                          {orderStatuses.map((st) => (
                            <option key={st} value={st} style={{ background: '#FFFFFF', color: '#222123' }}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 0.4rem', verticalAlign: 'middle', textAlign: 'center' }}>
                        <button
                          onClick={() => setViewingOrder(ord)}
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
                          title="View Invoice & Order Details"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#6B7280', padding: '3rem 1rem', fontWeight: '600' }}>
                    No orders found matching search criteria.
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
            onPageChange={(page) => fetchOrders(page)}
          />
        </div>
      </div>

      {viewingOrder && (
        <InvoiceModal
          isOpen={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          order={viewingOrder}
        />
      )}
    </div>
  );
}
