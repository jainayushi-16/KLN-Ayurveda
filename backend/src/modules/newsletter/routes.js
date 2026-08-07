const express = require("express");
const newsletterController = require("./controller");
const validate = require("../../middleware/validate");
const { subscribeSchema } = require("./validation");

const router = express.Router();

router.post("/subscribe", validate(subscribeSchema), newsletterController.subscribe);
router.post("/unsubscribe", validate(subscribeSchema), newsletterController.unsubscribe);

module.exports = router;
