class CartDTO {
  static toResponse(cart) {
    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
      image: item.product.images[0] ? item.product.images[0].url : null,
      category: item.product.category ? item.product.category.name : null,
    }));

    const totalAmount = items.reduce((acc, curr) => acc + curr.subtotal, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      totalItems: items.reduce((acc, curr) => acc + curr.quantity, 0),
      subtotal: totalAmount,
      shipping: totalAmount > 50 || totalAmount === 0 ? 0 : 9.99,
      tax: Number((totalAmount * 0.05).toFixed(2)),
      totalAmount: Number((totalAmount + (totalAmount > 50 || totalAmount === 0 ? 0 : 9.99) + (totalAmount * 0.05)).toFixed(2)),
    };
  }
}

module.exports = CartDTO;
