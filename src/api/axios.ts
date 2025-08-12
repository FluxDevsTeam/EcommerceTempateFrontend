import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "http://your-api-url.com/api",
});

// Request interceptor to add token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

// Response interceptor to handle 403 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || !localStorage.getItem("accessToken")) {
      // Clear auth state and redirect
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // Full reload to reset state
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;