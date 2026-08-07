const express = require("express");
const categoryController = require("./controller");

const router = express.Router();

router.get("/", categoryController.getCategories);

module.exports = router;
