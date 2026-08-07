const blogRepository = require("./repository");
const ApiError = require("../../utils/apiError");
const BlogDTO = require("./dto");

class BlogService {
  async getBlogs() {
    const blogs = await blogRepository.findAll();
    return blogs.map((b) => BlogDTO.toResponse(b));
  }

  async getBlogDetails(identifier) {
    const blog = await blogRepository.findBySlugOrId(identifier);
    if (!blog) {
      throw new ApiError(404, "Blog article not found");
    }
    return BlogDTO.toResponse(blog);
  }

  async getCategories() {
    return blogRepository.getCategories();
  }
}

module.exports = new BlogService();
