import React, { useState, useEffect, useCallback, useRef } from 'react';
import userService from '../../services/userService';
import DataTable from '../../components/admin/DataTable';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';

export default function ManagerUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isInitialMount = useRef(true);

  const fetchUsers = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await userService.getUsers({ page, limit: 10 });
      setUsers(response.users || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setCurrentPage(1);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  if (loading && users.length === 0) return <Spinner label="Loading Users..." />;
  if (error) return <div className="text-red-400 text-center p-8">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">User List (View Only)</h1>
      <DataTable
        headers={[
          { key: 'name', label: 'Full Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ]}
        data={users.map((user) => ({
          name: <span className="font-bold">{user.name}</span>,
          email: <span>{user.email}</span>,
          role: <span className="capitalize">{user.role}</span>,
          status: <StatusBadge status={user.status} />,
        }))}
        noDataMessage="No users found."
      />
      {/* Add PaginationControls if needed */}
    </div>
  );
}