const { z } = require("zod");

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
  }),
});

const addressSchema = z.object({
  body: z.object({
    street: z.string().min(1, "Street required"),
    city: z.string().min(1, "City required"),
    state: z.string().min(1, "State required"),
    postalCode: z.string().min(1, "Postal code required"),
    country: z.string().min(1, "Country required"),
    isDefault: z.boolean().optional(),
  }),
});

module.exports = {
  updateProfileSchema,
  addressSchema,
};
