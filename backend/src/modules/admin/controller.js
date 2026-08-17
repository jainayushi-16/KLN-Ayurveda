const adminService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const logger = require("../../config/logger");

class AdminController {
  getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();
    return ApiResponse.success(res, "Admin dashboard stats retrieved", stats);
  });

  getAllProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const { search, categoryId } = req.query;
    const result = await adminService.getAllProducts(page, limit, search, categoryId);
    return ApiResponse.success(res, "Admin products retrieved", result.items, 200, result.pagination);
  });

  createProduct = asyncHandler(async (req, res) => {
    const product = await adminService.createProduct(req.body);
    return ApiResponse.success(res, "Product created successfully", product, 201);
  });

  updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await adminService.updateProduct(id, req.body);
    return ApiResponse.success(res, "Product updated successfully", product);
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await adminService.deleteProduct(id);
    return ApiResponse.success(res, "Product deleted successfully");
  });

  updateStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { stockQuantity, inStock } = req.body;
    const product = await adminService.updateStock(id, stockQuantity, inStock);
    return ApiResponse.success(res, "Stock updated successfully", product);
  });

  createCategory = asyncHandler(async (req, res) => {
    const category = await adminService.createCategory(req.body);
    return ApiResponse.success(res, "Category created successfully", category, 201);
  });

  updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await adminService.updateCategory(id, req.body);
    return ApiResponse.success(res, "Category updated successfully", category);
  });

  deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await adminService.deleteCategory(id);
    return ApiResponse.success(res, "Category deleted successfully");
  });

  getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const { status, search } = req.query;
    const result = await adminService.getAllOrders(page, limit, status, search);
    return ApiResponse.success(res, "Orders retrieved successfully", result.items, 200, result.pagination);
  });

  getOrderDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await adminService.getOrderDetails(id);
    return ApiResponse.success(res, "Order details retrieved", order);
  });

  updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await adminService.updateOrderStatus(orderId, status);
    return ApiResponse.success(res, "Order status updated", order);
  });

  updatePaymentStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;
    const order = await adminService.updatePaymentStatus(orderId, paymentStatus);
    return ApiResponse.success(res, "Payment status updated", order);
  });

  getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await adminService.getAllCustomers();
    return ApiResponse.success(res, "Customers retrieved successfully", customers);
  });

  getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await adminService.getAllReviews();
    return ApiResponse.success(res, "Reviews retrieved successfully", reviews);
  });

  deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await adminService.deleteReview(id);
    return ApiResponse.success(res, "Review deleted successfully");
  });

  getSettings = asyncHandler(async (req, res) => {
    const settings = await adminService.getSettings();
    return ApiResponse.success(res, "Settings retrieved successfully", settings);
  });

  upsertSetting = asyncHandler(async (req, res) => {
    const { key, value, description } = req.body;
    const setting = await adminService.upsertSetting(key, value, description);
    return ApiResponse.success(res, "Setting saved successfully", setting);
  });

  testSmtp = asyncHandler(async (req, res) => {
    const {
      to,
      recipientEmail,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      smtpFrom,
      smtpFromName,
      smtpSecure,
    } = req.body || {};

    const targetEmail = to || recipientEmail;

    if (!targetEmail) {
      return ApiResponse.error(
        res,
        "Recipient email ('to' or 'recipientEmail') is required",
        ["Recipient email required"],
        400
      );
    }

    const payload = {
      to: targetEmail,
      ...(smtpHost ? { smtpHost } : {}),
      ...(smtpPort ? { smtpPort } : {}),
      ...(smtpUser !== undefined ? { smtpUser } : {}),
      ...(smtpPass !== undefined ? { smtpPass } : {}),
      ...(smtpFrom ? { smtpFrom } : {}),
      ...(smtpFromName ? { smtpFromName } : {}),
      ...(smtpSecure !== undefined ? { smtpSecure } : {}),
    };

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("SMTP Connection Timeout (12s exceeded). Please verify your 16-character Google App Password, host (smtp.gmail.com), and port (587).")),
        12000
      )
    );

    try {
      const info = await Promise.race([adminService.testSmtp(payload), timeoutPromise]);
      return ApiResponse.success(res, "SMTP Connection test successful and test email sent!", info);
    } catch (err) {
      logger.error(`[SMTP TEST] Failed to verify/send test email: ${err.message}`);
      
      const errMsg = err.message || "Failed to connect to SMTP server.";
      let statusCode = 400;

      if (errMsg.includes("Username and Password are required") || errMsg.includes("required")) {
        statusCode = 400;
      } else if (errMsg.includes("Authentication") || errMsg.includes("EAUTH") || errMsg.includes("Invalid login") || errMsg.includes("535")) {
        statusCode = 401;
      } else if (errMsg.includes("Timeout") || errMsg.includes("ETIMEDOUT") || errMsg.includes("ECONNREFUSED") || errMsg.includes("ESOCKET")) {
        statusCode = 408;
      } else {
        statusCode = 400;
      }

      return ApiResponse.error(res, `SMTP Test Failed: ${errMsg}`, [errMsg], statusCode);
    }
  });
}


module.exports = new AdminController();


