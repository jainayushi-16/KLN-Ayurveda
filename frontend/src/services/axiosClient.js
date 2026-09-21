import axios from "axios";
import toast from "react-hot-toast";

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl) {
    let cleanUrl = envUrl.trim();
    if (cleanUrl.startsWith("http://") && !cleanUrl.includes("localhost") && !cleanUrl.includes("127.0.0.1")) {
      cleanUrl = cleanUrl.replace("http://", "https://");
    }
    return cleanUrl;
  }

  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocal) {
      return "http://localhost:5000/api/v1";
    }
  }

  return "https://kln-ayurveda-backend.onrender.com/api/v1";
};

const API_BASE_URL = getApiBaseUrl();
console.log("🌐 [KLN Frontend API Base URL]:", API_BASE_URL);

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Attach JWT Token & Accept-Language Header
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("kln_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const lang = localStorage.getItem("kln_language") || "en-IN";
      config.headers["Accept-Language"] = lang;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standard Response Parsing & Graceful Error Handling
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const isNetworkError = !error.response || error.code === "ERR_NETWORK" || error.message === "Network Error";
    
    let message = isNetworkError
      ? "Network connection issue. Reconnecting to KLN servers..."
      : error.response?.data?.message || error.message || "An unexpected error occurred.";

    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      message = error.response.data.errors.map((e) => e.message || e.msg).join(", ");
    }

    if (typeof window !== "undefined") {
      if (status === 401) {
        const hadToken = Boolean(localStorage.getItem("kln_token"));
        localStorage.removeItem("kln_token");
        if (hadToken && !error.config?.url?.includes("/auth/me")) {
          toast.error("Session expired. Please sign in again.");
        }
      } else if (status === 403) {
        toast.error("Access denied. You do not have permission for this action.");
      } else if (status === 422 || status === 400) {
        toast.error(message);
      } else if (status === 500) {
        console.error("🔥 [KLN Server 500 Error]:", error.response?.data || error.message);
        toast.error("Server processing error. Please try again in a moment.");
      }
    }

    return Promise.reject(error.response?.data || { success: false, message, status: status || 500 });
  }
);

export default axiosClient;
