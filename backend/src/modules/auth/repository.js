const prisma = require("../../config/prisma");
const logger = require("../../config/logger");

const MEMORY_USERS = new Map();

class AuthRepository {
  async findByEmail(email) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (err) {
      logger.warn(`⚠️ Prisma database query failed for findByEmail (${email}): ${err.message}`);
      return MEMORY_USERS.get(email) || null;
    }
  }

  async findById(id) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (err) {
      logger.warn(`⚠️ Prisma database query failed for findById (${id}): ${err.message}`);
      for (const u of MEMORY_USERS.values()) {
        if (u.id === id) return u;
      }
      return null;
    }
  }

  async createUser(userData) {
    try {
      return await prisma.user.create({ data: userData });
    } catch (err) {
      logger.warn(`⚠️ Prisma database creation failed, saving user in fallback memory cache: ${err.message}`);
      const newUser = {
        id: "usr-" + Date.now(),
        ...userData,
        role: userData.role || "CUSTOMER",
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      MEMORY_USERS.set(userData.email, newUser);
      return newUser;
    }
  }

  async findByResetToken(token) {
    try {
      return await prisma.user.findFirst({ where: { resetToken: token } });
    } catch (err) {
      logger.warn(`⚠️ Prisma database query failed for findByResetToken: ${err.message}`);
      for (const u of MEMORY_USERS.values()) {
        if (u.resetToken === token) return u;
      }
      return null;
    }
  }

  async updateUser(id, updateData) {
    try {
      return await prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (err) {
      logger.warn(`⚠️ Prisma database update failed: ${err.message}`);
      for (const [email, u] of MEMORY_USERS.entries()) {
        if (u.id === id) {
          const updated = { ...u, ...updateData };
          MEMORY_USERS.set(email, updated);
          return updated;
        }
      }
      return null;
    }
  }

  async createResetToken(userId, tokenHash, expiresAt) {
    try {
      await prisma.passwordResetToken.updateMany({
        where: { userId, usedAt: null },
        data: { usedAt: new Date() },
      });
      return await prisma.passwordResetToken.create({
        data: {
          userId,
          tokenHash,
          expiresAt,
        },
      });
    } catch (err) {
      logger.error(`Failed to create password reset token in DB: ${err.message}`);
      return null;
    }
  }

  async findResetToken(tokenHash) {
    try {
      return await prisma.passwordResetToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });
    } catch (err) {
      logger.error(`Failed to find password reset token in DB: ${err.message}`);
      return null;
    }
  }

  async markResetTokenUsed(tokenId) {
    try {
      return await prisma.passwordResetToken.update({
        where: { id: tokenId },
        data: { usedAt: new Date() },
      });
    } catch (err) {
      logger.error(`Failed to mark reset token used in DB: ${err.message}`);
    }
  }
}

module.exports = new AuthRepository();


