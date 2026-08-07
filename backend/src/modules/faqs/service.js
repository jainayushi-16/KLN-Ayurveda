const faqRepository = require("./repository");
const FAQDTO = require("./dto");

class FAQService {
  async getFAQs() {
    const faqs = await faqRepository.findAll();
    return faqs.map((f) => FAQDTO.toResponse(f));
  }
}

module.exports = new FAQService();
