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
}

module.exports = new AuthRepository();

