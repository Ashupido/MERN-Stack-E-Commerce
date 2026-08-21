import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Common
import PublicLayout from '../components/public-layout/PublicLayout';
import AdminLayout from '../components/admin-layout/AdminLayout';
import ManagerLayout from '../components/ManagerLayout/ManagerLayout';
import SellerLayout from '../pages/admin/SellerLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// User Pages
import Profile from '../pages/user/Profile';
import UserOrders from '../pages/user/Orders';

// Cart & Checkout Pages
import Cart from '../pages/cart/Cart';
import Checkout from '../pages/cart/Checkout';
import PaymentSuccess from '../pages/cart/PaymentSuccess';
import Payment from '../pages/payment/Payment';

// Shop Pages
import Products from '../pages/Products';
import ProductDetails from '../pages/shop/ProductDetail';

// Admin / Seller Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AdminOrders from '../pages/admin/Orders';
import AdminUsers from '../pages/admin/Users';
import AdminLogs from '../pages/admin/AdminLogs'; // Assuming this is correct
import AdminSellers from '../pages/admin/sellers'; // Corrected to lowercase 's'
import AdminSettings from '../pages/admin/AdminSettings';
import AdminReports from '../pages/admin/reports'; // Corrected to lowercase 'r'
import SellerDashboard from '../pages/SellerDashboard';
import SellerProducts from '../pages/seller/Products';

// Manager Pages
import ManagerDashboard from '../pages/manager/Dashboard';
import ManagerOrders from '../pages/manager/Orders';
import ManagerProducts from '../pages/manager/Products';
import ManagerUsers from '../pages/manager/Users';

// Guards
import ProtectedRoute from './ProtectedRoute';

import NotFound from '../pages/NotFound';

export default function AppRoutes({ addToast }) {
  return (
    <Routes>
      {/* --- Routes that use the Public Layout --- */}
      <Route element={<PublicLayout />}>
        {/* Publicly Accessible */}
        <Route path="/" element={<Products addToast={addToast} />} />
        <Route path="/products" element={<Products addToast={addToast} />} />
        <Route path="/product/:id" element={<ProductDetails addToast={addToast} />} />
        <Route path="/login" element={<Login addToast={addToast} />} />
        <Route path="/register" element={<Register addToast={addToast} />} />
        <Route path="/cart" element={<Cart addToast={addToast} />} />
        <Route path="/payment" element={<Payment addToast={addToast} />} />

        {/* Authenticated User Routes (that also use the Public Layout) */}
        {/* These are protected and only accessible to the 'user' role */}
        <Route path="/profile" element={<ProtectedRoute requiredRole="user"><Profile addToast={addToast} /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute requiredRole="user"><UserOrders addToast={addToast} /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute requiredRole="user"><Checkout addToast={addToast} /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute requiredRole="user"><PaymentSuccess addToast={addToast} /></ProtectedRoute>} />
      </Route>

      {/* --- Admin Routes (with Admin Layout) --- */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard addToast={addToast} />} />
          <Route path="products" element={<AdminProducts addToast={addToast} />} />
          <Route path="orders" element={<AdminOrders addToast={addToast} />} />
          <Route path="users" element={<AdminUsers addToast={addToast} />} />
          <Route path="logs" element={<AdminLogs addToast={addToast} />} />
          <Route path="sellers" element={<AdminSellers addToast={addToast} />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reports" element={<AdminReports addToast={addToast} />} />
        </Route>
      </Route>

      {/* --- Manager Routes (with Manager Layout) --- */}
      <Route path="/manager" element={<ProtectedRoute requiredRole="manager"/>}>
        <Route element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboard addToast={addToast} />} />
          <Route path="orders" element={<ManagerOrders />} />
          <Route path="products" element={<ManagerProducts />} />
          <Route path="users" element={<ManagerUsers />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      {/* --- Seller Routes (with Seller Layout) --- */}
      <Route path="/seller" element={<ProtectedRoute requiredRole="seller"/>}>
        <Route element={<SellerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboard addToast={addToast} />} />
          <Route path="products" element={<SellerProducts />} />
          {/* Add other seller pages like /seller/products here */}
        </Route>
      </Route>

      {/* --- Fallback Route --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
