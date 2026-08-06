import { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import DataTable from '../../components/admin/DataTable'; // Assuming DataTable component exists

export default function AdminUsers({ addToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminUsers(); // Corrected to use adminService
      setUsers(res.data);
    } catch (err) {
      addToast?.('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role });
      await adminService.updateAdminUserRole(id, role);
      addToast?.('Role updated', 'success');
      fetchUsers();
    } catch (err) {
      addToast?.('Failed to update role', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!pendingDelete) return;
    try {
      await API.delete(`/admin/users/${pendingDelete._id}`);
      await adminService.deleteAdminUser(pendingDelete._id);
      addToast?.('User deleted', 'success');
      setPendingDelete(null);
      fetchUsers();
    } catch (err) {
      addToast?.('Failed to delete user', 'error');
    }
  };

  if (loading) return <Spinner label="Loading users" />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-6">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-6 text-3xl font-black text-white">User Management</h1>

        <DataTable
          headers={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'actions', label: 'Actions', align: 'right' },
          ]}
          data={users.map((u) => ({
            name: <span className="font-bold text-white">{u.name}</span>,
            email: <span className="text-gray-300">{u.email}</span>,
            role: (
              <select
                value={u.role}
                onChange={(e) => updateRole(u._id, e.target.value)}
                className="rounded-md bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            ),
            actions: (
              <button
                onClick={() => setPendingDelete(u)}
                className="rounded-md bg-red-600 px-3 py-1 text-sm font-black text-white transition hover:bg-red-500"
              >
                Delete
              </button>
            ),
          }))}
          noDataMessage="No users found."
        />
      </div>

      <Modal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDeleteUser}
        title="Confirm Delete User"
        confirmText="Delete"
      >
        <p>
          Are you sure you want to delete the user "{pendingDelete?.name}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
