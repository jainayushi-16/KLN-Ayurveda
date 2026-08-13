const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("./config/env");
const routesV1 = require("./routes/v1");
const errorHandler = require("./middleware/error");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// Trust reverse proxy (Render, Vercel, Cloudflare, Nginx)
app.set("trust proxy", 1);

// Security HTTP headers
app.use(helmet());


// CORS configuration
const allowedOrigins =
 env.corsOrigin.split(",")
 .map((origin) => origin.trim())
 .filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
       allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// Body parser & Cookie parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

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
