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

  async forgotPassword(email) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      // Return success message even if email not found to prevent user enumeration
      return { message: "If an account with that email exists, password reset instructions have been sent." };
    }

    const crypto = require("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");
    await authRepository.updateUser(user.id, { resetToken });

    const clientOrigin = env.corsOrigin.split(',')[0] || "http://localhost:3000";
    const resetUrl = `${clientOrigin}/reset-password?token=${resetToken}`;

    sendEmail({
      to: user.email,
      subject: "Password Reset Request - KLN Ayurveda",
      text: `Hello ${user.firstName || 'Valued Customer'},\n\nYou requested a password reset for your KLN Ayurveda account.\n\nPlease reset your password by clicking this link:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; background: #ffffff;">
          <h2 style="color: #2e7d32; text-align: center; margin-top: 0;">🌿 KLN Ayurveda Password Reset</h2>
          <p style="font-size: 15px; color: #333;">Hello <strong>${user.firstName || 'Valued Customer'}</strong>,</p>
          <p style="font-size: 14px; color: #555; line-height: 1.5;">We received a request to reset your password for your KLN Ayurveda account. Click the button below to choose a new password:</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="background-color: #2e7d32; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Reset My Password</a>
          </div>
          <p style="font-size: 12px; color: #777;">Or copy and paste this link into your web browser:<br/><a href="${resetUrl}" style="color: #2e7d32; word-break: break-all;">${resetUrl}</a></p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center; margin-bottom: 0;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    }).catch(() => {});

    return { message: "If an account with that email exists, password reset instructions have been sent." };
  }

  async resetPassword(token, newPassword) {
    const user = await authRepository.findByResetToken(token);
    if (!user) {
      throw new ApiError(400, "Invalid or expired password reset token");
    }

    const hashedPassword = await hashPassword(newPassword);
    await authRepository.updateUser(user.id, {
      password: hashedPassword,
      resetToken: null,
    });

    sendEmail({
      to: user.email,
      subject: "Password Changed Successfully - KLN Ayurveda",
      text: `Hello ${user.firstName || 'Valued Customer'},\n\nYour password for KLN Ayurveda has been reset successfully. If you did not perform this change, please contact support immediately.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2e7d32; text-align: center;">✅ Password Reset Successful</h2>
          <p>Hello <strong>${user.firstName || 'Valued Customer'}</strong>,</p>
          <p>Your password for your KLN Ayurveda account has been updated successfully.</p>
          <p>You can now log in using your new password.</p>
          <p style="font-size: 12px; color: #888; margin-top: 24px;">If you did not initiate this change, please contact our customer support team immediately.</p>
        </div>
      `,
    }).catch(() => {});

    return { message: "Password reset successfully. You can now log in with your new password." };
  }
}

module.exports = new AuthService();

