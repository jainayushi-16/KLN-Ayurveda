class UserProfileDTO {
  static toResponse(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      addresses: user.addresses || [],
      createdAt: user.createdAt,
    };
  }
}

module.exports = UserProfileDTO;
