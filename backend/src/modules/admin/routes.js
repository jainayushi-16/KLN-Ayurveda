const express = require("express");
const adminController = require("./controller");
const validate = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const { createProductAdminSchema } = require("./validation");

const { authLimiter } = require("../../middleware/rateLimiter");

const router = express.Router();

// Unauthenticated Admin Auth Routes
router.post("/auth/forgot-password", authLimiter, adminController.forgotPassword);
router.post("/auth/reset-password", authLimiter, adminController.resetPassword);
router.post("/forgot-password", authLimiter, adminController.forgotPassword);
router.post("/reset-password", authLimiter, adminController.resetPassword);

router.use(authenticate, authorize("ADMIN"));

// Dashboard & Stats
router.get("/dashboard", adminController.getDashboardStats);

// Products Management
router.get("/products", adminController.getAllProducts);
router.post("/products", validate(createProductAdminSchema), adminController.createProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);
router.patch("/products/:id/stock", adminController.updateStock);

// Category Management
router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

// Order Management
router.get("/orders", adminController.getAllOrders);
router.get("/orders/:id", adminController.getOrderDetails);
router.put("/orders/:orderId/status", adminController.updateOrderStatus);
router.put("/orders/:orderId/payment", adminController.updatePaymentStatus);

// Customer Management
router.get("/customers", adminController.getAllCustomers);
router.get("/customers/:id", adminController.getCustomerById);
router.put("/customers/:id", adminController.updateCustomer);
router.delete("/customers/:id", adminController.deleteCustomer);

// Review Management
router.get("/reviews", adminController.getAllReviews);
router.post("/reviews", adminController.createReview);
router.delete("/reviews/:id", adminController.deleteReview);

// Offers & Discounts Management
const offerController = require("../offers/controller");
const { createOfferSchema, updateOfferSchema } = require("../offers/validation");
router.get("/offers", offerController.getOffers);
router.post("/offers", validate(createOfferSchema), offerController.createOffer);
router.get("/offers/:id", offerController.getOfferById);
router.put("/offers/:id", validate(updateOfferSchema), offerController.updateOffer);
router.delete("/offers/:id", offerController.deleteOffer);
router.patch("/offers/:id/status", offerController.toggleOfferStatus);

// Admin Settings
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.upsertSetting);

module.exports = router;


