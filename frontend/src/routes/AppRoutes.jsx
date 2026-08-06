import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Common
import PublicLayout from '../components/public-layout/PublicLayout';
import AdminLayout from '../components/admin-layout/AdminLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// User Pages
import Profile from '../pages/user/Profile';
import Orders from '../pages/user/Orders';

// Cart & Checkout Pages
import Cart from '../pages/cart/Cart';
import Checkout from '../pages/cart/Checkout';
import PaymentSuccess from '../pages/cart/PaymentSuccess';
import Payment from '../pages/payment/Payment';

// Shop Pages
import Products from '../pages/Products';
import ProductDetail from '../pages/shop/ProductDetail';

// Admin / Seller Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AdminOrders from '../pages/admin/Orders';
import AdminUsers from '../pages/admin/Users';
import AdminLogs from '../pages/admin/AdminLogs';
import SellerDashboard from '../pages/SellerDashboard';
// Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import SellerRoute from './SellerRoute';

import NotFound from '../pages/NotFound';

export default function AppRoutes({ addToast }) {
  return (
    <Routes>
      {/* Public routes with common layout */}
      <Route element={<PublicLayout />}> 
        <Route path="/" element={<Products addToast={addToast} />} />
        <Route path="/products" element={<Products addToast={addToast} />} />
        <Route path="/product/:id" element={<ProductDetail addToast={addToast} />} />
        <Route path="/login" element={<Login addToast={addToast} />} />
        <Route path="/register" element={<Register addToast={addToast} />} />
        <Route path="/cart" element={<Cart addToast={addToast} />} />
      </Route>

      {/* Protected user routes */}
      <Route element={<ProtectedRoute><PublicLayout /></ProtectedRoute>}> 
        <Route path="/profile" element={<Profile addToast={addToast} />} />
        <Route path="/orders" element={<Orders addToast={addToast} />} />
        <Route path="/checkout" element={<Checkout addToast={addToast} />} />
<Route path="/payment" element={<Payment addToast={addToast} />} />
<Route path="/payment-success" element={<PaymentSuccess addToast={addToast} />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}> 
        <Route path="/admin/dashboard" element={<AdminDashboard addToast={addToast} />} />
        <Route path="/admin/products" element={<AdminProducts addToast={addToast} />} />
        <Route path="/admin/orders" element={<AdminOrders addToast={addToast} />} />
        <Route path="/admin/users" element={<AdminUsers addToast={addToast} />} />
        <Route path="/admin/logs" element={<AdminLogs addToast={addToast} />} />
      </Route>

      {/* Seller routes */}
      <Route element={<SellerRoute><PublicLayout /></SellerRoute>}> 
        <Route path="/seller/dashboard" element={<SellerDashboard addToast={addToast} />} />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
