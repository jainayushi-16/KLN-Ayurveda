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
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      pagination: null,
      errors: Array.isArray(errors) ? errors : errors ? [errors] : null,
    });
  }
}

module.exports = ApiResponse;
