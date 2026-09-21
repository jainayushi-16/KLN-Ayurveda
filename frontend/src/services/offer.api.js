import { axiosClient } from "./axiosClient";

export const offerApi = {
  validateCoupon: async (code, cartItems = []) => {
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) return { success: false, valid: false, message: "Please enter a valid promo code" };

    try {
      const res = await axiosClient.post("/offers/validate-discount", {
        code: cleanCode,
        cartItems: cartItems.map((item) => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if (res && (res.data || res.valid || res.success)) {
        return res;
      }
      return {
        success: false,
        valid: false,
        message: res?.message || `Invalid or expired promo code '${cleanCode}'.`,
      };
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message || `Invalid or expired promo code '${cleanCode}'.`;
      return {
        success: false,
        valid: false,
        message: errorMsg,
      };
    }
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
