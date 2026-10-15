const orderRepository = require("./repository");
const cartRepository = require("../cart/repository");
const discountService = require("../../services/discount.service");
const prisma = require("../../config/prisma");
const ApiError = require("../../utils/apiError");
const OrderDTO = require("./dto");
const crypto = require("crypto");
const { razorpayInstance, keyId, keySecret } = require("../../config/razorpay");
const sendEmail = require("../../utils/sendEmail");
const walletService = require("../wallet/service");
const walletRepository = require("../wallet/repository");


class OrderService {
  async createOrder(userId, shippingAddressData, paymentMethod, itemsFromPayload = null, couponCode = null, useWallet = false) {
    const cart = await cartRepository.getOrCreateCart(userId);
    let itemsToProcess = [];

    if (Array.isArray(itemsFromPayload) && itemsFromPayload.length > 0) {
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

    if (itemsToProcess.length === 0 && cart.items && cart.items.length > 0) {
      itemsToProcess = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));
    }

    if (itemsToProcess.length === 0) {
      throw new ApiError(400, "Your cart is empty. Please select products to continue.");
    }

    // 1. Calculate discount if coupon code provided (Server-side Source of Truth)
    let discountAmount = 0;
    let verifiedOffer = null;
    let isFreeShipping = false;

    if (couponCode) {
      try {
        const calculated = await discountService.validateAndCalculateDiscount({
          code: couponCode,
          userId,
          cartItems: itemsToProcess,
        });
        discountAmount = calculated.discountAmount;
        verifiedOffer = calculated;
        isFreeShipping = calculated.isFreeShipping;
      } catch (err) {
        console.warn("Coupon validation note during order creation:", err.message);
        verifiedOffer = {
          code: String(couponCode).trim().toUpperCase(),
          discountAmount: 0,
        };
      }
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
    let shippingFee = isFreeShipping ? 0 : subtotal > 450 ? 0 : 49;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = Number((taxableAmount * 0.05).toFixed(2));
    const totalAmount = Number(Math.max(0, taxableAmount + shippingFee + tax).toFixed(2));

    const orderNumber = `KLN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const isCOD =
      paymentMethod === "COD" ||
      paymentMethod === "CASH_ON_DELIVERY" ||
      String(paymentMethod || "").toUpperCase().includes("COD") ||
      String(paymentMethod || "").toUpperCase().includes("CASH");

    // 4. Wallet integration - determine wallet amount and effective payment method
    let walletAmount = 0;
    let effectivePaymentMethod = isCOD ? "COD" : paymentMethod;
    let effectivePaymentStatus = isCOD ? "PENDING" : (paymentMethod === "RAZORPAY" ? "PENDING" : "PAID");
    let effectiveOrderStatus = "PENDING";

    if (useWallet && userId) {
      const userWallet = await walletRepository.getOrCreateWallet(userId);
      const availableBalance = userWallet ? Math.max(0, userWallet.balance) : 0;
      if (availableBalance > 0) {
        if (availableBalance >= totalAmount) {
          // 100% full wallet payment
          walletAmount = totalAmount;
          effectivePaymentMethod = "WALLET";
          effectivePaymentStatus = "PAID";
          effectiveOrderStatus = "PROCESSING";
        } else {
          // Partial wallet payment
          walletAmount = Number(availableBalance.toFixed(2));
          if (isCOD) {
            effectivePaymentMethod = "WALLET_COD";
            effectivePaymentStatus = "PENDING";
            effectiveOrderStatus = "PENDING";
          } else {
            effectivePaymentMethod = "WALLET_RAZORPAY";
            effectivePaymentStatus = "PENDING";
            effectiveOrderStatus = "PENDING";
          }
        }
      }
    }

    const orderData = {
      orderNumber,
      userId,
      shippingAddressId: address.id,
      billingAddressId: address.id,
      subtotal,
      shippingFee,
      tax,
      discount: discountAmount,
      couponCode: verifiedOffer?.code || (couponCode ? String(couponCode).trim().toUpperCase() : null),
      offerId: verifiedOffer?.offerId || null,
      totalAmount,
      walletAmount,
      status: effectiveOrderStatus,
      paymentStatus: effectivePaymentStatus,
      paymentMethod: effectivePaymentMethod,
    };

    const itemsData = itemsToProcess.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    // 5. Create Order & Record Offer Usage inside a Prisma Transaction to prevent race conditions
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

      // Debit wallet immediately for full WALLET payment or WALLET_COD
      if (walletAmount > 0 && (effectivePaymentMethod === "WALLET" || effectivePaymentMethod === "WALLET_COD")) {
        await walletService.debitWallet(
          userId,
          {
            amount: walletAmount,
            category: effectivePaymentMethod === "WALLET" ? "PURCHASE" : "PARTIAL_PURCHASE",
            referenceType: "ORDER",
            referenceId: createdOrder.id,
            description: `${effectivePaymentMethod === "WALLET" ? "Full payment" : "Partial payment"} for Order #${createdOrder.orderNumber}`,
          },
          tx
        );
      }

      let targetOfferId = verifiedOffer?.offerId;
      const activeCode = verifiedOffer?.code || orderData.couponCode || couponCode;

      if (!targetOfferId && activeCode) {
        const foundOffer = await tx.offer.findFirst({
          where: { code: { equals: String(activeCode).trim(), mode: "insensitive" } },
        }).catch(() => null);
        if (foundOffer) targetOfferId = foundOffer.id;
      }

      if (targetOfferId) {
        try {
          await tx.order.update({
            where: { id: createdOrder.id },
            data: { offerId: targetOfferId },
          });
        } catch (e) {}

        try {
          if (userId) {
            await tx.offerUsage.create({
              data: {
                offerId: targetOfferId,
                userId,
                orderId: createdOrder.id,
                discountAmount: orderData.discount || discountAmount || 0,
              },
            });
          }
        } catch (e) {
          console.warn("OfferUsage creation note:", e.message);
        }

        try {
          await tx.offer.update({
            where: { id: targetOfferId },
            data: {
              usageCount: { increment: 1 },
            },
          });
        } catch (e) {
          console.warn("Offer usageCount increment note:", e.message);
        }
      }

      // Deduct product stock quantities
      for (const item of itemsToProcess) {
        try {
          const prod = await tx.product.findUnique({ where: { id: item.productId } });
          if (prod) {
            const currentStock = prod.stockQuantity || 0;
            const updatedStock = Math.max(0, currentStock - item.quantity);
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: updatedStock,
                inStock: updatedStock > 0,
              },
            });
          }
        } catch (e) {
          console.warn("Stock deduction note for product:", item.productId, e.message);
        }
      }

      // If fully paid at creation (e.g. WALLET), check for promotional cashback
      if (effectivePaymentStatus === "PAID") {
        await this.checkAndAwardCashback(createdOrder, verifiedOffer, tx);
      }

      return createdOrder;
    });

    // 6. Clear cart after order placed
    if (cart.id) {
      await cartRepository.clearCart(cart.id).catch(() => {});
    }

    // 7. Send Confirmation Email & In-App Notification
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

      notificationsService.notifyAdmins({
        type: "ORDER",
        title: `🛍️ New Store Order: #${order.orderNumber}`,
        message: `Customer placed order #${order.orderNumber} for ₹${order.totalAmount}.`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber, totalAmount: order.totalAmount },
        actionUrl: "/admin/orders",
      }).catch(() => {});
    } catch (e) {}

    return OrderDTO.toResponse(order);
  }

  async createBuyNowOrder(userId, buyNowItem, shippingAddressData, paymentMethod, couponCode = null, useWallet = false) {
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
      try {
        const calculated = await discountService.validateAndCalculateDiscount({
          code: couponCode,
          userId,
          cartItems: itemsToProcess,
        });
        discountAmount = calculated.discountAmount;
        verifiedOffer = calculated;
        isFreeShipping = calculated.isFreeShipping;
      } catch (err) {
        console.warn("BuyNow coupon validation note during order creation:", err.message);
        verifiedOffer = {
          code: String(couponCode).trim().toUpperCase(),
          discountAmount: 0,
        };
      }
    }

    const subtotal = product.price * quantity;
    let shippingFee = isFreeShipping ? 0 : subtotal > 450 ? 0 : 49;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = Number((taxableAmount * 0.05).toFixed(2));
    const totalAmount = Number(Math.max(0, taxableAmount + shippingFee + tax).toFixed(2));

    const address = await prisma.address.create({
      data: { userId, ...shippingAddressData },
    });

    const orderNumber = `KLN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const isCOD =
      paymentMethod === "COD" ||
      paymentMethod === "CASH_ON_DELIVERY" ||
      String(paymentMethod || "").toUpperCase().includes("COD") ||
      String(paymentMethod || "").toUpperCase().includes("CASH");

    // Wallet integration - determine wallet amount and effective payment method
    let walletAmount = 0;
    let effectivePaymentMethod = isCOD ? "COD" : paymentMethod;
    let effectivePaymentStatus = isCOD ? "PENDING" : (paymentMethod === "RAZORPAY" ? "PENDING" : "PAID");
    let effectiveOrderStatus = "PENDING";

    if (useWallet && userId) {
      const userWallet = await walletRepository.getOrCreateWallet(userId);
      const availableBalance = userWallet ? Math.max(0, userWallet.balance) : 0;
      if (availableBalance > 0) {
        if (availableBalance >= totalAmount) {
          // 100% full wallet payment
          walletAmount = totalAmount;
          effectivePaymentMethod = "WALLET";
          effectivePaymentStatus = "PAID";
          effectiveOrderStatus = "PROCESSING";
        } else {
          // Partial wallet payment
          walletAmount = Number(availableBalance.toFixed(2));
          if (isCOD) {
            effectivePaymentMethod = "WALLET_COD";
            effectivePaymentStatus = "PENDING";
            effectiveOrderStatus = "PENDING";
          } else {
            effectivePaymentMethod = "WALLET_RAZORPAY";
            effectivePaymentStatus = "PENDING";
            effectiveOrderStatus = "PENDING";
          }
        }
      }
    }

    const orderData = {
      orderNumber,
      userId,
      shippingAddressId: address.id,
      billingAddressId: address.id,
      subtotal,
      shippingFee,
      tax,
      discount: discountAmount,
      couponCode: verifiedOffer?.code || (couponCode ? String(couponCode).trim().toUpperCase() : null),
      offerId: verifiedOffer?.offerId || null,
      totalAmount,
      walletAmount,
      status: effectiveOrderStatus,
      paymentStatus: effectivePaymentStatus,
      paymentMethod: effectivePaymentMethod,
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

      // Debit wallet immediately for full WALLET payment or WALLET_COD
      if (walletAmount > 0 && (effectivePaymentMethod === "WALLET" || effectivePaymentMethod === "WALLET_COD")) {
        await walletService.debitWallet(
          userId,
          {
            amount: walletAmount,
            category: effectivePaymentMethod === "WALLET" ? "PURCHASE" : "PARTIAL_PURCHASE",
            referenceType: "ORDER",
            referenceId: createdOrder.id,
            description: `${effectivePaymentMethod === "WALLET" ? "Full payment" : "Partial payment"} for Order #${createdOrder.orderNumber}`,
          },
          tx
        );
      }

      let targetOfferId = verifiedOffer?.offerId;
      const activeCode = verifiedOffer?.code || orderData.couponCode || couponCode;

      if (!targetOfferId && activeCode) {
        const foundOffer = await tx.offer.findFirst({
          where: { code: { equals: String(activeCode).trim(), mode: "insensitive" } },
        }).catch(() => null);
        if (foundOffer) targetOfferId = foundOffer.id;
      }

      if (targetOfferId) {
        try {
          await tx.order.update({
            where: { id: createdOrder.id },
            data: { offerId: targetOfferId },
          });
        } catch (e) {}

        try {
          if (userId) {
            await tx.offerUsage.create({
              data: {
                offerId: targetOfferId,
                userId,
                orderId: createdOrder.id,
                discountAmount: orderData.discount || discountAmount || 0,
              },
            });
          }
        } catch (e) {
          console.warn("BuyNow offerUsage creation note:", e.message);
        }

        try {
          await tx.offer.update({
            where: { id: targetOfferId },
            data: {
              usageCount: { increment: 1 },
            },
          });
        } catch (e) {
          console.warn("BuyNow offer usageCount increment note:", e.message);
        }
      }

      // Deduct product stock quantity for Buy Now item
      try {
        const prod = await tx.product.findUnique({ where: { id: product.id } });
        if (prod) {
          const currentStock = prod.stockQuantity || 0;
          const updatedStock = Math.max(0, currentStock - quantity);
          await tx.product.update({
            where: { id: product.id },
            data: {
              stockQuantity: updatedStock,
              inStock: updatedStock > 0,
            },
          });
        }
      } catch (e) {
        console.warn("BuyNow stock deduction note:", e.message);
      }

      // If fully paid at creation (e.g. WALLET), check for promotional cashback
      if (effectivePaymentStatus === "PAID") {
        await this.checkAndAwardCashback(createdOrder, verifiedOffer, tx);
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

      notificationsService.notifyAdmins({
        type: "ORDER",
        title: `🛍️ New Store Order: #${order.orderNumber}`,
        message: `Customer placed Buy Now order #${order.orderNumber} for ₹${order.totalAmount}.`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber, totalAmount: order.totalAmount },
        actionUrl: "/admin/orders",
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
              <p style="margin: 12px 0 4px;">Need assistance with your order? Reply to this email or contact ayurvedakln@gmail.com</p>
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

  async cancelOrder(orderId, userId, reason = "Customer requested cancellation") {
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

    // 1. Restock products in inventory
    if (Array.isArray(order.items) && order.items.length > 0) {
      for (const item of order.items) {
        try {
          if (item.productId && item.quantity > 0) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: { increment: item.quantity },
                inStock: true,
              },
            });
          }
        } catch (e) {
          console.warn("Restock on cancellation note:", e.message);
        }
      }
    }

    // 2. Refund to KLN Wallet if order was paid or had wallet amount applied
    let refundAmount = 0;
    if (order.paymentStatus === "PAID") {
      refundAmount = order.totalAmount;
    } else if (order.walletAmount && order.walletAmount > 0) {
      refundAmount = order.walletAmount;
    }

    if (refundAmount > 0) {
      try {
        await walletService.processRefundToWallet(order.id, {
          refundAmount,
          reason: `Cancellation refund for Order #${order.orderNumber}: ${reason}`,
          category: "CANCELLATION_REFUND",
        });
      } catch (err) {
        console.error("Wallet refund error on cancellation:", err.message);
      }
    }

    // 3. Update order status and payment status if refunded
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        ...(refundAmount > 0 ? { paymentStatus: "REFUNDED" } : {}),
      },
      include: {
        items: { include: { product: true } },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    const formatted = OrderDTO.toResponse(updated);
    formatted.cancelReason = reason;

    // Send Cancellation Email
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.email) {
        sendEmail({
          to: user.email,
          subject: `Order #${order.orderNumber} Cancelled - KLN Ayurveda`,
          text: `Your order #${order.orderNumber} has been cancelled. Reason: ${reason}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #c62828;">Order Cancelled</h2>
              <p>Hello <strong>${user.firstName || 'Customer'}</strong>,</p>
              <p>Your order <strong>#${order.orderNumber}</strong> has been cancelled.</p>
              <p style="font-size: 13px; color: #555;"><strong>Cancellation Reason:</strong> ${reason}</p>
              ${
                refundAmount > 0
                  ? `<p style="font-size: 14px; color: #2e7d32; font-weight: bold;">₹${refundAmount.toFixed(2)} has been credited instantly to your KLN Wallet balance!</p>`
                  : `<p style="font-size: 13px; color: #666;">No payment deduction occurred for this order.</p>`
              }
            </div>
          `,
        }).catch(() => {});
      }
    } catch (e) {}

    return formatted;
  }

  async returnOrder(orderId, userId, returnData = {}) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    if (order.userId !== userId) {
      throw new ApiError(403, "Access denied");
    }
    if (order.status !== "DELIVERED") {
      throw new ApiError(400, "Only delivered orders are eligible for return per KLN return policy.");
    }

    const { reason, notes } = returnData;
    const updated = await orderRepository.updateStatus(orderId, "RETURN_REQUESTED");

    const formatted = OrderDTO.toResponse(updated);
    formatted.returnReason = reason || "Customer requested product return";
    formatted.returnNotes = notes || "";
    formatted.returnStatus = "PENDING_APPROVAL";

    return formatted;
  }

  async createRazorpayOrder(userId, shippingAddressData, buyNowItem, itemsFromPayload, couponCode, useWallet = false) {
    let order;
    if (buyNowItem && buyNowItem.productId) {
      order = await this.createBuyNowOrder(userId, buyNowItem, shippingAddressData, "RAZORPAY", couponCode, useWallet);
    } else {
      order = await this.createOrder(userId, shippingAddressData, "RAZORPAY", itemsFromPayload, couponCode, useWallet);
    }

    const orderDbId = order.id || order.orderId;
    const totalAmount = Number(order.totalAmount || order.grandTotal || (order.totals && order.totals.grandTotal) || 0);
    const walletUsed = Number(order.walletAmount || 0);

    // If order was 100% paid using KLN Wallet, no external Razorpay transaction is needed
    if (order.paymentStatus === "PAID" || walletUsed >= totalAmount) {
      return {
        order,
        orderId: orderDbId,
        orderNumber: order.orderNumber,
        isFullWalletPayment: true,
        amount: 0,
        currency: "INR",
        keyId: keyId,
      };
    }

    // Remaining amount to be paid via Razorpay
    const remainingAmount = Number(Math.max(0, totalAmount - walletUsed).toFixed(2));
    const totalInPaise = Math.round(remainingAmount * 100);

    // Ensure payment status is PENDING
    await prisma.order.update({
      where: { id: orderDbId },
      data: {
        paymentStatus: "PENDING",
        paymentMethod: walletUsed > 0 ? "WALLET_RAZORPAY" : "RAZORPAY",
      },
    });

    let razorpayOrder;
    if (razorpayInstance && process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes("placeholder")) {
      try {
        razorpayOrder = await razorpayInstance.orders.create({
          amount: totalInPaise,
          currency: "INR",
          receipt: order.orderNumber,
          notes: {
            orderId: orderDbId,
            userId,
            orderNumber: order.orderNumber,
            walletDeducted: walletUsed,
          },
        });
      } catch (err) {
        console.error("Razorpay API order creation failed:", err.message);
        throw new ApiError(500, `Razorpay Order Error: ${err.message}`);
      }
    } else {
      // Mock order fallback for local dev mode when API keys are placeholder
      razorpayOrder = {
        id: `order_mock_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
        entity: "order",
        amount: totalInPaise,
        amount_paid: 0,
        amount_due: totalInPaise,
        currency: "INR",
        receipt: order.orderNumber,
        status: "created",
        notes: { orderId: orderDbId, walletDeducted: walletUsed },
        created_at: Math.floor(Date.now() / 1000),
      };
    }

    // Save payment record
    await prisma.payment.upsert({
      where: { orderId: orderDbId },
      create: {
        orderId: orderDbId,
        amount: remainingAmount,
        provider: "RAZORPAY",
        status: "PENDING",
        transactionId: razorpayOrder.id,
      },
      update: {
        amount: remainingAmount,
        provider: "RAZORPAY",
        status: "PENDING",
        transactionId: razorpayOrder.id,
      },
    });

    return {
      order,
      orderId: orderDbId,
      orderNumber: order.orderNumber,
      isFullWalletPayment: false,
      walletAmountUsed: walletUsed,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || "INR",
      keyId: keyId,
    };
  }

  async verifyRazorpayPayment(userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }) {
    const targetId = orderId || razorpay_order_id;
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: targetId },
          { orderNumber: targetId },
          { payment: { transactionId: razorpay_order_id } },
        ],
      },
      include: { payment: true, items: true, shippingAddress: true },
    });

    if (!order) {
      throw new ApiError(404, "Order not found for Razorpay verification");
    }

    let isValidSignature = false;

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      if (keySecret && !keySecret.includes("placeholder")) {
        const generatedSignature = crypto
          .createHmac("sha256", keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest("hex");
        isValidSignature = generatedSignature === razorpay_signature;
      } else {
        // Dev fallback mode signature verification
        isValidSignature = true;
      }
    }

    if (!isValidSignature) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      });
      await prisma.payment.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          amount: order.totalAmount,
          provider: "RAZORPAY",
          status: "FAILED",
          transactionId: razorpay_payment_id || razorpay_order_id,
        },
        update: {
          status: "FAILED",
          transactionId: razorpay_payment_id || razorpay_order_id,
        },
      });
      throw new ApiError(400, "Razorpay payment signature verification failed.");
    }

    // Signature verified! Execute atomic payment update and wallet debit
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. If order had a partial wallet component, debit customer wallet inside transaction
      if (order.walletAmount && order.walletAmount > 0) {
        await walletService.debitWallet(
          order.userId,
          {
            amount: order.walletAmount,
            category: "PARTIAL_PURCHASE",
            referenceType: "ORDER",
            referenceId: order.id,
            description: `Partial wallet payment for Order #${order.orderNumber}`,
          },
          tx
        );
      }

      // 2. Mark order as PAID & PROCESSING
      const ord = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paymentMethod: order.walletAmount > 0 ? "WALLET_RAZORPAY" : "RAZORPAY",
        },
        include: { items: { include: { product: true } }, shippingAddress: true },
      });

      // 3. Update payment record
      await tx.payment.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          amount: Math.max(0, order.totalAmount - (order.walletAmount || 0)),
          provider: "RAZORPAY",
          status: "PAID",
          transactionId: razorpay_payment_id,
        },
        update: {
          status: "PAID",
          transactionId: razorpay_payment_id,
        },
      });

      // 4. Check & award promotional cashback if eligible
      await this.checkAndAwardCashback(ord, null, tx);

      return ord;
    });

    // Clear user cart if this was a cart checkout
    try {
      const userCart = await cartRepository.getOrCreateCart(userId);
      if (userCart && userCart.id) {
        await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } });
      }
    } catch (e) {}

    return OrderDTO.toResponse(updatedOrder);
  }

  /**
   * Automatically inspect order coupon / offer rules and credit promotional cashback if applicable
   */
  async checkAndAwardCashback(order, verifiedOffer = null, tx = null) {
    if (!order || !order.userId || order.totalAmount <= 0) return;

    try {
      const dbTx = tx || prisma;
      let offer = verifiedOffer;

      if (!offer && order.offerId) {
        offer = await dbTx.offer.findUnique({ where: { id: order.offerId } });
      } else if (!offer && order.couponCode) {
        offer = await dbTx.offer.findFirst({
          where: { code: { equals: String(order.couponCode).trim(), mode: "insensitive" } },
        });
      }

      if (!offer) return;

      const codeStr = String(offer.code || "").toUpperCase();
      const nameStr = String(offer.name || "").toUpperCase();
      const descStr = String(offer.description || "").toUpperCase();

      const isCashbackOffer =
        codeStr.includes("CB") ||
        codeStr.includes("CASHBACK") ||
        nameStr.includes("CASHBACK") ||
        descStr.includes("CASHBACK");

      if (isCashbackOffer) {
        let cashbackAmount = 0;
        if (offer.type === "PERCENTAGE") {
          cashbackAmount = (order.totalAmount * (offer.value || 0)) / 100;
          if (offer.maxDiscount && offer.maxDiscount > 0) {
            cashbackAmount = Math.min(cashbackAmount, offer.maxDiscount);
          }
        } else {
          cashbackAmount = offer.value || 0;
        }

        cashbackAmount = Number(Math.max(0, cashbackAmount).toFixed(2));

        if (cashbackAmount > 0) {
          // Check if already credited for this order to avoid duplicate cashback
          const existingCashback = await dbTx.walletTransaction.findFirst({
            where: {
              referenceType: "ORDER",
              referenceId: order.id,
              category: "PROMOTIONAL_CASHBACK",
            },
          });

          if (!existingCashback) {
            // Cashback expires in 90 days
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 90);

            await walletService.creditWallet(
              order.userId,
              {
                amount: cashbackAmount,
                category: "PROMOTIONAL_CASHBACK",
                description: `Cashback for Order #${order.orderNumber} (Offer: ${offer.code || offer.name})`,
                referenceType: "ORDER",
                referenceId: order.id,
                expiresAt,
                metadata: { offerCode: offer.code, offerId: offer.id },
              },
              dbTx
            );
          }
        }
      }
    } catch (err) {
      console.warn(`Cashback award note for order ${order.id}:`, err.message);
    }
  }
}

module.exports = new OrderService();


