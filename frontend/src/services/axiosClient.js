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
    
    const message = isNetworkError
      ? "Network connection error. Please ensure backend server is running and reachable."
      : error.response?.data?.message || error.message || "Unable to connect to KLN Ayurveda servers.";

    if (typeof window !== "undefined" && status === 401) {
      localStorage.removeItem("kln_token");
    } else if (typeof window !== "undefined") {
      toast.error(message);
    }

    return Promise.reject(error.response?.data || { success: false, message, status: status || 500 });
  }
);

export default axiosClient;
