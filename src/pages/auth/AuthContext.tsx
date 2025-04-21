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
  signup: (userData: SignupData) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  verifySignupOTP: (email: string, otp: string) => Promise<any>;
  resendSignupOTP: (email: string) => Promise<any>;
  requestForgotPassword: (email: string) => Promise<any>;
  resendForgotPasswordOTP: (email: string) => Promise<any>;
  verifyForgotPasswordOTP: (email: string, otp: string) => Promise<any>;
  setNewPassword: (email: string, new_password: string, confirm_password: string) => Promise<any>;
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

  useEffect(() => {
    // Check for existing user session on initial load
    const checkAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error("Authentication check failed", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const signup = async (userData: SignupData): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.signup(userData);
      setTempEmail(userData.email);
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const login = async (email: string, password: string): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.user) {
        setCurrentUser(response.user);
      }
      
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (err: any) {
      console.error("Logout error", err);
    } finally {
      setLoading(false);
    }
  };

  const verifySignupOTP = async (email: string, otp: string): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.verifySignupOTP(email, otp);
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const resendSignupOTP = async (email: string): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.resendSignupOTP(email);
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const requestForgotPassword = async (email: string): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.requestForgotPassword(email);
      setTempEmail(email);
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const resendForgotPasswordOTP = async (email: string): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.resendForgotPasswordOTP(email);
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const verifyForgotPasswordOTP = async (email: string, otp: string): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.verifyForgotPasswordOTP(email, otp);
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const setNewPassword = async (email: string, new_password: string, confirm_password: string): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.setNewPassword({ email, new_password, confirm_password });
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const requestPasswordChange = async (old_password: string, new_password: string, confirm_password: string): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.requestPasswordChange({ 
        old_password, 
        new_password, 
        confirm_password 
      });
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const resendPasswordChangeOTP = async (): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.resendPasswordChangeOTP();
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const verifyPasswordChange = async (otp: string): Promise<any> => {
    setLoading(true);
    
    try {
      const response = await authService.verifyPasswordChange(otp);
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
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