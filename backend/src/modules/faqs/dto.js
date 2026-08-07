class FAQDTO {
  static toResponse(faq) {
    return {
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    };
  }
}

module.exports = FAQDTO;
