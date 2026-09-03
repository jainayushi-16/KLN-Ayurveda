"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import Badge from "@/components/admin/common/Badge";
import { Search, Warehouse, Edit, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newStock, setNewStock] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/products?limit=50");
      if (res.success) {
        setProducts(res.data || []);
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
      toast.success("Stock quantity updated successfully");
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      toast.error(err.message || "Failed to update stock");
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div>
            <h3 className="text-base font-bold text-[#f5f8f6]">Inventory & Stock Control</h3>
            <p className="text-xs text-[#6b8277]">Real-time warehouse stock levels & re-order thresholds</p>
          </div>
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search product inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pl-9 pr-4 rounded-xl bg-[#08120e] border border-[#c9a66b]/20 text-xs text-[#f5f8f6] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU / Slug</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 py-6">
                    Loading inventory units...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((prod) => (
                  <tr key={prod.id}>
                    <td className="font-bold text-[#f5f8f6]">{prod.name}</td>
                    <td className="text-xs text-[#6b8277]">{prod.slug}</td>
                    <td>
                      {editingId === prod.id ? (
                        <input
                          type="number"
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          className="w-20 p-1.5 rounded-lg bg-[#08120e] border border-[#c9a66b] text-white font-bold text-xs text-center"
                        />
                      ) : (
                        <span className="font-bold text-xs">{prod.stockQuantity} Units</span>
                      )}
                    </td>
                    <td>
                      {prod.stockQuantity <= 10 ? (
                        <Badge type="lowstock" text="Low Stock Warning" />
                      ) : (
                        <Badge type="instock" text="Sufficient Stock" />
                      )}
                    </td>
                    <td className="text-right">
                      {editingId === prod.id ? (
                        <button
                          onClick={() => handleUpdateStock(prod.id)}
                          className="btn-primary py-1 px-2.5 text-xs"
                        >
                          <Save size={14} />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => { setEditingId(prod.id); setNewStock(String(prod.stockQuantity)); }}
                          className="btn-secondary py-1 px-2.5 text-xs"
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
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No products found.
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
