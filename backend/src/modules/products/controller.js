const productService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class ProductController {
  getProducts = asyncHandler(async (req, res) => {
    const result = await productService.getProducts(req.query);
    return ApiResponse.success(
      res,
      "Products retrieved successfully",
      result.items,
      200,
      result.pagination
    );
  });

  getProductDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await productService.getProductDetails(id);
    return ApiResponse.success(res, "Product details retrieved", result);
  });
}

module.exports = new ProductController();
