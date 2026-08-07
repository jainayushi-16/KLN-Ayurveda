const adminService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class AdminController {
  getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();
    return ApiResponse.success(res, "Admin dashboard stats retrieved", stats);
  });

  createProduct = asyncHandler(async (req, res) => {
    const product = await adminService.createProduct(req.body);
    return ApiResponse.success(res, "Product created successfully", product, 201);
  });

  updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await adminService.updateOrderStatus(orderId, status);
    return ApiResponse.success(res, "Order status updated", order);
  });

  getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await adminService.getAllCustomers();
    return ApiResponse.success(res, "Customers retrieved successfully", customers);
  });
}

module.exports = new AdminController();
