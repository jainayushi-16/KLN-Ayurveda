const blogService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class BlogController {
  getBlogs = asyncHandler(async (req, res) => {
    const blogs = await blogService.getBlogs();
    return ApiResponse.success(res, "Blogs retrieved successfully", blogs);
  });

  getBlogDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await blogService.getBlogDetails(id);
    return ApiResponse.success(res, "Blog details retrieved", blog);
  });

  getCategories = asyncHandler(async (req, res) => {
    const categories = await blogService.getCategories();
    return ApiResponse.success(res, "Blog categories retrieved", categories);
  });
}

module.exports = new BlogController();
