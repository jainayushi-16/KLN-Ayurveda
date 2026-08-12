'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Pagination from '../../../components/common/Pagination';
import InvoiceModal from '../../../components/invoices/InvoiceModal';
import { Search, Eye, ShoppingBag, Truck, CreditCard, Calendar, User } from 'lucide-react';
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
        <div className="table-toolbar" style={{ padding: '1.25rem 1.5rem', background: '#F9FAF7', borderBottom: '1px solid rgba(47, 93, 52, 0.12)' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
              <div className="search-input-box" style={{ minWidth: '320px' }}>
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
                style={{ width: '180px', borderRadius: '12px', borderColor: 'rgba(47, 93, 52, 0.2)', fontWeight: '600' }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {orderStatuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#2F5D34', background: '#E7F0E4', padding: '0.4rem 1rem', borderRadius: '20px' }}>
              Total Orders: {pagination.totalItems || orders.length}
            </div>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="custom-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
            <thead>
              <tr style={{ background: '#F4F7F2' }}>
                <th style={{ padding: '1.1rem 1.25rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2F5D34' }}>Order #</th>
                <th style={{ padding: '1.1rem 1.25rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2F5D34' }}>Customer</th>
                <th style={{ padding: '1.1rem 1.25rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2F5D34' }}>Order Date</th>
                <th style={{ padding: '1.1rem 1.25rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2F5D34' }}>Logistics / AWB</th>
                <th style={{ padding: '1.1rem 1.25rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2F5D34' }}>Total Amount</th>
                <th style={{ padding: '1.1rem 1.25rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2F5D34' }}>Payment Status</th>
                <th style={{ padding: '1.1rem 1.25rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2F5D34' }}>Fulfillment Status</th>
                <th style={{ padding: '1.1rem 1.25rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2F5D34', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#6B7280', padding: '3rem 1.5rem', fontWeight: '600' }}>
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
                      <td style={{ padding: '1.25rem 1.25rem', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: '700', color: '#2F5D34', fontSize: '0.95rem', display: 'flex', items: 'center', gap: '0.4rem' }}>
                          <ShoppingBag size={16} className="text-[#C9A66B]" />
                          <span>#{ord.orderNumber}</span>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td style={{ padding: '1.25rem 1.25rem', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2F5D34, #5B7C3A)', color: '#FFFFFF', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {customerInitial}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#222123', fontSize: '0.9rem' }}>{customerName}</div>
                            <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '2px' }}>{ord.user?.email || ord.shippingAddress?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Order Date */}
                      <td style={{ padding: '1.25rem 1.25rem', verticalAlign: 'middle', color: '#4B5563', fontSize: '0.85rem', fontWeight: '500' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={14} style={{ color: '#9CA3AF' }} />
                          <span>{new Date(ord.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Logistics / AWB */}
                      <td style={{ padding: '1.25rem 1.25rem', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: '700', color: '#222123', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Truck size={14} className="text-[#2F5D34]" />
                            <span>{carrier}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#C9A66B', fontFamily: 'monospace', fontWeight: '700', marginTop: '2px' }}>
                            {awbNumber}
                          </div>
                        </div>
                      </td>

                      {/* Total Price */}
                      <td style={{ padding: '1.25rem 1.25rem', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: '800', color: '#2F5D34', fontSize: '1rem' }}>
                          ₹{Number(ord.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Payment Status Dropdown Pill */}
                      <td style={{ padding: '1.25rem 1.25rem', verticalAlign: 'middle' }}>
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value)}
                          style={{
                            background: pStyle.bg,
                            color: pStyle.color,
                            border: `1px solid ${pStyle.border}`,
                            borderRadius: '30px',
                            padding: '0.35rem 0.85rem',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            outline: 'none',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                          }}
                        >
                          {paymentStatuses.map((ps) => (
                            <option key={ps} value={ps} style={{ background: '#FFFFFF', color: '#222123' }}>{ps}</option>
                          ))}
                        </select>
                      </td>

                      {/* Fulfillment Status Dropdown Pill */}
                      <td style={{ padding: '1.25rem 1.25rem', verticalAlign: 'middle' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          style={{
                            background: fStyle.bg,
                            color: fStyle.color,
                            border: `1px solid ${fStyle.border}`,
                            borderRadius: '30px',
                            padding: '0.4rem 0.9rem',
                            fontSize: '0.78rem',
                            fontWeight: '800',
                            outline: 'none',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                          }}
                        >
                          {orderStatuses.map((st) => (
                            <option key={st} value={st} style={{ background: '#FFFFFF', color: '#222123' }}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1.25rem 1.25rem', verticalAlign: 'middle', textAlign: 'right' }}>
                        <button
                          onClick={() => setViewingOrder(ord)}
                          style={{
                            background: '#E7F0E4',
                            color: '#2F5D34',
                            border: '1px solid rgba(47, 93, 52, 0.2)',
                            padding: '0.5rem 0.85rem',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            transition: 'all 0.2s ease',
                          }}
                          className="hover:bg-[#2F5D34] hover:text-white"
                          title="View Invoice & Order Details"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#6B7280', padding: '3rem 1.5rem', fontWeight: '600' }}>
                    No orders found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Container */}
        <div style={{ padding: '1rem 1.5rem', background: '#F9FAF7', borderTop: '1px solid rgba(47, 93, 52, 0.12)' }}>
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
