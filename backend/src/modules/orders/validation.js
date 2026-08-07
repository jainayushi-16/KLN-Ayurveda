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
  }),
});

module.exports = {
  createOrderSchema,
};
