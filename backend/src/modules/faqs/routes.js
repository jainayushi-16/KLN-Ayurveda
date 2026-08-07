const express = require("express");
const faqController = require("./controller");

const router = express.Router();

router.get("/", faqController.getFAQs);

module.exports = router;
