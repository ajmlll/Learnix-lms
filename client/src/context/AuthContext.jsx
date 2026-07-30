import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, logout, setUser, setToken } from '../store/slices/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, role, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  // Handle unauthorized 401 event dispatched by API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
    };
    window.addEventListener('learnix:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('learnix:unauthorized', handleUnauthorized);
  }, [dispatch]);

  const login = async (email, password) => {
    const res = await dispatch(loginUser({ email, password })).unwrap();
    return res.user;
  };

  const register = async (name, email, password, role = 'student') => {
    const res = await dispatch(registerUser({ name, email, password, role })).unwrap();
    return res.user;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSetUser = (u) => {
    dispatch(setUser(u));
  };

  const value = {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout: handleLogout,
    setUser: handleSetUser,
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

export default AuthContext;
