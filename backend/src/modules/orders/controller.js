const orderService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class OrderController {
  createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod, buyNowItem, items, couponCode } = req.body;

    const formattedAddress = {
      street: shippingAddress?.street || "Address",
      city: shippingAddress?.city || "City",
      state: shippingAddress?.state || "State",
      postalCode: String(shippingAddress?.postalCode || shippingAddress?.pincode || "400050"),
      country: shippingAddress?.country || "India",
    };

    let order;
    if (buyNowItem && buyNowItem.productId) {
      // Buy Now flow — single item, bypasses cart
      order = await orderService.createBuyNowOrder(req.user.id, buyNowItem, formattedAddress, paymentMethod, couponCode);
    } else {
      // Normal cart checkout flow (supports database cart or items passed in payload)
      order = await orderService.createOrder(req.user.id, formattedAddress, paymentMethod, items, couponCode);
    }

    return ApiResponse.success(res, "Order placed successfully", order, 201);
  });

  getUserOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getUserOrders(req.user.id);
    return ApiResponse.success(res, "Orders retrieved successfully", orders);
  });

  getOrderDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await orderService.getOrderDetails(id);
    return ApiResponse.success(res, "Order details retrieved", order);
  });

  trackOrder = asyncHandler(async (req, res) => {
    const { orderNumber } = req.params;
    const order = await orderService.trackOrder(orderNumber);
    return ApiResponse.success(res, "Order tracking info retrieved", order);
  });

  cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason, notes } = req.body || {};
    const cancelReason = reason || notes || "Customer requested cancellation";
    const order = await orderService.cancelOrder(id, req.user.id, cancelReason);
    return ApiResponse.success(res, "Order cancelled successfully", order);
  });

  returnOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason, itemIds, notes } = req.body || {};
    const order = await orderService.returnOrder(id, req.user.id, { reason, itemIds, notes });
    return ApiResponse.success(res, "Return request submitted successfully", order);
  });

  downloadInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const invoiceService = require("../../services/invoice.service");
    const order = await orderService.getOrderDetails(id);

    // Verify ownership or admin role
    if (req.user && req.user.role !== "ADMIN" && order.userId && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied. You can only access your own order invoices." });
    }

    const html = invoiceService.generateInvoiceHtml(order, req.user);
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", `inline; filename="KLN_Invoice_${order.orderNumber || id}.html"`);
    return res.send(html);
  });
}

module.exports = new OrderController();
