const express = require("express");
const orderController = require("./controller");
const validate = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { createOrderSchema } = require("./validation");

const router = express.Router();

router.get("/track/:orderNumber", orderController.trackOrder);

router.use(authenticate);

router.post("/", validate(createOrderSchema), orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get("/:id", orderController.getOrderDetails);
router.post("/:id/cancel", orderController.cancelOrder);

module.exports = router;
