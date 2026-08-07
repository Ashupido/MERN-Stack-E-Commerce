import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors rounded-lg ${
        isActive ? 'bg-slate-700 text-white' : ''
      }`
    }
  >
    {icon}
    <span className="ml-3">{children}</span>
  </NavLink>
);

export default function SellerLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <aside className="w-64 bg-slate-800 p-4 border-r border-slate-700 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-center">Seller Panel</h2>
        <nav className="flex-grow space-y-2">
          <SidebarLink to="/seller/dashboard" icon={<LayoutDashboard size={20} />}>Dashboard</SidebarLink>
          <SidebarLink to="/seller/products" icon={<Package size={20} />}>My Products</SidebarLink>
          <SidebarLink to="/seller/orders" icon={<ShoppingCart size={20} />}>My Orders</SidebarLink>
          <SidebarLink to="/seller/settings" icon={<Settings size={20} />}>Store Settings</SidebarLink>
        </nav>
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-slate-300 hover:bg-red-800/50 hover:text-white transition-colors rounded-lg"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="bg-slate-950 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}