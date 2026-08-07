const express = require("express");
const productController = require("./controller");
const validate = require("../../middleware/validate");
const { getProductsQuerySchema } = require("./validation");

const router = express.Router();

router.get("/", validate(getProductsQuerySchema), productController.getProducts);
router.get("/:id", productController.getProductDetails);

module.exports = router;
