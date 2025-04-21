// src/services/authService.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

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


interface SetNewPassword {
  email: string;
  new_password: string;
  confirm_password: string;
}

interface PasswordChange {
  old_password: string;
  new_password: string;
  confirm_password: string;
}


interface RefreshToken {
  refresh_token: string;
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
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried refreshing the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await authService.refreshToken({ refresh_token: refreshToken });
        
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
      console.error("Signup error details:", error.response?.data);
      throw error;
    }
  },
  // Resend OTP for signup
  resendSignupOTP: async (email: string): Promise<any> => {
    const response = await api.post('/auth/signup/resend-otp/', { email });
    return response.data;
  },
  
  // Verify OTP for signup
  verifySignupOTP: async (email: string, otp: string): Promise<any> => {
    const response = await api.post('/auth/signup/verify-otp/', { email, otp });
    return response.data;
  },
  
  // Login
  login: async (credentials: Login): Promise<AuthResponse> => {
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
    
    return response.data;
  },
  
  // Refresh token
  refreshToken: async (data: RefreshToken): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh/', { refresh_token: data.refresh_token });
    
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
    }
    
    return response.data;
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
    const response = await api.post('/auth/forgot-password/request-forgot-password/', { email });
    return response.data;
  },
  
  // Resend OTP for forgot password
  resendForgotPasswordOTP: async (email: string): Promise<any> => {
    const response = await api.post('/auth/forgot-password/resend-otp/', { email });
    return response.data;
  },
  
  // Verify OTP for forgot password
  verifyForgotPasswordOTP: async (email: string, otp: string): Promise<any> => {
    const response = await api.post('/auth/forgot-password/verify-otp/', { email, otp });
    return response.data;
  },
  
  // Set new password after forgot password flow
  setNewPassword: async (data: SetNewPassword): Promise<any> => {
    const response = await api.post('/auth/forgot-password/set-new-password/', data);
    return response.data;
  },
  
  // Request password change (when logged in)
  requestPasswordChange: async (data: PasswordChange): Promise<any> => {
    const response = await api.post('/auth/password-change/request-password-change/', data);
    return response.data;
  },
  
  // Resend OTP for password change
  resendPasswordChangeOTP: async (): Promise<any> => {
    const response = await api.post('/auth/password-change/resend-otp/');
    return response.data;
  },
  
  // Verify password change with OTP
  verifyPasswordChange: async (otp: string): Promise<any> => {
    const response = await api.post('/auth/password-change/verify-password-change/', { otp });
    return response.data;
  },
  
  // Get current user info
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
    return null;
  },
  
  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('accessToken');
  }
};

export default authService;