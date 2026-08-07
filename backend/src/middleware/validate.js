const ApiError = require("../utils/apiError");

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = parsed.body || req.body;
    req.query = parsed.query || req.query;
    req.params = parsed.params || req.params;
    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
      return next(new ApiError(400, "Validation Error", formattedErrors));
    }
    next(err);
  }
};

module.exports = validate;
