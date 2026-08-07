const express = require("express");
const blogController = require("./controller");

const router = express.Router();

router.get("/", blogController.getBlogs);
router.get("/categories", blogController.getCategories);
router.get("/:id", blogController.getBlogDetails);

module.exports = router;
