const cartService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class CartController {
  getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user.id);
    return ApiResponse.success(res, "Cart retrieved successfully", cart);
  });

  addItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.addItem(req.user.id, productId, quantity);
    return ApiResponse.success(res, "Item added to cart", cart);
  });

  updateQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.updateQuantity(req.user.id, productId, quantity);
    return ApiResponse.success(res, "Cart item updated", cart);
  });

  removeItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const cart = await cartService.removeItem(req.user.id, productId);
    return ApiResponse.success(res, "Item removed from cart", cart);
  });

  clearCart = asyncHandler(async (req, res) => {
    const cart = await cartService.clearCart(req.user.id);
    return ApiResponse.success(res, "Cart cleared successfully", cart);
  });
}

module.exports = new CartController();
