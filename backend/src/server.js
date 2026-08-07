const app = require("./app");
const env = require("./config/env");
const logger = require("./config/logger");

const PORT = env.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 KLN Ayurveda Backend Server running in ${env.env} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
