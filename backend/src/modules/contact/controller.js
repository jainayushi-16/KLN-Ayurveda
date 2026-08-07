const contactService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class ContactController {
  submitContact = asyncHandler(async (req, res) => {
    const contact = await contactService.submitContact(req.body);
    return ApiResponse.success(res, "Message sent successfully. We will get back to you shortly.", contact, 201);
  });
}

module.exports = new ContactController();
