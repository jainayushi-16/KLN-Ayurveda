const { z } = require("zod");

const createProductAdminSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    shortDesc: z.string().min(1, "Short description required"),
    fullDesc: z.string().min(1, "Full description required"),
    price: z.number().positive(),
    originalPrice: z.number().optional(),
    categoryId: z.string().min(1, "Category ID is required"),
    badge: z.string().optional(),
    stockQuantity: z.number().int().default(100),
  }),
});

module.exports = {
  createProductAdminSchema,
};
