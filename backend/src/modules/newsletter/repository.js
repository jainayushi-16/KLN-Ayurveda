const prisma = require("../../config/prisma");

class NewsletterRepository {
  async subscribe(email) {
    return prisma.newsletter.upsert({
      where: { email },
      update: { isSubscribed: true },
      create: { email, isSubscribed: true },
    });
  }

  async unsubscribe(email) {
    return prisma.newsletter.update({
      where: { email },
      data: { isSubscribed: false },
    });
  }
}

module.exports = new NewsletterRepository();
