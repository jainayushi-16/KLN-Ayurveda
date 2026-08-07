const prisma = require("../../config/prisma");

class UserRepository {
  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
  }

  async updateProfile(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      include: { addresses: true },
    });
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
