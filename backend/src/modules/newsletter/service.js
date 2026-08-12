const newsletterRepository = require("./repository");
const NewsletterDTO = require("./dto");
const sendEmail = require("../../utils/sendEmail");

class NewsletterService {
  async subscribe(email) {
    const sub = await newsletterRepository.subscribe(email);

    sendEmail({
      to: email,
      subject: "Subscribed to KLN Ayurveda Newsletter",
      text: `Thank you for subscribing to the KLN Ayurveda newsletter! You will receive our latest health & wellness updates.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #2e7d32;">Subscription Confirmed</h2>
          <p>Thank you for subscribing to the <strong>KLN Ayurveda</strong> newsletter!</p>
          <p>You will now receive updates on our latest products, wellness tips, and exclusive offers directly in your inbox.</p>
        </div>
      `,
    }).catch(() => {});

    return NewsletterDTO.toResponse(sub);
  }

  async unsubscribe(email) {
    const unsub = await newsletterRepository.unsubscribe(email);
    return NewsletterDTO.toResponse(unsub);
  }
}

module.exports = new NewsletterService();

