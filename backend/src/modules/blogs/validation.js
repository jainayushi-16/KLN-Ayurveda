const { z } = require("zod");

const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    excerpt: z.string().min(1, "Excerpt is required"),
    content: z.string().min(1, "Content is required"),
    coverImage: z.string().url("Invalid image URL"),
    blogCategoryId: z.string().min(1, "Category ID is required"),
  }),
});

module.exports = {
  createBlogSchema,
};
