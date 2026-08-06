import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import AdminLayout from '../components/admin/AdminLayout';

export default function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
        <Spinner label="Verifying admin access..." />
      </div>
    );
  }

  // Guard: must be logged in and admin role
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render admin layout with nested routes
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
