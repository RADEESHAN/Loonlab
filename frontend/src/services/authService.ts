import axios from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';
import config from '../config.json';

const API_URL = config.API_BASE_URL ? `${config.API_BASE_URL}/users` : 'http://localhost:5000/api/users';

// Register user
export const register = async (userData: RegisterCredentials): Promise<User> => {
  try {
    console.log('Making registration request to:', `${API_URL}/register`);
    console.log('With data:', userData);
    
    const response = await axios.post(`${API_URL}/register`, userData);
    
    console.log('Registration API response:', response.data);
    
    if (response.data) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Registration API error:', error.response || error);
    throw error;
  }
};

// Login user
export const login = async (userData: LoginCredentials): Promise<User> => {
  try {
    console.log('Making login request to:', `${API_URL}/login`);
    console.log('With data:', userData);
    
    const response = await axios.post(`${API_URL}/login`, userData);
    
    console.log('Login API response:', response.data);
    
    if (response.data) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login API error:', error.response || error);
    throw error;
  }
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('userInfo');
};

// Get user profile
export const getUserProfile = async (): Promise<User> => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  
  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

// Add movie to favorites
export const addToFavorites = async (movieId: number): Promise<number[]> => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  
  const response = await axios.post(`${API_URL}/favorites`, { movieId }, config);
  
  // Update local storage with new favorites
  const updatedUserInfo = {
    ...userInfo,
    favorites: response.data.favorites,
  };
  localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
  
  return response.data.favorites;
};

// Remove movie from favorites
export const removeFromFavorites = async (movieId: number): Promise<number[]> => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  
  const response = await axios.delete(`${API_URL}/favorites/${movieId}`, config);
  
  // Update local storage with new favorites
  const updatedUserInfo = {
    ...userInfo,
    favorites: response.data.favorites,
  };
  localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
  
  return response.data.favorites;
};

// Get user favorites
export const getFavorites = async (): Promise<number[]> => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  
  const response = await axios.get(`${API_URL}/favorites`, config);
  return response.data.favorites;
};
