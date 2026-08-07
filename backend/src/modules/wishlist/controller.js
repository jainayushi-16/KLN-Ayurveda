const wishlistService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

class WishlistController {
  getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishlist(req.user.id);
    return ApiResponse.success(res, "Wishlist retrieved successfully", wishlist);
  });

  addProduct = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const wishlist = await wishlistService.addProduct(req.user.id, productId);
    return ApiResponse.success(res, "Product added to wishlist", wishlist);
  });

  removeProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const wishlist = await wishlistService.removeProduct(req.user.id, productId);
    return ApiResponse.success(res, "Product removed from wishlist", wishlist);
  });

  moveToCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const wishlist = await wishlistService.moveToCart(req.user.id, productId);
    return ApiResponse.success(res, "Product moved to cart", wishlist);
  });
}

module.exports = new WishlistController();
