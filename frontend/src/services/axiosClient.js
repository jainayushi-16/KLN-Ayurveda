import axios from "axios";
import toast from "react-hot-toast";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://kln-ayurveda-backend.onrender.com/api/v1"
    : "http://localhost:5000/api/v1");
export const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});
// Request Interceptor: Attach JWT Token
axiosClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("kln_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));
// Response Interceptor: Standard Response Parsing & Error Handling
axiosClient.interceptors.response.use((response) => response.data, (error) => {
    const message = error.response?.data?.message ||
        error.message ||
        "Unable to connect to KLN Ayurveda servers.";
    // Only toast errors on client-side
    if (typeof window !== "undefined" && error.response?.status !== 401) {
        toast.error(message);
    }
    return Promise.reject(error.response?.data || { success: false, message });
});
