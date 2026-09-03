"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/services/axiosClient";
import Modal from "@/components/admin/common/Modal";
import Badge from "@/components/admin/common/Badge";
import { Search, Eye, Edit, Trash2, Users, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/customers");
      if (res.success) {
        setCustomers(res.data || []);
      }
    } catch (err) {
      toast.error("Failed to load customer directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const term = search.toLowerCase();
    const name = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
    const email = (c.email || "").toLowerCase();
    const phone = (c.phone || "").toLowerCase();
    return name.includes(term) || email.includes(term) || phone.includes(term);
  });

  return (
    <div>
      <div className="card-table-wrapper">
        <div className="table-toolbar flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by Customer name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2 pl-9 pr-4 rounded-xl bg-[#08120e] border border-[#c9a66b]/20 text-xs text-[#f5f8f6] outline-none focus:border-[#c9a66b]"
              />
            </div>
          </div>
          <button className="btn-secondary" onClick={fetchCustomers}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Orders</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-6">
                    Loading customer directory...
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => {
                  const fullName = `${cust.firstName || ""} ${cust.lastName || ""}`.trim() || "Customer";
                  return (
                    <tr key={cust.id}>
                      <td className="font-bold text-[#f5f8f6]">
                        {fullName}
                      </td>
                      <td className="text-xs text-[#e8c88a]">{cust.email}</td>
                      <td className="text-xs text-[#a3b8ad]">{cust.phone || "-"}</td>
                      <td>
                        <Badge type={cust.role} text={cust.role} />
                      </td>
                      <td className="text-xs text-[#a3b8ad]">
                        {new Date(cust.createdAt).toLocaleDateString()}
                      </td>
                      <td className="font-bold text-xs">
                        {cust._count?.orders || cust.orders?.length || 0}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="btn-secondary py-1 px-2.5 text-xs"
                        >
                          <Eye size={14} />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No customers found matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      <Modal
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title="Customer Directory Record"
        maxWidth="500px"
      >
        {selectedCustomer && (
          <div className="space-y-3 text-xs text-gray-300">
            <div className="bg-[#0e1c16] p-4 rounded-xl border border-[#c9a66b]/20">
              <div className="text-sm font-bold text-white mb-1">
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </div>
              <div>Email: <strong className="text-white">{selectedCustomer.email}</strong></div>
              <div>Phone: <strong className="text-white">{selectedCustomer.phone || "N/A"}</strong></div>
              <div>Role: <Badge type={selectedCustomer.role} text={selectedCustomer.role} /></div>
              <div>Member Since: <strong className="text-white">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</strong></div>
            </div>
            <div className="flex justify-end pt-2">
              <button className="btn-secondary" onClick={() => setSelectedCustomer(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
