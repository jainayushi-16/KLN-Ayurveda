const { z } = require("zod");

const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().min(1, "Product ID is required"),
    rating: z.number().int().min(1).max(5),
    title: z.string().optional(),
    comment: z.string().min(3, "Comment must be at least 3 characters"),
  }),
});

module.exports = {
  createReviewSchema,
};
