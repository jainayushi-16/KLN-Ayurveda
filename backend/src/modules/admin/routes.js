const express = require("express");
const adminController = require("./controller");
const validate = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const { createProductAdminSchema } = require("./validation");

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", adminController.getDashboardStats);
router.post("/products", validate(createProductAdminSchema), adminController.createProduct);
router.put("/orders/:orderId/status", adminController.updateOrderStatus);
router.get("/customers", adminController.getAllCustomers);

module.exports = router;
