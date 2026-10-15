const walletRepository = require("./repository");
const prisma = require("../../config/prisma");
const ApiError = require("../../utils/apiError");
const logger = require("../../config/logger");

class WalletService {
  async getWalletBalance(userId) {
    if (!userId) throw new ApiError(401, "Authentication required");

    // Clean up any expired promotional credits before returning balance
    await this.processExpiredCredits(userId).catch((err) => {
      logger.warn(`Failed to process expired wallet credits for user ${userId}:`, err.message);
    });

    const wallet = await walletRepository.getOrCreateWallet(userId);

    // Calculate aggregated metrics
    const [aggregates] = await Promise.all([
      prisma.walletTransaction.groupBy({
        by: ["category"],
        where: { walletId: wallet.id, status: "COMPLETED" },
        _sum: { amount: true },
      }),
    ]);

    let totalCashback = 0;
    let totalRefunds = 0;
    let totalPurchases = 0;

    for (const agg of aggregates) {
      const sum = agg._sum?.amount || 0;
      if (agg.category === "PROMOTIONAL_CASHBACK") totalCashback += sum;
      else if (["REFUND", "CANCELLATION_REFUND", "RETURN_REFUND"].includes(agg.category)) totalRefunds += sum;
      else if (["PURCHASE", "PARTIAL_PURCHASE"].includes(agg.category)) totalPurchases += sum;
    }

    return {
      walletId: wallet.id,
      balance: Math.round(wallet.balance * 100) / 100,
      currency: "INR",
      currencySymbol: "₹",
      totalCashback: Math.round(totalCashback * 100) / 100,
      totalRefunds: Math.round(totalRefunds * 100) / 100,
      totalPurchases: Math.round(totalPurchases * 100) / 100,
      updatedAt: wallet.updatedAt,
    };
  }

  async getWalletTransactions(userId, { page = 1, limit = 20, type = "ALL", search = "" }) {
    if (!userId) throw new ApiError(401, "Authentication required");

    const wallet = await walletRepository.getOrCreateWallet(userId);
    return walletRepository.getTransactions(wallet.id, {
      page: Math.max(1, parseInt(page, 10) || 1),
      limit: Math.max(1, Math.min(100, parseInt(limit, 10) || 20)),
      filter: type,
      search,
    });
  }

