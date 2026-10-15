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
          await walletService.processRefundToWallet(order.id, {
            refundAmount: order.totalAmount,
            reason: `Return refund for Order #${order.orderNumber}`,
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

}

module.exports = new AdminService();


