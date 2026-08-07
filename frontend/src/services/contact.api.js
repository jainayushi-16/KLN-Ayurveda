import { axiosClient } from "./axiosClient";
export const contactApi = {
    submitContact: (data) => axiosClient.post("/contact", data),
    subscribeNewsletter: (email) => axiosClient.post("/newsletter/subscribe", { email }),
};
