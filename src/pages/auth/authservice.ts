// src/services/authService.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_URL = 'https://ecommercetemplate.pythonanywhere.com'; // Replace with your actual API base URL

// Type definitions for API responses
interface AuthResponse {
  access: string;
  refresh: string;
  user?: User;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface UserSignup {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  verify_password: string;
}

interface PasswordChange {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface RefreshToken {
  refresh: string; // Changed from refresh_token to match API usage
}

interface Login {
  email: string;
  password: string;
}

// Create typed axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor for handling token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If the error is 401 and we haven't tried refreshing the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await authService.refreshToken({ refresh: refreshToken });
        
        // If refresh successful, update tokens
        if (response.access) {
          localStorage.setItem('accessToken', response.access);
          
          // Update the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${response.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        authService.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
  
const authService = {
  // Signup
  signup: async (userData: UserSignup): Promise<any> => {
    console.log("Signup payload:", JSON.stringify(userData, null, 2));
    try {
      const response = await api.post('/auth/signup/', userData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Signup error details:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Resend OTP for signup
  resendSignupOTP: async (email: string): Promise<any> => {
    try {
      console.log(`API call - Resend OTP for: ${email}`);
      const response = await api.post('/auth/signup/resend-otp/', { email });
      console.log('Resend OTP response:', response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Resend OTP error:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Verify OTP for signup
  verifySignupOTP: async (email: string, otp: string): Promise<any> => {
    try {
      console.log(`API call - Verify OTP for: ${email} with code: ${otp}`);
      const response = await api.post('/auth/signup/verify-otp/', { email, otp });
      console.log('Verify OTP response:', response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Verify OTP error:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Login
  login: async (credentials: Login): Promise<AuthResponse> => {
    try {
      console.log(`API call - Login with email: ${credentials.email}`);
      const response = await api.post<AuthResponse>('/auth/login/', credentials);
      
      // Store tokens in localStorage or secure storage
      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
      }
      if (response.data.refresh) {
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      
      // If user data is included, store it
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Login error:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Refresh token
  refreshToken: async (data: RefreshToken): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh/', { refresh_token: data.refresh });
      
      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
      }
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Token refresh error:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Logout
  logout: async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage, even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
  
  // Forgot password request
  requestForgotPassword: async (email: string): Promise<any> => {
    try {
      const frontendUrl = 'http://localhost:5173/change-password';
      
      // Pass the frontend URL to the backend so it knows where to send users
      const response = await api.post('/auth/forgot-password/request-forgot-password/', { 
        email,
        reset_url: `${frontendUrl}?email=${encodeURIComponent(email)}`
      });
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Forgot password request error:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Resend OTP for forgot password
  resendForgotPasswordOTP: async (email: string): Promise<any> => {
    try {
      const response = await api.post('/auth/forgot-password/resend-otp/', { email });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Resend forgot password OTP error:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Verify OTP for forgot password
  verifyForgotPasswordOTP: async (email: string, otp: string): Promise<any> => {
    try {
      const response = await api.post('/auth/forgot-password/verify-otp/', { email, otp });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Verify forgot password OTP error:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Set new password after forgot password flow
  setNewPassword: async (data: { email: string; new_password: string; confirm_password: string }): Promise<any> => {
    console.log("Sending request with payload:", data); // Log the payload
    
    try {
      const response = await api.post('/auth/forgot-password/set-new-password/', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Set new password error:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Request password change (when logged in)
  requestPasswordChange: async (data: PasswordChange): Promise<any> => {
    try {
      const response = await api.post('/auth/password-change/request-password-change/', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Request password change error:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Resend OTP for password change
  resendPasswordChangeOTP: async (): Promise<any> => {
    try {
      const response = await api.post('/auth/password-change/resend-otp/');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Resend password change OTP error:", axiosError.response?.data);
      throw error;
    }
  },
  
  // Verify password change with OTP
  verifyPasswordChange: async (otp: string): Promise<any> => {
    try {
      const response = await api.post('/auth/password-change/verify-password-change/', { otp });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Verify password change error:", axiosError.response?.data);
      throw error;
    }
  },
 
  // Get current user info
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  },
  
  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('accessToken');
  }
};

export default authService;