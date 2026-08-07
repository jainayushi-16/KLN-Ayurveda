const express = require("express");
const wishlistController = require("./controller");
const validate = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { wishlistActionSchema } = require("./validation");

const router = express.Router();

router.use(authenticate);

router.get("/", wishlistController.getWishlist);
router.post("/items", validate(wishlistActionSchema), wishlistController.addProduct);
router.post("/move-to-cart", validate(wishlistActionSchema), wishlistController.moveToCart);
router.delete("/items/:productId", wishlistController.removeProduct);

module.exports = router;
