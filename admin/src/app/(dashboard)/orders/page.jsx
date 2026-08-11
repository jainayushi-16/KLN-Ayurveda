'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Badge from '../../../components/common/Badge';
import Pagination from '../../../components/common/Pagination';
import InvoiceModal from '../../../components/invoices/InvoiceModal';
import { Search, Eye } from 'lucide-react';
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

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-input-box">
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
              style={{ width: '180px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {orderStatuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th>Fulfillment Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  Loading customer orders...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((ord) => {
                const customerName = ord.user
                  ? `${ord.user.firstName || ''} ${ord.user.lastName || ''}`.trim()
                  : 'Customer';
                return (
                  <tr key={ord.id}>
                    <td style={{ fontWeight: '600', color: 'var(--accent-gold-light)' }}>
                      #{ord.orderNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.user?.email}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      ₹{ord.totalAmount.toFixed(2)}
                    </td>
                    <td>
                      <select
                        value={ord.paymentStatus}
                        onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value)}
                        style={{
                          background: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.78rem',
                        }}
                      >
                        {paymentStatuses.map((ps) => (
                          <option key={ps} value={ps}>{ps}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        style={{
                          background: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}
                      >
                        {orderStatuses.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon"
                        title="View Invoice & Details"
                        onClick={() => setViewingOrder(ord)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          pagination={pagination}
          onPageChange={(page) => fetchOrders(page)}
        />
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
