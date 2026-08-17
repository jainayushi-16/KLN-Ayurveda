import axios from 'axios';

let API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://kln-ayurveda-backend.onrender.com/api/v1";

// Ensure https protocol for production deployed API URLs
if (typeof API_BASE_URL === 'string' && API_BASE_URL.startsWith('http://') && !API_BASE_URL.includes('localhost') && !API_BASE_URL.includes('127.0.0.1')) {
  API_BASE_URL = API_BASE_URL.replace('http://', 'https://');
}

console.log("🌐 [KLN Admin API Base URL]:", API_BASE_URL);

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('kln_admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
      localStorage.removeItem('kln_admin_token');
      localStorage.removeItem('kln_admin_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
