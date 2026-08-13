class ApiResponse {
  static success(res, message = "Success", data = null, statusCode = 200, pagination = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination,
      errors: null,
    });
  }

  static error(res, message = "An error occurred", errors = null, statusCode = 500) {
    let actualStatus = statusCode;
    let actualErrors = errors;

    if (typeof errors === "number") {
      actualStatus = errors;
      actualErrors = [message];
    } else if (typeof statusCode !== "number") {
      actualStatus = 500;
    }

    return res.status(actualStatus).json({
      success: false,
      message,
      data: null,
      pagination: null,
      errors: Array.isArray(actualErrors) ? actualErrors : actualErrors ? [actualErrors] : null,
    });
  }
}


module.exports = ApiResponse;
