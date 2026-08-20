class UserProfileDTO {
  static toResponse(user) {
    const fn = user.firstName || "";
    const ln = user.lastName || "";
    const fullName = `${fn} ${ln}`.trim() || user.email || "Customer";
    return {
      id: user.id,
      email: user.email,
      firstName: fn,
      lastName: ln,
      fullName: fullName,
      phone: user.phone,
      avatar: user.avatar,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      addresses: user.addresses || [],
      createdAt: user.createdAt,
    };
  }
}

module.exports = UserProfileDTO;
