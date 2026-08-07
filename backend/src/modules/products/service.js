const productRepository = require("./repository");
const ApiError = require("../../utils/apiError");
const ProductDTO = require("./dto");

class ProductService {
  async getProducts(queryParams) {
    const result = await productRepository.findAll(queryParams);
    const formattedItems = result.items.map((p) => ProductDTO.toResponse(p));
    return {
      items: formattedItems,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async getProductDetails(identifier) {
    const product = await productRepository.findBySlugOrId(identifier);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    const related = await productRepository.findRelated(product.categoryId, product.id);
    return {
      product: ProductDTO.toResponse(product),
      reviews: product.reviews,
      relatedProducts: related.map((p) => ProductDTO.toResponse(p)),
    };
  }
}

module.exports = new ProductService();
