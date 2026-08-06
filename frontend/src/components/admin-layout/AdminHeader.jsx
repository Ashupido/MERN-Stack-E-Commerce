import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, ArrowRightStartOnRectangleIcon as LogoutIcon } from '@heroicons/react/24/outline'; // assuming heroicons installed

// Simple placeholder avatar URL
const avatarUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

export default function AdminHeader({ toggleMobileSidebar, isMobileSidebarOpen }) {
  return (
    <header className="flex items-center justify-between h-16 bg-gray-800 px-4 shadow-md">
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden text-gray-300 hover:text-white"
        onClick={toggleMobileSidebar}
        aria-label="Toggle navigation"
      >
        {/* Hamburger icon */}
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo and title */}
      <div className="flex items-center space-x-3">
        <Link to="/admin/dashboard" className="text-2xl font-black text-amber-300">
          Pido
        </Link>
        <span className="text-sm font-medium text-gray-300">Admin Control Center</span>
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-4">
        {/* Notification bell */}
        <button className="relative text-gray-300 hover:text-white">
          <BellIcon className="h-5 w-5" />
          {/* Example red dot for unread count */}
          <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500" />
        </button>
        {/* Avatar and name */}
        <div className="flex items-center space-x-2">
          <img src={avatarUrl} alt="Admin avatar" className="h-8 w-8 rounded-full border border-gray-600" />
          <span className="text-sm font-medium text-gray-200">Admin</span>
        </div>
        {/* Logout */}
        <button className="flex items-center text-gray-300 hover:text-white">
          <LogoutIcon className="h-5 w-5" />
          <span className="ml-1 text-sm">Logout</span>
        </button>
      </div>
    </header>
  );
}
