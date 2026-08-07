const wishlistRepository = require("./repository");
const cartRepository = require("../cart/repository");
const WishlistDTO = require("./dto");

class WishlistService {
  async getWishlist(userId) {
    const wishlist = await wishlistRepository.getOrCreateWishlist(userId);
    return WishlistDTO.toResponse(wishlist);
  }

  async addProduct(userId, productId) {
    const wishlist = await wishlistRepository.getOrCreateWishlist(userId);
    await wishlistRepository.addProduct(wishlist.id, productId);
    const updated = await wishlistRepository.getOrCreateWishlist(userId);
    return WishlistDTO.toResponse(updated);
  }

  async removeProduct(userId, productId) {
    const wishlist = await wishlistRepository.getOrCreateWishlist(userId);
    await wishlistRepository.removeProduct(wishlist.id, productId);
    const updated = await wishlistRepository.getOrCreateWishlist(userId);
    return WishlistDTO.toResponse(updated);
  }

  async moveToCart(userId, productId) {
    const wishlist = await wishlistRepository.getOrCreateWishlist(userId);
    const cart = await cartRepository.getOrCreateCart(userId);

    await cartRepository.addItem(cart.id, productId, 1);
    await wishlistRepository.removeProduct(wishlist.id, productId);

    const updated = await wishlistRepository.getOrCreateWishlist(userId);
    return WishlistDTO.toResponse(updated);
  }
}

module.exports = new WishlistService();
