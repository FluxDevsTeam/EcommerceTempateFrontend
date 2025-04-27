import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_URL = 'https://ecommercetemplate.pythonanywhere.com';

// Type definitions for API responses
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  message?: string;
  user?: User;
  // For backward compatibility during transition
  access?: string;
  refresh?: string;
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
  refresh: string;
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
        if (response.access_token) {
          localStorage.setItem('accessToken', response.access_token);
          
          // Update the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${response.access_token}`;
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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      
      // Store tokens in localStorage
      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
      }
      if (response.data.refresh_token) {
        localStorage.setItem('refreshToken', response.data.refresh_token);
      }
      
      // Since user data isn't included in login response, fetch it separately
      try {
        // Fetch user profile after storing the token
        const userResponse = await authService.getUserProfile();
        
        // Return combined data
        return {
          ...response.data,
          user: userResponse
        };
      } catch (profileError) {
        console.error("Failed to fetch user profile:", profileError);
      }
      
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
      
      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
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
    console.log("Sending request with payload:", data);
    
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
 
  // Get user profile
  getUserProfile: async (): Promise<User> => {
    try {
      // The interceptor will automatically add the Authorization header
      const response = await api.get<User>('/auth/profile/');
      
      // Update stored user data
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Get profile error:", axiosError.response?.data);
      
      // If it's a 401 error, the interceptor should have already tried refreshing the token
      throw new Error('Failed to fetch user profile');
    }
  },
  
  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error("Error parsing user data:", e);
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