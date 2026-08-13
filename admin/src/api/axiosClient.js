import axios from 'axios';

let API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  API_BASE_URL = "http://localhost:5000/api/v1";
}

if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
  // When running on localhost, prefer local backend unless explicitly forced
  if (process.env.NEXT_PUBLIC_USE_LOCAL_API !== "false") {
    API_BASE_URL = "http://localhost:5000/api/v1";
  }
}

if (typeof API_BASE_URL === 'string' && API_BASE_URL.startsWith('http://') && !API_BASE_URL.includes('localhost') && !API_BASE_URL.includes('127.0.0.1')) {
  API_BASE_URL = API_BASE_URL.replace('http://', 'https://');
}

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
