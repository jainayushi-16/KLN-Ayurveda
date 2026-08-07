// Temporary Standalone Mode: Backend API calls commented out
// import { axiosClient } from "./axiosClient";

export const faqApi = {
  // getFAQs: () => axiosClient.get("/faqs"),
  getFAQs: () => Promise.resolve({ success: true, data: [] }),
};
