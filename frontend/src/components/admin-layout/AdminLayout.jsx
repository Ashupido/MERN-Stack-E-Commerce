import React from 'react';
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar.jsx";
import { Outlet } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans">
      {/* Header */}
      <AdminHeader toggleMobileSidebar={toggleMobile} isMobileSidebarOpen={mobileOpen} />

      {/* Main area with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar isMobileOpen={mobileOpen} closeMobileSidebar={closeMobile} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
