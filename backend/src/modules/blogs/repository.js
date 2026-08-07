const prisma = require("../../config/prisma");

class BlogRepository {
  async findAll() {
    return prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  }

  async findBySlugOrId(identifier) {
    return prisma.blog.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: { category: true },
    });
  }

  async getCategories() {
    return prisma.blogCategory.findMany();
  }
}

module.exports = new BlogRepository();
