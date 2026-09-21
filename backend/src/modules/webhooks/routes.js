const express = require("express");
const webhookController = require("./controller");

const router = express.Router();

// Webhook status & integration info
router.get("/info", webhookController.getWebhookInfo);
router.get("/health", webhookController.getWebhookInfo);

// Delivery / Logistics Webhook Routes
router.post("/delivery", webhookController.handleDeliveryWebhook);
router.post("/shipment", webhookController.handleDeliveryWebhook);

// Payment Gateway Webhook Routes
router.post("/payment", webhookController.handlePaymentWebhook);

module.exports = router;
