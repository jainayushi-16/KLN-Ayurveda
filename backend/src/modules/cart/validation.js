const { z } = require("zod");

const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().positive().default(1),
  }),
});

const updateQuantitySchema = z.object({
  body: z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
  }),
});

module.exports = {
  addToCartSchema,
  updateQuantitySchema,
};
