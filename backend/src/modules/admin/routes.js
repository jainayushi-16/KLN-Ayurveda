const express = require("express");
const adminController = require("./controller");
const validate = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const { createProductAdminSchema } = require("./validation");

const router = express.Router();

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

// Review Management
router.get("/reviews", adminController.getAllReviews);
router.delete("/reviews/:id", adminController.deleteReview);

// Admin Settings
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.upsertSetting);
router.post("/smtp/test", adminController.testSmtp);

module.exports = router;

