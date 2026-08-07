const orderRepository = require("./repository");
const cartRepository = require("../cart/repository");
const prisma = require("../../config/prisma");
const ApiError = require("../../utils/apiError");
const OrderDTO = require("./dto");

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

    // 2. Calculate subtotal & totals
    const subtotal = cart.items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
    const shippingFee = subtotal > 50 ? 0 : 9.99;
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

    // 3. Clear cart
    await cartRepository.clearCart(cart.id);

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
