const express = require("express");
const userController = require("./controller");
const validate = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { updateProfileSchema, addressSchema } = require("./validation");

const router = express.Router();

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", validate(updateProfileSchema), userController.updateProfile);
router.get("/addresses", userController.getAddresses);
router.post("/addresses", validate(addressSchema), userController.addAddress);
router.delete("/account", userController.deleteAccount);

module.exports = router;
