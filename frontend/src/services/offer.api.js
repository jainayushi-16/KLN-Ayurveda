import { axiosClient } from "./axiosClient";

export const offerApi = {
  validateCoupon: async (code, cartItems = []) => {
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) return { success: false, valid: false, message: "Please enter a valid promo code" };

    // Known valid coupon definitions
    const VALID_COUPONS = {
      KLN10: { discountPercent: 0.1, message: "Coupon 'KLN10' applied (10% OFF)" },
      KLN20: { discountPercent: 0.2, message: "Coupon 'KLN20' applied (20% OFF)" },
      WELCOME15: { discountPercent: 0.15, message: "Coupon 'WELCOME15' applied (15% OFF)" },
      AYUR50: { discountPercent: 0.5, message: "Coupon 'AYUR50' applied (50% OFF)" },
      FREESHIP: { discountPercent: 0, isFreeShipping: true, message: "Coupon 'FREESHIP' applied (Free Express Shipping)" },
    };

    // 1. Try backend validation first
    try {
      const res = await axiosClient.post("/offers/validate-discount", {
        code: cleanCode,
        cartItems: cartItems.map((item) => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      if (res && (res.data || res.valid)) return res;
    } catch (e) {
      console.warn("Backend coupon validation note:", e);
    }

    // 2. Check local valid coupons list
    const validOffer = VALID_COUPONS[cleanCode];
    if (validOffer) {
      const itemsList = (cartItems || []).map((i) => i.subtotal || ((i.price || 0) * (i.quantity || 1)) || 0);
      const subtotal = itemsList.reduce((acc, v) => acc + v, 0);
      const discountAmount = Math.round(subtotal * validOffer.discountPercent);

      return {
        success: true,
        valid: true,
        data: {
          valid: true,
          code: cleanCode,
          discountPercent: validOffer.discountPercent,
          discountAmount,
          isFreeShipping: Boolean(validOffer.isFreeShipping),
          message: validOffer.message,
        },
      };
    }

    // 3. Reject invalid coupon codes
    return {
      success: false,
      valid: false,
      message: `Invalid promo code '${cleanCode}'. Please enter a valid coupon code (e.g. KLN10, KLN20, WELCOME15, AYUR50).`,
    };
  },

  getActiveOffers: async () => {
    try {
      const res = await axiosClient.get("/offers/active");
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.message)
        ? res.message
        : Array.isArray(res)
        ? res
        : Array.isArray(res?.offers)
        ? res.offers
        : [];
      return { success: true, data: list };
    } catch (e) {
      console.warn("Backend active offers fetch note:", e);
    }
    return { success: true, data: [] };
  },

  getUsedOffers: async () => {
    try {
      const res = await axiosClient.get("/offers/used");
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.message)
        ? res.message
        : Array.isArray(res)
        ? res
        : [];
      return { success: true, data: list };
    } catch (e) {
      console.warn("Backend offer usage fetch note:", e);
    }
    return { success: true, data: [] };
  },
};

export default offerApi;
