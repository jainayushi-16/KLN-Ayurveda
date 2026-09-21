const prisma = require("../../config/prisma");
const logger = require("../../config/logger");
const ApiError = require("../../utils/apiError");
const sendEmail = require("../../utils/sendEmail");

class WebhookService {
  /**
   * Process Delivery / Shipment Webhook from Logistics Providers
   * Supported Carriers: Shiprocket, Delhivery, BlueDart, Pickrr, Custom Logistics
   */
  async processDeliveryWebhook(payload, headers = {}) {
    logger.info("📦 [Webhook Delivery Payload Received]:", JSON.stringify(payload));

    // Extract Order Reference, Status & Tracking Metadata from payload
    const orderNumber = payload.orderNumber || payload.order_id || payload.order_number || payload.awb || payload.tracking_number;
    const rawStatus = (payload.status || payload.current_status || payload.shipment_status || "").toUpperCase();
    const carrier = payload.carrier || payload.courier_name || "Express Courier";
    const trackingNumber = payload.trackingNumber || payload.awb || payload.waybill || payload.tracking_id || "";
    const currentLocation = payload.current_location || payload.location || payload.city || "";
    const estimatedDelivery = payload.estimated_delivery || payload.edd || "";

    if (!orderNumber) {
      throw new ApiError(400, "Missing orderNumber or AWB in delivery webhook payload");
    }

    // Find Order in Database
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: String(orderNumber) },
          { id: String(orderNumber) },
        ],
      },
      include: { user: true, items: true },
    });

    if (!order) {
      logger.warn(`⚠️ Delivery Webhook: Order #${orderNumber} not found in database.`);
      return { success: false, message: `Order #${orderNumber} not found` };
    }

    // Map external courier status to internal OrderStatus
    let newStatus = order.status;
    if (rawStatus.includes("DELIVER") || rawStatus === "DLVD") {
      newStatus = "DELIVERED";
    } else if (rawStatus.includes("OUT_FOR_DELIVERY") || rawStatus.includes("DISPATCH") || rawStatus.includes("TRANSIT") || rawStatus.includes("SHIPPED") || rawStatus === "IN_TRANSIT") {
      newStatus = "SHIPPED";
    } else if (rawStatus.includes("CANCEL") || rawStatus.includes("RTO")) {
      newStatus = "CANCELLED";
    }

    // Update Order Status in Database
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
      },
    });

    // Create In-App Notification for Customer
    try {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          type: "ORDER_STATUS",
          title: `Order #${order.orderNumber} ${newStatus === "DELIVERED" ? "Delivered 🎉" : newStatus === "SHIPPED" ? "Shipped 🚚" : "Updated"}`,
          message: `Your order #${order.orderNumber} shipment status has been updated to: ${newStatus.replace("_", " ")}${currentLocation ? ` at ${currentLocation}` : ""}.`,
          metadata: {
            orderNumber: order.orderNumber,
            status: newStatus,
            carrier,
            trackingNumber,
            currentLocation,
            estimatedDelivery,
          },
        },
      });
    } catch (e) {
      logger.warn("Webhook Notification Error:", e.message);
    }

    // Send Customer Status Email
    if (order.user && order.user.email) {
      try {
        sendEmail({
          to: order.user.email,
          subject: `Order #${order.orderNumber} Update: ${newStatus.replace("_", " ")} - KLN Ayurveda`,
          text: `Hello ${order.user.firstName || "Customer"}, your order #${order.orderNumber} status is now ${newStatus}. Carrier: ${carrier}, AWB: ${trackingNumber}.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #f7f4ec;">
              <h2 style="color: #2F5D34;">🌿 KLN Ayurveda Delivery Update</h2>
              <p>Hello <strong>${order.user.firstName || "Valued Customer"}</strong>,</p>
              <p>Your order <strong>#${order.orderNumber}</strong> has a new shipment update:</p>
              <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #2F5D34; margin: 15px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Status:</strong> <span style="color: #2F5D34; font-weight: bold;">${newStatus.replace("_", " ")}</span></p>
                <p style="margin: 0 0 8px 0;"><strong>Carrier:</strong> ${carrier}</p>
                ${trackingNumber ? `<p style="margin: 0 0 8px 0;"><strong>Tracking AWB:</strong> ${trackingNumber}</p>` : ""}
                ${currentLocation ? `<p style="margin: 0;"><strong>Current Location:</strong> ${currentLocation}</p>` : ""}
              </div>
              <p style="font-size: 13px; color: #555;">Thank you for choosing KLN Ayurveda authentic Kshirapaka formulations!</p>
            </div>
          `,
        }).catch(() => {});
      } catch (e) {}
    }

    return {
      success: true,
      orderNumber: order.orderNumber,
      previousStatus: order.status,
      newStatus,
      carrier,
      trackingNumber,
    };
  }

  /**
   * Process Payment Webhook from Gateways (Razorpay, Stripe, PhonePe, Paytm)
   */
  async processPaymentWebhook(payload, headers = {}) {
    logger.info("💳 [Webhook Payment Payload Received]:", JSON.stringify(payload));

    const orderNumber = payload.orderNumber || payload.order_id || payload.order_number || payload.data?.object?.metadata?.orderNumber;
    const paymentStatus = (payload.paymentStatus || payload.status || payload.event || payload.data?.object?.status || "").toUpperCase();
    const transactionId = payload.transactionId || payload.payment_id || payload.id || payload.data?.object?.id || `TXN-${Date.now()}`;
    const provider = payload.provider || payload.gateway || "GATEWAY";

    if (!orderNumber) {
      throw new ApiError(400, "Missing orderNumber in payment webhook payload");
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: String(orderNumber) },
          { id: String(orderNumber) },
        ],
      },
      include: { user: true },
    });

    if (!order) {
      logger.warn(`⚠️ Payment Webhook: Order #${orderNumber} not found.`);
      return { success: false, message: `Order #${orderNumber} not found` };
    }

    let isPaid = paymentStatus.includes("PAID") || paymentStatus.includes("SUCCESS") || paymentStatus.includes("SUCCEEDED") || paymentStatus.includes("COMPLETED");
    let isFailed = paymentStatus.includes("FAIL") || paymentStatus.includes("DENIED") || paymentStatus.includes("CANCEL");

    const newPaymentStatus = isPaid ? "PAID" : isFailed ? "FAILED" : "PENDING";
    const newOrderStatus = isPaid && order.status === "PENDING" ? "PROCESSING" : order.status;

    // Update Order & Upsert Payment Record
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
      },
    });

    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: order.totalAmount,
        provider,
        status: newPaymentStatus,
        transactionId,
      },
      update: {
        amount: order.totalAmount,
        provider,
        status: newPaymentStatus,
        transactionId,
      },
    });

    return {
      success: true,
      orderNumber: order.orderNumber,
      paymentStatus: newPaymentStatus,
      orderStatus: newOrderStatus,
      transactionId,
    };
  }
}

module.exports = new WebhookService();
