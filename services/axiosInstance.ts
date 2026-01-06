import axios from "axios";

// URL base da API - usa variável de ambiente ou fallback para localhost
const baseURL = process.env.NEXT_PUBLIC_API_URL || 
                process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL || 
                'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors here
    return Promise.reject(error);
  }
);

export default axiosInstance;
