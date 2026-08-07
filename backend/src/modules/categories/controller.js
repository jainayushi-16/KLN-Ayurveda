const categoryService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class CategoryController {
  getCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getCategories();
    return ApiResponse.success(res, "Categories retrieved successfully", categories);
  });
}

module.exports = new CategoryController();
