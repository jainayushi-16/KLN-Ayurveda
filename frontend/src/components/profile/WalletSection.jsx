"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShoppingBag,
  Gift,
  RotateCcw,
  Calendar,
} from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import toast from "react-hot-toast";

const FILTER_OPTIONS = [
  { id: "ALL", label: "All Transactions" },
  { id: "CREDIT", label: "Credits (+)" },
  { id: "DEBIT", label: "Debits (-)" },
  { id: "REFUND", label: "Refunds" },
  { id: "CASHBACK", label: "Cashback" },
  { id: "EXPIRED", label: "Expired" },
];

export default function WalletSection() {
  const {
    balance,
    currencySymbol,
    totalCashback,
    totalRefunds,
    totalPurchases,
    transactions,
    pagination,
    isLoading,
    isTransactionsLoading,
    error,
    fetchWalletBalance,
    fetchWalletTransactions,
  } = useWalletStore();

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchWalletBalance();
    fetchWalletTransactions({ page: 1, type: "ALL", search: "" });
  }, [fetchWalletBalance, fetchWalletTransactions]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    fetchWalletTransactions({ page: 1, type: filterId, search: searchQuery });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchWalletTransactions({ page: 1, type: activeFilter, search: searchQuery });
  };

  const handlePageChange = (newPage) => {
    fetchWalletTransactions({ page: newPage, type: activeFilter, search: searchQuery });
  };

  const handleCopy = (text, id) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Transaction ID copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatCurrency = (val) => {
    return `${currencySymbol || "₹"}${Number(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getCategoryBadge = (category, type) => {
    switch (category) {
      case "PROMOTIONAL_CASHBACK":
        return { label: "Cashback", icon: Gift, bg: "bg-amber-50 text-amber-800 border-amber-200" };
      case "REFUND":
      case "CANCELLATION_REFUND":
      case "RETURN_REFUND":
        return { label: "Refund", icon: RotateCcw, bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "PURCHASE":
      case "PARTIAL_PURCHASE":
        return { label: "Order Payment", icon: ShoppingBag, bg: "bg-blue-50 text-blue-800 border-blue-200" };
      case "ADMIN_ADJUSTMENT":
        return { label: "Admin Credit", icon: Sparkles, bg: "bg-purple-50 text-purple-800 border-purple-200" };
      case "EXPIRED":
        return { label: "Expired", icon: Clock, bg: "bg-slate-100 text-slate-700 border-slate-200" };
      default:
        return {
          label: type === "CREDIT" ? "Credit" : "Debit",
          icon: type === "CREDIT" ? ArrowDownLeft : ArrowUpRight,
          bg: type === "CREDIT" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2F5D34] via-[#244929] to-[#1a381d] p-6 sm:p-8 text-white shadow-xl">
        {/* Decorative background glow */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#C9A66B]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/15 text-[#f4ece1]">
              <Wallet className="h-3.5 w-3.5 text-[#C9A66B]" />
              <span>Official KLN Ayurveda Pay Balance</span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-serif">
                {isLoading ? (
                  <span className="inline-block h-10 w-40 animate-pulse rounded-lg bg-white/20" />
                ) : (
                  formatCurrency(balance)
                )}
              </span>
              <span className="text-sm font-medium text-emerald-200/90">Available Balance</span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md pt-1">
              Use your KLN Wallet balance for instant 1-click checkout, automated order refunds, and exclusive promotional cashback.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => {
                fetchWalletBalance();
                fetchWalletTransactions({ page: 1, type: activeFilter, search: searchQuery });
                toast.success("Wallet updated!");
              }}
              disabled={isLoading || isTransactionsLoading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-medium text-white transition-all backdrop-blur-md cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || isTransactionsLoading ? "animate-spin" : ""}`} />
              <span>Refresh Balance</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between text-xs text-emerald-200/80">
              <span>Total Cashback Earned</span>
              <Gift className="h-4 w-4 text-[#C9A66B]" />
            </div>
            <div className="mt-1 text-lg font-bold text-white font-serif">
              {formatCurrency(totalCashback)}
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between text-xs text-emerald-200/80">
              <span>Total Refunds Credited</span>
              <RotateCcw className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="mt-1 text-lg font-bold text-white font-serif">
              {formatCurrency(totalRefunds)}
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between text-xs text-emerald-200/80">
              <span>Total Purchases Paid</span>
              <ShoppingBag className="h-4 w-4 text-emerald-200" />
            </div>
            <div className="mt-1 text-lg font-bold text-white font-serif">
              {formatCurrency(totalPurchases)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Transaction History Section */}
      <div className="bg-white/95 backdrop-blur-xl border border-stone-200/70 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#2A1810] font-serif flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2F5D34]" />
              <span>Transaction History & Ledger</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Immutable ledger of all credits, debits, refunds, and promo cashback applied to your account.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference or description..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2F5D34]/30 focus:border-[#2F5D34] transition-all"
            />
          </form>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === f.id
                  ? "bg-[#2F5D34] text-white shadow-md shadow-[#2F5D34]/20"
                  : "bg-stone-100 hover:bg-stone-200/80 text-stone-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {isTransactionsLoading ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-200" />
                  <div className="space-y-1.5">
                    <div className="w-36 h-4 bg-stone-200 rounded" />
                    <div className="w-24 h-3 bg-stone-200 rounded" />
                  </div>
                </div>
                <div className="w-20 h-5 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-stone-50/70 border border-dashed border-stone-200">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#2F5D34] flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-stone-800">No Transactions Found</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              {searchQuery
                ? `No transactions match your search query "${searchQuery}".`
                : "Your wallet transactions, order refunds, and cashback rewards will appear here once recorded."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {transactions.map((txn) => {
              const badge = getCategoryBadge(txn.category, txn.type);
              const BadgeIcon = badge.icon;
              const isCredit = txn.type === "CREDIT";

              return (
                <div
                  key={txn.id}
                  className="py-4.5 px-3 sm:px-4 rounded-2xl hover:bg-stone-50/90 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Direction Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isCredit
                          ? "bg-emerald-50 border-emerald-200 text-[#2F5D34]"
                          : "bg-stone-100 border-stone-200 text-stone-700"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-rose-600" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900">
                          {txn.description || (isCredit ? "Wallet Credit" : "Wallet Debit")}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                        >
                          <BadgeIcon className="w-2.5 h-2.5" />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-stone-500">
                        <span>
                          {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(txn.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        <span className="text-stone-300">•</span>

                        <div className="inline-flex items-center gap-1 font-mono text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                          <span>{txn.transactionId}</span>
                          <button
                            onClick={() => handleCopy(txn.transactionId, txn.id)}
                            className="hover:text-[#2F5D34] transition-colors cursor-pointer"
                            title="Copy Transaction ID"
                          >
                            {copiedId === txn.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {txn.expiresAt && (
                          <>
                            <span className="text-stone-300">•</span>
                            <span className="text-amber-700 font-medium">
                              Expires: {new Date(txn.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount and Running Balance */}
                  <div className="sm:text-right shrink-0 pl-13 sm:pl-0">
                    <div
                      className={`text-base font-bold font-serif ${
                        isCredit ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {isCredit ? "+" : "−"} {formatCurrency(txn.amount)}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Balance: <span className="font-semibold text-stone-700">{formatCurrency(txn.balanceAfter)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs text-stone-600">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || isTransactionsLoading}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || isTransactionsLoading}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
