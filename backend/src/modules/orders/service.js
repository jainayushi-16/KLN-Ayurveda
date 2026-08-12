const orderRepository = require("./repository");
const cartRepository = require("../cart/repository");
const prisma = require("../../config/prisma");
const ApiError = require("../../utils/apiError");
const OrderDTO = require("./dto");
const sendEmail = require("../../utils/sendEmail");

class OrderService {
  async createOrder(userId, shippingAddressData, paymentMethod) {
    const cart = await cartRepository.getOrCreateCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new ApiError(400, "Your cart is empty");
    }

    // 1. Create or get address
    const address = await prisma.address.create({
      data: {
        userId,
        ...shippingAddressData,
      },
    });

    // 2. Calculate subtotal & totals (server-side — never trust frontend prices)
    const subtotal = cart.items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
    const shippingFee = subtotal > 499 ? 0 : 49;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const totalAmount = Number((subtotal + shippingFee + tax).toFixed(2));

    const orderNumber = `KLN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const orderData = {
      orderNumber,
      userId,
      shippingAddressId: address.id,
      billingAddressId: address.id,
      subtotal,
      shippingFee,
      tax,
      discount: 0,
      totalAmount,
      status: "PENDING",
      paymentStatus: "PAID",
      paymentMethod,
    };

    const itemsData = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity,
    }));

    const order = await orderRepository.createOrder(orderData, itemsData);

    // 3. Clear cart after order placed
    await cartRepository.clearCart(cart.id);

    // 4. Send Order Confirmation Email
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.email) {
        sendEmail({
          to: user.email,
          subject: `Order Confirmation - ${order.orderNumber}`,
          text: `Thank you for your order! Your order #${order.orderNumber} for ₹${order.totalAmount} has been received.`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #2e7d32;">Order Placed Successfully!</h2>
              <p>Hello <strong>${user.firstName || 'Customer'}</strong>,</p>
              <p>Thank you for shopping with KLN Ayurveda. Your order <strong>#${order.orderNumber}</strong> has been received and is being processed.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: #f4f4f4;">
                  <th style="padding: 8px; text-align: left;">Order Number</th>
                  <th style="padding: 8px; text-align: right;">Total Amount</th>
                </tr>
                <tr>
                  <td style="padding: 8px;">${order.orderNumber}</td>
                  <td style="padding: 8px; text-align: right;">₹${order.totalAmount}</td>
                </tr>
              </table>
              <p>We will send you another email as soon as your items are shipped.</p>
            </div>
          `,
        }).catch(() => {});
      }
    } catch (e) {
      // Non-blocking
    }

    return OrderDTO.toResponse(order);
  }

  async createBuyNowOrder(userId, buyNowItem, shippingAddressData, paymentMethod) {
    // Validate product from DB — never trust frontend price
    const product = await prisma.product.findUnique({
      where: { id: buyNowItem.productId },
      include: { images: true },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    if (!product.inStock) {
      throw new ApiError(400, "Product is out of stock");
    }

    const quantity = Math.max(1, Math.min(99, parseInt(buyNowItem.quantity) || 1));

    // Calculate totals server-side
    const subtotal = product.price * quantity;
    const shippingFee = subtotal > 499 ? 0 : 49;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const totalAmount = Number((subtotal + shippingFee + tax).toFixed(2));

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
      discount: 0,
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

    const order = await orderRepository.createOrder(orderData, itemsData);
    return OrderDTO.toResponse(order);
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
    return OrderDTO.toResponse(updated);
  }
}

module.exports = new OrderService();
