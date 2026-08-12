const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  env: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "kln_access_secret_2026",
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "kln_refresh_secret_2026",
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || "7d",
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: process.env.SMTP_PORT || 2525,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || "noreply@klnayurveda.com",
  },
};
