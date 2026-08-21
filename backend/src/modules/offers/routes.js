const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { authenticate } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const validate = require("../../middleware/validate");
const { createOfferSchema, updateOfferSchema, validateDiscountSchema } = require("./validation");
const { apiLimiter } = require("../../middleware/rateLimiter");

// ----------------------------------------------------
// Public / Customer Offer Routes
// ----------------------------------------------------

/**
 * @route   GET /api/v1/offers/active
 * @desc    Get active promotional offers for storefront
 * @access  Public
 */
router.get("/active", controller.getActivePublicOffers);

/**
 * @route   POST /api/v1/offers/validate-discount
 * @desc    Validate coupon code and calculate discount
 * @access  Public (Optional auth hydrates user limit)
 */
router.post(
  "/validate-discount",
  apiLimiter,
  (req, res, next) => {
    // Optional auth check without throwing 401 if unauthenticated
    if (req.headers.authorization || (req.cookies && req.cookies.accessToken)) {
      return authenticate(req, res, next);
    }
    next();
  },
  validate(validateDiscountSchema),
  controller.validateDiscount
);

// ----------------------------------------------------
// Admin Offer Management Routes (Requires Admin Authorization)
// ----------------------------------------------------

/**
 * @route   GET /api/v1/admin/offers
 * @desc    Get paginated offers with filters & metrics
 * @access  Private (Admin)
 */
router.get("/admin", authenticate, authorize("ADMIN"), controller.getOffers);

/**
 * @route   POST /api/v1/admin/offers
 * @desc    Create a new offer/coupon
 * @access  Private (Admin)
 */
router.post(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  validate(createOfferSchema),
  controller.createOffer
);

/**
 * @route   GET /api/v1/admin/offers/:id
 * @desc    Get single offer details with usage history
 * @access  Private (Admin)
 */
router.get("/admin/:id", authenticate, authorize("ADMIN"), controller.getOfferById);

/**
 * @route   PUT /api/v1/admin/offers/:id
 * @desc    Update an existing offer
 * @access  Private (Admin)
 */
router.put(
  "/admin/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateOfferSchema),
  controller.updateOffer
);

/**
 * @route   DELETE /api/v1/admin/offers/:id
 * @desc    Delete an offer
 * @access  Private (Admin)
 */
router.delete("/admin/:id", authenticate, authorize("ADMIN"), controller.deleteOffer);

/**
 * @route   PATCH /api/v1/admin/offers/:id/status
 * @desc    Activate or deactivate an offer
 * @access  Private (Admin)
 */
router.patch("/admin/:id/status", authenticate, authorize("ADMIN"), controller.toggleOfferStatus);

module.exports = router;
