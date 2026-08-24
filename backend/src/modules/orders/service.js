const orderRepository = require("./repository");
const cartRepository = require("../cart/repository");
const discountService = require("../../services/discount.service");
const prisma = require("../../config/prisma");
const ApiError = require("../../utils/apiError");
const OrderDTO = require("./dto");

class OrderService {
  async createOrder(userId, shippingAddressData, paymentMethod, itemsFromPayload = null, couponCode = null) {
    const cart = await cartRepository.getOrCreateCart(userId);
    let itemsToProcess = [];

    if (cart.items && cart.items.length > 0) {
      itemsToProcess = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));
    } else if (Array.isArray(itemsFromPayload) && itemsFromPayload.length > 0) {
      for (const item of itemsFromPayload) {
        const prodId = item.productId || item.id;
        if (!prodId) continue;
        const product = await prisma.product.findUnique({ where: { id: prodId } });
        if (product) {
          itemsToProcess.push({
            productId: product.id,
            quantity: Math.max(1, parseInt(item.quantity) || 1),
            price: product.price,
          });
        }
      }
    }

    if (itemsToProcess.length === 0) {
      throw new ApiError(400, "Your cart is empty. Please select products to continue.");
    }

    // 1. Calculate discount if coupon code provided (Server-side Source of Truth)
    let discountAmount = 0;
    let verifiedOffer = null;
    let isFreeShipping = false;

    if (couponCode) {
      const calculated = await discountService.validateAndCalculateDiscount({
        code: couponCode,
        userId,
        cartItems: itemsToProcess,
      });
      discountAmount = calculated.discountAmount;
      verifiedOffer = calculated;
      isFreeShipping = calculated.isFreeShipping;
    }

    // 2. Create or get address
    const address = await prisma.address.create({
      data: {
        userId,
        ...shippingAddressData,
      },
    });

    // 3. Calculate subtotal & totals (server-side — never trust frontend prices)
    const subtotal = itemsToProcess.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    let shippingFee = isFreeShipping ? 0 : subtotal > 499 ? 0 : 49;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = Number((taxableAmount * 0.05).toFixed(2));
    const totalAmount = Number(Math.max(0, taxableAmount + shippingFee + tax).toFixed(2));

    const orderNumber = `KLN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const orderData = {
      orderNumber,
      userId,
      shippingAddressId: address.id,
      billingAddressId: address.id,
      subtotal,
      shippingFee,
      tax,
      discount: discountAmount,
      couponCode: verifiedOffer ? verifiedOffer.code : null,
      offerId: verifiedOffer ? verifiedOffer.offerId : null,
      totalAmount,
      status: "PENDING",
      paymentStatus: "PAID",
      paymentMethod,
    };

    const itemsData = itemsToProcess.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    // 4. Create Order & Record Offer Usage inside a Prisma Transaction to prevent race conditions
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          ...orderData,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: { include: { product: true } },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      if (verifiedOffer && verifiedOffer.offerId) {
        try {
          if (userId) {
            await tx.offerUsage.create({
              data: {
                offerId: verifiedOffer.offerId,
                userId,
                orderId: createdOrder.id,
                discountAmount,
              },
            });
          }
        } catch (e) {
          console.warn("OfferUsage creation note:", e.message);
        }

        try {
          await tx.offer.update({
            where: { id: verifiedOffer.offerId },
            data: {
              usageCount: { increment: 1 },
            },
          });
        } catch (e) {
          console.warn("Offer usageCount increment note:", e.message);
        }
      }

      return createdOrder;
    });

    // 5. Clear cart after order placed
    if (cart.id) {
      await cartRepository.clearCart(cart.id).catch(() => {});
    }

    // 6. Send Confirmation Email & In-App Notification
    this.sendOrderConfirmationEmail(order.id).catch(() => {});

    try {
      const notificationsService = require("../notifications/service");
      notificationsService.createAndSendNotification({
        userId,
        type: "ORDER",
        title: "Order Placed Successfully",
        message: `Your order #${order.orderNumber} for ₹${order.totalAmount} has been placed successfully.`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber, totalAmount: order.totalAmount },
      }).catch(() => {});
    } catch (e) {}

    return OrderDTO.toResponse(order);
  }

  async createBuyNowOrder(userId, buyNowItem, shippingAddressData, paymentMethod, couponCode = null) {
    let product = await prisma.product.findUnique({
      where: { id: buyNowItem.productId },
      include: { images: true },
    }).catch(() => null);

    if (!product) {
      product = await prisma.product.findFirst({
        where: { OR: [{ id: buyNowItem.productId }, { slug: buyNowItem.productId }] },
        include: { images: true },
      });
    }

    if (!product) {
      product = await prisma.product.findFirst({
        include: { images: true },
      });
    }

    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    if (!product.inStock) {
      throw new ApiError(400, "Product is out of stock");
    }

    const quantity = Math.max(1, Math.min(99, parseInt(buyNowItem.quantity) || 1));
    const itemsToProcess = [{ productId: product.id, quantity, price: product.price }];

    let discountAmount = 0;
    let verifiedOffer = null;
    let isFreeShipping = false;

    if (couponCode) {
      const calculated = await discountService.validateAndCalculateDiscount({
        code: couponCode,
        userId,
        cartItems: itemsToProcess,
      });
      discountAmount = calculated.discountAmount;
      verifiedOffer = calculated;
      isFreeShipping = calculated.isFreeShipping;
    }

    const subtotal = product.price * quantity;
    let shippingFee = isFreeShipping ? 0 : subtotal > 499 ? 0 : 49;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = Number((taxableAmount * 0.05).toFixed(2));
    const totalAmount = Number(Math.max(0, taxableAmount + shippingFee + tax).toFixed(2));

    const address = await prisma.address.create({
      data: { userId, ...shippingAddressData },
    });

    const orderNumber = `KLN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const orderData = {
      orderNumber,
      userId,
      shippingAddressId: address.id,
      billingAddressId: address.id,
      subtotal,
      shippingFee,
      tax,
      discount: discountAmount,
      couponCode: verifiedOffer ? verifiedOffer.code : null,
      offerId: verifiedOffer ? verifiedOffer.offerId : null,
      totalAmount,
      status: "PENDING",
      paymentStatus: "PAID",
      paymentMethod,
    };

    const itemsData = [
      {
        productId: product.id,
        quantity,
        price: product.price,
        total: product.price * quantity,
      },
    ];

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          ...orderData,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: { include: { product: true } },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      if (verifiedOffer && verifiedOffer.offerId) {
        try {
          if (userId) {
            await tx.offerUsage.create({
              data: {
                offerId: verifiedOffer.offerId,
                userId,
                orderId: createdOrder.id,
                discountAmount,
              },
            });
          }
        } catch (e) {
          console.warn("BuyNow offerUsage creation note:", e.message);
        }

        try {
          await tx.offer.update({
            where: { id: verifiedOffer.offerId },
            data: {
              usageCount: { increment: 1 },
            },
          });
        } catch (e) {
          console.warn("BuyNow offer usageCount increment note:", e.message);
        }
      }

      return createdOrder;
    });

    // Send Rich Order Confirmation Email & In-App Notification
    this.sendOrderConfirmationEmail(order.id).catch(() => {});

    try {
      const notificationsService = require("../notifications/service");
      notificationsService.createAndSendNotification({
        userId,
        type: "ORDER",
        title: "Order Placed Successfully",
        message: `Your order #${order.orderNumber} for ₹${order.totalAmount} has been placed successfully.`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber, totalAmount: order.totalAmount },
      }).catch(() => {});
    } catch (e) {}

    return OrderDTO.toResponse(order);
  }

  async sendOrderConfirmationEmail(orderId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          shippingAddress: true,
          items: { include: { product: true } },
        },
      });

      if (!order || !order.user || !order.user.email) return;

      const itemsRows = order.items
        .map(
          (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${item.product?.name || 'Ayurvedic Product'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">₹${item.price}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold;">₹${item.total}</td>
        </tr>
      `
        )
        .join("");

      const addr = order.shippingAddress;
      const addressText = addr
        ? `${addr.street}, ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}`
        : "Standard Delivery Address";

      sendEmail({
        to: order.user.email,
        subject: `Order Confirmed! #${order.orderNumber} - KLN Ayurveda`,
        text: `Thank you for your order #${order.orderNumber}! Total: ₹${order.totalAmount}. We are preparing your shipment.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background: #ffffff; color: #333;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #2e7d32;">
              <h1 style="color: #2e7d32; margin: 0; font-size: 24px;">🌿 KLN Ayurveda</h1>
              <p style="color: #666; font-size: 13px; margin-top: 4px;">Pure & Authentic Healthcare</p>
            </div>

            <div style="margin: 20px 0;">
              <h2 style="color: #2e7d32; font-size: 18px; margin-bottom: 8px;">Thank You for Your Order!</h2>
              <p style="font-size: 14px; margin: 0 0 16px;">Hello <strong>${order.user.firstName || 'Valued Customer'}</strong>,</p>
              <p style="font-size: 14px; color: #555; line-height: 1.5; margin: 0;">We have received your order <strong>#${order.orderNumber}</strong> and it is now being processed by our team.</p>
            </div>

            <div style="background: #f9fbf9; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td><strong>Order Number:</strong> #${order.orderNumber}</td>
                  <td style="text-align: right;"><strong>Payment Method:</strong> ${order.paymentMethod || 'Card/UPI'}</td>
                </tr>
                <tr>
                  <td style="padding-top: 8px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style="text-align: right; padding-top: 8px;"><strong>Payment Status:</strong> <span style="color: #2e7d32; font-weight: bold;">${order.paymentStatus}</span></td>
                </tr>
              </table>
            </div>

            <h3 style="font-size: 15px; color: #2e7d32; margin-bottom: 10px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <thead>
                <tr style="background: #e8f5e9; color: #2e7d32;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div style="width: 240px; margin-left: auto; font-size: 13px; line-height: 1.8; margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between;">
                <span>Subtotal:</span> <span>₹${order.subtotal}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>GST / Tax:</span> <span>₹${order.tax}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Shipping Fee:</span> <span>${order.shippingFee === 0 ? 'FREE' : '₹' + order.shippingFee}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: bold; color: #2e7d32; border-top: 1px solid #ddd; padding-top: 6px; margin-top: 6px;">
                <span>Total Amount:</span> <span>₹${order.totalAmount}</span>
              </div>
            </div>

            <div style="background: #f4f4f4; padding: 14px; border-radius: 8px; margin-bottom: 24px; font-size: 13px;">
              <h4 style="margin: 0 0 6px; color: #333;">🚚 Delivery Address</h4>
              <p style="margin: 0; color: #555;">${addressText}</p>
            </div>

            <div style="text-align: center; border-top: 1px solid #eeeeee; pt-16; margin-top: 24px; font-size: 12px; color: #888;">
              <p style="margin: 12px 0 4px;">Need assistance with your order? Reply to this email or contact support@klnayurveda.com</p>
              <p style="margin: 0;">© KLN Ayurveda - Authenticity & Wellness Guaranteed</p>
            </div>
          </div>
        `,
      }).catch(() => {});
    } catch (err) {
      // Non-blocking
    }
  }

  async getUserOrders(userId) {
    const orders = await orderRepository.findByUserId(userId);
    return orders.map((o) => OrderDTO.toResponse(o));
  }

  async getOrderDetails(orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return OrderDTO.toResponse(order);
  }

  async trackOrder(orderNumber) {
    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return OrderDTO.toResponse(order);
  }

  async cancelOrder(orderId, userId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    if (order.userId !== userId) {
      throw new ApiError(403, "Access denied");
    }
    if (order.status === "SHIPPED" || order.status === "DELIVERED") {
      throw new ApiError(400, "Cannot cancel an order that has already been shipped or delivered.");
    }
    const updated = await orderRepository.updateStatus(orderId, "CANCELLED");

    // Send Cancellation Email
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.email) {
        sendEmail({
          to: user.email,
          subject: `Order #${order.orderNumber} Cancelled - KLN Ayurveda`,
          text: `Your order #${order.orderNumber} has been cancelled. If you have questions, please contact support.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #c62828;">Order Cancelled</h2>
              <p>Hello <strong>${user.firstName || 'Customer'}</strong>,</p>
              <p>Your order <strong>#${order.orderNumber}</strong> has been cancelled.</p>
              <p style="font-size: 13px; color: #666;">If a payment was processed, your refund will be credited back within 5-7 business days.</p>
            </div>
          `,
        }).catch(() => {});
      }
    } catch (e) {}

    return OrderDTO.toResponse(updated);
  }
}

module.exports = new OrderService();

