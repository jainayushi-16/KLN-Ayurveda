const prisma = require("../../config/prisma");

class UserRepository {
  async findById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: { addresses: true },
      });
    } catch (err) {
      // Fallback query if new columns do not exist in database table yet
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          addresses: true,
        },
      });
    }
  }

  async updateProfile(id, data) {
    const allowedFields = ["firstName", "lastName", "phone", "avatar"];
    const updateData = {};
    if (data && typeof data === "object") {
      Object.keys(data).forEach((key) => {
        if (allowedFields.includes(key) && data[key] !== undefined) {
          updateData[key] = data[key];
        }
      });
    }

    try {
      return await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          addresses: true,
        },
      });
    } catch (err) {
      console.error("Prisma updateProfile fallback handler:", err.message);
      return await prisma.user.update({
        where: { id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          addresses: true,
        },
      });
    }
  }

  async addAddress(userId, addressData) {
    return prisma.address.create({
      data: {
        userId,
        ...addressData,
      },
    });
  }

  async getAddresses(userId) {
    return prisma.address.findMany({ where: { userId } });
  }

  async deleteAccount(id) {
    return prisma.user.delete({ where: { id } });
  }
}

module.exports = new UserRepository();
