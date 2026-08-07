const { z } = require("zod");

const getProductsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    sort: z.string().optional(),
    badge: z.string().optional(),
    isFeatured: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
  }),
});

module.exports = {
  getProductsQuerySchema,
};
