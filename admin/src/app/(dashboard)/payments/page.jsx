'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Badge from '../../../components/common/Badge';
import Pagination from '../../../components/common/Pagination';
import InvoiceModal from '../../../components/invoices/InvoiceModal';
import { Eye, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/admin/orders?page=${page}&limit=10&search=${search}`);
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
  }, [search]);

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div className="search-input-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search by order # or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Payment Status</th>
              <th style={{ textAlign: 'right' }}>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  Loading payment logs...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((ord) => {
                const customerName = ord.user
                  ? `${ord.user.firstName || ''} ${ord.user.lastName || ''}`.trim()
                  : 'Customer';
                return (
                  <tr key={ord.id}>
                    <td style={{ fontWeight: '600', color: 'var(--accent-gold-light)' }}>#{ord.orderNumber}</td>
                    <td>
                      <div>{customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.user?.email}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      ₹{ord.totalAmount.toFixed(2)}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        {ord.paymentMethod || 'Credit Card / UPI'}
                      </span>
                    </td>
                    <td>
                      <Badge type={ord.paymentStatus} text={ord.paymentStatus} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon"
                        title="View / Print Tax Invoice"
                        onClick={() => setSelectedOrder(ord)}
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
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          pagination={pagination}
          onPageChange={(page) => fetchPayments(page)}
        />
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
