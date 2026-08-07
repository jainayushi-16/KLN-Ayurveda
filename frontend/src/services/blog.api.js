// Temporary Standalone Mode: Backend API calls commented out
// import { axiosClient } from "./axiosClient";

export const blogApi = {
  // getBlogs: () => axiosClient.get("/blogs"),
  getBlogs: () => Promise.resolve({ success: true, data: [] }),

  // getBlogDetails: (idOrSlug) => axiosClient.get(`/blogs/${idOrSlug}`),
  getBlogDetails: (idOrSlug) => Promise.resolve({ success: true, data: null }),

  // getCategories: () => axiosClient.get("/blogs/categories"),
  getCategories: () => Promise.resolve({ success: true, data: [] }),
};
