const { z } = require("zod");

const wishlistActionSchema = z.object({
  body: z.object({
    productId: z.string().min(1, "Product ID is required"),
  }),
});

module.exports = {
  wishlistActionSchema,
};
