'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axiosClient from '../../api/axiosClient';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import InvoiceModal from '../../components/invoices/InvoiceModal';
import { Users, Package, ShoppingBag, DollarSign, AlertTriangle, ArrowRight, Eye, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/admin/dashboard');
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading dashboard statistics...</div>;
  }

  return (
    <div>
      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          color="#3b82f6"
        />
        <StatCard
          label="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          color="#10b981"
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          color="#a855f7"
        />
        <StatCard
          label="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          color="#d4af37"
        />
      </div>

      {/* Low Stock Banner Alert */}
      {stats?.lowStockCount > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fbbf24' }}>
            <AlertTriangle size={22} />
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Inventory Stock Alert</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                There are {stats.lowStockCount} product(s) running low on stock (&le; 10 units remaining).
              </div>
            </div>
          </div>
          <Link href="/inventory" className="btn-secondary" style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
            <span>Check Inventory</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Recent Store Orders</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest customer transactions in real-time</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/products" className="btn-secondary">
              <PlusCircle size={16} />
              <span>Add Product</span>
            </Link>
            <Link href="/orders" className="btn-primary">
              <span>View All Orders</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => {
                const customerName = order.user
                  ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
                  : 'Customer';
                return (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '600', color: 'var(--accent-gold-light)' }}>
                      #{order.orderNumber}
                    </td>
                    <td>
                      <div>{customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td>
                      <Badge type={order.paymentStatus} text={order.paymentStatus} />
                    </td>
                    <td>
                      <Badge type={order.status} text={order.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon"
                        title="View Invoice"
                        onClick={() => setSelectedOrder(order)}
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
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice View Modal */}
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
