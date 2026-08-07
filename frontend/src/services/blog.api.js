import { axiosClient } from "./axiosClient";
export const blogApi = {
    getBlogs: () => axiosClient.get("/blogs"),
    getBlogDetails: (idOrSlug) => axiosClient.get(`/blogs/${idOrSlug}`),
    getCategories: () => axiosClient.get("/blogs/categories"),
};
