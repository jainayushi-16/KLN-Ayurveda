const express = require("express");
const notificationsController = require("./controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", notificationsController.getUserNotifications);
router.get("/unread-count", notificationsController.getUnreadCount);
router.patch("/read-all", notificationsController.markAllAsRead);
router.patch("/:id/read", notificationsController.markAsRead);

module.exports = router;
