const { z } = require("zod");

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

module.exports = {
  createCategorySchema,
};
