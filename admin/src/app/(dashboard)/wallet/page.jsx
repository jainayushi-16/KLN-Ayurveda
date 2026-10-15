'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axiosClient from '../../../api/axiosClient';
import Modal from '../../../components/common/Modal';
import Badge from '../../../components/common/Badge';
import {
  Wallet,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  Download,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  IndianRupee,
  Gift,
  RotateCcw,
  PlusCircle,
  MinusCircle,
  FileText,
  Calendar,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminWalletPage() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [balanceFilter, setBalanceFilter] = useState('ALL'); // ALL, POSITIVE, ZERO

  // Transaction Ledger Modal
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [customerTxns, setCustomerTxns] = useState([]);
  const [loadingTxns, setLoadingTxns] = useState(false);
  const [txnFilter, setTxnFilter] = useState('ALL');

  // Manual Adjustment Modal
  const [adjustWallet, setAdjustWallet] = useState(null);
  const [adjustType, setAdjustType] = useState('CREDIT'); // CREDIT or DEBIT
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustExpiryDays, setAdjustExpiryDays] = useState('');
  const [submittingAdjust, setSubmittingAdjust] = useState(false);

  // Export State
  const [exporting, setExporting] = useState(false);

  const fetchWallets = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await axiosClient.get('/admin/wallet/all');
      if (res && res.data) {
        setWallets(res.data || []);
        if (showToast) toast.success('Customer wallets updated!');
      }
    } catch (err) {
      console.error('Fetch wallets error:', err);
      toast.error(err?.message || 'Failed to fetch customer wallets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // System aggregates
  const systemMetrics = useMemo(() => {
    let totalBal = 0;
    let positiveCount = 0;
    for (const w of wallets) {
      const b = Number(w.balance || 0);
      totalBal += b;
      if (b > 0) positiveCount++;
    }
    return {
      totalWallets: wallets.length,
      positiveWallets: positiveCount,
      systemBalance: totalBal,
    };
  }, [wallets]);

  // Filtered customer list
  const filteredWallets = useMemo(() => {
    return wallets.filter((w) => {
      const u = w.user || {};
      const q = search.toLowerCase().trim();
      const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      const email = String(u.email || '').toLowerCase();
      const phone = String(u.phone || '').toLowerCase();
      const walletId = String(w.id || '').toLowerCase();

      const matchesSearch = !q || name.includes(q) || email.includes(q) || phone.includes(q) || walletId.includes(q);

      if (!matchesSearch) return false;

      if (balanceFilter === 'POSITIVE') return (w.balance || 0) > 0;
      if (balanceFilter === 'ZERO') return (w.balance || 0) <= 0;
      return true;
    });
  }, [wallets, search, balanceFilter]);

  // Open Transactions Ledger Modal
  const handleOpenLedger = async (wallet) => {
    setSelectedWallet(wallet);
    setTxnFilter('ALL');
    setLoadingTxns(true);
    try {
      const userId = wallet.userId || wallet.user?.id;
      const res = await axiosClient.get(`/admin/wallet/${userId}/transactions`);
      if (res && res.data) {
        setCustomerTxns(res.data.items || res.data || []);
      }
    } catch (err) {
      console.error('Fetch ledger error:', err);
      toast.error(err?.message || 'Failed to load transaction ledger');
    } finally {
      setLoadingTxns(false);
    }
  };

  // Open Manual Adjust Modal
  const handleOpenAdjust = (wallet, defaultType = 'CREDIT') => {
    setAdjustWallet(wallet);
    setAdjustType(defaultType);
    setAdjustAmount('');
    setAdjustReason('');
    setAdjustExpiryDays('');
  };

  // Submit Manual Adjustment
  const handleSaveAdjustment = async (e) => {
    e.preventDefault();
    if (!adjustWallet) return;

    const numAmount = parseFloat(adjustAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0.');
      return;
    }

    if (!adjustReason || adjustReason.trim().length < 4) {
      toast.error('A mandatory audit reason (at least 4 characters) is required for all manual balance adjustments.');
      return;
    }

    if (adjustType === 'DEBIT' && numAmount > (adjustWallet.balance || 0)) {
      toast.error(`Cannot debit ₹${numAmount}. Customer only has ₹${(adjustWallet.balance || 0).toFixed(2)} in their wallet.`);
      return;
    }

    setSubmittingAdjust(true);
    try {
      const userId = adjustWallet.userId || adjustWallet.user?.id;
      let expiresAt = null;
      if (adjustType === 'CREDIT' && adjustExpiryDays && parseInt(adjustExpiryDays) > 0) {
        const d = new Date();
        d.setDate(d.getDate() + parseInt(adjustExpiryDays));
        expiresAt = d.toISOString();
      }

      await axiosClient.post(`/admin/wallet/${userId}/adjust`, {
        type: adjustType,
        amount: numAmount,
        reason: adjustReason.trim(),
        expiresAt,
      });

      toast.success(`Successfully ${adjustType === 'CREDIT' ? 'credited' : 'debited'} ₹${numAmount.toFixed(2)}!`);
      setAdjustWallet(null);
      fetchWallets();
    } catch (err) {
      console.error('Adjust error:', err);
      toast.error(err?.message || 'Failed to apply balance adjustment');
    } finally {
      setSubmittingAdjust(false);
    }
  };

  // Export CSV
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await axiosClient.get('/admin/wallet/export', {
        params: { format: 'csv' },
        responseType: 'blob',
      });
      const blob = new Blob([res], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `KLN_Wallet_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Wallet audit ledger exported to CSV!');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export wallet transactions.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2F5D34]/10 text-[#2F5D34]">
              <Wallet className="w-6 h-6" />
            </div>
            <span>KLN Wallet Management</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Audit customer wallet balances, view immutable transaction ledgers, issue manual credits/debits, and export ledger logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchWallets(true)}
            disabled={refreshing || loading}
            className="btn btn-outline flex items-center gap-2 text-sm cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="btn bg-[#2F5D34] hover:bg-[#234727] text-white flex items-center gap-2 text-sm shadow-md cursor-pointer"
          >
            <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
            <span>{exporting ? 'Exporting...' : 'Export Ledger (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top System Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#2F5D34] flex items-center justify-center shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Customer Balances</div>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">
              ₹{systemMetrics.systemBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-0.5">Live backed by PostgreSQL</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Wallets</div>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">{systemMetrics.totalWallets}</div>
            <div className="text-xs text-blue-700 font-medium mt-0.5">{systemMetrics.positiveWallets} with active balance</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-[#C9A66B]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Auditable Transactions</div>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">Immutable</div>
            <div className="text-xs text-amber-700 font-medium mt-0.5">Full ledger audit trail</div>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer by name, email, phone, or wallet ID..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D34]/30 focus:border-[#2F5D34]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Filter Balance:</span>
          {['ALL', 'POSITIVE', 'ZERO'].map((f) => (
            <button
              key={f}
              onClick={() => setBalanceFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                balanceFilter === f
                  ? 'bg-[#2F5D34] text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {f === 'ALL' ? 'All Customers' : f === 'POSITIVE' ? 'With Balance (> ₹0)' : 'Zero Balance'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Customer Wallets Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Wallet Balance</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2F5D34]" />
                    <span>Loading customer wallets...</span>
                  </td>
                </tr>
              ) : filteredWallets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <Wallet className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-gray-700">No customer wallets found</p>
                    <p className="text-xs text-gray-400 mt-1">Try modifying your search or filter</p>
                  </td>
                </tr>
              ) : (
                filteredWallets.map((w) => {
                  const u = w.user || {};
                  const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Valued Customer';
                  const bal = Number(w.balance || 0);

                  return (
                    <tr key={w.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#2F5D34] font-bold flex items-center justify-center shrink-0 uppercase text-sm">
                            {fullName.charAt(0) || 'C'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{fullName}</div>
                            <div className="text-[11px] font-mono text-gray-400">ID: {w.id.slice(0, 12)}...</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs text-gray-600">
                        <div>{u.email || 'No email'}</div>
                        <div className="text-gray-400">{u.phone || 'No phone'}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#2F5D34] border border-emerald-200">
                          <span>₹{bal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs text-gray-500">
                        {new Date(w.updatedAt || w.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenLedger(w)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
                            title="View Transaction Ledger"
                          >
                            Ledger
                          </button>

                          <button
                            onClick={() => handleOpenAdjust(w, 'CREDIT')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#2F5D34] border border-emerald-200 transition-colors cursor-pointer"
                            title="Credit or Debit Balance"
                          >
                            Adjust Balance
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal: Customer Transaction Ledger */}
      {selectedWallet && (
        <Modal
          isOpen={Boolean(selectedWallet)}
          onClose={() => setSelectedWallet(null)}
          title={`Wallet Ledger: ${selectedWallet.user?.firstName || 'Customer'} (Current: ₹${(selectedWallet.balance || 0).toFixed(2)})`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
              <div>
                Customer: <strong className="text-gray-800">{selectedWallet.user?.email}</strong>
              </div>
              <button
                onClick={() => {
                  const w = selectedWallet;
                  setSelectedWallet(null);
                  handleOpenAdjust(w, 'CREDIT');
                }}
                className="text-[#2F5D34] font-bold hover:underline cursor-pointer"
              >
                + Manual Adjustment
              </button>
            </div>

            {loadingTxns ? (
              <div className="py-12 text-center text-gray-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#2F5D34]" />
                <span>Loading ledger transactions...</span>
              </div>
            ) : customerTxns.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">
                No transactions recorded yet for this customer.
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                {customerTxns.map((t) => {
                  const isCredit = t.type === 'CREDIT';
                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              isCredit ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {t.category || t.type}
                          </span>
                          <span className="font-semibold text-gray-900">{t.description}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-2">
                          <span>Ref: {t.transactionId}</span>
                          <span>•</span>
                          <span>{new Date(t.createdAt).toLocaleString('en-IN')}</span>
                          {t.expiresAt && (
                            <>
                              <span>•</span>
                              <span className="text-amber-600 font-medium">
                                Expires: {new Date(t.expiresAt).toLocaleDateString('en-IN')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-bold font-mono text-sm ${isCredit ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isCredit ? '+' : '−'} ₹{Number(t.amount).toFixed(2)}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          After: ₹{Number(t.balanceAfter).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* 6. Modal: Manual Balance Adjustment (Auditable) */}
      {adjustWallet && (
        <Modal
          isOpen={Boolean(adjustWallet)}
          onClose={() => setAdjustWallet(null)}
          title={`Adjust Wallet Balance: ${adjustWallet.user?.firstName || 'Customer'}`}
          size="md"
        >
          <form onSubmit={handleSaveAdjustment} className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex justify-between items-center">
              <span>Customer Current Balance:</span>
              <strong className="text-sm font-bold">₹{Number(adjustWallet.balance || 0).toFixed(2)}</strong>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Adjustment Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustType('CREDIT')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    adjustType === 'CREDIT'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Credit (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustType('DEBIT')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    adjustType === 'DEBIT'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>Debit (−)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="e.g. 250.00"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D34]/30 focus:border-[#2F5D34]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Mandatory Reason (Auditable) *
              </label>
              <textarea
                required
                rows={3}
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. Compensation for order shipment delay / Promotional goodwill credit..."
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D34]/30 focus:border-[#2F5D34]"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                This reason is permanently recorded in the immutable wallet ledger for compliance and customer audit.
              </p>
            </div>

            {adjustType === 'CREDIT' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Optional Promotional Expiry (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={adjustExpiryDays}
                  onChange={(e) => setAdjustExpiryDays(e.target.value)}
                  placeholder="e.g. 30 (Leave blank for non-expiring funds)"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D34]/30 focus:border-[#2F5D34]"
                />
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAdjustWallet(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submittingAdjust}
                className="px-5 py-2 text-xs font-bold text-white bg-[#2F5D34] hover:bg-[#234727] rounded-xl shadow-md cursor-pointer disabled:opacity-50"
              >
                {submittingAdjust ? 'Processing...' : `Confirm ${adjustType}`}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
