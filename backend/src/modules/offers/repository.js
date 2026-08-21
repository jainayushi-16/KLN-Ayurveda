const prisma = require("../../config/prisma");

class OfferRepository {
  async createOffer(offerData, productIds = [], categoryIds = []) {
    return prisma.offer.create({
      data: {
        ...offerData,
        selectedProducts: {
          create: productIds.map((id) => ({ productId: id })),
        },
        selectedCategories: {
          create: categoryIds.map((id) => ({ categoryId: id })),
        },
      },
      include: {
        selectedProducts: { include: { product: true } },
        selectedCategories: { include: { category: true } },
      },
    });
  }

  async getOffers({ search, status, type, page = 1, limit = 10, startDate, endDate }) {
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (type && type !== "ALL") {
      where.type = type;
    }

    if (startDate || endDate) {
      where.startAt = {};
      if (startDate) where.startAt.gte = new Date(startDate);
      if (endDate) where.startAt.lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          selectedProducts: { include: { product: true } },
          selectedCategories: { include: { category: true } },
          _count: { select: { usages: true, orders: true } },
        },
      }),
      prisma.offer.count({ where }),
    ]);

    return {
      offers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOfferById(id) {
    return prisma.offer.findUnique({
      where: { id },
      include: {
        selectedProducts: { include: { product: true } },
        selectedCategories: { include: { category: true } },
        usages: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
            order: { select: { id: true, orderNumber: true, totalAmount: true, createdAt: true } },
          },
          orderBy: { usedAt: "desc" },
          take: 50,
        },
        _count: { select: { usages: true, orders: true } },
      },
    });
  }

  async getOfferByCode(code) {
    if (!code) return null;
    return prisma.offer.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: {
        selectedProducts: true,
        selectedCategories: true,
      },
    });
  }

  async updateOffer(id, offerData, productIds = null, categoryIds = null) {
    const updatePayload = { ...offerData };

    if (Array.isArray(productIds)) {
      updatePayload.selectedProducts = {
        deleteMany: {},
        create: productIds.map((pId) => ({ productId: pId })),
      };
    }

    if (Array.isArray(categoryIds)) {
      updatePayload.selectedCategories = {
        deleteMany: {},
        create: categoryIds.map((cId) => ({ categoryId: cId })),
      };
    }

    return prisma.offer.update({
      where: { id },
      data: updatePayload,
      include: {
        selectedProducts: { include: { product: true } },
        selectedCategories: { include: { category: true } },
      },
    });
  }

  async deleteOffer(id) {
    return prisma.offer.delete({
      where: { id },
    });
  }

  async toggleOfferStatus(id, isActive) {
    return prisma.offer.update({
      where: { id },
      data: { isActive },
    });
  }

  async getActivePublicOffers() {
    const now = new Date();
    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        status: { in: ["ACTIVE", "SCHEDULED"] },
        startAt: { lte: now },
        endAt: { gte: now },
      },
      orderBy: { createdAt: "desc" },
      include: {
        selectedProducts: { select: { productId: true } },
        selectedCategories: { select: { categoryId: true } },
      },
    });

    // Filter out exhausted offers dynamically
    return offers.filter((o) => o.usageLimit === null || o.usageCount < o.usageLimit);
  }

  async getOfferMetrics() {
    const now = new Date();

    const [totalOffers, activeOffers, scheduledOffers, expiredOffers, totalUsagesResult, revenueResult] = await Promise.all([
      prisma.offer.count(),
      prisma.offer.count({
        where: {
          isActive: true,
          startAt: { lte: now },
          endAt: { gte: now },
        },
      }),
      prisma.offer.count({
        where: {
          startAt: { gt: now },
        },
      }),
      prisma.offer.count({
        where: {
          endAt: { lt: now },
        },
      }),
      prisma.offerUsage.aggregate({
        _count: { id: true },
        _sum: { discountAmount: true },
      }),
      prisma.order.aggregate({
        where: { offerId: { not: null } },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
    ]);

    return {
      totalOffers,
      activeOffers,
      scheduledOffers,
      expiredOffers,
      totalUsages: totalUsagesResult._count.id || 0,
      totalDiscountGiven: Number((totalUsagesResult._sum.discountAmount || 0).toFixed(2)),
      discountedOrdersCount: revenueResult._count.id || 0,
      discountedRevenueGenerated: Number((revenueResult._sum.totalAmount || 0).toFixed(2)),
    };
  }
}

module.exports = new OfferRepository();
