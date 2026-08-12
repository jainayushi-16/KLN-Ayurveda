const reviewRepository = require("./repository");
const ReviewDTO = require("./dto");
const prisma = require("../../config/prisma");

class ReviewService {
  async createReview(userId, reviewData) {
    const { productId, rating, title, comment } = reviewData;

    let dbProductId = productId;
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      const anyProduct = await prisma.product.findFirst();
      if (anyProduct) {
        dbProductId = anyProduct.id;
      }
    }

    const review = await reviewRepository.createReview({
      userId,
      productId: dbProductId,
      rating: Number(rating) || 5,
      title: title || "Customer Review",
      comment: comment || "",
    });

    return ReviewDTO.toResponse(review);
  }

  async getProductReviews(productId) {
    const reviews = await reviewRepository.findByProductId(productId);
    return reviews.map((r) => ReviewDTO.toResponse(r));
  }

  async deleteReview(reviewId, userId) {
    return reviewRepository.deleteReview(reviewId, userId);
  }
}

module.exports = new ReviewService();
