const ApiResponse = require("../utils/apiResponse");
const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  const errors = err.errors || null;

  // Sanitize Prisma & DB internal errors so raw technical traces never leak to toast / client UI
  if (err.code === "P2003" || message.includes("foreign key constraint") || message.includes("RESTRICT setting")) {
    statusCode = 400;
    message = "This item is linked to existing records and cannot be deleted.";
  } else if (message.includes("Invalid `prisma.") || message.includes("ConnectorError") || message.includes("QueryError")) {
    statusCode = 500;
    message = "A database operation failed. Please try again.";
  }

  logger.error(`[${req.method}] ${req.url} - ${statusCode} - ${err.message}`);

  return ApiResponse.error(res, message, errors, statusCode);
};

module.exports = errorHandler;