  async processExpiredCredits(userId) {
    const now = new Date();
    const expiredTransactions = await prisma.walletTransaction.findMany({
      where: {
        wallet: { userId },
        type: "CREDIT",
        status: "COMPLETED",
        expiresAt: { lte: now },
        metadata: {
          path: ["isExpiredProcessed"],
          equals: null,
        },
      },
      include: { wallet: true },
    });

    for (const txn of expiredTransactions) {
      try {
        await prisma.$transaction(async (tx) => {
          const currentWallet = await tx.wallet.findUnique({
            where: { id: txn.walletId },
          });

          if (!currentWallet || currentWallet.balance <= 0) return;

          // Debit at most what is left in wallet
          const debitAmount = Math.min(currentWallet.balance, txn.amount);
          if (debitAmount <= 0) return;

          const newBalance = Math.round((currentWallet.balance - debitAmount) * 100) / 100;
          await tx.wallet.update({
            where: { id: txn.walletId },
            data: { balance: newBalance },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: txn.walletId,
              transactionId: walletRepository.generateTransactionId(),
              amount: debitAmount,
              type: "DEBIT",
              category: "EXPIRED",
              balanceBefore: currentWallet.balance,
              balanceAfter: newBalance,
              referenceType: "WALLET_TRANSACTION",
              referenceId: txn.transactionId,
              description: `Expired promotional credit from ${txn.transactionId}`,
              status: "COMPLETED",
            },
          });

          // Mark parent transaction as processed
          const meta = (typeof txn.metadata === "object" && txn.metadata !== null) ? txn.metadata : {};
          await tx.walletTransaction.update({
            where: { id: txn.id },
            data: {
              metadata: { ...meta, isExpiredProcessed: true, expiredAt: now.toISOString() },
            },
          });
        });
      } catch (err) {
        logger.error(`Error expiring transaction ${txn.id}: ${err.message}`);
      }
    }
  }

  async creditWallet(userId, { amount, category = "ADMIN_ADJUSTMENT", description, referenceType = null, referenceId = null, expiresAt = null, metadata = null }, externalTx = null) {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new ApiError(400, "Credit amount must be a positive number");
    }

    const execute = async (tx) => {
      const wallet = await walletRepository.getOrCreateWallet(userId, tx);
      const balanceBefore = wallet.balance;
      const balanceAfter = Math.round((balanceBefore + numAmount) * 100) / 100;

      await walletRepository.updateBalance(wallet.id, balanceAfter, tx);

      const txn = await walletRepository.recordTransaction(
        {
          walletId: wallet.id,
          amount: numAmount,
          type: "CREDIT",
          category,
          balanceBefore,
          balanceAfter,
          referenceType,
          referenceId,
          description: description || `Wallet credited with ₹${numAmount.toFixed(2)}`,
          status: "COMPLETED",
          expiresAt,
          metadata,
        },
        tx
      );

      return { wallet, transaction: txn };
    };

    if (externalTx) {
      return execute(externalTx);
    }
    return prisma.$transaction(execute);
  }

  async debitWallet(userId, { amount, category = "PURCHASE", description, referenceType = null, referenceId = null, metadata = null }, externalTx = null) {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new ApiError(400, "Debit amount must be a positive number");
    }

    const execute = async (tx) => {
      const wallet = await walletRepository.getOrCreateWallet(userId, tx);
      const balanceBefore = wallet.balance;

      if (balanceBefore < numAmount) {
        throw new ApiError(
          400,
          `Insufficient KLN Wallet balance. Available: ₹${balanceBefore.toFixed(2)}, Required: ₹${numAmount.toFixed(2)}`
        );
      }

      const balanceAfter = Math.round((balanceBefore - numAmount) * 100) / 100;
      if (balanceAfter < 0) {
        throw new ApiError(400, "Wallet balance cannot become negative.");
      }

      await walletRepository.updateBalance(wallet.id, balanceAfter, tx);

      const txn = await walletRepository.recordTransaction(
        {
          walletId: wallet.id,
          amount: numAmount,
          type: "DEBIT",
          category,
          balanceBefore,
          balanceAfter,
          referenceType,
          referenceId,
          description: description || `Wallet debited for ₹${numAmount.toFixed(2)}`,
          status: "COMPLETED",
          metadata,
        },
        tx
      );

      return { wallet, transaction: txn };
    };

    if (externalTx) {
      return execute(externalTx);
    }
    return prisma.$transaction(execute);
  }

  async processRefundToWallet(orderId, { refundAmount, reason = "Order refund", category = "REFUND" }, externalTx = null) {
    const execute = async (tx) => {
      // 1. Prevent duplicate refunds
      const existingRefund = await walletRepository.checkDuplicateRefund(orderId, category, tx);
      if (existingRefund) {
        logger.warn(`Refund already credited to wallet for order ${orderId}: ${existingRefund.transactionId}`);
        return existingRefund;
      }

      // 2. Load order to verify user and amount
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { user: true },
      });

      if (!order) {
        throw new ApiError(404, `Order ${orderId} not found for refund`);
      }

      let targetAmount;
      if (refundAmount !== undefined && refundAmount !== null) {
        targetAmount = Number(refundAmount);
      } else if (category === "RETURN_REFUND") {
        targetAmount = Number((Number(order.totalAmount) * 0.50).toFixed(2));
      } else {
        targetAmount = Number(order.totalAmount);
      }
      if (isNaN(targetAmount) || targetAmount <= 0) {
        throw new ApiError(400, "Invalid refund amount");
      }

      const desc = `${category === "CANCELLATION_REFUND" ? "Cancellation refund" : category === "RETURN_REFUND" ? "Return refund" : "Refund"} for Order #${order.orderNumber}: ${reason}`;

      const { transaction } = await this.creditWallet(
        order.userId,
        {
          amount: targetAmount,
          category,
          description: desc,
          referenceType: "ORDER",
          referenceId: order.id,
          metadata: {
            orderNumber: order.orderNumber,
            reason,
          },
        },
        tx
      );

      // Create in-app notification
      try {
        const notificationsService = require("../notifications/service");
        notificationsService.createAndSendNotification({
          userId: order.userId,
          type: "WALLET",
          title: "Refund Credited to KLN Wallet 🌿",
          message: `₹${targetAmount.toFixed(2)} has been credited to your KLN Wallet for Order #${order.orderNumber}.`,
          metadata: { orderId: order.id, orderNumber: order.orderNumber, refundAmount: targetAmount, transactionId: transaction.transactionId },
        }).catch(() => {});
      } catch (e) {}

      return transaction;
    };

    if (externalTx) {
      return execute(externalTx);
    }
    return prisma.$transaction(execute);
  }

  async adminAdjustWallet(targetUserId, { amount, type, category = "ADMIN_ADJUSTMENT", reason, expiresAt = null }, adminUser) {
    if (!reason || !reason.trim()) {
      throw new ApiError(400, "A mandatory reason must be provided for manual wallet adjustments.");
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new ApiError(400, "Adjustment amount must be a positive number.");
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new ApiError(404, "Customer not found");
    }

    const safeAdmin = adminUser || { id: "ADMIN", email: "admin@klnayurveda.com" };

    const metadata = {
      adjustedBy: safeAdmin.id,
      adminEmail: safeAdmin.email,
      reason: reason.trim(),
      adjustmentDate: new Date().toISOString(),
    };

    let result;
    if (type === "CREDIT") {
      result = await this.creditWallet(targetUserId, {
        amount: numAmount,
        category: category || "ADMIN_ADJUSTMENT",
        description: `Admin Credit: ${reason.trim()}`,
        referenceType: "ADMIN",
        referenceId: safeAdmin.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        metadata,
      });
    } else if (type === "DEBIT") {
      result = await this.debitWallet(targetUserId, {
        amount: numAmount,
        category: "ADMIN_ADJUSTMENT",
        description: `Admin Debit: ${reason.trim()}`,
        referenceType: "ADMIN",
        referenceId: safeAdmin.id,
        metadata,
      });
    } else {
      throw new ApiError(400, "Adjustment type must be CREDIT or DEBIT");
    }

    // Notify customer about manual wallet adjustment
    try {
      const notificationsService = require("../notifications/service");
      notificationsService.createAndSendNotification({
        userId: targetUserId,
        type: "WALLET",
        title: type === "CREDIT" ? "KLN Wallet Credited" : "KLN Wallet Debited",
        message: `₹${numAmount.toFixed(2)} has been ${type === "CREDIT" ? "credited to" : "debited from"} your KLN Wallet. (${reason.trim()})`,
        metadata: {
          transactionId: result.transaction.transactionId,
          type,
          amount: numAmount,
        },
      }).catch(() => {});
    } catch (e) {}

    return result;
  }

  async adminGetAllWallets({ page = 1, limit = 100, search = "" }) {
    return walletRepository.getAllWallets({
      page: Math.max(1, parseInt(page, 10) || 1),
      limit: Math.max(1, Math.min(500, parseInt(limit, 10) || 100)),
      search,
    });
  }

  async adminGetCustomerTransactions(targetUserId, query) {
    const wallet = await walletRepository.getOrCreateWallet(targetUserId);
    return walletRepository.getTransactions(wallet.id, {
      page: Math.max(1, parseInt(query.page, 10) || 1),
      limit: Math.max(1, Math.min(100, parseInt(query.limit, 10) || 20)),
      filter: query.type || "ALL",
      search: query.search || "",
    });
  }

  async adminExportTransactions() {
    return walletRepository.getAllTransactionsForExport();
  }
}

module.exports = new WalletService();
