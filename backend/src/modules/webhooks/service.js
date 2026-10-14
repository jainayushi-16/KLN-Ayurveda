const prisma = require("../../config/prisma");
const logger = require("../../config/logger");
const ApiError = require("../../utils/apiError");
const sendEmail = require("../../utils/sendEmail");

class WebhookService {
  /**
   * Process Payment Webhook from Gateways (Razorpay, Stripe, PhonePe, Paytm)
   */
  async processPaymentWebhook(payload, headers = {}) {

    logger.info("💳 [Webhook Payment Payload Received]:", JSON.stringify(payload));

    // Handle Razorpay specific webhook structure
    const rzpEntity = payload.payload?.payment?.entity || payload.payload?.order?.entity;
    const rzpEvent = (payload.event || "").toLowerCase();

    const orderNumber =
      payload.orderNumber ||
      payload.order_id ||
      payload.order_number ||
      rzpEntity?.notes?.orderNumber ||
      rzpEntity?.receipt ||
      payload.data?.object?.metadata?.orderNumber;

    const orderDbId =
      rzpEntity?.notes?.orderId ||
      payload.orderId;

    const rawPaymentStatus = (
      payload.paymentStatus ||
      payload.status ||
      payload.event ||
      rzpEntity?.status ||
      payload.data?.object?.status ||
      ""
    ).toUpperCase();

    const transactionId =
      rzpEntity?.id ||
      payload.transactionId ||
      payload.payment_id ||
      payload.id ||
      payload.data?.object?.id ||
      `TXN-${Date.now()}`;

    const provider = rzpEntity ? "RAZORPAY" : (payload.provider || payload.gateway || "GATEWAY");

    if (!orderNumber && !orderDbId && !rzpEntity?.order_id) {
      throw new ApiError(400, "Missing orderNumber or orderId in payment webhook payload");
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(orderDbId ? [{ id: String(orderDbId) }] : []),
          ...(orderNumber ? [{ orderNumber: String(orderNumber) }, { id: String(orderNumber) }] : []),
          ...(rzpEntity?.order_id ? [{ payment: { transactionId: String(rzpEntity.order_id) } }] : []),
        ],
      },
      include: { user: true },
    });

    if (!order) {
      logger.warn(`⚠️ Payment Webhook: Order reference not found in database.`);
      return { success: false, message: "Order reference not found" };
    }

    let isPaid =
      rzpEvent === "payment.captured" ||
      rzpEvent === "order.paid" ||
      rawPaymentStatus.includes("CAPTURED") ||
      rawPaymentStatus.includes("PAID") ||
      rawPaymentStatus.includes("SUCCESS") ||
      rawPaymentStatus.includes("SUCCEEDED") ||
      rawPaymentStatus.includes("COMPLETED");

    let isFailed =
      rzpEvent === "payment.failed" ||
      rawPaymentStatus.includes("FAIL") ||
      rawPaymentStatus.includes("DENIED") ||
      rawPaymentStatus.includes("CANCEL");

    const newPaymentStatus = isPaid ? "PAID" : isFailed ? "FAILED" : "PENDING";
    const newOrderStatus = isPaid && order.status === "PENDING" ? "PROCESSING" : order.status;

    // Update Order & Upsert Payment Record
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
        paymentMethod: provider,
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
