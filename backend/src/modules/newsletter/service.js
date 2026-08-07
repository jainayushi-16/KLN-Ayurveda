const newsletterRepository = require("./repository");
const NewsletterDTO = require("./dto");

class NewsletterService {
  async subscribe(email) {
    const sub = await newsletterRepository.subscribe(email);
    return NewsletterDTO.toResponse(sub);
  }

  async unsubscribe(email) {
    const unsub = await newsletterRepository.unsubscribe(email);
    return NewsletterDTO.toResponse(unsub);
  }
}

module.exports = new NewsletterService();
