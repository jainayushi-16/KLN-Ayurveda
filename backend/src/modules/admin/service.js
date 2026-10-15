const adminRepository = require("./repository");
const authRepository = require("../auth/repository");
const prisma = require("../../config/prisma");
const sendEmail = require("../../utils/sendEmail");
const mailService = require("../../services/mail.service");
const { hashPassword } = require("../../utils/password");
const ApiError = require("../../utils/apiError");
const env = require("../../config/env");
const logger = require("../../config/logger");
const crypto = require("crypto");

class AdminService {
  async getDashboardStats() {
    return adminRepository.getDashboardStats();
  }

  async getAllProducts(page, limit, search, categoryId) {
    return adminRepository.getAllProducts(page, limit, search, categoryId);
  }

  async createProduct(data) {
    return adminRepository.createProduct(data);
  }

  async updateProduct(id, data) {
    return adminRepository.updateProduct(id, data);
  }

  async deleteProduct(id) {
    return adminRepository.deleteProduct(id);
  }

  async updateStock(id, stockQuantity, inStock) {
    return adminRepository.updateStock(id, stockQuantity, inStock);
  }

  async createCategory(data) {
    return adminRepository.createCategory(data);
  }

  async updateCategory(id, data) {
    return adminRepository.updateCategory(id, data);
  }

  async deleteCategory(id) {
    return adminRepository.deleteCategory(id);
  }

  async getAllOrders(page, limit, status, search, paymentStatus, paymentMethod) {
    return adminRepository.getAllOrders(page, limit, status, search, paymentStatus, paymentMethod);
  }

  async getOrderDetails(id) {
    return adminRepository.getOrderDetails(id);
  }

