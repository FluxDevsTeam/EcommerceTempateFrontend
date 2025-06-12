import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_URL = 'https://api.kidsdesigncompany.com';

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

// Add these helper functions at the top of the file
const isNetworkError = (error: any): boolean => {
  return !error.response && !error.status && error.message === 'Network Error';
};

const handleServiceError = (error: any): never => {
  if (isNetworkError(error)) {
    throw new Error('Unable to connect to the server. Please check your internet connection.');
  }
  
  // Handle other types of errors
  const message = error.response?.data?.message || error.message;
  throw new Error(message || 'An unexpected error occurred');
};

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
          
          // Update the original request with the new token using JWT format
          originalRequest.headers['Authorization'] = `JWT ${response.access_token}`;
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
      config.headers.Authorization = `JWT ${token}`;
      
      // For debugging
      
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const authService = {
  // Signup
  signup: async (userData: UserSignup): Promise<any> => {
    
    try {
      const response = await api.post('/auth/signup/', userData);
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Resend OTP for signup
  resendSignupOTP: async (email: string): Promise<any> => {
    try {
      
      const response = await api.post('/auth/signup/resend-otp/', { email });
      
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Verify OTP for signup
  verifySignupOTP: async (email: string, otp: string): Promise<any> => {
    try {
      
      const response = await api.post('/auth/signup/verify-otp/', { email, otp });
      
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Login
  login: async (credentials: Login): Promise<AuthResponse> => {
    try {
      
      const response = await api.post<AuthResponse>('/auth/login/', credentials);
      
      // Store tokens in localStorage
      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
      } else if (response.data.access) { // Fallback for backward compatibility
        localStorage.setItem('accessToken', response.data.access);
      }
      
      if (response.data.refresh_token) {
        localStorage.setItem('refreshToken', response.data.refresh_token);
      } else if (response.data.refresh) { // Fallback for backward compatibility
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      
      // Fetch user profile after storing the token
      try {
        const userResponse = await authService.getUserProfile();
        
        // Return combined data
        return {
          ...response.data,
          user: userResponse
        };
      } catch (profileError) {
        
      }
      
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Refresh token
  refreshToken: async (data: RefreshToken): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh/', { refresh_token: data.refresh });
      
      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
      } else if (response.data.access) { // Fallback for backward compatibility
        localStorage.setItem('accessToken', response.data.access);
      }
      
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
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
      const frontendUrl = 'https://kidsdesigncompany.com/change-password';
      
      // Pass the frontend URL to the backend so it knows where to send users
      const response = await api.post('/auth/forgot-password/request-forgot-password/', { 
        email,
        reset_url: `${frontendUrl}?email=${encodeURIComponent(email)}`
      });
      
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Resend OTP for forgot password
  resendForgotPasswordOTP: async (email: string): Promise<any> => {
    try {
      const response = await api.post('/auth/forgot-password/resend-otp/', { email });
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Verify OTP for forgot password
  verifyForgotPasswordOTP: async (email: string, otp: string): Promise<any> => {
    try {
      const response = await api.post('/auth/forgot-password/verify-otp/', { email, otp });
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Set new password after forgot password flow
  setNewPassword: async (data: { email: string; new_password: string; confirm_password: string }): Promise<any> => {
    
    
    try {
      const response = await api.post('/auth/forgot-password/set-new-password/', data);
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Request password change (when logged in)
  requestPasswordChange: async (data: PasswordChange): Promise<any> => {
    try {
      const response = await api.post('/auth/password-change/request-password-change/', data);
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Resend OTP for password change
  resendPasswordChangeOTP: async (): Promise<any> => {
    try {
      const response = await api.post('/auth/password-change/resend-otp/');
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Verify password change with OTP
  verifyPasswordChange: async (otp: string): Promise<any> => {
    try {
      const response = await api.post('/auth/password-change/verify-password-change/', { otp });
      return response.data;
    } catch (error: any) {
      throw handleServiceError(error);
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
    } catch (error: any) {
      throw handleServiceError(error);
    }
  },
  
  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        
        return null;
      }
    }
    
    return null;
  },
  
  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('accessToken') && !!localStorage.getItem('user');
  }

  
};

export default authService;