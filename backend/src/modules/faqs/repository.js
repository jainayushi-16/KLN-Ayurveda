const prisma = require("../../config/prisma");

class FAQRepository {
  async findAll() {
    return prisma.fAQ.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new FAQRepository();
