const transporter = require("../config/nodemailer");
const env = require("../config/env");
const logger = require("../config/logger");

/**
 * Send an email to a real email address
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} [options.text] - Plain text content
 * @param {string} [options.html] - HTML content
 * @returns {Promise<Object|null>} - Nodemailer send info or null if failed
 */
async function sendEmail({ to, subject, text, html }) {
  if (!to) {
    logger.error("❌ sendEmail called without recipient email address");
    return null;
  }

  try {
    const mailOptions = {
      from: `"${env.smtp.fromName || 'KLN Ayurveda'}" <${env.smtp.from}>`,
      to,
      subject,
      text: text || "",
      html: html || text || "",
    };

    logger.info(`📧 Attempting to send email to ${to} (Subject: "${subject}")`);

    const info = await transporter.sendMail(mailOptions);
    logger.info(`✅ Email sent successfully to ${to}. MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
    // Non-blocking: catch and log error so API request flow isn't crashed
    return null;
  }
}

module.exports = sendEmail;
