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
  const rawHost = (config.host || "").trim().toLowerCase();
  const rawUser = (config.user || "").trim();
  const rawPass = (config.pass || "").replace(/\s+/g, "");

  const isGmail = rawHost.includes("gmail") || rawUser.endsWith("@gmail.com");

  if (isGmail) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: rawUser,
        pass: rawPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  const port = Number(config.port) || 587;
  const secure = config.secure === true || config.secure === "true" || port === 465;

  return nodemailer.createTransport({
    host: rawHost || "smtp.gmail.com",
    port,
    secure,
    family: 4,
    auth: (rawUser && rawPass) ? { user: rawUser, pass: rawPass } : undefined,
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
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
const verifyAndSendTestEmail = async (payload) => {
  const toEmail = typeof payload === "string" ? payload : payload.to;
  const customConfig = typeof payload === "object" ? payload : {};

  const dbConfig = await getSmtpConfig();

  const host = (customConfig.smtpHost || dbConfig.host || "smtp.gmail.com").trim();
  const port = Number(customConfig.smtpPort || dbConfig.port || 465);
  const user = (customConfig.smtpUser || dbConfig.user || "").trim();
  const pass = (customConfig.smtpPass || dbConfig.pass || "").trim();
  const from = (customConfig.smtpFrom || dbConfig.from || user || "noreply@klnayurveda.com").trim();
  const fromName = (customConfig.smtpFromName || dbConfig.fromName || "KLN Ayurveda").trim();
  const secure = customConfig.smtpSecure !== undefined
    ? (customConfig.smtpSecure === "true" || customConfig.smtpSecure === true || port === 465)
    : dbConfig.secure;

  if (!user || !pass) {
    throw new Error("SMTP Username and Password are required. Please enter your credentials in the form fields first.");
  }

  const activeConfig = { host, port, user, pass, from, fromName, secure };
  const testTransporter = createTransporter(activeConfig);

  logger.info(`📧 Testing SMTP: host=${host}, port=${port}, secure=${secure}, user=${user}`);

  try {
    await testTransporter.verify();
    logger.info("✅ SMTP verification successful");
  } catch (verifyErr) {
    logger.error(`❌ SMTP verification failed: ${verifyErr.message}`);
    throw new Error(`SMTP Verification Failed (${verifyErr.message})`);
  }

  // Auto-save verified settings into database
  try {
    const settingsToSave = [
      { key: "smtpHost", value: host, description: "SMTP Server Host" },
      { key: "smtpPort", value: String(port), description: "SMTP Server Port" },
      { key: "smtpUser", value: user, description: "SMTP Auth Username/Email" },
      { key: "smtpPass", value: pass, description: "SMTP Auth Password/App Key" },
      { key: "smtpFrom", value: from, description: "Sender From Email Address" },
      { key: "smtpFromName", value: fromName, description: "Sender Display Name" },
      { key: "smtpSecure", value: String(secure), description: "Use SSL/TLS (true/false)" },
    ];

    for (const item of settingsToSave) {
      await prisma.settings.upsert({
        where: { key: item.key },
        update: { value: item.value, description: item.description },
        create: { key: item.key, value: item.value, description: item.description },
      });
    }
    await reloadTransporter();
  } catch (dbErr) {
    logger.warn(`Could not auto-save verified SMTP settings: ${dbErr.message}`);
  }

  const info = await testTransporter.sendMail({
    from: `"${fromName}" <${from}>`,
    to: toEmail,
    subject: "KLN Ayurveda - SMTP Test Email",
    text: `Hello! This is a test email sent from your KLN Ayurveda Admin Settings using SMTP host (${host}:${port}). Your SMTP configuration is working correctly!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2e7d32; text-align: center;">🌿 KLN Ayurveda SMTP Test Email</h2>
        <p>Hello,</p>
        <p>Congratulations! Your SMTP Gateway configuration has been verified successfully and is active across your application.</p>
        <div style="background: #f4f6f4; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>SMTP Host:</strong> ${host}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>SMTP Port:</strong> ${port}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Sender Email:</strong> ${from}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Sender Name:</strong> ${fromName}</p>
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



