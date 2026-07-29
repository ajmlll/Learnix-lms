import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('learnix_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('learnix_token') || null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('learnix_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('learnix_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('learnix_token', token);
    } else {
      localStorage.removeItem('learnix_token');
    }
  }, [token]);

  // Handle unauthorized 401 event dispatched by API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('learnix_user');
      localStorage.removeItem('learnix_token');
    };
    window.addEventListener('learnix:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('learnix:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      const authenticatedUser = {
        ...data.user,
        id: data.user._id || data.user.id,
      };
      setUser(authenticatedUser);
      setToken(data.token);
      setIsLoading(false);
      return authenticatedUser;
    } catch (err) {
      setIsLoading(false);
      // Strictly rethrow real backend error (e.g. 401 Invalid Credentials)
      throw err;
    }
  };

  const register = async (name, email, password, role = 'student') => {
    setIsLoading(true);
    try {
      const data = await authService.register({ name, email, password, role });
      const authenticatedUser = {
        ...data.user,
        id: data.user._id || data.user.id,
      };
      setUser(authenticatedUser);
      setToken(data.token);
      setIsLoading(false);
      return authenticatedUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('learnix_user');
    localStorage.removeItem('learnix_token');
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
