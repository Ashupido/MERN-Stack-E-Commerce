import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Restore & verify session on startup
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (err) {
          console.error('Session restore error:', err);
          // If token expired/invalid, clear local state
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken('');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (email, password) => {
    const data = await authService.login(email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
    window.dispatchEvent(new Event('auth-updated'));
    return data;
  };

  const handleRegister = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
    window.dispatchEvent(new Event('auth-updated'));
    return data;
  };

  const updateUserProfile = async (updateData) => {
    const response = await authService.updateProfile(updateData);
    if (response.user) {
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      window.dispatchEvent(new Event('auth-updated'));
    }
    return response;
  };

  const handleLogout = () => {
    authService.logout();
    setToken('');
    setUser(null);
    window.dispatchEvent(new Event('auth-updated'));
  };

  const value = {
    user,
    token,
    loading,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    login: handleLogin,
    register: handleRegister,
    updateUserProfile,
    logout: handleLogout,
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

export default AuthContext;
