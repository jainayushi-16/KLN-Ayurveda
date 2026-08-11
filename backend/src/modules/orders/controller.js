const orderService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class OrderController {
  createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod, buyNowItem } = req.body;

    let order;
    if (buyNowItem && buyNowItem.productId) {
      // Buy Now flow — single item, bypasses cart
      order = await orderService.createBuyNowOrder(req.user.id, buyNowItem, shippingAddress, paymentMethod);
    } else {
      // Normal cart checkout flow
      order = await orderService.createOrder(req.user.id, shippingAddress, paymentMethod);
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
    const order = await orderService.cancelOrder(id, req.user.id);
    return ApiResponse.success(res, "Order cancelled successfully", order);
  });
}

module.exports = new OrderController();
