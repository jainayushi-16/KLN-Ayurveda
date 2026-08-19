const notificationsRepository = require("./repository");
const mailService = require("../../services/mail.service");
const prisma = require("../../config/prisma");
const logger = require("../../config/logger");

class NotificationsService {
  /**
   * Helper to create in-app DB notification + dispatch SMTP email
   */
  async createAndSendNotification({ userId, type = "GENERAL", title, message, metadata, actionUrl }) {
    if (!userId || !title || !message) {
      logger.warn("⚠️ createAndSendNotification missing required fields.");
      return null;
    }

    // 1. Create In-App Notification in DB
    const notif = await notificationsRepository.createNotification({
      userId,
      type,
      title,
      message,
      metadata: metadata || undefined,
    });

    // 2. Fetch User to send Email Notification
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, firstName: true },
      });

      if (user && user.email) {
        // Asynchronously dispatch email notification (non-blocking failure handling)
        mailService.sendNotificationEmail({
          to: user.email,
          name: user.firstName,
          title,
          message,
          type,
          actionUrl,
        }).catch((err) => {
          logger.error(`❌ Non-blocking SMTP notification email error to ${user.email}: ${err.message}`);
        });
      }
    } catch (err) {
      logger.error(`Failed to fetch user email for notification (${userId}): ${err.message}`);
    }

    return notif;
  }

  async getUserNotifications(userId) {
    return notificationsRepository.getUserNotifications(userId);
  }

  async getUnreadCount(userId) {
    const count = await notificationsRepository.getUnreadCount(userId);
    return { unreadCount: count };
  }

  async markAsRead(id, userId) {
    await notificationsRepository.markAsRead(id, userId);
    return { message: "Notification marked as read" };
  }

  async markAllAsRead(userId) {
    await notificationsRepository.markAllAsRead(userId);
    return { message: "All notifications marked as read" };
  }
}

module.exports = new NotificationsService();
