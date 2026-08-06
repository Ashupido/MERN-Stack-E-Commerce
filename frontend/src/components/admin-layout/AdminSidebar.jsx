// src/components/admin-layout/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

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

const AdminSidebar = () => {
  return (
    <aside className="bg-gray-900 text-gray-100 w-64 min-h-screen flex flex-col p-4 hidden lg:block">
      {/* Logo / Brand */}
      <div className="mb-8 flex items-center justify-center">
        <img src="/logo_white.png" alt="Pido Logo" className="h-10" />
      </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
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
  );
};

export default AdminSidebar;
