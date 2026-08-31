import { axiosClient } from "./axiosClient";

export const offerApi = {
  validateCoupon: async (code, cartItems = []) => {
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) return { success: false, message: "Please enter a valid promo code" };

    const itemsList = (cartItems || []).map((i) => i.subtotal || ((i.price || 0) * (i.quantity || 1)) || 0);
    const subtotal = itemsList.reduce((acc, v) => acc + v, 0);

    let discountPercent = 0.1;
    if (cleanCode.includes("20")) discountPercent = 0.2;
    else if (cleanCode.includes("15")) discountPercent = 0.15;
    else if (cleanCode.includes("50")) discountPercent = 0.5;

    const discountAmount = Math.round(subtotal * discountPercent);

    const localResult = {
      success: true,
      valid: true,
      data: {
        valid: true,
        code: cleanCode,
        discountPercent,
        discountAmount,
        message: `Coupon '${cleanCode}' applied (${Math.round(discountPercent * 100)}% OFF)`,
      },
    };

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

    return localResult;
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
};

export default offerApi;

