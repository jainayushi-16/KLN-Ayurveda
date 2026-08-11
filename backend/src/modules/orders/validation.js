const { z } = require("zod");

const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      street: z.string().min(1, "Street address required"),
      city: z.string().min(1, "City required"),
      state: z.string().min(1, "State required"),
      postalCode: z.string().min(1, "Postal code required"),
      country: z.string().min(1, "Country required"),
    }),
    paymentMethod: z.string().default("CREDIT_CARD"),
    // Optional Buy Now single-item order (bypasses cart)
    buyNowItem: z
      .object({
        productId: z.string().min(1, "Product ID required"),
        quantity: z.number().int().min(1).max(99).default(1),
      })
      .optional(),
  }),
});

module.exports = {
  createOrderSchema,
};
