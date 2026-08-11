class ProductDTO {
  static toResponse(product) {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDesc: product.shortDesc,
      fullDesc: product.fullDesc,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      badge: product.badge,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      isFeatured: product.isFeatured,
      usageInstructions: product.usageInstructions,
      category: product.category ? product.category.name : null,
      images: product.images ? product.images.map((img) => img.url) : [],
      ingredients: product.ingredients ? product.ingredients.map((ing) => ing.name) : [],
      benefits: product.benefits ? product.benefits.map((b) => b.name) : [],
      createdAt: product.createdAt,
    };
  }
}

module.exports = ProductDTO;
