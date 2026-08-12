import axios from "axios";
import toast from "react-hot-toast";

let API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://kln-ayurveda-backend.onrender.com/api/v1"
    : "http://localhost:5000/api/v1");

if (typeof API_BASE_URL === "string" && API_BASE_URL.startsWith("http://") && !API_BASE_URL.includes("localhost") && !API_BASE_URL.includes("127.0.0.1")) {
  API_BASE_URL = API_BASE_URL.replace("http://", "https://");
}

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

// Response Interceptor: Standard Response Parsing & Graceful 401 Error Handling
axiosClient.interceptors.response.use((response) => response.data, (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ||
        error.message ||
        "Unable to connect to KLN Ayurveda servers.";

    // If token is invalid or expired (401), clear stale token from localStorage to prevent repeated errors
    if (typeof window !== "undefined" && status === 401) {
        localStorage.removeItem("kln_token");
    } else if (typeof window !== "undefined") {
        toast.error(message);
    }
    
    return Promise.reject(error.response?.data || { success: false, message, status });
});
