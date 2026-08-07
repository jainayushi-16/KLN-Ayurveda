const ApiResponse = require("../utils/apiResponse");
const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || null;

  logger.error(`[${req.method}] ${req.url} - ${statusCode} - ${message}`);

  return ApiResponse.error(res, message, errors, statusCode);
};

module.exports = errorHandler;
