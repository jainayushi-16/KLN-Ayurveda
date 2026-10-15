const express = require("express");
const walletController = require("./controller");
const validate = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const { adminAdjustWalletSchema, getTransactionsQuerySchema } = require("./validation");

const router = express.Router();

// All wallet routes require authentication
router.use(authenticate);

// Customer wallet endpoints
router.get("/", walletController.getWalletBalance);
router.get("/transactions", validate(getTransactionsQuerySchema), walletController.getWalletTransactions);

// Admin wallet management endpoints (also mirrored in /admin routes)
router.get("/admin/all", authorize("ADMIN"), walletController.adminGetAllWallets);
router.get("/admin/:userId/transactions", authorize("ADMIN"), walletController.adminGetCustomerTransactions);
router.post(
  "/admin/:userId/adjust",
  authorize("ADMIN"),
  validate(adminAdjustWalletSchema),
  walletController.adminAdjustWallet
);
router.get("/admin/export", authorize("ADMIN"), walletController.adminExportTransactions);

module.exports = router;
