const categoryRepository = require("./repository");
const CategoryDTO = require("./dto");

class CategoryService {
  async getCategories() {
    const categories = await categoryRepository.findAll();
    return categories.map((c) => CategoryDTO.toResponse(c));
  }
}

module.exports = new CategoryService();
