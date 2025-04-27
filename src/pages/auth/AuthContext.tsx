import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from './authservice';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface SignupData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  verify_password: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
  signup: (userData: SignupData) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  verifySignupOTP: (email: string, otp: string) => Promise<any>;
  resendSignupOTP: (email: string) => Promise<any>;
  requestForgotPassword: (email: string) => Promise<any>;
  resendForgotPasswordOTP: (email: string) => Promise<any>;
  verifyForgotPasswordOTP: (email: string, otp: string) => Promise<any>;
  setNewPassword: (data: { email: string; new_password: string; confirm_password: string }) => Promise<any>;
  requestPasswordChange: (old_password: string, new_password: string, confirm_password: string) => Promise<any>;
  resendPasswordChangeOTP: () => Promise<any>;
  verifyPasswordChange: (otp: string) => Promise<any>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tempEmail, setTempEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // Check for existing user session on initial load
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const user = authService.getCurrentUser();
        console.log("getCurrentUser returned:", user);
        
        if (user) {
          console.log("Setting currentUser state with:", user);
          setCurrentUser(user);
        } else {
          console.log("No user found in localStorage");
        }
      } catch (err) {
        console.error("Authentication check failed", err);
        setError("Failed to check authentication status");
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);

  const signup = async (userData: SignupData): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await authService.signup(userData);
      // Store email in localStorage for verification
      localStorage.setItem('signupEmail', userData.email);
      setTempEmail(userData.email);
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const login = async (email: string, password: string): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.user) {
        setCurrentUser(response.user);
      }
      
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (err: any) {
      console.error("Logout error", err);
      setError("Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifySignupOTP = async (email: string, otp: string): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      console.log(`Attempting to verify OTP with email: ${email}, otp: ${otp}`);
      const response = await authService.verifySignupOTP(email, otp);
      console.log('Verification response:', response);
      setLoading(false);
      return response;
    } catch (err: any) {
      console.error('Verification error:', err);
      const errorMessage = err.response?.data?.message || 'Verification failed. Please check the code and try again.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const resendSignupOTP = async (email: string): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      console.log(`Resending OTP to email: ${email}`);
      const response = await authService.resendSignupOTP(email);
      console.log('Resend response:', response);
      setLoading(false);
      return response;
    } catch (err: any) {
      console.error('Resend error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to resend verification code. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const requestForgotPassword = async (email: string): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await authService.requestForgotPassword(email);
      // Store email for verification component
      localStorage.setItem('resetEmail', email);
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to process password reset request. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const resendForgotPasswordOTP = async (email: string): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await authService.resendForgotPasswordOTP(email);
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to resend verification code. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const verifyForgotPasswordOTP = async (email: string, otp: string): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await authService.verifyForgotPasswordOTP(email, otp);
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to verify code. Please check and try again.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const setNewPassword = async (data: { email: string; new_password: string; confirm_password: string }): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await authService.setNewPassword(data);
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to set new password. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const requestPasswordChange = async (old_password: string, new_password: string, confirm_password: string): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await authService.requestPasswordChange({ 
        old_password, 
        new_password, 
        confirm_password 
      });
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to request password change. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const resendPasswordChangeOTP = async (): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await authService.resendPasswordChangeOTP();
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to resend verification code. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const verifyPasswordChange = async (otp: string): Promise<any> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await authService.verifyPasswordChange(otp);
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to verify code. Please check and try again.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    error,
    clearError,
    signup,
    login,
    logout,
    verifySignupOTP,
    resendSignupOTP,
    requestForgotPassword,
    resendForgotPasswordOTP,
    verifyForgotPasswordOTP,
    setNewPassword,
    requestPasswordChange,
    resendPasswordChangeOTP,
    verifyPasswordChange
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};