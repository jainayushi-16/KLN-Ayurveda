const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

class DiscountService {
  /**
   * Determine effective status of an offer based on server time, limits, and database flag
   */
  calculateEffectiveStatus(offer) {
    if (!offer) return "INACTIVE";
    if (!offer.isActive || offer.status === "INACTIVE") return "INACTIVE";
    if (offer.status === "DRAFT") return "DRAFT";

    const now = new Date();
    const start = new Date(offer.startAt);
    const end = new Date(offer.endAt);

    if (now < start) return "SCHEDULED";
    if (now > end) return "EXPIRED";
    if (offer.usageLimit !== null && offer.usageCount >= offer.usageLimit) return "EXHAUSTED";

    return "ACTIVE";
  }

  /**
   * Validate coupon and calculate server-side discount
   */
  async validateAndCalculateDiscount({ code, userId = null, cartItems = [] }) {
    if (!code || typeof code !== "string") {
      throw new ApiError(400, "Coupon code is required.");
    }

    const normalizedCode = code.trim().toUpperCase();

    let offer = await prisma.offer
      .findFirst({
        where: { code: { equals: normalizedCode, mode: "insensitive" } },
        include: {
          selectedProducts: { select: { productId: true } },
          selectedCategories: { select: { categoryId: true } },
        },
      })
      .catch(() => null);

    if (!offer) {
      throw new ApiError(404, `Invalid coupon code '${normalizedCode}'. Please enter a valid coupon code.`);
    }

    // 2. Determine effective status
    const effectiveStatus = this.calculateEffectiveStatus(offer);
    if (effectiveStatus === "INACTIVE") {
      throw new ApiError(400, `Coupon '${normalizedCode}' is currently inactive.`);
    }
    if (effectiveStatus === "DRAFT") {
      throw new ApiError(400, `Coupon '${normalizedCode}' is not available.`);
    }
    if (effectiveStatus === "SCHEDULED") {
      throw new ApiError(400, `Coupon '${normalizedCode}' will be active starting ${new Date(offer.startAt).toLocaleDateString()}.`);
    }
    if (effectiveStatus === "EXPIRED") {
      throw new ApiError(400, `Coupon '${normalizedCode}' has expired.`);
    }
    if (effectiveStatus === "EXHAUSTED") {
      throw new ApiError(400, `Coupon '${normalizedCode}' has reached its maximum usage limit.`);
    }

    // 3. Hydrate & validate cart items from database if needed
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new ApiError(400, "Your cart is empty. Add products to apply coupon.");
    }

    const productIds = cartItems.map((item) => item.productId || item.id).filter(Boolean);
    const dbProducts = await prisma.product
      .findMany({
        where: {
          OR: [{ id: { in: productIds } }, { slug: { in: productIds } }],
        },
        select: { id: true, slug: true, price: true, categoryId: true, name: true },
      })
      .catch(() => []);

    const productMap = new Map();
    dbProducts.forEach((p) => {
      productMap.set(p.id, p);
      if (p.slug) productMap.set(p.slug, p);
    });

    let totalSubtotal = 0;
    let eligibleSubtotal = 0;
    let hasEligibleItems = false;

    const targetProductIds = new Set(offer.selectedProducts.map((p) => p.productId));
    const targetCategoryIds = new Set(offer.selectedCategories.map((c) => c.categoryId));

    for (const item of cartItems) {
      const prodId = item.productId || item.id;
      const product = productMap.get(prodId);
      const qty = Math.max(1, parseInt(item.quantity) || 1);
      const itemPrice = product ? product.price : Number(item.price || item.subtotal / qty || 49);
      const itemTotal = itemPrice * qty;
      totalSubtotal += itemTotal;

      let isEligible = false;
      if (offer.type === "PRODUCT_SPECIFIC") {
        isEligible = product ? targetProductIds.has(product.id) : true;
      } else if (offer.type === "CATEGORY_SPECIFIC") {
        isEligible = product ? targetCategoryIds.has(product.categoryId) : true;
      } else {
        isEligible = true;
      }

      if (isEligible) {
        eligibleSubtotal += itemTotal;
        hasEligibleItems = true;
      }
    }

    if (totalSubtotal <= 0) {
      throw new ApiError(400, "Cart total must be greater than zero.");
    }

    // 4. Validate Minimum Order Value
    if (offer.minimumOrderValue > 0 && totalSubtotal < offer.minimumOrderValue) {
      throw new ApiError(
        400,
        `Coupon '${normalizedCode}' requires a minimum order value of ₹${offer.minimumOrderValue}. Add ₹${(offer.minimumOrderValue - totalSubtotal).toFixed(2)} more to qualify.`
      );
    }

    // 5. Validate Product/Category Eligibility
    if ((offer.type === "PRODUCT_SPECIFIC" || offer.type === "CATEGORY_SPECIFIC") && !hasEligibleItems) {
      throw new ApiError(400, `Coupon '${normalizedCode}' is not applicable to the items in your cart.`);
    }

    // 6. Validate Per-Customer Usage Limit if user is authenticated
    if (userId && offer.perCustomerLimit > 0) {
      const userUsageCount = await prisma.offerUsage.count({
        where: { offerId: offer.id, userId },
      });

      if (userUsageCount >= offer.perCustomerLimit) {
        throw new ApiError(
          400,
          `You have already used coupon '${normalizedCode}' the maximum allowed ${offer.perCustomerLimit} time(s).`
        );
      }
    }

    // 7. Calculate Discount Amount
    let discountAmount = 0;
    let isFreeShipping = false;

    switch (offer.type) {
      case "PERCENTAGE": {
        discountAmount = (eligibleSubtotal * offer.value) / 100;
        if (offer.maxDiscount && offer.maxDiscount > 0) {
          discountAmount = Math.min(discountAmount, offer.maxDiscount);
        }
        break;
      }
      case "FLAT":
      case "CART_VALUE": {
        discountAmount = Math.min(offer.value, eligibleSubtotal);
        break;
      }
      case "PRODUCT_SPECIFIC":
      case "CATEGORY_SPECIFIC": {
        discountAmount = (eligibleSubtotal * offer.value) / 100;
        if (offer.maxDiscount && offer.maxDiscount > 0) {
          discountAmount = Math.min(discountAmount, offer.maxDiscount);
        }
        break;
      }
      case "FREE_SHIPPING": {
        discountAmount = 0;
        isFreeShipping = true;
        break;
      }
      default: {
        discountAmount = Math.min(offer.value, eligibleSubtotal);
      }
    }

    discountAmount = Number(Math.max(0, discountAmount).toFixed(2));
    discountAmount = Math.min(discountAmount, totalSubtotal);

    return {
      offerId: offer.id,
      code: offer.code,
      name: offer.name,
      type: offer.type,
      value: offer.value,
      discountAmount,
      isFreeShipping,
      totalSubtotal,
      finalSubtotal: Number((totalSubtotal - discountAmount).toFixed(2)),
      message: `Coupon '${offer.code}' applied successfully!`,
    };
  }
}

module.exports = new DiscountService();
