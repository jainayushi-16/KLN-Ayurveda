const offerRepository = require("./repository");
const discountService = require("../../services/discount.service");
const ApiError = require("../../utils/apiError");

class OfferService {
  async createOffer(payload) {
    const {
      name,
      description,
      code,
      type = "PERCENTAGE",
      value,
      maxDiscount,
      minimumOrderValue = 0,
      startAt,
      endAt,
      usageLimit,
      perCustomerLimit = 1,
      isActive = true,
      isFeatured = false,
      productIds = [],
      categoryIds = [],
    } = payload;

    if (!name || !code || value === undefined || value < 0) {
      throw new ApiError(400, "Name, unique code, and a non-negative value are required.");
    }

    const normalizedCode = code.trim().toUpperCase();
    const existing = await offerRepository.getOfferByCode(normalizedCode);
    if (existing) {
      throw new ApiError(409, `An offer with code '${normalizedCode}' already exists.`);
    }

    const startDate = startAt ? new Date(startAt) : new Date();
    const endDate = endAt ? new Date(endAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (endDate <= startDate) {
      throw new ApiError(400, "End date must be after start date.");
    }

    const now = new Date();
    let initialStatus = "ACTIVE";
    if (startDate > now) {
      initialStatus = "SCHEDULED";
    }

    const offerData = {
      name,
      description,
      code: normalizedCode,
      type,
      value: parseFloat(value),
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
      minimumOrderValue: parseFloat(minimumOrderValue || 0),
      startAt: startDate,
      endAt: endDate,
      status: initialStatus,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      perCustomerLimit: parseInt(perCustomerLimit || 1),
      isActive: Boolean(isActive),
      isFeatured: Boolean(isFeatured),
    };

    const offer = await offerRepository.createOffer(offerData, productIds, categoryIds);
    return this.enrichOfferStatus(offer);
  }

  async getOffers(queryParams) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const search = queryParams.search || "";
    const status = queryParams.status || "ALL";
    const type = queryParams.type || "ALL";
    const startDate = queryParams.startDate;
    const endDate = queryParams.endDate;

    const result = await offerRepository.getOffers({
      search,
      status,
      type,
      page,
      limit,
      startDate,
      endDate,
    });

    result.offers = result.offers.map((offer) => this.enrichOfferStatus(offer));
    const metrics = await offerRepository.getOfferMetrics();

    return {
      ...result,
      metrics,
    };
  }

  async getOfferById(id) {
    const offer = await offerRepository.getOfferById(id);
    if (!offer) {
      throw new ApiError(404, "Offer not found.");
    }
    return this.enrichOfferStatus(offer);
  }

  async updateOffer(id, payload) {
    const existing = await offerRepository.getOfferById(id);
    if (!existing) {
      throw new ApiError(404, "Offer not found.");
    }

    const {
      name,
      description,
      code,
      type,
      value,
      maxDiscount,
      minimumOrderValue,
      startAt,
      endAt,
      usageLimit,
      perCustomerLimit,
      isActive,
      isFeatured,
      productIds,
      categoryIds,
    } = payload;

    const offerData = {};

    if (code) {
      const normalizedCode = code.trim().toUpperCase();
      if (normalizedCode !== existing.code) {
        const codeConflict = await offerRepository.getOfferByCode(normalizedCode);
        if (codeConflict) {
          throw new ApiError(409, `An offer with code '${normalizedCode}' already exists.`);
        }
        offerData.code = normalizedCode;
      }
    }

    if (name !== undefined) offerData.name = name;
    if (description !== undefined) offerData.description = description;
    if (type !== undefined) offerData.type = type;
    if (value !== undefined) offerData.value = parseFloat(value);
    if (maxDiscount !== undefined) offerData.maxDiscount = maxDiscount ? parseFloat(maxDiscount) : null;
    if (minimumOrderValue !== undefined) offerData.minimumOrderValue = parseFloat(minimumOrderValue);
    if (startAt !== undefined) offerData.startAt = new Date(startAt);
    if (endAt !== undefined) offerData.endAt = new Date(endAt);
    if (usageLimit !== undefined) offerData.usageLimit = usageLimit ? parseInt(usageLimit) : null;
    if (perCustomerLimit !== undefined) offerData.perCustomerLimit = parseInt(perCustomerLimit);
    if (isActive !== undefined) offerData.isActive = Boolean(isActive);
    if (isFeatured !== undefined) offerData.isFeatured = Boolean(isFeatured);

    const updated = await offerRepository.updateOffer(id, offerData, productIds, categoryIds);
    return this.enrichOfferStatus(updated);
  }

  async deleteOffer(id) {
    const existing = await offerRepository.getOfferById(id);
    if (!existing) {
      throw new ApiError(404, "Offer not found.");
    }
    return offerRepository.deleteOffer(id);
  }

  async toggleOfferStatus(id, isActive) {
    const existing = await offerRepository.getOfferById(id);
    if (!existing) {
      throw new ApiError(404, "Offer not found.");
    }
    const updated = await offerRepository.toggleOfferStatus(id, Boolean(isActive));
    return this.enrichOfferStatus(updated);
  }

  async getActivePublicOffers() {
    const offers = await offerRepository.getActivePublicOffers();
    return offers.map((o) => this.enrichOfferStatus(o));
  }

  async validateDiscount({ code, userId, cartItems }) {
    return discountService.validateAndCalculateDiscount({ code, userId, cartItems });
  }

  enrichOfferStatus(offer) {
    if (!offer) return offer;
    const usageCount = Math.max(
      offer.usageCount || 0,
      offer._count?.usages || 0,
      offer._count?.orders || 0,
      offer.usages?.length || 0
    );
    const effectiveStatus = discountService.calculateEffectiveStatus({ ...offer, usageCount });
    return {
      ...offer,
      usageCount,
      effectiveStatus,
    };
  }

  async getUserOfferUsages(userId) {
    return offerRepository.getUserOfferUsages(userId);
  }

  async getAdminOfferUsages(queryParams) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 20;
    const offerId = queryParams.offerId || null;
    return offerRepository.getAdminOfferUsages({ offerId, page, limit });
  }
}

module.exports = new OfferService();

