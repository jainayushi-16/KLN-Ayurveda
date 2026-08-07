// Temporary Standalone Mode: Backend API calls commented out
// import { axiosClient } from "./axiosClient";

export const contactApi = {
  // submitContact: (data) => axiosClient.post("/contact", data),
  submitContact: (data) => Promise.resolve({ success: true, message: "Message sent successfully" }),

  // subscribeNewsletter: (email) => axiosClient.post("/newsletter/subscribe", { email }),
  subscribeNewsletter: (email) => Promise.resolve({ success: true, message: "Subscribed to newsletter" }),
};
