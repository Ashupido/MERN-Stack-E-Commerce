import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-950 text-white font-sans overflow-hidden">
      {/* Top Admin Navbar */}
      <AdminNavbar
        toggleMobileSidebar={toggleMobileSidebar}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <AdminSidebar
          isMobileOpen={isMobileSidebarOpen}
          closeMobileSidebar={closeMobileSidebar}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
