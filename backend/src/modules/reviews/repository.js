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
    return prisma.review.delete({
      where: { id: reviewId, userId },
    });
  }
}

module.exports = new ReviewRepository();
