const prisma = require("../../config/prisma");

class CartRepository {
  async getOrCreateCart(userId) {
    let cart = await prisma.cart.findUnique({
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

    if (!cart) {
      cart = await prisma.cart.create({
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

    return cart;
  }

  async addItem(cartId, productId, quantity = 1) {
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: { cartId, productId, quantity },
    });
  }

  async updateQuantity(cartId, productId, quantity) {
    return prisma.cartItem.update({
      where: { cartId_productId: { cartId, productId } },
      data: { quantity },
    });
  }

  async removeItem(cartId, productId) {
    return prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    });
  }

  async clearCart(cartId) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}

module.exports = new CartRepository();
