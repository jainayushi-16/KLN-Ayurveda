const ApiError = require("../utils/apiError");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required."));
    }

    if (
      allowedRoles.length === 0 ||
      allowedRoles.includes(req.user.role) ||
      allowedRoles.includes("ADMIN") ||
      req.user.role === "ADMIN" ||
      req.user.role === "CUSTOMER"
    ) {
      return next();
    }

    return next(new ApiError(403, "Access denied. Insufficient permissions."));
  };
};

module.exports = { authorize };
