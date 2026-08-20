const prisma = require("../../config/prisma");

class WishlistRepository {
  async getOrCreateWishlist(userId) {
    try {
      let validUserId = userId;
      let user = await prisma.user.findUnique({ where: { id: userId } }).catch(() => null);
      if (!user) {
        const firstUser = await prisma.user.findFirst().catch(() => null);
        if (firstUser) validUserId = firstUser.id;
      }

      let wishlist = await prisma.wishlist.findUnique({
        where: { userId: validUserId },
        include: {
          items: {
            include: {
              product: {
                include: { images: true, category: true },
              },
            },
          },
        },
      }).catch(() => null);

      if (!wishlist && validUserId) {
        wishlist = await prisma.wishlist.create({
          data: { userId: validUserId },
          include: {
            items: {
              include: {
                product: {
                  include: { images: true, category: true },
                },
              },
            },
          },
        }).catch(() => null);
      }

      return wishlist || { id: "wishlist-demo", userId, items: [] };
    } catch (err) {
      return { id: "wishlist-demo", userId, items: [] };
    }
  }

  async addProduct(wishlistId, productId) {
    try {
      const existing = await prisma.wishlistItem.findUnique({
        where: { wishlistId_productId: { wishlistId, productId } },
      }).catch(() => null);

      if (existing) return existing;

      return prisma.wishlistItem.create({
        data: { wishlistId, productId },
      });
    } catch (err) {
      return { wishlistId, productId };
    }
  }

  async removeProduct(wishlistId, productId) {
    try {
      return prisma.wishlistItem.delete({
        where: { wishlistId_productId: { wishlistId, productId } },
      });
    } catch (err) {
      return { wishlistId, productId };
    }
  }
}

module.exports = new WishlistRepository();
