const prisma = require("../../config/prisma");
const logger = require("../../config/logger");

class NotificationsRepository {
  async createNotification(data) {
    try {
      return await prisma.notification.create({
        data,
      });
    } catch (err) {
      logger.error(`Failed to create notification in DB: ${err.message}`);
      return null;
    }
  }

  async getUserNotifications(userId, limit = 50) {
    try {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    } catch (err) {
      logger.error(`Failed to fetch notifications for user (${userId}): ${err.message}`);
      return [];
    }
  }

  async getUnreadCount(userId) {
    try {
      return await prisma.notification.count({
        where: { userId, readAt: null },
      });
    } catch (err) {
      logger.error(`Failed to get unread notification count for user (${userId}): ${err.message}`);
      return 0;
    }
  }

  async markAsRead(id, userId) {
    try {
      return await prisma.notification.updateMany({
        where: { id, userId, readAt: null },
        data: { readAt: new Date() },
      });
    } catch (err) {
      logger.error(`Failed to mark notification (${id}) as read: ${err.message}`);
    }
  }

  async markAllAsRead(userId) {
    try {
      return await prisma.notification.updateMany({
        where: { userId, readAt: null },
        data: { readAt: new Date() },
      });
    } catch (err) {
      logger.error(`Failed to mark all notifications as read for user (${userId}): ${err.message}`);
    }
  }
}

module.exports = new NotificationsRepository();
