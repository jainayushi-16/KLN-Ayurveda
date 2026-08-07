const faqService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class FAQController {
  getFAQs = asyncHandler(async (req, res) => {
    const faqs = await faqService.getFAQs();
    return ApiResponse.success(res, "FAQs retrieved successfully", faqs);
  });
}

module.exports = new FAQController();
