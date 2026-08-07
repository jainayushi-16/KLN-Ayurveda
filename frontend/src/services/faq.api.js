import { axiosClient } from "./axiosClient";
export const faqApi = {
    getFAQs: () => axiosClient.get("/faqs"),
};
