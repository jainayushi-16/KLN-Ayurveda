'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Badge from '../../../components/common/Badge';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import { Search, Edit3, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalItems: 0 });
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editingStockProduct, setEditingStockProduct] = useState(null);
  const [newStockQty, setNewStockQty] = useState('');

  const fetchInventory = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/admin/products?page=${page}&limit=10&search=${search}`);
      if (res.success) {
        let items = res.data || [];
        if (filterLowStock) {
          items = items.filter((p) => p.stockQuantity <= 10);
        }
        setProducts(items);
        setPagination(res.pagination || { page: 1, totalPages: 1, totalItems: items.length });
      }
    } catch (err) {
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory(1);
  }, [search, filterLowStock]);

  const openStockModal = (product) => {
    setEditingStockProduct(product);
    setNewStockQty(product.stockQuantity);
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!editingStockProduct) return;
    try {
      const qty = parseInt(newStockQty, 10);
      await axiosClient.patch(`/admin/products/${editingStockProduct.id}/stock`, {
        stockQuantity: qty,
        inStock: qty > 0,
      });
      toast.success(`Updated stock for "${editingStockProduct.name}" to ${qty} units`);
      setEditingStockProduct(null);
      fetchInventory(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to update stock quantity');
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
                placeholder="Search product inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className={`btn-secondary ${filterLowStock ? 'active' : ''}`}
              style={{
                borderColor: filterLowStock ? '#fbbf24' : 'var(--border-color)',
                color: filterLowStock ? '#fbbf24' : 'var(--text-primary)',
              }}
              onClick={() => setFilterLowStock(!filterLowStock)}
            >
              <AlertTriangle size={16} />
              <span>{filterLowStock ? 'Showing Low Stock Only' : 'Filter Low Stock (<= 10)'}</span>
            </button>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Availability</th>
              <th>Status Badge</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  Loading inventory status...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{prod.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {prod.id}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{prod.category?.name || 'General'}</td>
                  <td style={{ fontWeight: '700', fontSize: '1.05rem', color: prod.stockQuantity <= 10 ? '#fbbf24' : 'var(--text-primary)' }}>
                    {prod.stockQuantity} units
                  </td>
                  <td>
                    {prod.stockQuantity <= 0 ? (
                      <Badge type="outstock" text="Out of Stock" />
                    ) : prod.stockQuantity <= 10 ? (
                      <Badge type="lowstock" text="Low Stock Alert" />
                    ) : (
                      <Badge type="instock" text="In Stock" />
                    )}
                  </td>
                  <td>
                    {prod.inStock ? (
                      <span style={{ color: '#34d399', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle size={14} /> Active Listing
                      </span>
                    ) : (
                      <span style={{ color: '#f87171', fontSize: '0.85rem' }}>Disabled Listing</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem' }} onClick={() => openStockModal(prod)}>
                      <Edit3 size={14} />
                      <span>Update Stock</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No inventory items match filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          pagination={pagination}
          onPageChange={(page) => fetchInventory(page)}
        />
      </div>

      {/* Quick Stock Update Modal */}
      {editingStockProduct && (
        <Modal
          isOpen={!!editingStockProduct}
          onClose={() => setEditingStockProduct(null)}
          title={`Update Stock — ${editingStockProduct.name}`}
          maxWidth="450px"
        >
          <form onSubmit={handleUpdateStock}>
            <div className="form-group">
              <label className="form-label">New Stock Quantity (Units)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                required
                value={newStockQty}
                onChange={(e) => setNewStockQty(e.target.value)}
              />
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Setting stock quantity to 0 will automatically flag product listing as Out of Stock.
            </div>

            <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none' }}>
              <button type="button" className="btn-secondary" onClick={() => setEditingStockProduct(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Stock
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
