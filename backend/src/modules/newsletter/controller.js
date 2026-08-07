const newsletterService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class NewsletterController {
  subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const sub = await newsletterService.subscribe(email);
    return ApiResponse.success(res, "Successfully subscribed to KLN Ayurveda newsletter!", sub);
  });

  unsubscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const unsub = await newsletterService.unsubscribe(email);
    return ApiResponse.success(res, "Unsubscribed successfully", unsub);
  });
}

module.exports = new NewsletterController();
