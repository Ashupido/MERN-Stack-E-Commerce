import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import Spinner from '../../components/common/Spinner';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import UserForm from '../../components/admin/UserForm'; // Reusing the form component
import StatusBadge from '../../components/common/StatusBadge'; // New StatusBadge component
import { User, Users, UserCheck, UserX, DollarSign, Briefcase } from 'lucide-react'; // Icons for stats

export default function AdminUsers({ addToast }) {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // For create/update operations
  const [error, setError] = useState('');

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0); // For stats

  // State for modals and forms
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // User object being edited
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null); // User object pending deletion
  const [viewingUser, setViewingUser] = useState(null); // User object for details modal

  // Ref to skip filter effect on initial mount
  const isInitialMount = useRef(true);

  // ===============================
  // FETCH USERS
  // ===============================
  const fetchUsers = useCallback(async (page) => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 10,
        search: searchTerm,
        role: filterRole,
        status: filterStatus,
        sort: 'createdAt_desc',
      };
      const response = await userService.getUsers(params);
      setUsers(response.users || []);
      setTotalUsersCount(response.totalUsers || 0);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError('Failed to load users.');
      addToast?.('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterRole, filterStatus, addToast]);

  // ===============================
  // FETCH USER STATISTICS (derived from fetchUsers for now)
  // ===============================
  const userStats = useMemo(() => {
    const active = users.filter(u => u.status === 'active').length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    const sellers = users.filter(u => u.role === 'seller').length;
    const managers = users.filter(u => u.role === 'manager').length;
    const admins = users.filter(u => u.role === 'admin').length;

    return {
      total: totalUsersCount,
      active,
      inactive,
      sellers,
      managers,
      admins,
    };
  }, [users, totalUsersCount]);

  // ===============================
  // EFFECTS
  // ===============================
  useEffect(() => {
    // On filter/search change, reset to page 1.
    // Skip initial mount to prevent double fetch on load.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // Let the currentPage useEffect handle the initial fetch
    } else {
      // If filters change, always reset to page 1.
      setCurrentPage(1); // This will trigger the other useEffect to fetch page 1
    }
  }, [searchTerm, filterRole, filterStatus]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]); // fetchUsers is a dependency because it's called here

  // ===============================
  // HANDLERS
  // ===============================
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreateEditSubmit = async (userData) => {
    setSaving(true);
    try {
      if (editingUser) {
        await userService.updateUser(editingUser._id, userData);
        addToast?.('User updated successfully', 'success');
      } else {
        await userService.createUser(userData);
        addToast?.('User created successfully', 'success');
      }
      setShowUserForm(false);
      setEditingUser(null);
      fetchUsers(currentPage); // Refresh current page
    } catch (err) {
      console.error('User operation failed:', err);
      addToast?.(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteUser) return;
    try {
      await userService.deleteUser(pendingDeleteUser._id);
      addToast?.('User deleted successfully', 'success');
      setPendingDeleteUser(null);
      fetchUsers(currentPage); // Refresh current page
    } catch (err) {
      console.error('User deletion failed:', err);
      addToast?.(err.response?.data?.message || 'Deletion failed', 'error');
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await userService.updateUser(user._id, { status: newStatus });
      addToast?.(`User ${user.name} set to ${newStatus}`, 'success');
      fetchUsers(currentPage); // Refresh current page
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      addToast?.(err.response?.data?.message || 'Failed to change status', 'error');
    }
  };

  const handleViewDetails = (user) => {
    setViewingUser(user);
    // In a real app, you might fetch full details here if not already available
  };

  if (loading && users.length === 0) {
    return <Spinner label="Loading users" />;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="mb-6 text-4xl font-bold">User Management</h1>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-6 w-6" />} title="Total Users" value={userStats.total} />
        <StatCard icon={<UserCheck className="h-6 w-6 text-green-400" />} title="Active Users" value={userStats.active} />
        <StatCard icon={<UserX className="h-6 w-6 text-red-400" />} title="Inactive Users" value={userStats.inactive} />
        <StatCard icon={<Briefcase className="h-6 w-6 text-purple-400" />} title="Sellers/Managers" value={userStats.sellers + userStats.managers} />
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-500/30 bg-red-950/70 p-4 text-sm font-semibold text-red-100">
          {error}
        </div>
      )}

      {/* Controls: Add User, Search, Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => {
            setShowUserForm(true);
            setEditingUser(null);
          }}
          className="rounded bg-cyan-500 px-5 py-3 text-black font-bold"
        >
          Add New User
        </button>

        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded bg-gray-700 p-2 text-white placeholder-gray-400"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded bg-gray-700 p-2 text-white"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded bg-gray-700 p-2 text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          initialData={editingUser}
          onSubmit={handleCreateEditSubmit}
          onCancel={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
          saving={saving}
        />
      )}

      {/* User Details Modal */}
      {viewingUser && (
        <Modal
          isOpen={true}
          onClose={() => setViewingUser(null)}
          title="User Details"
          hideConfirmButton
        >
          <UserDetails user={viewingUser} />
        </Modal>
      )}

      {/* User Table */}
      {users.length === 0 && !loading ? (
        <div className="text-center text-gray-400 py-10">No users found.</div>
      ) : (
        <DataTable
          headers={[
            { key: 'avatar', label: 'Avatar' },
            { key: 'name', label: 'Full Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'role', label: 'Role' },
            { key: 'status', label: 'Status' },
            { key: 'createdAt', label: 'Created' },
            { key: 'lastLogin', label: 'Last Login' },
            { key: 'actions', label: 'Actions' },
          ]}
          data={users.map((user) => ({
            avatar: (
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ),
            name: <span className="font-bold">{user.name}</span>,
            email: <span>{user.email}</span>,
            phone: <span>{user.phone || 'N/A'}</span>,
            role: (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                user.role === 'admin' ? 'bg-purple-500' :
                user.role === 'manager' ? 'bg-blue-500' :
                user.role === 'seller' ? 'bg-yellow-500' : 'bg-gray-500'
              } text-white`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            ),
            status: <StatusBadge status={user.status} />,
            createdAt: <span>{new Date(user.createdAt).toLocaleDateString()}</span>,
            lastLogin: <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</span>,
            actions: (
              <>
                <button
                  onClick={() => handleViewDetails(user)}
                  className="mr-2 rounded bg-gray-600 px-3 py-2 text-sm text-white"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setShowUserForm(true);
                  }}
                  className="mr-2 rounded bg-blue-500 px-3 py-2 text-sm text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleStatus(user)}
                  className={`mr-2 rounded ${user.status === 'active' ? 'bg-red-500' : 'bg-green-500'} px-3 py-2 text-sm text-white`}
                >
                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => setPendingDeleteUser(user)}
                  className="rounded bg-red-700 px-3 py-2 text-sm text-white"
                >
                  Delete
                </button>
              </>
            ),
          }))}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded bg-gray-700 px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-bold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded bg-gray-700 px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pendingDeleteUser && (
        <Modal
          isOpen={true}
          onClose={() => setPendingDeleteUser(null)}
          onConfirm={handleDeleteConfirm}
          title="Confirm Delete"
          confirmText="Delete"
        >
          <p>Are you sure you want to delete user "{pendingDeleteUser.name}"?</p>
          <p className="text-sm text-red-400 mt-2">This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}

// ===============================
// Helper Components (can be moved to separate files)
// ===============================

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase text-gray-500">{title}</p>
        {icon}
      </div>
      <p className="mt-2 text-3xl font-black text-amber-400">{value}</p>
    </div>
  );
}

function UserDetails({ user }) {
  return (
    <div className="grid gap-4 text-gray-300">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`}
          alt={user.name}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-white">{user.name}</h3>
          <p className="text-sm text-gray-400">{user.username}</p>
        </div>
      </div>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
      <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
      <p><strong>Status:</strong> <StatusBadge status={user.status} /></p>
      <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
      <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
      {/* Add more details as needed */}
    </div>
  );
}
