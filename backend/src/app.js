const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("./config/env");
const routesV1 = require("./routes/v1");
const errorHandler = require("./middleware/error");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.corsOrigin,
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
