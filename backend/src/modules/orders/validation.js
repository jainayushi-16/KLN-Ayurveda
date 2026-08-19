const { z } = require("zod");

const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z
      .object({
        fullName: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        street: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        state: z.string().optional().nullable(),
        postalCode: z.string().optional().nullable(),
        pincode: z.string().optional().nullable(),
        country: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
    paymentMethod: z.string().optional().nullable().default("CREDIT_CARD"),
    items: z
      .array(
        z.object({
          productId: z.string().optional().nullable(),
          id: z.string().optional().nullable(),
          quantity: z.number().optional().nullable(),
        })
      )
      .optional()
      .nullable(),
    buyNowItem: z
      .object({
        productId: z.string().optional().nullable(),
        id: z.string().optional().nullable(),
        quantity: z.number().optional().nullable(),
      })
      .optional()
      .nullable(),
  }),
});

module.exports = {
  createOrderSchema,
};
