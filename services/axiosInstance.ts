import { EnvironmentType } from "@/types/env";
import { ENVIRONMENT_VARIABLES } from "@/utils/env";
import axios from "axios";

const baseURL = (() => {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT as EnvironmentType || 'development';

  const api_url = ENVIRONMENT_VARIABLES.find(envVar => envVar.api_url !== undefined || envVar.environment_type === env)?.api_url;

  return api_url || 'http://localhost:3000';
})();

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
