const contactRepository = require("./repository");
const ContactDTO = require("./dto");
const sendEmail = require("../../utils/sendEmail");
const env = require("../../config/env");

class ContactService {
  async submitContact(contactData) {
    const contact = await contactRepository.createContact(contactData);

    // Send confirmation email to user
    sendEmail({
      to: contact.email,
      subject: "Thank you for contacting KLN Ayurveda",
      text: `Hello ${contact.name || "Valued Customer"},\n\nThank you for reaching out to KLN Ayurveda. We have received your message:\n\n"${contact.message}"\n\nOur team will get back to you shortly.\n\nBest regards,\nKLN Ayurveda Team`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #2e7d32;">Thank you for contacting KLN Ayurveda</h2>
          <p>Hello <strong>${contact.name || "Valued Customer"}</strong>,</p>
          <p>Thank you for reaching out to us. We have received your message:</p>
          <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid #2e7d32; margin: 16px 0;">
            ${contact.message}
          </blockquote>
          <p>Our customer support team will review your inquiry and get back to you shortly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">KLN Ayurveda - Natural & Authentic Healthcare</p>
        </div>
      `,
    }).catch(() => {});

    // Send notification to admin/support email if configured
    if (env.smtp.from && env.smtp.from !== contact.email) {
      sendEmail({
        to: env.smtp.from,
        subject: `[Contact Form] New inquiry from ${contact.name || contact.email}`,
        text: `New contact form submission:\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || 'N/A'}\nMessage: ${contact.message}`,
      }).catch(() => {});
    }

    return ContactDTO.toResponse(contact);
  }
}

module.exports = new ContactService();

