const reviewRepository = require("./repository");
const ReviewDTO = require("./dto");

class ReviewService {
  async createReview(userId, reviewData) {
    const review = await reviewRepository.createReview({
      userId,
      ...reviewData,
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
