import axiosClient from "./axiosClient";

export const offerApi = {
  validateCoupon: async (code, cartItems = []) => {
    const res = await axiosClient.post("/offers/validate-discount", {
      code,
      cartItems: cartItems.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
      })),
    });
    return res;
  },

  getActiveOffers: async () => {
    const res = await axiosClient.get("/offers/active");
    return res;
  },
};

export default offerApi;
