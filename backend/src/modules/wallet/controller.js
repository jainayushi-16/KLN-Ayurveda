const walletService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class WalletController {
  getWalletBalance = asyncHandler(async (req, res) => {
    const data = await walletService.getWalletBalance(req.user.id);
    return ApiResponse.success(res, "Wallet balance retrieved successfully", data);
  });

  getWalletTransactions = asyncHandler(async (req, res) => {
    const { page, limit, type, search } = req.query;
    const data = await walletService.getWalletTransactions(req.user.id, {
      page,
      limit,
      type,
      search,
    });
    return ApiResponse.success(
      res,
      "Wallet transactions retrieved successfully",
      data.items,
      200,
      data.pagination
    );
  });

  adminGetAllWallets = asyncHandler(async (req, res) => {
    const { page, limit, search } = req.query;
    const data = await walletService.adminGetAllWallets({ page, limit, search });
    return ApiResponse.success(
      res,
      "Customer wallets retrieved successfully",
      data.items,
      200,
      data.pagination
    );
  });

  adminGetCustomerTransactions = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const data = await walletService.adminGetCustomerTransactions(userId, req.query);
    return ApiResponse.success(
      res,
      "Customer wallet transactions retrieved successfully",
      data.items,
      200,
      data.pagination
    );
  });

  adminAdjustWallet = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { amount, type, category, reason, expiresAt } = req.body;
    const result = await walletService.adminAdjustWallet(
      userId,
      { amount, type, category, reason, expiresAt },
      req.user
    );
    return ApiResponse.success(
      res,
      `Customer wallet successfully ${type === "CREDIT" ? "credited" : "debited"}`,
      result
    );
  });

  adminExportTransactions = asyncHandler(async (req, res) => {
    const format = req.query.format || "json";
    const transactions = await walletService.adminExportTransactions();

    if (format === "csv") {
      const headers = [
        "Transaction ID",
        "Date",
        "Customer Name",
        "Customer Email",
        "Customer Phone",
        "Type",
        "Category",
        "Amount (INR)",
        "Balance Before",
        "Balance After",
        "Status",
        "Reference ID",
        "Description",
      ];

      const rows = transactions.map((t) => {
        const u = t.wallet?.user || {};
        const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Customer";
        return [
          `"${t.transactionId}"`,
          `"${new Date(t.createdAt).toISOString()}"`,
          `"${name.replace(/"/g, '""')}"`,
          `"${u.email || ""}"`,
          `"${u.phone || ""}"`,
          `"${t.type}"`,
          `"${t.category}"`,
          t.amount.toFixed(2),
          t.balanceBefore.toFixed(2),
          t.balanceAfter.toFixed(2),
          `"${t.status}"`,
          `"${t.referenceId || ""}"`,
          `"${(t.description || "").replace(/"/g, '""')}"`,
        ].join(",");
      });

      const csvContent = [headers.join(","), ...rows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="kln_wallet_ledger_${Date.now()}.csv"`
      );
      return res.send(csvContent);
    }

    return ApiResponse.success(res, "Wallet ledger exported successfully", transactions);
  });
}

module.exports = new WalletController();
