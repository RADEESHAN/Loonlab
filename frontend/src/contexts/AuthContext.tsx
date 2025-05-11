import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginCredentials, RegisterCredentials } from '../types/auth';
import * as authService from '../services/authService';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);
  // Login user
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Sending login request:', credentials);
      const data = await authService.login(credentials);
      console.log('Login response:', data);
      
      setUser(data);
      setIsAuthenticated(true);
      setLoading(false);
      return data; // Return the data to the component
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
      throw error; // Propagate the error to the component
    }
  };
  // Register user
  const register = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Sending registration request:', credentials);
      const data = await authService.register(credentials);
      console.log('Registration response:', data);
      
      setUser(data);
      setIsAuthenticated(true);
      setLoading(false);
      return data; // Return the data to the component
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
      throw error; // Propagate the error to the component
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Add to favorites
  const addToFavorites = async (movieId: number) => {
    try {
      if (!user) return;
      
      const favorites = await authService.addToFavorites(movieId);
      
      setUser({
        ...user,
        favorites
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add movie to favorites');
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (movieId: number) => {
    try {
      if (!user) return;
      
      const favorites = await authService.removeFromFavorites(movieId);
      
      setUser({
        ...user,
        favorites
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to remove movie from favorites');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        addToFavorites,
        removeFromFavorites
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
