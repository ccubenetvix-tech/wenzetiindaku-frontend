import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiClient, setAuthState, getApiBaseUrl } from '@/utils/api';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  email: string;
  role: 'customer' | 'vendor';
  verified: boolean;
  approved?: boolean;
  profilePhoto?: string;
  gender?: string;
  address?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  profile_completed?: boolean;
  createdAt: string;
  registrationMethod?: 'google' | 'email';
  // Vendor-specific properties
  businessEmail?: string;
  businessPhone?: string;
  businessWebsite?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  businessType?: string;
  description?: string;
  categories?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'customer' | 'vendor') => Promise<{ user: User; token: string }>;
  signup: (data: any, role: 'customer' | 'vendor') => Promise<void>;
  verifyOTP: (email: string, otp: string, role: 'customer' | 'vendor') => Promise<void>;
  resendOTP: (email: string, role: 'customer' | 'vendor') => Promise<void>;
  googleLogin: () => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setSession: (sessionToken: string, sessionUser: User) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = getApiBaseUrl();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token is still valid
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Auth initialization - User data received:', data);
            if (data.success) {
              setUser(data.data.user);
            }
          } else {
            // Token is invalid, clear auth state
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid auth state
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Keep API client token in sync with auth token
  useEffect(() => {
    apiClient.setToken(token);
  }, [token]);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    apiClient.setToken(null);
  }, []);

  const setSession = useCallback((sessionToken: string, sessionUser: User) => {
    setToken(sessionToken);
    setUser(sessionUser);
    localStorage.setItem('auth_token', sessionToken);
    localStorage.setItem('auth_user', JSON.stringify(sessionUser));
    apiClient.setToken(sessionToken);
  }, []);

  const login = async (email: string, password: string, role: 'customer' | 'vendor') => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/${role}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      if (data.success) {
        setSession(data.data.token, data.data.user);
        return { user: data.data.user, token: data.data.token };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: any, role: 'customer' | 'vendor') => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/${role}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Signup failed');
      }

      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string, role: 'customer' | 'vendor') => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/${role}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'OTP verification failed');
      }

      return data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email: string, role: 'customer' | 'vendor') => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/${role}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to resend OTP');
      }

      return data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useCallback(() => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    window.location.href = '/';
  }, [clearSession]);

  const redirectToLogin = useCallback(() => {
    window.location.href = '/customer/login';
  }, []);

  // Set up auth state for API client
  useEffect(() => {
    setAuthState({
      clearAuth: logout,
      redirectToLogin,
    });
  }, [logout, redirectToLogin]);

  const updateUser = (userData: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    signup,
    verifyOTP,
    resendOTP,
    googleLogin,
    logout,
    updateUser,
    setSession,
    clearSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
