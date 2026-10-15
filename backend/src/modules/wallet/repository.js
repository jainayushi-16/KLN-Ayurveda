const prisma = require("../../config/prisma");
const crypto = require("crypto");

class WalletRepository {
  generateTransactionId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
    return `TXN-WLT-${timestamp}-${randomHex}`;
  }

  async getOrCreateWallet(userId, tx = prisma) {
    let wallet = await tx.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!wallet) {
      wallet = await tx.wallet.create({
        data: {
          userId,
          balance: 0,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });
    }

    return wallet;
  }

  async findWalletByUserId(userId, tx = prisma) {
    return tx.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async updateBalance(walletId, newBalance, tx = prisma) {
    return tx.wallet.update({
      where: { id: walletId },
      data: {
        balance: Math.round(newBalance * 100) / 100,
        updatedAt: new Date(),
      },
    });
  }

  async recordTransaction(data, tx = prisma) {
    const transactionId = data.transactionId || this.generateTransactionId();
    return tx.walletTransaction.create({
      data: {
        walletId: data.walletId,
        transactionId,
        amount: Math.round(data.amount * 100) / 100,
        type: data.type,
        category: data.category,
        balanceBefore: Math.round(data.balanceBefore * 100) / 100,
        balanceAfter: Math.round(data.balanceAfter * 100) / 100,
        referenceType: data.referenceType || null,
        referenceId: data.referenceId || null,
        description: data.description,
        status: data.status || "COMPLETED",
        expiresAt: data.expiresAt || null,
        metadata: data.metadata || null,
      },
    });
  }

  async getTransactions(walletId, { page = 1, limit = 20, filter = "ALL", search = "" }) {
    const where = { walletId };

    if (filter === "CREDIT") {
      where.type = "CREDIT";
    } else if (filter === "DEBIT") {
      where.type = "DEBIT";
    } else if (filter === "REFUND") {
      where.category = { in: ["REFUND", "CANCELLATION_REFUND", "RETURN_REFUND"] };
    } else if (filter === "CASHBACK") {
      where.category = "PROMOTIONAL_CASHBACK";
    } else if (filter === "EXPIRED") {
      where.category = "EXPIRED";
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { transactionId: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { referenceId: { contains: q, mode: "insensitive" } },
      ];
    }

    const total = await prisma.walletTransaction.count({ where });
    const items = await prisma.walletTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async checkDuplicateRefund(orderId, category = null, tx = prisma) {
    const where = {
      referenceId: orderId,
      status: "COMPLETED",
    };
    if (category) {
      where.category = category;
    } else {
      where.category = { in: ["REFUND", "CANCELLATION_REFUND", "RETURN_REFUND"] };
    }
    return tx.walletTransaction.findFirst({ where });
  }

  async getAllWallets({ page = 1, limit = 100, search = "" }) {
    // Automatically ensure all users have an initialized wallet record
    try {
      const usersWithoutWallet = await prisma.user.findMany({
        where: { wallet: null },
        select: { id: true },
      });
      if (usersWithoutWallet.length > 0) {
        await prisma.wallet.createMany({
          data: usersWithoutWallet.map((u) => ({ userId: u.id, balance: 0 })),
          skipDuplicates: true,
        });
      }
    } catch (e) {
      console.warn("Wallet backfill note:", e.message);
    }

    const where = {};
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { id: { contains: q, mode: "insensitive" } },
        { user: { firstName: { contains: q, mode: "insensitive" } } },
        { user: { lastName: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { user: { phone: { contains: q, mode: "insensitive" } } },
      ];
    }

    const total = await prisma.wallet.count({ where });
    const items = await prisma.wallet.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { balance: "desc" },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true,
          },
        },
        _count: {
          select: { transactions: true },
        },
      },
    });

    return {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getAllTransactionsForExport() {
    return prisma.walletTransaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 2000,
      include: {
        wallet: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }
}

module.exports = new WalletRepository();
