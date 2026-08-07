import { axiosClient } from "./axiosClient";
export const productApi = {
    getProducts: (params) => axiosClient.get("/products", { params }),
    getProductDetails: (idOrSlug) => axiosClient.get(`/products/${idOrSlug}`),
    getCategories: () => axiosClient.get("/categories"),
};
