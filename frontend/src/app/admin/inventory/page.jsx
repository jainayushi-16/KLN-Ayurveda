"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "@/services/axiosClient";
import Badge from "@/components/admin/common/Badge";
import { Search, Warehouse, Edit, Save, Filter, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stockCondition, setStockCondition] = useState("ALL"); // ALL, LOW_STOCK, OUT_OF_STOCK, IN_STOCK
  const [editingId, setEditingId] = useState(null);
  const [newStock, setNewStock] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/products?limit=100");
      if (res && (res.success || res.data)) {
        setProducts(res.data || res.products || []);
      }
    } catch (err) {
      toast.error("Failed to load inventory details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (productId) => {
    try {
      await axiosClient.put(`/admin/products/${productId}`, { stockQuantity: parseInt(newStock, 10) });
      toast.success("Stock quantity updated successfully 🌿");
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      toast.error(err.message || "Failed to update stock");
    }
  };

  // Client-side dynamic filtering
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Stock condition filter
      if (stockCondition === "LOW_STOCK" && (prod.stockQuantity > 10 || prod.stockQuantity <= 0)) return false;
      if (stockCondition === "OUT_OF_STOCK" && prod.stockQuantity > 0) return false;
      if (stockCondition === "IN_STOCK" && prod.stockQuantity <= 10) return false;

      // Search query
      if (search) {
        const term = search.toLowerCase();
        const name = (prod.name || "").toLowerCase();
        const slug = (prod.slug || "").toLowerCase();
        if (!name.includes(term) && !slug.includes(term)) return false;
      }

      return true;
    });
  }, [products, search, stockCondition]);

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="search-input-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search product inventory by title or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              style={{ width: "180px" }}
              value={stockCondition}
              onChange={(e) => setStockCondition(e.target.value)}
            >
              <option value="ALL">📦 All Stock Conditions</option>
              <option value="LOW_STOCK">⚠️ Low Stock (1 - 10)</option>
              <option value="OUT_OF_STOCK">❌ Out of Stock (0)</option>
              <option value="IN_STOCK">✅ Sufficient Stock (&gt;10)</option>
            </select>
          </div>

          <button className="btn-secondary" onClick={fetchInventory}>
            <RefreshCw size={16} />
            <span>Refresh Inventory</span>
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU / Slug</th>
                <th>Current Stock</th>
                <th>Stock Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    Loading warehouse stock units...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td style={{ fontWeight: "700", color: "var(--text-primary)" }}>{prod.name}</td>
                    <td style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{prod.slug}</td>
                    <td>
                      {editingId === prod.id ? (
                        <input
                          type="number"
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          className="form-control"
                          style={{ width: "90px", padding: "0.3rem 0.5rem", fontWeight: "800" }}
                        />
                      ) : (
                        <span style={{ fontWeight: "800", fontSize: "0.9rem" }}>{prod.stockQuantity} Units</span>
                      )}
                    </td>
                    <td>
                      {prod.stockQuantity <= 0 ? (
                        <Badge type="outstock" text="Out of Stock" />
                      ) : prod.stockQuantity <= 10 ? (
                        <Badge type="lowstock" text="Low Stock Warning" />
                      ) : (
                        <Badge type="instock" text="Sufficient Stock" />
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {editingId === prod.id ? (
                        <button
                          onClick={() => handleUpdateStock(prod.id)}
                          className="btn-primary"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                        >
                          <Save size={14} />
                          <span>Save Stock</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => { setEditingId(prod.id); setNewStock(String(prod.stockQuantity)); }}
                          className="btn-secondary"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                        >
                          <Edit size={14} />
                          <span>Adjust Stock</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                    No inventory products found matching active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
