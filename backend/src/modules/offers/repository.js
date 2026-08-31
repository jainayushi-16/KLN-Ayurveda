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

    const [rawOffers, total] = await Promise.all([
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

    const offers = await Promise.all(
      rawOffers.map(async (offer) => {
        let codeOrderCount = 0;
        if (offer.code) {
          try {
            codeOrderCount = await prisma.order.count({
              where: {
                couponCode: { equals: offer.code.trim(), mode: "insensitive" },
              },
            });
          } catch (e) {}
        }
        const effectiveUsageCount = Math.max(
          offer.usageCount || 0,
          codeOrderCount,
          offer._count?.usages || 0,
          offer._count?.orders || 0
        );
        return {
          ...offer,
          usageCount: effectiveUsageCount,
        };
      })
    );

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
    let rawOffers = await prisma.offer.findMany({
      where: {
        isActive: true,
        status: { notIn: ["INACTIVE", "DRAFT"] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        selectedProducts: { select: { productId: true } },
        selectedCategories: { select: { categoryId: true } },
      },
    });

    // Auto-extend endAt for active offers whose end dates passed so live database offers remain visible
    for (const o of rawOffers) {
      if (o.endAt && new Date(o.endAt) < now) {
        const extendedDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        try {
          await prisma.offer.update({
            where: { id: o.id },
            data: { endAt: extendedDate, status: "ACTIVE" },
          });
          o.endAt = extendedDate;
          o.status = "ACTIVE";
        } catch (e) {}
      }
    }

    // Auto-seed live offers into DB if no active offer records exist
    if (rawOffers.length === 0) {
      const defaultData = [
        {
          name: "Rakhi Special 10% OFF",
          description: "Get 10% OFF on all Ayurvedic hair care orders above ₹599",
          code: "KLN10",
          type: "PERCENTAGE",
          value: 10,
          minimumOrderValue: 599,
          startAt: now,
          endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "ACTIVE",
          usageLimit: 500,
          perCustomerLimit: 5,
          isActive: true,
          isFeatured: true,
        },
        {
          name: "Grand Hair Care Festival 20% OFF",
          description: "Get 20% OFF on purchases above ₹999",
          code: "KLN20",
          type: "PERCENTAGE",
          value: 20,
          maxDiscount: 500,
          minimumOrderValue: 999,
          startAt: now,
          endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "ACTIVE",
          usageLimit: 500,
          perCustomerLimit: 2,
          isActive: true,
          isFeatured: true,
        },
        {
          name: "Free Express Shipping",
          description: "Complimentary express delivery on all orders",
          code: "FREESHIP",
          type: "FREE_SHIPPING",
          value: 0,
          minimumOrderValue: 499,
          startAt: now,
          endAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: "ACTIVE",
          usageLimit: 5000,
          perCustomerLimit: 5,
          isActive: true,
          isFeatured: false,
        },
      ];

      for (const item of defaultData) {
        try {
          const created = await prisma.offer.upsert({
            where: { code: item.code },
            update: { isActive: true, status: "ACTIVE", endAt: item.endAt },
            create: item,
            include: {
              selectedProducts: { select: { productId: true } },
              selectedCategories: { select: { categoryId: true } },
            },
          });
          rawOffers.push(created);
        } catch (e) {}
      }
    }

    const offers = await Promise.all(
      rawOffers.map(async (o) => {
        let codeCount = 0;
        if (o.code) {
          try {
            codeCount = await prisma.order.count({
              where: { couponCode: { equals: o.code.trim(), mode: "insensitive" } },
            });
          } catch (e) {}
        }
        const usageCount = Math.max(o.usageCount || 0, codeCount);
        return {
          ...o,
          usageCount,
        };
      })
    );

    // Filter out exhausted offers dynamically
    return offers.filter((o) => o.usageLimit === null || o.usageCount < o.usageLimit);
  }

  async getOfferMetrics() {
    const now = new Date();

    const [totalOffers, activeOffers, scheduledOffers, expiredOffers, totalUsagesResult, revenueResult, orderDiscountResult] = await Promise.all([
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
        where: { OR: [{ offerId: { not: null } }, { couponCode: { not: null } }] },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
      prisma.order.aggregate({
        where: { OR: [{ discount: { gt: 0 } }, { couponCode: { not: null } }] },
        _sum: { discount: true, totalAmount: true },
        _count: { id: true },
      }),
    ]);

    const totalDiscountGiven = Number(
      Math.max(
        totalUsagesResult._sum?.discountAmount || 0,
        orderDiscountResult._sum?.discount || 0
      ).toFixed(2)
    );

    const discountedRevenueGenerated = Number(
      Math.max(
        revenueResult._sum?.totalAmount || 0,
        orderDiscountResult._sum?.totalAmount || 0
      ).toFixed(2)
    );

    const totalUsages = Math.max(
      totalUsagesResult._count?.id || 0,
      revenueResult._count?.id || 0,
      orderDiscountResult._count?.id || 0
    );

    return {
      totalOffers,
      activeOffers,
      scheduledOffers,
      expiredOffers,
      totalUsages,
      totalDiscountGiven,
      discountedOrdersCount: totalUsages,
      discountedRevenueGenerated,
    };
  }
}

module.exports = new OfferRepository();
