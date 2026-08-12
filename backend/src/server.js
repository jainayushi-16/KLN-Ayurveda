const app = require("./app");
const env = require("./config/env");
const logger = require("./config/logger");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(
    `🚀 KLN Ayurveda Backend Server running in ${env.nodeEnv} mode on port ${PORT}`
  );
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);

  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});