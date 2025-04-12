import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/auth.service';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      AuthService.handleAuthCallback(token);
      const returnUrl = localStorage.getItem('returnUrl') || '/';
      localStorage.removeItem('returnUrl');
      navigate(returnUrl);
    }
  }, [location, navigate]);

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    // Save return URL if needed
    const returnUrl = new URLSearchParams(location.search).get('returnUrl');
    if (returnUrl) {
      localStorage.setItem('returnUrl', returnUrl);
    }
    login();
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-gray-600 mt-2">
              Sign in to your account to shop, track orders, and more.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              Only approved emails can log in to the platform. Please contact an admin if you need access.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage; 