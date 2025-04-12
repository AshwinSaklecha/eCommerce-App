import api from './api';
import { User } from '../types';

export const AuthService = {
  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Handle auth callback
  handleAuthCallback: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get Google auth URL
  getGoogleAuthUrl: (): string => {
    return `${api.defaults.baseURL}/auth/google`;
  },
};

export default AuthService; 