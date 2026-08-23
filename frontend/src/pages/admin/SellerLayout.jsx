import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Menu, Package, ShoppingCart, Settings, LogOut, X } from 'lucide-react';
import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white lg:flex">
      <header className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-4 lg:hidden">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-400">Pido</p>
          <h2 className="text-lg font-black">Seller Panel</h2>
        </div>
        <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-lg p-2 text-slate-200 hover:bg-slate-700" aria-label={mobileMenuOpen ? 'Close seller menu' : 'Open seller menu'} aria-expanded={mobileMenuOpen}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>
      <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} border-b border-slate-700 bg-slate-800 p-4 lg:block lg:w-64 lg:border-b-0 lg:border-r`}>
        <div className="flex h-full flex-col lg:min-h-screen">
        <h2 className="mb-8 text-center text-2xl font-bold">Seller Panel</h2>
        <nav className="flex-grow space-y-2" onClick={closeMobileMenu}>
          <SidebarLink to="/seller/dashboard" icon={<LayoutDashboard size={20} />}>Dashboard</SidebarLink>
          <SidebarLink to="/seller/products" icon={<Package size={20} />}>My Products</SidebarLink>
          <SidebarLink to="/seller/orders" icon={<ShoppingCart size={20} />}>My Orders</SidebarLink>
          <SidebarLink to="/seller/settings" icon={<Settings size={20} />}>Store Settings</SidebarLink>
        </nav>
        <div>
          <button
            onClick={() => { closeMobileMenu(); handleLogout(); }}
            className="flex items-center w-full px-4 py-3 text-slate-300 hover:bg-red-800/50 hover:text-white transition-colors rounded-lg"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
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