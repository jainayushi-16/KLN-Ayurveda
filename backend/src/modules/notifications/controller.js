const notificationsService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class NotificationsController {
  getUserNotifications = asyncHandler(async (req, res) => {
    const notifications = await notificationsService.getUserNotifications(req.user.id);
    return ApiResponse.success(res, "User notifications retrieved", notifications);
  });

  getUnreadCount = asyncHandler(async (req, res) => {
    const result = await notificationsService.getUnreadCount(req.user.id);
    return ApiResponse.success(res, "Unread count retrieved", result);
  });

  markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await notificationsService.markAsRead(id, req.user.id);
    return ApiResponse.success(res, result.message);
  });

  markAllAsRead = asyncHandler(async (req, res) => {
    const result = await notificationsService.markAllAsRead(req.user.id);
    return ApiResponse.success(res, result.message);
  });

  deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await notificationsService.deleteNotification(id, req.user.id);
    return ApiResponse.success(res, result.message);
  });

  deleteAllNotifications = asyncHandler(async (req, res) => {
    const result = await notificationsService.deleteAllNotifications(req.user.id);
    return ApiResponse.success(res, result.message);
  });
}

module.exports = new NotificationsController();
