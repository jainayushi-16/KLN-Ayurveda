const cartRepository = require("./repository");
const CartDTO = require("./dto");

class CartService {
  async getCart(userId) {
    const cart = await cartRepository.getOrCreateCart(userId);
    return CartDTO.toResponse(cart);
  }

  async addItem(userId, productId, quantity) {
    const cart = await cartRepository.getOrCreateCart(userId);
    await cartRepository.addItem(cart.id, productId, quantity);
    const updatedCart = await cartRepository.getOrCreateCart(userId);
    return CartDTO.toResponse(updatedCart);
  }

  async updateQuantity(userId, productId, quantity) {
    const cart = await cartRepository.getOrCreateCart(userId);
    await cartRepository.updateQuantity(cart.id, productId, quantity);
    const updatedCart = await cartRepository.getOrCreateCart(userId);
    return CartDTO.toResponse(updatedCart);
  }

  async removeItem(userId, productId) {
    const cart = await cartRepository.getOrCreateCart(userId);
    await cartRepository.removeItem(cart.id, productId);
    const updatedCart = await cartRepository.getOrCreateCart(userId);
    return CartDTO.toResponse(updatedCart);
  }

  async clearCart(userId) {
    const cart = await cartRepository.getOrCreateCart(userId);
    await cartRepository.clearCart(cart.id);
    const updatedCart = await cartRepository.getOrCreateCart(userId);
    return CartDTO.toResponse(updatedCart);
  }
}

module.exports = new CartService();
