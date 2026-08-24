const offerService = require("./service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const createOffer = asyncHandler(async (req, res) => {
  const offer = await offerService.createOffer(req.body);
  return apiResponse.success(res, "Offer created successfully", offer, 201);
});

const getOffers = asyncHandler(async (req, res) => {
  const result = await offerService.getOffers(req.query);
  return apiResponse.success(res, "Offers retrieved successfully", result);
});

const getOfferById = asyncHandler(async (req, res) => {
  const offer = await offerService.getOfferById(req.params.id);
  return apiResponse.success(res, "Offer details retrieved successfully", offer);
});

const updateOffer = asyncHandler(async (req, res) => {
  const offer = await offerService.updateOffer(req.params.id, req.body);
  return apiResponse.success(res, "Offer updated successfully", offer);
});

const deleteOffer = asyncHandler(async (req, res) => {
  await offerService.deleteOffer(req.params.id);
  return apiResponse.success(res, "Offer deleted successfully", null);
});

const toggleOfferStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const offer = await offerService.toggleOfferStatus(req.params.id, isActive);
  return apiResponse.success(res, `Offer ${isActive ? "activated" : "deactivated"} successfully`, offer);
});

const getActivePublicOffers = asyncHandler(async (req, res) => {
  const offers = await offerService.getActivePublicOffers();
  return apiResponse.success(res, "Active offers retrieved successfully", offers);
});

const validateDiscount = asyncHandler(async (req, res) => {
  const { code, cartItems } = req.body;
  const userId = req.user ? req.user.id : null;
  const result = await offerService.validateDiscount({ code, userId, cartItems });
  return apiResponse.success(res, result.message, result);
});

module.exports = {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  getActivePublicOffers,
  validateDiscount,
};
