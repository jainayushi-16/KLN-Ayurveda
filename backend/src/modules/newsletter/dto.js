class NewsletterDTO {
  static toResponse(newsletter) {
    return {
      id: newsletter.id,
      email: newsletter.email,
      isSubscribed: newsletter.isSubscribed,
      createdAt: newsletter.createdAt,
    };
  }
}

module.exports = NewsletterDTO;
