class WishlistDTO {
  static toResponse(wishlist) {
    const items = wishlist.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      shortDesc: item.product.shortDesc,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      badge: item.product.badge,
      rating: item.product.rating,
      inStock: item.product.inStock,
      image: item.product.images[0] ? item.product.images[0].url : null,
      category: item.product.category ? item.product.category.name : null,
    }));

    return {
      id: wishlist.id,
      userId: wishlist.userId,
      items,
      totalItems: items.length,
    };
  }
}

module.exports = WishlistDTO;