  async updateOrderStatus(orderId, status) {
    const updated = await adminRepository.updateOrderStatus(orderId, status);

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true, items: true },
      });

      if (order) {
        const walletService = require("../wallet/service");

        // Handle cancellation or return refund to wallet
        if (status === "CANCELLED" && (order.paymentStatus === "PAID" || (order.walletAmount && order.walletAmount > 0))) {
          const refundAmount = order.paymentStatus === "PAID" ? order.totalAmount : order.walletAmount;
          await walletService.processRefundToWallet(order.id, {
            refundAmount,
            reason: `Order #${order.orderNumber} cancelled by admin`,
            category: "CANCELLATION_REFUND",
          }).catch((err) => console.warn("Admin cancel wallet refund error:", err.message));

          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "REFUNDED" },
          }).catch(() => {});
        } else if (status === "RETURNED" || status === "RETURN_APPROVED") {
          // If the return product is happened, then the refund is 50%
          const basePaidAmount = order.paymentStatus === "PAID" || order.paymentStatus === "REFUNDED"
            ? order.totalAmount
            : (order.walletAmount || order.totalAmount);
          const refundAmount = Number((basePaidAmount * 0.50).toFixed(2));

          await walletService.processRefundToWallet(order.id, {
            refundAmount,
            reason: `50% Return refund for Order #${order.orderNumber} (Policy: 50% refund on returned products)`,
            category: "RETURN_REFUND",
          }).catch((err) => console.warn("Admin return wallet refund error:", err.message));

          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "REFUNDED" },
          }).catch(() => {});
        }

        if (order.user) {
          const notificationsService = require("../notifications/service");
          notificationsService.createAndSendNotification({
            userId: order.userId,
            type: "ORDER",
            title: `Order Status Updated: ${status}`,
            message: `Your order #${order.orderNumber} status has been updated to ${status}.`,
            metadata: { orderId: order.id, orderNumber: order.orderNumber, status },
          }).catch(() => {});
        }
      }
    } catch (e) {
      // Non-blocking
    }

    return updated;
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    const updated = await adminRepository.updatePaymentStatus(orderId, paymentStatus);

    if (paymentStatus === "REFUNDED") {
      try {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (order) {
          const walletService = require("../wallet/service");
          const refundAmount = order.paymentStatus === "PAID" || paymentStatus === "REFUNDED" ? order.totalAmount : (order.walletAmount || 0);
          if (refundAmount > 0) {
            await walletService.processRefundToWallet(order.id, {
              refundAmount,
              reason: `Order #${order.orderNumber} refunded by admin`,
              category: "REFUND",
            }).catch((err) => console.warn("Admin payment status wallet refund error:", err.message));
          }
        }
      } catch (err) {
        console.warn("Wallet refund on payment update error:", err.message);
      }
    }

    return updated;
  }

  async handleReturnResponse(orderId, isApproved) {
    const existingOrder = await prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
      include: { user: true, items: true },
    });

    if (!existingOrder) {
      throw new Error(`Order ${orderId} not found`);
    }

    const walletService = require("../wallet/service");
    const notificationsService = require("../notifications/service");

    if (isApproved) {
      // If the return product is happened, then the refund is 50%
      const basePaidAmount = existingOrder.paymentStatus === "PAID" || existingOrder.paymentStatus === "REFUNDED"
        ? existingOrder.totalAmount
        : (existingOrder.walletAmount || existingOrder.totalAmount);
      const refundAmount = Number((basePaidAmount * 0.50).toFixed(2));

      await walletService.processRefundToWallet(existingOrder.id, {
        refundAmount,
        reason: `50% Return refund for Order #${existingOrder.orderNumber} (Policy: 50% refund on product returns)`,
        category: "RETURN_REFUND",
      }).catch((err) => console.warn("Return approval wallet refund error:", err.message));

      // Restock inventory items
      if (Array.isArray(existingOrder.items)) {
        for (const item of existingOrder.items) {
          if (item.productId && item.quantity > 0) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: { increment: item.quantity },
                inStock: true,
              },
            }).catch(() => {});
          }
        }
      }

      const updated = await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          status: "CANCELLED",
          paymentStatus: "REFUNDED",
        },
      });

      // Notify customer of 50% wallet credit
      if (existingOrder.user) {
        notificationsService.createAndSendNotification({
          userId: existingOrder.userId,
          type: "ORDER",
          title: "Return Request Approved (50% Refund)",
          message: `Your return request for order #${existingOrder.orderNumber} was approved! A 50% refund of ₹${refundAmount.toFixed(2)} has been credited to your KLN Wallet.`,
          metadata: { orderId: existingOrder.id, orderNumber: existingOrder.orderNumber, refundAmount },
        }).catch(() => {});
      }

      return updated;
    } else {
      const updated = await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          status: "DELIVERED",
        },
      });

      if (existingOrder.user) {
        notificationsService.createAndSendNotification({
          userId: existingOrder.userId,
          type: "ORDER",
          title: "Return Request Rejected",
          message: `Your return request for order #${existingOrder.orderNumber} was reviewed and rejected as it does not comply with KLN Return Policy.`,
          metadata: { orderId: existingOrder.id, orderNumber: existingOrder.orderNumber },
        }).catch(() => {});
      }

      return updated;
    }
  }

  async getAllCustomers() {
    return adminRepository.getAllCustomers();
  }

  async getCustomerById(id) {
    return adminRepository.getCustomerById(id);
  }

  async updateCustomer(id, data) {
    return adminRepository.updateCustomer(id, data);
  }

  async deleteCustomer(id) {
    return adminRepository.deleteCustomer(id);
  }

  async getAllReviews() {
    return adminRepository.getAllReviews();
  }

  async createReview(data) {
    return adminRepository.createReview(data);
  }

  async deleteReview(id) {
    return adminRepository.deleteReview(id);
  }

  async getSettings() {
    return adminRepository.getSettings();
  }

  async upsertSetting(key, value, description) {
    return adminRepository.upsertSetting(key, value, description);
  }

  async forgotPassword(email) {
    const authService = require("../auth/service");
    return authService.forgotPassword(email);
  }

  async resetPassword(token, newPassword) {
    const authService = require("../auth/service");
    return authService.resetPassword(token, newPassword);
  }

  async getAdminNotifications(adminUserId) {
    const directNotifs = await prisma.notification.findMany({
      where: { userId: adminUserId },
      orderBy: { createdAt: "desc" },
      take: 100,
    }).catch(() => []);

    const storeNotifs = await prisma.notification.findMany({
      where: {
        type: { in: ["ORDER", "INVENTORY", "RETURN", "SYSTEM", "ANNOUNCEMENT"] },
        NOT: { userId: adminUserId },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }).catch(() => []);

    const combinedMap = new Map();
    [...directNotifs, ...storeNotifs].forEach((n) => {
      combinedMap.set(n.id, n);
    });

    // Synthesize notifications from recent orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    }).catch(() => []);

    recentOrders.forEach((order) => {
      const syntheticId = `order-alert-${order.id}`;
      if (!combinedMap.has(syntheticId)) {
        const custName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'Customer';
        combinedMap.set(syntheticId, {
          id: syntheticId,
          type: "ORDER",
          title: `🛍️ Order #${order.orderNumber} (${order.status})`,
          message: `${custName || 'Customer'} placed order for ₹${order.totalAmount} via ${order.paymentMethod || 'Online'}.`,
          metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            status: order.status,
            paymentStatus: order.paymentStatus,
          },
          readAt: null,
          createdAt: order.createdAt,
        });
      }
    });

    // Low stock items
    const lowStockProducts = await prisma.product.findMany({
      where: { stockQuantity: { lte: 10 } },
      take: 5,
    }).catch(() => []);

    lowStockProducts.forEach((p) => {
      const syntheticId = `inventory-low-${p.id}`;
      if (!combinedMap.has(syntheticId)) {
        combinedMap.set(syntheticId, {
          id: syntheticId,
          type: "INVENTORY",
          title: `⚠️ Low Stock Alert: ${p.name}`,
          message: `Only ${p.stockQuantity} unit(s) remaining for ${p.name}. Restock recommended.`,
          metadata: { productId: p.id, stockQuantity: p.stockQuantity },
          readAt: null,
          createdAt: p.updatedAt || new Date(),
        });
      }
    });

    return Array.from(combinedMap.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  async broadcastNotification({ title, message, type = "ANNOUNCEMENT", targetRole = "ALL", senderId }) {
    let targetUsers = [];
    if (targetRole === "ADMIN") {
      targetUsers = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
    } else if (targetRole === "CUSTOMER") {
      targetUsers = await prisma.user.findMany({ where: { role: "CUSTOMER" }, select: { id: true } });
    } else {
      targetUsers = await prisma.user.findMany({ select: { id: true } });
    }

    const created = [];
    for (const u of targetUsers) {
      const notif = await prisma.notification.create({
        data: {
          userId: u.id,
          type,
          title,
          message,
          metadata: { senderId, targetRole, broadcastAt: new Date().toISOString() },
        },
      }).catch(() => null);
      if (notif) created.push(notif);
    }

    return { count: created.length, message: `Notification broadcasted to ${created.length} users` };
  }
}

module.exports = new AdminService();


