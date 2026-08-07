const authService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return ApiResponse.success(res, "Registration successful", result, 201);
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return ApiResponse.success(res, "Login successful", result);
  });

  logout = asyncHandler(async (req, res) => {
    res.clearCookie("refreshToken");
    return ApiResponse.success(res, "Logout successful");
  });

  refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const result = await authService.refreshToken(token);
    return ApiResponse.success(res, "Token refreshed successfully", result);
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    return ApiResponse.success(res, result.message);
  });

  getMe = asyncHandler(async (req, res) => {
    return ApiResponse.success(res, "Current user retrieved", req.user);
  });
}

module.exports = new AuthController();
