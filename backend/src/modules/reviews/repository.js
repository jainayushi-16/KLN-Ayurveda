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
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
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
