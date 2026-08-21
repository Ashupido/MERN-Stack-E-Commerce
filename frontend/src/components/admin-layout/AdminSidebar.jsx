// src/components/admin-layout/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Dashboard", to: "/admin/dashboard" },
  { name: "Products", to: "/admin/products" },
  { name: "Orders", to: "/admin/orders" },
  { name: "Users", to: "/admin/users" },
  { name: "Sellers", to: "/admin/sellers" },
  { name: "Reports", to: "/admin/reports" },
  { name: "Logs", to: "/admin/logs" },
  { name: "Settings", to: "/admin/settings" },
];

const AdminSidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-900 p-4 text-gray-100 shadow-2xl transition-transform duration-200 lg:static lg:z-auto lg:min-h-screen lg:translate-x-0 lg:shadow-none ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 flex items-center justify-between lg:justify-center">
          <img src="/logo_white.png" alt="Pido Logo" className="h-10" />
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="rounded-md p-2 text-gray-300 hover:bg-gray-800 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            onClick={closeMobileSidebar}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md hover:bg-gray-800 transition-colors ${
                isActive ? "bg-gray-800 font-semibold" : ""
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
