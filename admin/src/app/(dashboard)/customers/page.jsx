'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Modal from '../../../components/common/Modal';
import Badge from '../../../components/common/Badge';
import { Search, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/customers');
      if (res.success) {
        setCustomers(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load customers list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    return fullName.includes(q) || (c.email && c.email.toLowerCase().includes(q));
  });

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div className="search-input-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined Date</th>
              <th>Total Orders</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  Loading registered customers...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((cust) => {
                const name = `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || 'Customer';
                return (
                  <tr key={cust.id}>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{cust.email}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cust.phone || '-'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {cust._count?.orders || 0} Orders
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon"
                        title="View Customer Order History"
                        onClick={() => setSelectedCustomer(cust)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer History — ${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
          maxWidth="600px"
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email: {selectedCustomer.email}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phone: {selectedCustomer.phone || 'Not provided'}</div>
          </div>

          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--accent-gold)' }}>Recent Orders History</h4>
          {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
            <table className="custom-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedCustomer.orders.map((ord) => (
                  <tr key={ord.id}>
                    <td style={{ fontWeight: '600', color: 'var(--accent-gold-light)' }}>#{ord.orderNumber}</td>
                    <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: '600' }}>₹{ord.totalAmount.toFixed(2)}</td>
                    <td><Badge type={ord.status} text={ord.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
              No orders placed by this customer yet.
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
