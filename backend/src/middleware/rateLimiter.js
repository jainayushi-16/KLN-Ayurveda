const rateLimit = require("express-rate-limit");
const env = require("../config/env");

const isDev = env.env === "development" || process.env.NODE_ENV !== "production";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 2000, // Allow 2000 requests per 15 mins in prod, virtually unlimited in dev
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
    data: null,
    pagination: null,
    errors: ["Rate limit exceeded"],
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 200, // Allow 200 auth attempts per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: {
    success: false,
    message: "Too many login/register attempts. Please try again later.",
    data: null,
    pagination: null,
    errors: ["Auth rate limit exceeded"],
  },
});

module.exports = { apiLimiter, authLimiter };

