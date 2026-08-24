import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const getDashboardRoute = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'seller':
      return '/seller/dashboard';
    case 'user':
      return '/';
    default:
      return '/';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    try {
      const data = await authService.login(email, password);
      const userData = data.user || data;

      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }

      if (userData) {
        const role = userData.role || userData.user?.role;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        const targetPath = getDashboardRoute(role);
        navigate(targetPath, { replace: true });
      }

      window.dispatchEvent(new Event('auth-updated'));
      return data;
    } catch (err) {
      throw err;
    }
  };

  const handleRegister = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    const userData = data.user || data;

    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }

    if (userData) {
      const role = userData.role || userData.user?.role;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      const targetPath = getDashboardRoute(role);
      navigate(targetPath, { replace: true });
    }

    window.dispatchEvent(new Event('auth-updated'));
    return data;
  };

  const handleOAuthLogin = useCallback(async (oauthToken) => {
    localStorage.setItem('token', oauthToken);
    setToken(oauthToken);
    const profile = await authService.getProfile();
    localStorage.setItem('user', JSON.stringify(profile));
    setUser(profile);
    navigate(getDashboardRoute(profile.role), { replace: true });
    window.dispatchEvent(new Event('auth-updated'));
    return profile;
  }, [navigate]);

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
    navigate('/login'); // Redirect to login page after logout
  };

  const value = {
    user,
    token,
    loading,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    login: handleLogin,
    loginWithToken: handleOAuthLogin,
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
