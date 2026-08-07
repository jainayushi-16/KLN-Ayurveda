class CategoryDTO {
  static toResponse(category) {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category._count ? category._count.products : undefined,
    };
  }
}

module.exports = CategoryDTO;
