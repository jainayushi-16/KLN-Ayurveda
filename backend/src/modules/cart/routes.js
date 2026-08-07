const express = require("express");
const cartController = require("./controller");
const validate = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { addToCartSchema, updateQuantitySchema } = require("./validation");

const router = express.Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/items", validate(addToCartSchema), cartController.addItem);
router.put("/items", validate(updateQuantitySchema), cartController.updateQuantity);
router.delete("/items/:productId", cartController.removeItem);
router.delete("/", cartController.clearCart);

module.exports = router;
