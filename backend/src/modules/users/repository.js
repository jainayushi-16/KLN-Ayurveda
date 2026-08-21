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
          dateOfBirth: true,
          gender: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          addresses: true,
        },
      });
    }
  }

  async updateProfile(id, data) {
    const allowedFields = ["firstName", "lastName", "email", "phone", "avatar", "dateOfBirth", "gender"];
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
          dateOfBirth: true,
          gender: true,
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
          dateOfBirth: true,
          gender: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          addresses: true,
        },
      });
    }
  }

  async addAddress(userId, addressData) {
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    } else {
      const existingCount = await prisma.address.count({ where: { userId } });
      if (existingCount === 0) {
        addressData.isDefault = true;
      }
    }
    return prisma.address.create({
      data: {
        userId,
        ...addressData,
      },
    });
  }

  async getAddresses(userId) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateAddress(userId, addressId, addressData) {
    const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!existing) {
      const ApiError = require("../../utils/apiError");
      throw new ApiError(404, "Address not found");
    }
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return prisma.address.update({
      where: { id: addressId },
      data: addressData,
    });
  }

  async deleteAddress(userId, addressId) {
    const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!existing) {
      const ApiError = require("../../utils/apiError");
      throw new ApiError(404, "Address not found");
    }
    return prisma.address.delete({ where: { id: addressId } });
  }

  async setDefaultAddress(userId, addressId) {
    const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!existing) {
      const ApiError = require("../../utils/apiError");
      throw new ApiError(404, "Address not found");
    }
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
    return prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }

  async deleteAccount(id) {
    return prisma.user.delete({ where: { id } });
  }
}

module.exports = new UserRepository();
