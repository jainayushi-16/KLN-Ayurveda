const prisma = require("../../config/prisma");

class WishlistRepository {
  async getOrCreateWishlist(userId) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true, category: true },
            },
          },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: true, category: true },
              },
            },
          },
        },
      });
    }

    return wishlist;
  }

  async addProduct(wishlistId, productId) {
    const existing = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId, productId } },
    });

    if (existing) return existing;

    return prisma.wishlistItem.create({
      data: { wishlistId, productId },
    });
  }

  async removeProduct(wishlistId, productId) {
    return prisma.wishlistItem.delete({
      where: { wishlistId_productId: { wishlistId, productId } },
    });
  }
}

module.exports = new WishlistRepository();
