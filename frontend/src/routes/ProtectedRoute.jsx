import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner label="Authenticating..." />;
  }

  // 1. Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If a specific role is required for this route
  if (requiredRole) {
    // User's role must be either the required role or 'admin'
    const hasPermission = user?.role === requiredRole || user?.role === 'admin';

    if (!hasPermission) {
      // User is logged in but not authorized for this specific role.
      // Redirect them to the home page.
      return <Navigate to="/" replace />;
    }
  }

  // 3. If all checks pass, render the nested routes
  return children ? <>{children}</> : <Outlet />;
}
