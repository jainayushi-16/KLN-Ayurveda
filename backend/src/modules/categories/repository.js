const prisma = require("../../config/prisma");

class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
  }

  async findBySlugOrId(identifier) {
    return prisma.category.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
    });
  }
}

module.exports = new CategoryRepository();
