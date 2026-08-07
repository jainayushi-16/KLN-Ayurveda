const prisma = require("../../config/prisma");

class AdminRepository {
  async getDashboardStats() {
    const [totalUsers, totalProducts, totalOrders, revenueResult] = await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "PAID" },
      }),
    ]);

    return {
      totalCustomers: totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult._sum.totalAmount || 0,
    };
  }

  async createProduct(data) {
    return prisma.product.create({
      data,
      include: { category: true, images: true },
    });
  }

  async updateOrderStatus(orderId, status) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async getAllCustomers() {
    return prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
  }
}

module.exports = new AdminRepository();
