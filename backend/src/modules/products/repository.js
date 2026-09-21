const prisma = require("../../config/prisma");

class ProductRepository {
  async findAll({ page = 1, limit = 10, category, type, search, minPrice, maxPrice, isFeatured, badge, sort }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortDesc: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) {
      where.category = { name: { equals: category, mode: "insensitive" } };
    }
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === "true" || isFeatured === true;
    }
    if (badge) {
      where.badge = { equals: badge, mode: "insensitive" };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: "desc" };
    if (sort === "price-low") orderBy = { price: "asc" };
    if (sort === "price-high") orderBy = { price: "desc" };
    if (sort === "rating") orderBy = { rating: "desc" };
    if (sort === "bestselling") orderBy = { reviewsCount: "desc" };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          category: true,
          images: true,
          ingredients: true,
          benefits: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findBySlugOrId(identifier) {
    return prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: true,
        images: true,
        ingredients: true,
        benefits: true,
        reviews: {
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
          take: 5,
        },
      },
    });
  }

  async findRelated(categoryId, currentProductId) {
    return prisma.product.findMany({
      where: {
        categoryId,
        id: { not: currentProductId },
      },
      take: 4,
      include: {
        images: true,
        category: true,
      },
    });
  }
}

module.exports = new ProductRepository();
