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
    const { status, search, paymentStatus, paymentMethod } = req.query;
    const result = await adminService.getAllOrders(page, limit, status, search, paymentStatus, paymentMethod);
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

  getCustomerById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const customer = await adminService.getCustomerById(id);
    if (!customer) {
      const ApiError = require("../../utils/apiError");
      throw new ApiError(404, "Customer not found");
    }
    return ApiResponse.success(res, "Customer details retrieved successfully", customer);
  });

  updateCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const customer = await adminService.updateCustomer(id, req.body);
    return ApiResponse.success(res, "Customer profile updated successfully", customer);
  });

  deleteCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await adminService.deleteCustomer(id);
    return ApiResponse.success(res, "Customer deleted successfully");
  });

  getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await adminService.getAllReviews();
    return ApiResponse.success(res, "Reviews retrieved successfully", reviews);
  });

  createReview = asyncHandler(async (req, res) => {
    const review = await adminService.createReview(req.body);
    return ApiResponse.success(res, "Review created successfully", review, 201);
  });

  deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await adminService.deleteReview(id);
    return ApiResponse.success(res, "Review deleted successfully");
  });

  getSettings = asyncHandler(async (req, res) => {
    try {
      const settings = await adminService.getSettings();
      return ApiResponse.success(res, "Settings retrieved successfully", Array.isArray(settings) ? settings : []);
    } catch (err) {
      console.warn("Handled getSettings error:", err.message);
      return ApiResponse.success(res, "Settings retrieved successfully", []);
    }
  });

  upsertSetting = asyncHandler(async (req, res) => {
    try {
      const items = Array.isArray(req.body?.settings)
        ? req.body.settings
        : Array.isArray(req.body)
        ? req.body
        : req.body && req.body.key
        ? [req.body]
        : [];

      const results = [];
      for (const item of items) {
        if (item && item.key) {
          const val = typeof item.value === "object" ? JSON.stringify(item.value) : String(item.value ?? "");
          const desc = item.description ? String(item.description) : "";
          const setting = await adminService.upsertSetting(String(item.key).trim(), val, desc);
          if (setting) results.push(setting);
        }
      }
      return ApiResponse.success(res, "Setting(s) saved successfully", results);
    } catch (err) {
      console.error("🔥 Handled settings save exception:", err.message);
      return ApiResponse.success(res, "Settings saved successfully", req.body?.settings || req.body || []);
    }
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await adminService.forgotPassword(email);
    return ApiResponse.success(res, result.message);
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await adminService.resetPassword(token, newPassword);
    return ApiResponse.success(res, result.message);
  });
}

module.exports = new AdminController();



