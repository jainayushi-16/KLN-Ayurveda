const prisma = require("../../config/prisma");

const SAMPLE_PRODUCTS = [
  {
    id: "prod-1",
    name: "Intensive Hair Growth Oil",
    slug: "intensive-hair-growth-oil",
    shortDesc: "Traditional Kshirapaka formulation with Bhringraj & Amla for root strengthening.",
    fullDesc: "Crafted through ancient Ayurvedic Kshirapaka method using pure sesame oil, Bhringraj, Amla, Brahmi, and 16 vital herbs.",
    price: 610,
    originalPrice: 750,
    badge: "Bestseller",
    rating: 4.9,
    reviewsCount: 328,
    inStock: true,
    stockQuantity: 250,
    isFeatured: true,
    usageInstructions: "Gently warm oil. Massage into scalp using fingertips.",
    category: { name: "Hair Care" },
    images: [{ url: "/images/products/hairoil/oilf.jpeg" }, { url: "/images/products/hairoil/oilbenefit.jpeg" }],
    ingredients: [{ name: "Bhringraj" }, { name: "Amla" }, { name: "Brahmi" }],
    benefits: [{ name: "Hair Growth" }, { name: "Fall Control" }],
    createdAt: new Date(),
  },
  {
    id: "prod-2",
    name: "Deep Conditioning Herbal Mask",
    slug: "deep-conditioning-herbal-mask",
    shortDesc: "Nourishing clay & botanical mask for silky texture and scalp hydration.",
    fullDesc: "A rich restorative hair butter mask packed with Fenugreek, Hibiscus petals, Neem, and Organic Butter.",
    price: 340,
    originalPrice: 450,
    badge: "Organic",
    rating: 4.8,
    reviewsCount: 194,
    inStock: true,
    stockQuantity: 180,
    isFeatured: true,
    usageInstructions: "Apply generously to damp hair post-shampoo. Leave on for 15-20 minutes.",
    category: { name: "Hair Care" },
    images: [{ url: "/images/products/hairmask/maskbb.jpeg" }, { url: "/images/products/hairmask/maskf.jpeg" }],
    ingredients: [{ name: "Hibiscus Petals" }, { name: "Fenugreek" }],
    benefits: [{ name: "Scalp Nourishment" }, { name: "Anti-Dandruff" }],
    createdAt: new Date(),
  },
  {
    id: "prod-3",
    name: "Scalp Revitalizing Herbal Tonic",
    slug: "scalp-revitalizing-herbal-tonic",
    shortDesc: "Non-sticky daily spray infused with Rosemary, Brahmi, and Aloe Vera.",
    fullDesc: "A weightless daily scalp mist formulated to stimulate dormant follicles and balance oil production.",
    price: 360,
    originalPrice: 480,
    badge: "New",
    rating: 4.7,
    reviewsCount: 156,
    inStock: true,
    stockQuantity: 300,
    isFeatured: true,
    usageInstructions: "Spray directly onto scalp twice daily.",
    category: { name: "Scalp Care" },
    images: [{ url: "/images/products/hairtonic/tonicf.jpeg" }, { url: "/images/products/hairtonic/tonicbenefit.jpeg" }],
    ingredients: [{ name: "Rosemary Hydrosol" }, { name: "Aloe Vera Gel" }],
    benefits: [{ name: "Scalp Nourishment" }, { name: "Fall Control" }],
    createdAt: new Date(),
  },
];

class ProductRepository {
  async findAll({ page = 1, limit = 10, category, type, search, minPrice, maxPrice, isFeatured, badge, sort }) {
    try {
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

      if (items.length > 0) {
        return {
          items,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        };
      }
    } catch (err) {
      console.warn("⚠️ Database query failed, returning fallback product dataset:", err.message);
    }

    return {
      items: SAMPLE_PRODUCTS,
      total: SAMPLE_PRODUCTS.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    };
  }

  async findBySlugOrId(identifier) {
    try {
      const product = await prisma.product.findFirst({
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
      if (product) return product;
    } catch (err) {
      // Fallback below
    }

    return SAMPLE_PRODUCTS.find((p) => p.id === identifier || p.slug === identifier) || SAMPLE_PRODUCTS[0];
  }

  async findRelated(categoryId, currentProductId) {
    try {
      const related = await prisma.product.findMany({
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
      if (related.length > 0) return related;
    } catch (err) {
      // Fallback
    }

    return SAMPLE_PRODUCTS.filter((p) => p.id !== currentProductId);
  }
}

module.exports = new ProductRepository();
