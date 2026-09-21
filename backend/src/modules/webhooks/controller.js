const webhookService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class WebhookController {
  /**
   * POST /api/v1/webhooks/delivery (or /shipment)
   * Logistics / Carrier Webhook Listener (Shiprocket, Delhivery, BlueDart)
   */
  handleDeliveryWebhook = asyncHandler(async (req, res) => {
    // Secret verification check (optional configured secret header)
    const webhookSecret = process.env.DELIVERY_WEBHOOK_SECRET || process.env.SHIPROCKET_WEBHOOK_TOKEN;
    const incomingSecret = req.headers["x-webhook-secret"] || req.headers["x-shiprocket-signature"] || req.query.secret;

    if (webhookSecret && incomingSecret && webhookSecret !== incomingSecret) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized delivery webhook signature.",
      });
    }

    const result = await webhookService.processDeliveryWebhook(req.body, req.headers);
    return ApiResponse.success(res, "Delivery webhook received & processed", result, 200);
  });

  /**
   * POST /api/v1/webhooks/payment
   * Payment Gateway Webhook Listener (Razorpay, Stripe, PhonePe, Paytm)
   */
  handlePaymentWebhook = asyncHandler(async (req, res) => {
    const paymentSecret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET;
    const incomingSecret = req.headers["x-payment-signature"] || req.headers["x-razorpay-signature"] || req.query.secret;

    if (paymentSecret && incomingSecret && paymentSecret !== incomingSecret) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized payment webhook signature.",
      });
    }

    const result = await webhookService.processPaymentWebhook(req.body, req.headers);
    return ApiResponse.success(res, "Payment webhook received & processed", result, 200);
  });

  /**
   * GET /api/v1/webhooks/info
   * Documentation & API Health for Webhook Integrations
   */
  getWebhookInfo = asyncHandler(async (req, res) => {
    return ApiResponse.success(res, "KLN Ayurveda Webhook Gateway is Active", {
      endpoints: {
        delivery: {
          path: "/api/v1/webhooks/delivery",
          method: "POST",
          headers: ["x-webhook-secret", "x-shiprocket-signature"],
          payloadSample: {
            orderNumber: "KLN-123456",
            status: "DELIVERED",
            carrier: "BlueDart Express",
            trackingNumber: "TRK-908123",
            current_location: "Mumbai Hub",
          },
        },
        payment: {
          path: "/api/v1/webhooks/payment",
          method: "POST",
          headers: ["x-payment-signature", "x-razorpay-signature"],
          payloadSample: {
            orderNumber: "KLN-123456",
            paymentStatus: "PAID",
            transactionId: "TXN987654",
            provider: "RAZORPAY",
          },
        },
      },
      status: "ONLINE",
    });
  });
}

module.exports = new WebhookController();
