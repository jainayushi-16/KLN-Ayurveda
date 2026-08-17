const nodemailerConfig = require("../config/nodemailer");
const logger = require("../config/logger");

/**
 * Send an email using configured SMTP transporter
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} [options.text] - Plain text content
 * @param {string} [options.html] - HTML content
 * @returns {Promise<Object>} - Nodemailer send info
 */
async function sendEmail({ to, subject, text, html }) {
  if (!to) {
    logger.error("❌ sendEmail called without recipient email address");
    throw new Error("Recipient email address is required");
  }

  const smtpConfig = await nodemailerConfig.getSmtpConfig();
  if (!smtpConfig.user || !smtpConfig.pass) {
    const err = "SMTP credentials (user/password) are missing in server environment and settings.";
    logger.error(`❌ sendEmail failed: ${err}`);
    throw new Error(err);
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

  try {
    const info = await nodemailerConfig.sendMail(mailOptions);
    logger.info(`✅ Email sent successfully to ${to}. MessageId: ${info?.messageId || 'SENT'}`);
    return info;
  } catch (error) {
    logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
    throw error;
  }
}

module.exports = sendEmail;
