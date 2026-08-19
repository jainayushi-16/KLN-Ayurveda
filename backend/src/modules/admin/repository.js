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
    const { images, imageUrl, category, id: _id, createdAt, updatedAt, reviews, ingredients, benefits, cartItems, orderItems, wishlistItems, ...rawProductData } = data;

    const createData = {
      name: String(rawProductData.name || "New Product"),
      slug: String(rawProductData.slug || `product-${Date.now()}`),
      shortDesc: String(rawProductData.shortDesc || ""),
      fullDesc: String(rawProductData.fullDesc || ""),
      price: parseFloat(rawProductData.price) || 0,
      originalPrice: rawProductData.originalPrice ? parseFloat(rawProductData.originalPrice) : null,
      discountPercent: rawProductData.discountPercent ? parseInt(rawProductData.discountPercent, 10) : null,
      categoryId: String(rawProductData.categoryId),
      badge: rawProductData.badge ? String(rawProductData.badge) : null,
      type: rawProductData.type ? String(rawProductData.type) : "Oil",
      stockQuantity: parseInt(rawProductData.stockQuantity, 10) || 100,
      inStock: rawProductData.inStock !== undefined ? Boolean(rawProductData.inStock) : true,
      isFeatured: rawProductData.isFeatured !== undefined ? Boolean(rawProductData.isFeatured) : false,
      usageInstructions: rawProductData.usageInstructions ? String(rawProductData.usageInstructions) : null,
    };

    const allImages = [...(images || [])];
    if (imageUrl && !allImages.some(img => (typeof img === 'string' ? img : img.url) === imageUrl)) {
      allImages.unshift({ url: imageUrl, isPrimary: true });
    }

    if (allImages.length > 0) {
      createData.images = {
        create: allImages.map((img, idx) => ({
          url: typeof img === "string" ? img : img.url,
          isPrimary: typeof img === "string" ? idx === 0 : (img.isPrimary || idx === 0),
        })),
      };
    }

    return prisma.product.create({
      data: createData,
      include: { category: true, images: true },
    });
  }

  async updateProduct(id, data) {
    const { images, imageUrl, category, id: _id, createdAt, updatedAt, reviews, ingredients, benefits, cartItems, orderItems, wishlistItems, ...rawProductData } = data;

    const productData = {};
    if (rawProductData.name !== undefined) productData.name = String(rawProductData.name);
    if (rawProductData.slug !== undefined) productData.slug = String(rawProductData.slug);
    if (rawProductData.shortDesc !== undefined) productData.shortDesc = String(rawProductData.shortDesc);
    if (rawProductData.fullDesc !== undefined) productData.fullDesc = String(rawProductData.fullDesc);
    if (rawProductData.price !== undefined) productData.price = parseFloat(rawProductData.price) || 0;
    if (rawProductData.originalPrice !== undefined) productData.originalPrice = rawProductData.originalPrice !== null ? parseFloat(rawProductData.originalPrice) : null;
    if (rawProductData.discountPercent !== undefined) productData.discountPercent = rawProductData.discountPercent !== null ? parseInt(rawProductData.discountPercent, 10) : null;
    if (rawProductData.categoryId !== undefined) productData.categoryId = String(rawProductData.categoryId);
    if (rawProductData.badge !== undefined) productData.badge = rawProductData.badge ? String(rawProductData.badge) : null;
    if (rawProductData.type !== undefined) productData.type = String(rawProductData.type);
    if (rawProductData.stockQuantity !== undefined) productData.stockQuantity = parseInt(rawProductData.stockQuantity, 10) || 0;
    if (rawProductData.inStock !== undefined) productData.inStock = Boolean(rawProductData.inStock);
    if (rawProductData.isFeatured !== undefined) productData.isFeatured = Boolean(rawProductData.isFeatured);
    if (rawProductData.usageInstructions !== undefined) productData.usageInstructions = rawProductData.usageInstructions ? String(rawProductData.usageInstructions) : null;

    const allImages = [...(images || [])];
    if (imageUrl && !allImages.some(img => (typeof img === 'string' ? img : img.url) === imageUrl)) {
      allImages.unshift({ url: imageUrl, isPrimary: true });
    }

    if (allImages.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } }).catch(() => {});
      await prisma.productImage.createMany({
        data: allImages.map((img, idx) => ({
          productId: id,
          url: typeof img === "string" ? img : img.url,
          isPrimary: typeof img === "string" ? idx === 0 : (img.isPrimary || idx === 0),
        })),
      }).catch(() => {});
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

  async getAllOrders(page = 1, limit = 20, status = "", search = "", paymentStatus = "", paymentMethod = "") {
    const where = {};
    if (status) {
      where.status = status;
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }
    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
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
