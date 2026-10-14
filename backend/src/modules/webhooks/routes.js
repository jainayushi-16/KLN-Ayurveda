const express = require("express");
const webhookController = require("./controller");

const router = express.Router();

// Webhook status & integration info
router.get("/info", webhookController.getWebhookInfo);
router.get("/health", webhookController.getWebhookInfo);

// Payment Gateway Webhook Routes
router.post("/payment", webhookController.handlePaymentWebhook);

module.exports = router;

