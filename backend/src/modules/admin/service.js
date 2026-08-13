const adminRepository = require("./repository");
const prisma = require("../../config/prisma");
const sendEmail = require("../../utils/sendEmail");
const nodemailerConfig = require("../../config/nodemailer");

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

    // Send order status update email to customer
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true },
      });

      if (order && order.user && order.user.email) {
        let statusBadge = "📌";
        if (status === "PROCESSING") statusBadge = "⚙️";
        if (status === "SHIPPED") statusBadge = "🚚";
        if (status === "DELIVERED") statusBadge = "🎉";
        if (status === "CANCELLED") statusBadge = "❌";

        sendEmail({
          to: order.user.email,
          subject: `${statusBadge} Order #${order.orderNumber} Status Updated: ${status}`,
          text: `Hello ${order.user.firstName || 'Customer'}, your order #${order.orderNumber} status has been updated to ${status}.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #2e7d32; text-align: center;">${statusBadge} Order Status Update</h2>
              <p>Hello <strong>${order.user.firstName || 'Valued Customer'}</strong>,</p>
              <p>The status of your order <strong>#${order.orderNumber}</strong> has been updated to: <span style="font-weight: bold; color: #2e7d32;">${status}</span>.</p>
              <div style="background: #f9f9f9; padding: 16px; border-radius: 6px; margin: 20px 0; font-size: 14px;">
                <p style="margin: 4px 0;"><strong>Order Number:</strong> #${order.orderNumber}</p>
                <p style="margin: 4px 0;"><strong>New Status:</strong> ${status}</p>
                <p style="margin: 4px 0;"><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
              </div>
              <p style="font-size: 13px; color: #666;">Thank you for choosing KLN Ayurveda.</p>
            </div>
          `,
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
    const setting = await adminRepository.upsertSetting(key, value, description);
    if (key.startsWith("smtp")) {
      await nodemailerConfig.reloadTransporter();
    }
    return setting;
  }

  async testSmtp(toEmail) {
    return nodemailerConfig.verifyAndSendTestEmail(toEmail);
  }
}

module.exports = new AdminService();

