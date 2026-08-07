const authRepository = require("./repository");
const { hashPassword, comparePassword } = require("../../utils/password");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../../utils/jwt");
const ApiError = require("../../utils/apiError");
const UserDTO = require("./dto");

class AuthService {
  async register(userData) {
    const existing = await authRepository.findByEmail(userData.email);
    if (existing) {
      throw new ApiError(400, "User with this email already exists");
    }

    const hashedPassword = await hashPassword(userData.password);
    const user = await authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    return {
      user: UserDTO.toResponse(user),
      tokens: { accessToken, refreshToken },
    };
  }

  async login(email, password) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    return {
      user: UserDTO.toResponse(user),
      tokens: { accessToken, refreshToken },
    };
  }

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token required");
    }
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await authRepository.findById(decoded.userId);
      if (!user) {
        throw new ApiError(401, "User not found");
      }
      const accessToken = generateAccessToken({ userId: user.id, role: user.role });
      return { accessToken };
    } catch (err) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await authRepository.findById(userId);
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Current password does not match");
    }
    const hashedPassword = await hashPassword(newPassword);
    await authRepository.updateUser(userId, { password: hashedPassword });
    return { message: "Password updated successfully" };
  }
}

module.exports = new AuthService();
