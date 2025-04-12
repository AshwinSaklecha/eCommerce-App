import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
import AuthService from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(AuthService.isAuthenticated());

  useEffect(() => {
    const loadUser = async () => {
      if (!AuthService.isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const user = await AuthService.getCurrentUser();
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to load user:', error);
        setError('Failed to authenticate user');
        AuthService.logout();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = () => {
    window.location.href = AuthService.getGoogleAuthUrl();
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 