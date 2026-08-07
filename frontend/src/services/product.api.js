// Temporary Standalone Mode: Backend API calls commented out
// import { axiosClient } from "./axiosClient";
import { PRODUCTS, CATEGORIES } from "@/data/products";

export const productApi = {
  // getProducts: (params) => axiosClient.get("/products", { params }),
  getProducts: (params) => Promise.resolve({ success: true, data: PRODUCTS }),

  // getProductDetails: (idOrSlug) => axiosClient.get(`/products/${idOrSlug}`),
  getProductDetails: (idOrSlug) => {
    const product = PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || PRODUCTS[0];
    return Promise.resolve({ success: true, data: product });
  },

  // getCategories: () => axiosClient.get("/categories"),
  getCategories: () => Promise.resolve({ success: true, data: CATEGORIES }),
};
