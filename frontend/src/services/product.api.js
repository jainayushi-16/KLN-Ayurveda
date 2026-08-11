import { axiosClient } from "./axiosClient";

export const productApi = {
  // Returns: { success, data: [...products], pagination }
  getProducts: (params) => axiosClient.get("/products", { params }),

  // Returns: { success, data: { product, reviews, relatedProducts } }
  getProductDetails: (idOrSlug) => axiosClient.get(`/products/${idOrSlug}`),

  // Returns: { success, data: [...categories] }
  getCategories: () => axiosClient.get("/categories"),

  // Returns: { success, data: review }
  createReview: (data) => axiosClient.post("/reviews", data),
};
