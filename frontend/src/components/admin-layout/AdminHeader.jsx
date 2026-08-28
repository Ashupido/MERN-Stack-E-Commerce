import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, ArrowRightStartOnRectangleIcon as LogoutIcon, XMarkIcon } from '@heroicons/react/24/outline'; // assuming heroicons installed
import { useAuth } from '../../context/AuthContext';

// Simple placeholder avatar URL
const avatarUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

export default function AdminHeader({ toggleMobileSidebar, isMobileSidebarOpen }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-gray-700 bg-gray-900 px-3 py-3 shadow-md sm:px-5 lg:px-6">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 transition hover:bg-gray-700 hover:text-white lg:hidden"
        onClick={toggleMobileSidebar}
        aria-label={isMobileSidebarOpen ? 'Close navigation' : 'Open navigation'}
      >
        <svg
          className={`${isMobileSidebarOpen ? 'hidden' : 'block'} h-5 w-5`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <XMarkIcon className={`${isMobileSidebarOpen ? 'block' : 'hidden'} h-5 w-5`} />
      </button>

      {/* Logo and title */}
      <div className="min-w-0 flex-1">
        <Link to="/admin/dashboard" className="text-xl font-black tracking-tight text-amber-300 sm:text-2xl">
          Pido
        </Link>
        <span className="ml-2 hidden text-sm font-medium text-gray-300 sm:inline">Admin Control Center</span>
      </div>

      {/* Right side icons */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        {/* Notification bell */}
        <button type="button" aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition hover:bg-gray-800 hover:text-white">
          <BellIcon className="h-5 w-5" />
          {/* Example red dot for unread count */}
          <span className="absolute right-2 top-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-900" />
        </button>
        {/* Avatar and name */}
        <div className="flex items-center gap-2">
          <img src={avatarUrl} alt="Admin avatar" className="h-9 w-9 rounded-full border border-gray-600" />
          <span className="hidden max-w-28 truncate text-sm font-medium text-gray-200 sm:inline">{user?.name || 'Admin'}</span>
        </div>
        {/* Logout */}
        <button type="button" onClick={logout} aria-label="Log out" className="flex h-10 items-center justify-center rounded-lg px-2 text-gray-300 transition hover:bg-gray-800 hover:text-white sm:gap-1">
          <LogoutIcon className="h-5 w-5" />
          <span className="hidden text-sm sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
