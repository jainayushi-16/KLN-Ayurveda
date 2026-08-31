const prisma = require("../../config/prisma");

class ReviewRepository {
  async createReview(reviewData) {
    return prisma.review.create({
      data: reviewData,
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });
  }

  async findByProductId(productId) {
    if (!productId || productId === "all") {
      return prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
      });
    }

    return prisma.review.findMany({
      where: {
        OR: [
          { productId: String(productId) },
          { product: { id: String(productId) } },
          { product: { slug: String(productId) } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async deleteReview(reviewId, userId) {
    try {
      return await prisma.review.delete({
        where: { id: reviewId, userId },
      });
    } catch (err) {
      if (err.code === "P2025") {
        return { count: 0, message: "Review record not found or already deleted" };
      }
      throw err;
    }
  }
}

module.exports = new ReviewRepository();
