const express = require("express");
const authController = require("./controller");
const validate = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { authLimiter } = require("../../middleware/rateLimiter");
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require("./validation");

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/change-password", authenticate, validate(changePasswordSchema), authController.changePassword);
router.get("/me", authenticate, authController.getMe);

module.exports = router;
