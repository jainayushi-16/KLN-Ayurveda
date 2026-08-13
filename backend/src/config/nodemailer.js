const nodemailer = require("nodemailer");
const env = require("./env");
const logger = require("./logger");
const prisma = require("./prisma");

let currentTransporter = null;
let cachedConfig = null;

/**
 * Fetch active SMTP config from DB settings or env fallback
 */
async function getSmtpConfig() {
  try {
    const settings = await prisma.settings.findMany({
      where: {
        key: {
          in: ["smtpHost", "smtpPort", "smtpUser", "smtpPass", "smtpFrom", "smtpFromName", "smtpSecure"],
        },
      },
    });

    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    const host = settingsMap.smtpHost || env.smtp.host;
    const port = Number(settingsMap.smtpPort) || Number(env.smtp.port) || 587;
    const user = settingsMap.smtpUser || env.smtp.user;
    const pass = settingsMap.smtpPass || env.smtp.pass;
    const from = settingsMap.smtpFrom || env.smtp.from || "noreply@klnayurveda.com";
    const fromName = settingsMap.smtpFromName || env.smtp.fromName || "KLN Ayurveda";
    const secure = settingsMap.smtpSecure ? settingsMap.smtpSecure === "true" : port === 465;

    cachedConfig = { host, port, user, pass, from, fromName, secure };
    return cachedConfig;
  } catch (error) {
    logger.warn(`Could not read SMTP settings from DB, fallback to env: ${error.message}`);
    cachedConfig = {
      host: env.smtp.host,
      port: Number(env.smtp.port) || 587,
      user: env.smtp.user,
      pass: env.smtp.pass,
      from: env.smtp.from || "noreply@klnayurveda.com",
      fromName: env.smtp.fromName || "KLN Ayurveda",
      secure: (Number(env.smtp.port) || 587) === 465,
    };
    return cachedConfig;
  }
}

/**
 * Create or return current transporter
 */
function createTransporter(config) {
  const portNum = Number(config.port) || 587;
  const isSecure = config.secure === true || config.secure === "true" || portNum === 465;

  return nodemailer.createTransport({
    host: config.host,
    port: portNum,
    secure: isSecure,
    family: 4, // Force IPv4 resolution to prevent IPv6 timeouts on cloud hosts
    auth: (config.user && config.pass)
      ? {
          user: config.user,
          pass: config.pass,
        }
      : undefined,
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 25000,
    greetingTimeout: 25000,
    socketTimeout: 25000,
  });
}



/**
 * Get active Nodemailer transporter instance
 */
function getTransporter() {
  if (!currentTransporter) {
    const syncConfig = cachedConfig || {
      host: env.smtp.host,
      port: Number(env.smtp.port) || 587,
      secure: (Number(env.smtp.port) || 587) === 465,
      user: env.smtp.user,
      pass: env.smtp.pass,
      from: env.smtp.from || "noreply@klnayurveda.com",
      fromName: env.smtp.fromName || "KLN Ayurveda",
    };
    currentTransporter = createTransporter(syncConfig);
  }
  return currentTransporter;
}

/**
 * Reload transporter with latest DB/env credentials
 */
async function reloadTransporter() {
  const config = await getSmtpConfig();
  currentTransporter = createTransporter(config);
  logger.info(`🔄 SMTP Transporter reloaded for host ${config.host}:${config.port}`);
  return currentTransporter;
}

/**
 * Verify transporter connection
 */
const verifyTransporter = async () => {
  try {
    const config = await getSmtpConfig();
    const tempTransporter = createTransporter(config);
    await tempTransporter.verify();
    logger.info("✅ SMTP Transporter connected successfully!");
    return true;
  } catch (error) {
    logger.error(`❌ SMTP Connection Failed: ${error.message}`);
    return false;
  }
};

/**
 * Send a test email to verify credentials
 */
const verifyAndSendTestEmail = async (toEmail) => {
  const config = await getSmtpConfig();
  const testTransporter = createTransporter(config);

  await testTransporter.verify();

  const info = await testTransporter.sendMail({
    from: `"${config.fromName}" <${config.from}>`,
    to: toEmail,
    subject: "KLN Ayurveda - SMTP Test Email",
    text: `Hello! This is a test email sent from your KLN Ayurveda Admin Settings using SMTP host (${config.host}:${config.port}). Your SMTP configuration is working correctly!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
        <h2 style="color: #2e7d32; text-align: center;">🌿 KLN Ayurveda SMTP Test Email</h2>
        <p>Hello,</p>
        <p>Congratulations! Your SMTP Gateway configuration has been verified successfully.</p>
        <div style="background: #f4f6f4; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>SMTP Host:</strong> ${config.host}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>SMTP Port:</strong> ${config.port}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Sender Email:</strong> ${config.from}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Sender Name:</strong> ${config.fromName}</p>
        </div>
        <p style="font-size: 12px; color: #777; text-align: center;">Sent from KLN Ayurveda Admin Settings Panel.</p>
      </div>
    `,
  });

  return info;
};

// Initialize config asynchronously
getSmtpConfig().then((config) => {
  currentTransporter = createTransporter(config);
});

async function sendMail(options) {
  const config = await getSmtpConfig();
  if (!currentTransporter) {
    currentTransporter = createTransporter(config);
  }
  return currentTransporter.sendMail(options);
}

module.exports = {
  sendMail,
  getTransporter,
  getSmtpConfig,
  reloadTransporter,
  verifyTransporter,
  verifyAndSendTestEmail,
};



