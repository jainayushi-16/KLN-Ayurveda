"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axiosClient from "@/services/axiosClient";
import StatCard from "@/components/admin/common/StatCard";
import Badge from "@/components/admin/common/Badge";
import InvoiceModal from "@/components/admin/invoices/InvoiceModal";
import { Users, Package, ShoppingBag, DollarSign, AlertTriangle, ArrowRight, Eye, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get("/admin/dashboard");
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-xs text-gray-400 p-4">Loading dashboard statistics...</div>;
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
          value={`₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`}
          icon={DollarSign}
          color="#d4af37"
        />
      </div>

      {/* Low Stock Banner Alert */}
      {stats?.lowStockCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-amber-400">
            <AlertTriangle size={22} />
            <div>
              <div className="font-semibold text-sm">Inventory Stock Alert</div>
              <div className="text-xs text-[#a3b8ad]">
                There are {stats.lowStockCount} product(s) running low on stock (≤ 10 units remaining).
              </div>
            </div>
          </div>
          <Link href="/admin/inventory" className="btn-secondary text-amber-400 border-amber-500/30">
            <span>Check Inventory</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div>
            <h3 className="text-base font-bold text-[#f5f8f6]">Recent Store Orders</h3>
            <p className="text-xs text-[#6b8277]">Latest customer transactions in real-time</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/products" className="btn-secondary">
              <PlusCircle size={16} />
              <span>Add Product</span>
            </Link>
            <Link href="/admin/orders" className="btn-primary">
              <span>View All Orders</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => {
                  const customerName = order.user
                    ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                    : "Customer";
                  return (
                    <tr key={order.id}>
                      <td className="font-bold text-[#e8c88a]">
                        #{order.orderNumber}
                      </td>
                      <td>
                        <div>{customerName}</div>
                        <div className="text-[11px] text-[#6b8277]">{order.user?.email}</div>
                      </td>
                      <td className="text-xs text-[#a3b8ad]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="font-bold">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td>
                        <Badge type={order.paymentStatus} text={order.paymentStatus} />
                      </td>
                      <td>
                        <Badge type={order.status} text={order.status} />
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="btn-secondary py-1 px-2.5 text-xs"
                          title="View Invoice"
                        >
                          <Eye size={14} />
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
