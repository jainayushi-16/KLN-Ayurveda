const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("./config/env");
const routesV1 = require("./routes/v1");
const errorHandler = require("./middleware/error");
const { apiLimiter } = require("./middleware/rateLimiter");

const logger = require("./config/logger");

const app = express();

// Trust reverse proxy (Render, Vercel, Cloudflare, Nginx)
app.set("trust proxy", 1);

// 1. Security HTTP headers
app.use(helmet());

// 2. CORS configuration & Preflight handling
const rawOriginSources = [
  process.env.CORS_ORIGIN,
  env.corsOrigin,
  process.env.FRONTEND_URL,
  env.frontendUrl,
  process.env.ADMIN_FRONTEND_URL,
  env.adminFrontendUrl,
  "https://kln-ayurveda.vercel.app",
  "https://kln-ayurveda-admin.vercel.app",
].filter(Boolean);

const allowedOrigins = Array.from(
  new Set(
    rawOriginSources
      .flatMap((source) => source.split(","))
      .map((origin) => origin.replace(/["']/g, "").trim().replace(/\/+$/, ""))
      .filter(Boolean)
  )
);

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow non-browser, Postman, curl, server-to-server

  const normalizedOrigin = origin.replace(/["']/g, "").trim().replace(/\/+$/, "");

  if (
    normalizedOrigin.includes("localhost") ||
    normalizedOrigin.includes("127.0.0.1")
  ) {
    return true;
  }

  return allowedOrigins.some((allowed) => {
    const normalizedAllowed = allowed.toLowerCase();
    const normalizedTarget = normalizedOrigin.toLowerCase();
    return normalizedTarget === normalizedAllowed || normalizedTarget.endsWith(normalizedAllowed);
  });
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      logger.warn(`⚠️ CORS blocked request from unauthorized origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Accept-Language",
    "Origin",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
  ],
  optionsSuccessStatus: 200,
};

// Enable CORS middleware globally
app.use(cors(corsOptions));

// Explicit preflight OPTIONS handler before rate limiter and routes
app.options("*", cors(corsOptions));

// Safe startup diagnostic log
logger.info(`🌐 CORS allowed origins: [${allowedOrigins.join(", ")}]`);

// Body parser & Cookie parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// i18n Language Middleware
const i18nMiddleware = require("./middleware/i18n");
app.use(i18nMiddleware);

// Rate Limiting
app.use("/api", apiLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Root welcome endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 KLN Ayurveda Backend API is running!",
    health: "/health",
    version: "v1",
  });
});

// API Routes
app.use("/api/v1", routesV1);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
    data: null,
    pagination: null,
    errors: ["Route not found"],
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
