const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  env: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "kln_access_secret_2026",
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || "30d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "kln_refresh_secret_2026",
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || "30d",
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  frontendUrl: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "http://localhost:3000",
  adminFrontendUrl: process.env.ADMIN_FRONTEND_URL || "http://localhost:3001",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  emailProvider: (process.env.EMAIL_PROVIDER || (process.env.RESEND_API_KEY ? "resend" : "smtp")).replace(/["']/g, "").trim().toLowerCase(),
  resend: {
    apiKey: (process.env.RESEND_API_KEY || "").replace(/["']/g, "").trim(),
    fromEmail: (process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM || "onboarding@resend.dev").replace(/["']/g, "").trim(),
    fromName: (process.env.RESEND_FROM_NAME || process.env.SMTP_FROM_NAME || "KLN Ayurveda").replace(/["']/g, "").trim(),
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    secure: process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === "true" : undefined,
    from: process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER || "noreply@klnayurveda.com",
    fromName: process.env.SMTP_FROM_NAME || process.env.EMAIL_FROM_NAME || "KLN Ayurveda",
  },
};


