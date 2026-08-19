const nodemailer = require("nodemailer");
const env = require("../config/env");
const logger = require("../config/logger");

let transporter = null;
let currentConfigHash = "";

/**
 * Get current SMTP config strictly from environment variables
 */
function getSmtpConfig() {
  const host = (env.smtp.host || "smtp.gmail.com").trim();
  const port = Number(env.smtp.port) || 587;
  const user = (env.smtp.user || "").trim();
  const pass = (env.smtp.pass || "").replace(/\s+/g, "").replace(/^["']|["']$/g, "");
  const from = (env.smtp.from || user || "noreply@klnayurveda.com").trim();
  const fromName = (env.smtp.fromName || "KLN Ayurveda").trim();

  let secure = port === 465;
  if (env.smtp.secure !== undefined) {
    secure = Boolean(env.smtp.secure);
  } else if (port === 587) {
    secure = false;
  }

  return { host, port, user, pass, from, fromName, secure };
}

/**
 * Create or reuse Nodemailer transporter
 */
function getTransporter() {
  const config = getSmtpConfig();
  const configHash = `${config.host}:${config.port}:${config.user}:${config.secure}`;

  if (!transporter || currentConfigHash !== configHash) {
    logger.info(`📧 Initializing Nodemailer transporter (${config.host}:${config.port}, secure=${config.secure}, user=${config.user})`);

    const isGmail = config.host.includes("gmail") || config.user.endsWith("@gmail.com");

    const transportOptions = {
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.user && config.pass ? { user: config.user, pass: config.pass } : undefined,
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    };

    if (isGmail && config.port === 587) {
      transportOptions.requireTLS = true;
    }

    transporter = nodemailer.createTransport(transportOptions);
    currentConfigHash = configHash;
  }

  return transporter;
}

/**
 * Verify SMTP Connection (Backend-only health check)
 */
async function verifySmtpConnection() {
  try {
    const config = getSmtpConfig();
    if (!config.user || !config.pass) {
      logger.warn("⚠️ SMTP Verification skipped: SMTP_USER or SMTP_PASS environment variables are missing.");
      return { success: false, message: "SMTP credentials missing in environment variables" };
    }

    const t = getTransporter();
    await t.verify();
    logger.info("✅ Backend SMTP connection verified successfully!");
    return { success: true, message: "SMTP server connection successful" };
  } catch (error) {
    logger.error(`❌ SMTP Verification Failed: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Generic email sending function
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Text fallback
 * @param {string} [options.html] - HTML content
 */
async function sendEmail({ to, subject, text, html }) {
  if (!to) {
    logger.error("❌ sendEmail error: Recipient address ('to') is required.");
    throw new Error("Recipient address is required");
  }

  const config = getSmtpConfig();
  if (!config.user || !config.pass) {
    logger.error("❌ sendEmail error: SMTP_USER and SMTP_PASS are missing in environment variables.");
    throw new Error("SMTP service is currently unconfigured");
  }

  const mailOptions = {
    from: `"${config.fromName}" <${config.from}>`,
    to,
    subject,
    text: text || "",
    html: html || text || "",
  };

  try {
    const t = getTransporter();
    logger.info(`📧 Sending email to ${to} ("${subject}")`);
    const info = await t.sendMail(mailOptions);
    logger.info(`✅ Email dispatched successfully to ${to}. MessageID: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
    throw error;
  }
}

/**
 * Send branded KLN Ayurveda password reset email
 */
async function sendPasswordResetEmail({ to, name, resetUrl, isAdmin = false }) {
  const recipientName = name || "Valued Customer";
  const userTypeLabel = isAdmin ? "Administrator" : "Customer";
  const subject = "Reset Your Password - KLN Ayurveda";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F6F3EC; color: #222123;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 15px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E2DCCF; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #1B351E; padding: 32px 20px;">
                  <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">
                    🌿 KLN Ayurveda
                  </h1>
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: #A3C9A8; text-transform: uppercase; letter-spacing: 2px;">
                    Authentic Wellness & Care
                  </p>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 40px 32px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1B351E; font-weight: 700;">
                    Reset Your Password
                  </h2>
                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4A494A;">
                    Hello <strong>${recipientName}</strong>,
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #555555;">
                    We received a request to reset the password for your KLN Ayurveda ${userTypeLabel} account. Click the button below to set a new password:
                  </p>

                  <!-- Reset Button -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 12px 0 28px 0;">
                        <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #2F5D34; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(47, 93, 52, 0.3);">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 12px 0; font-size: 13px; color: #666666;">
                    Or copy and paste this link into your web browser:
                  </p>
                  <div style="margin: 0 0 24px 0; padding: 12px 16px; background-color: #F6F3EC; border-radius: 8px; word-break: break-all; font-size: 12px; color: #2F5D34; border: 1px dashed #C8D6C5;">
                    <a href="${resetUrl}" target="_blank" style="color: #2F5D34; text-decoration: underline;">${resetUrl}</a>
                  </div>

                  <!-- Security Warning -->
                  <div style="margin: 24px 0 0 0; padding: 16px; background-color: #FFF9E6; border-left: 4px solid #D4A373; border-radius: 6px;">
                    <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #8C6D3B;">
                      ⏰ Security Notice:
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #7A5F33; line-height: 1.5;">
                      This password reset link will expire in <strong>1 hour</strong>. If you did not request a password reset, please ignore this email or contact support if you have concerns.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F9F8F5; padding: 24px 32px; border-top: 1px solid #E2DCCF; text-align: center;">
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: #777777;">
                    Need help? Contact support at <a href="mailto:support@klnayurveda.com" style="color: #2F5D34; font-weight: 600; text-decoration: none;">support@klnayurveda.com</a>
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #999999;">
                    © 2026 KLN Ayurveda. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `Hello ${recipientName},\n\nYou requested a password reset for your KLN Ayurveda ${userTypeLabel} account.\n\nPlease reset your password using the link below:\n${resetUrl}\n\nNote: This link expires in 1 hour. If you did not request this, please ignore this message.`;

  return sendEmail({ to, subject, text, html });
}

/**
 * Send branded KLN Ayurveda notification email
 */
async function sendNotificationEmail({ to, name, title, message, type = "GENERAL", actionUrl }) {
  const recipientName = name || "Valued Customer";
  const subject = `${title} - KLN Ayurveda`;
  const defaultAccountUrl = `${(env.frontendUrl || "http://localhost:3000").replace(/\/+$/, "")}/profile`;
  const buttonUrl = actionUrl || defaultAccountUrl;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F6F3EC; color: #222123;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 15px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E2DCCF; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #1B351E; padding: 32px 20px;">
                  <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">
                    🌿 KLN Ayurveda
                  </h1>
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: #A3C9A8; text-transform: uppercase; letter-spacing: 2px;">
                    Authentic Wellness & Care
                  </p>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 40px 32px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1B351E; font-weight: 700;">
                    ${title}
                  </h2>
                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4A494A;">
                    Hello <strong>${recipientName}</strong>,
                  </p>
                  <div style="margin: 0 0 24px 0; padding: 18px 20px; background-color: #F7F4EC; border-left: 4px solid #2F5D34; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #333333;">
                    ${message}
                  </div>

                  <!-- Action Button -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 12px 0 24px 0;">
                        <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #2F5D34; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(47, 93, 52, 0.25);">
                          View Account
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F9F8F5; padding: 24px 32px; border-top: 1px solid #E2DCCF; text-align: center;">
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: #777777;">
                    Need help? Contact support at <a href="mailto:support@klnayurveda.com" style="color: #2F5D34; font-weight: 600; text-decoration: none;">support@klnayurveda.com</a>
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #999999;">
                    © 2026 KLN Ayurveda. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `Hello ${recipientName},\n\n${title}\n\n${message}\n\nView details: ${buttonUrl}`;

  return sendEmail({ to, subject, text, html });
}

module.exports = {
  getSmtpConfig,
  getTransporter,
  verifySmtpConnection,
  sendEmail,
  sendPasswordResetEmail,
  sendNotificationEmail,
};

