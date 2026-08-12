const authRepository = require("./repository");
const { hashPassword, comparePassword } = require("../../utils/password");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../../utils/jwt");
const ApiError = require("../../utils/apiError");
const UserDTO = require("./dto");
const sendEmail = require("../../utils/sendEmail");

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

    // Send Welcome Email
    sendEmail({
      to: user.email,
      subject: "Welcome to KLN Ayurveda!",
      text: `Hello ${user.firstName || 'there'},\n\nWelcome to KLN Ayurveda! We are excited to have you join our community.\n\nBest regards,\nKLN Ayurveda Team`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #2e7d32;">Welcome to KLN Ayurveda!</h2>
          <p>Hello <strong>${user.firstName || 'Valued Customer'}</strong>,</p>
          <p>Thank you for creating an account with KLN Ayurveda. Explore our authentic Ayurvedic products and wellness solutions.</p>
          <p>If you have any questions, feel free to contact our support team anytime.</p>
        </div>
      `,
    }).catch(() => {});

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
