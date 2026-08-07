const userService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class UserController {
  getProfile = asyncHandler(async (req, res) => {
    const profile = await userService.getProfile(req.user.id);
    return ApiResponse.success(res, "Profile retrieved successfully", profile);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const profile = await userService.updateProfile(req.user.id, req.body);
    return ApiResponse.success(res, "Profile updated successfully", profile);
  });

  addAddress = asyncHandler(async (req, res) => {
    const address = await userService.addAddress(req.user.id, req.body);
    return ApiResponse.success(res, "Address added successfully", address, 201);
  });

  getAddresses = asyncHandler(async (req, res) => {
    const addresses = await userService.getAddresses(req.user.id);
    return ApiResponse.success(res, "Addresses retrieved successfully", addresses);
  });

  deleteAccount = asyncHandler(async (req, res) => {
    await userService.deleteAccount(req.user.id);
    return ApiResponse.success(res, "Account deleted successfully");
  });
}

module.exports = new UserController();
