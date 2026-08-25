class ReviewDTO {
  static toResponse(review) {
    const author =
      review.authorName ||
      review.userName ||
      (review.user ? `${review.user.firstName || ""} ${review.user.lastName || ""}`.trim() : "Verified Customer");

    return {
      id: review.id,
      productId: review.productId,
      authorName: author,
      userName: author,
      rating: review.rating,
      title: review.title || "Customer Review",
      comment: review.comment || "",
      verifiedBuyer: review.verifiedBuyer !== undefined ? review.verifiedBuyer : true,
      verifiedPurchase: review.verifiedBuyer !== undefined ? review.verifiedBuyer : true,
      user: {
        name: author,
        firstName: author,
        lastName: "",
        avatar: review.user?.avatar,
      },
      createdAt: review.createdAt,
    };
  }
}

module.exports = ReviewDTO;
