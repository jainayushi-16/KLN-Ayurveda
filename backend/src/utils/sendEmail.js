const nodemailerConfig = require("../config/nodemailer");
const logger = require("../config/logger");

/**
 * Send an email using configured SMTP transporter
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} [options.text] - Plain text content
 * @param {string} [options.html] - HTML content
 * @returns {Promise<Object|null>} - Nodemailer send info or null if dispatch fails
 */
async function sendEmail({ to, subject, text, html }) {
  if (!to) {
    logger.error("❌ sendEmail called without recipient email address");
    return null;
  }

  try {
    const smtpConfig = await nodemailerConfig.getSmtpConfig();
    if (!smtpConfig.user || !smtpConfig.pass) {
      logger.error("❌ sendEmail skipped: SMTP credentials (SMTP_USER/SMTP_PASS) are missing in server environment and database settings.");
      return null;
    }

    const fromName = smtpConfig.fromName || "KLN Ayurveda";
    const fromEmail = smtpConfig.from || smtpConfig.user || "noreply@klnayurveda.com";

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text: text || "",
      html: html || text || "",
    };

    logger.info(`📧 Attempting to send email to ${to} (Subject: "${subject}") using SMTP User: ${smtpConfig.user}`);

    const info = await nodemailerConfig.sendMail(mailOptions);
    logger.info(`✅ Email sent successfully to ${to}. MessageId: ${info?.messageId || 'SENT'}`);
    return info;
  } catch (error) {
    logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
    return null;
  }
}

module.exports = sendEmail;
