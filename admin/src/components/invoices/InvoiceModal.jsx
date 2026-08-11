'use client';

import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { Printer } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const customerName = order.user
    ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
    : 'Valued Customer';
  const customerEmail = order.user?.email || 'N/A';
  const customerPhone = order.user?.phone || 'N/A';

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tax Invoice — ${order.orderNumber}`}
      maxWidth="750px"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Invoice</span>
          </button>
        </>
      }
    >
      <div className="invoice-printable" style={{ padding: '0.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--accent-gold)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ color: 'var(--accent-gold)', fontSize: '1.6rem', marginBottom: '0.2rem' }}>KLN Ayurveda</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Authentic Ayurvedic Formulations</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email: support@klnayurveda.com | Web: www.klnayurveda.com</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>INVOICE</h3>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-gold-light)' }}>#{order.orderNumber}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date: {orderDate}</div>
            <div style={{ marginTop: '0.4rem' }}>
              <Badge type={order.paymentStatus} text={`Payment: ${order.paymentStatus}`} />
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Billed To</h4>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{customerName}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{customerEmail}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phone: {customerPhone}</div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Shipping Address</h4>
            {order.shippingAddress ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</div>
                <div>{order.shippingAddress.country}</div>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Standard Shipping</div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Item Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: '600' }}>{item.product?.name || 'Ayurvedic Product'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {item.productId?.slice(0, 8)}</div>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{item.price?.toFixed(2)}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>₹{(item.total || item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '260px', background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span>₹{(order.subtotal || order.totalAmount).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Shipping Fee:</span>
              <span>₹{(order.shippingFee || 0).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Tax:</span>
              <span>₹{(order.tax || 0).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#34d399' }}>
                <span>Discount:</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)', fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--accent-gold)' }}>
              <span>Grand Total:</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
