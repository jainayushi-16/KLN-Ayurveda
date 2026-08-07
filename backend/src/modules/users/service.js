const userRepository = require("./repository");
const ApiError = require("../../utils/apiError");
const UserProfileDTO = require("./dto");

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return UserProfileDTO.toResponse(user);
  }

  async updateProfile(userId, updateData) {
    const user = await userRepository.updateProfile(userId, updateData);
    return UserProfileDTO.toResponse(user);
  }

  async addAddress(userId, addressData) {
    return userRepository.addAddress(userId, addressData);
  }

  async getAddresses(userId) {
    return userRepository.getAddresses(userId);
  }

  async deleteAccount(userId) {
    return userRepository.deleteAccount(userId);
  }
}

module.exports = new UserService();
