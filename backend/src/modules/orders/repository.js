const prisma = require("../../config/prisma");

class OrderRepository {
  async createOrder(orderData, itemsData) {
    return prisma.order.create({
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
  }

  async findByUserId(userId) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: { include: { images: true } } } },
        shippingAddress: true,
      },
    });
  }

  async findById(orderId) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { include: { images: true } } } },
        shippingAddress: true,
        billingAddress: true,
        payment: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findByOrderNumber(orderNumber) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: { include: { images: true } } } },
        shippingAddress: true,
      },
    });
  }

  async updateStatus(orderId, status) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}

module.exports = new OrderRepository();
