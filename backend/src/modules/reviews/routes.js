const express = require("express");
const reviewController = require("./controller");
const validate = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { createReviewSchema } = require("./validation");

const router = express.Router();

router.get("/product/:productId", reviewController.getProductReviews);
router.post("/", authenticate, validate(createReviewSchema), reviewController.createReview);
router.delete("/:id", authenticate, reviewController.deleteReview);

module.exports = router;
