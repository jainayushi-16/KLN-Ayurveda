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

  async getAllOrders(page, limit, status, search) {
    return adminRepository.getAllOrders(page, limit, status, search);
  }

  async getOrderDetails(id) {
    return adminRepository.getOrderDetails(id);
  }

  async updateOrderStatus(orderId, status) {
    const updated = await adminRepository.updateOrderStatus(orderId, status);

    // Send order status update email & create in-app notification for customer
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true },
      });

      if (order && order.user) {
        let statusBadge = "📌";
        if (status === "PROCESSING") statusBadge = "⚙️";
        if (status === "SHIPPED") statusBadge = "🚚";
        if (status === "DELIVERED") statusBadge = "🎉";
        if (status === "CANCELLED") statusBadge = "❌";

        const notificationsService = require("../notifications/service");
        notificationsService.createAndSendNotification({
          userId: order.userId,
          type: "ORDER",
          title: `Order Status Updated: ${status}`,
          message: `Your order #${order.orderNumber} status has been updated to ${status}.`,
          metadata: { orderId: order.id, orderNumber: order.orderNumber, status },
        }).catch(() => {});
      }
    } catch (e) {
      // Non-blocking
    }

    return updated;
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    return adminRepository.updatePaymentStatus(orderId, paymentStatus);
  }

  async getAllCustomers() {
    return adminRepository.getAllCustomers();
  }

  async getAllReviews() {
    return adminRepository.getAllReviews();
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
    const normalizedEmail = (email || "").trim().toLowerCase();
    const user = await authRepository.findByEmail(normalizedEmail);

    if (!user || user.role !== "ADMIN") {
      logger.info(`[ADMIN FORGOT PASSWORD] Requested for email: ${normalizedEmail}`);
      return { message: "If an account with that email exists, a password reset link has been sent." };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await authRepository.createResetToken(user.id, tokenHash, expiresAt);

    const baseUrl = (env.adminFrontendUrl || "http://localhost:3001").replace(/\/+$/, "");
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

    try {
      await mailService.sendPasswordResetEmail({
        to: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Administrator",
        resetUrl,
        isAdmin: true,
      });
      logger.info(`[ADMIN FORGOT PASSWORD] Reset link email sent successfully to admin ${user.email}`);
    } catch (err) {
      logger.error(`[ADMIN FORGOT PASSWORD] Email dispatch error to admin ${user.email}: ${err.message}`);
    }

    return { message: "If an account with that email exists, a password reset link has been sent." };
  }

  async resetPassword(token, newPassword) {
    if (!token || typeof token !== "string") {
      throw new ApiError(400, "The reset link is invalid or has expired.");
    }
    if (!newPassword || newPassword.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long.");
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetTokenRecord = await authRepository.findResetToken(tokenHash);

    if (!resetTokenRecord || resetTokenRecord.usedAt || new Date() > new Date(resetTokenRecord.expiresAt)) {
      throw new ApiError(400, "The reset link is invalid or has expired.");
    }

    if (!resetTokenRecord.user || resetTokenRecord.user.role !== "ADMIN") {
      throw new ApiError(400, "The reset link is invalid or has expired.");
    }

    const hashedPassword = await hashPassword(newPassword);
    await authRepository.updateUser(resetTokenRecord.userId, { password: hashedPassword });
    await authRepository.markResetTokenUsed(resetTokenRecord.id);

    return { message: "Your password has been reset successfully." };
  }
}

module.exports = new AdminService();


