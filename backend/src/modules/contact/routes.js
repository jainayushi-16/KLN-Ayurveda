const express = require("express");
const contactController = require("./controller");
const validate = require("../../middleware/validate");
const { createContactSchema } = require("./validation");

const router = express.Router();

router.post("/", validate(createContactSchema), contactController.submitContact);

module.exports = router;
