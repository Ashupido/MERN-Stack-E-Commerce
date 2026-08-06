import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar({ toggleMobileSidebar, isMobileSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notificationsList = [
    { id: 1, title: 'New Order Received', time: '5m ago', unread: true },
    { id: 2, title: 'Low Stock Alert for Wireless Headphones', time: '1h ago', unread: true },
    { id: 3, title: 'System Security Audit Completed', time: '3h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-800 bg-gray-900/95 px-4 shadow-md backdrop-blur sm:px-6">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
          aria-label="Toggle Navigation Sidebar"
        >
          {isMobileSidebarOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 font-black text-white shadow-md shadow-cyan-500/20">
            A
          </span>
          <span className="hidden text-lg font-black tracking-wide text-white sm:inline-block">
            Control Center
          </span>
        </div>
      </div>

      {/* Right: Storefront Link, Notifications, Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Storefront Link */}
        <Link
          to="/"
          className="hidden items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-900/50 sm:flex"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Storefront
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
            title="Notifications"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/80">
              <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">Notifications</h3>
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-extrabold text-cyan-400">
                  {notificationsList.filter((n) => n.unread).length} New
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-800/50">
                {notificationsList.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-gray-800/50 transition">
                    <p className="text-xs font-semibold text-gray-200">{notif.title}</p>
                    <p className="mt-1 text-[10px] text-gray-500">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1.5 text-gray-300 transition hover:bg-gray-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 font-bold text-white shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-bold text-white">{user?.name || 'Admin'}</div>
              <div className="text-[10px] font-semibold text-cyan-400 capitalize">{user?.role || 'admin'}</div>
            </div>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-800 bg-gray-900 py-1.5 shadow-2xl shadow-black/80">
              <div className="border-b border-gray-800 px-4 py-2">
                <p className="text-xs font-bold text-white">{user?.name || 'Admin User'}</p>
                <p className="text-[11px] truncate text-gray-400">{user?.email || 'admin@example.com'}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
              >
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-red-400 transition hover:bg-red-950/40 hover:text-red-300"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
