const nodemailer = require("nodemailer");
const env = require("./env");
const logger = require("./logger");

const port = Number(env.smtp.port) || 587;
const isSecure = port === 465;

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: port,
  secure: isSecure,
  auth: (env.smtp.user && env.smtp.pass)
    ? {
        user: env.smtp.user,
        pass: env.smtp.pass,
      }
    : undefined,
  tls: {
    rejectUnauthorized: false, // Prevents self-signed certificate errors
  },
});

/**
 * Verify transporter connection on demand
 */
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    logger.info("✅ SMTP Transporter connected successfully!");
    return true;
  } catch (error) {
    logger.error(`❌ SMTP Connection Failed: ${error.message}`);
    return false;
  }
};

module.exports = transporter;
module.exports.verifyTransporter = verifyTransporter;

