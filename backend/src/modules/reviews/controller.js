const reviewService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class ReviewController {
  createReview = asyncHandler(async (req, res) => {
    const review = await reviewService.createReview(req.user.id, req.body);
    return ApiResponse.success(res, "Review submitted successfully", review, 201);
  });

  getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const reviews = await reviewService.getProductReviews(productId);
    return ApiResponse.success(res, "Product reviews retrieved", reviews);
  });

  deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await reviewService.deleteReview(id, req.user.id);
    return ApiResponse.success(res, "Review deleted successfully");
  });
}

module.exports = new ReviewController();
