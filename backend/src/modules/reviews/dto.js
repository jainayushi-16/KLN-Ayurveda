class ReviewDTO {
  static toResponse(review) {
    return {
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      verifiedBuyer: review.verifiedBuyer,
      user: review.user
        ? {
            name: `${review.user.firstName} ${review.user.lastName}`,
            avatar: review.user.avatar,
          }
        : null,
      createdAt: review.createdAt,
    };
  }
}

module.exports = ReviewDTO;
