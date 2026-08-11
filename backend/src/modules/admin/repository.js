const prisma = require("../../config/prisma");

class AdminRepository {
  async getDashboardStats() {
    const [totalUsers, totalProducts, totalOrders, revenueResult, recentOrders, lowStockProducts] = await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "PAID" },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      prisma.product.count({ where: { stockQuantity: { lte: 10 } } }),
    ]);

    return {
      totalCustomers: totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult._sum.totalAmount || 0,
      recentOrders,
      lowStockCount: lowStockProducts,
    };
  }

  async getAllProducts(page = 1, limit = 20, search = "", categoryId = "") {
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortDesc: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const total = await prisma.product.count({ where });
    const items = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: true, images: true },
    });

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async createProduct(data) {
    const { images, ...productData } = data;
    const createData = { ...productData };
    
    if (images && images.length > 0) {
      createData.images = {
        create: images.map((img) => ({
          url: typeof img === "string" ? img : img.url,
          isPrimary: typeof img === "string" ? false : (img.isPrimary || false),
        })),
      };
    }

    return prisma.product.create({
      data: createData,
      include: { category: true, images: true },
    });
  }

  async updateProduct(id, data) {
    const { images, ...productData } = data;
    
    // If new images provided, recreate them
    if (images && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: images.map((img) => ({
          productId: id,
          url: typeof img === "string" ? img : img.url,
          isPrimary: typeof img === "string" ? false : (img.isPrimary || false),
        })),
      });
    }

    return prisma.product.update({
      where: { id },
      data: productData,
      include: { category: true, images: true },
    });
  }

  async deleteProduct(id) {
    return prisma.product.delete({
      where: { id },
    });
  }

  async updateStock(id, stockQuantity, inStock) {
    return prisma.product.update({
      where: { id },
      data: {
        stockQuantity: parseInt(stockQuantity, 10),
        inStock: typeof inStock === "boolean" ? inStock : parseInt(stockQuantity, 10) > 0,
      },
    });
  }

  async createCategory(data) {
    return prisma.category.create({
      data,
    });
  }

  async updateCategory(id, data) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id) {
    return prisma.category.delete({
      where: { id },
    });
  }

  async getAllOrders(page = 1, limit = 20, status = "", search = "") {
    const where = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { firstName: { contains: search, mode: "insensitive" } } },
        { user: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const total = await prisma.order.count({ where });
    const items = await prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        items: { include: { product: true } },
        shippingAddress: true,
        billingAddress: true,
        payment: true,
      },
    });

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getOrderDetails(id) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        items: { include: { product: { include: { images: true } } } },
        shippingAddress: true,
        billingAddress: true,
        payment: true,
      },
    });
  }

  async updateOrderStatus(orderId, status) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { user: true, items: true },
    });
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
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
        _count: { select: { orders: true, reviews: true } },
        orders: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, orderNumber: true, totalAmount: true, status: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllReviews() {
    return prisma.review.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteReview(id) {
    return prisma.review.delete({
      where: { id },
    });
  }

  async getSettings() {
    return prisma.settings.findMany();
  }

  async upsertSetting(key, value, description) {
    return prisma.settings.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }
}

module.exports = new AdminRepository();
