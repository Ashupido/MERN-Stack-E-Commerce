import React, { useState, useEffect, useCallback, useRef } from 'react';
import managerService from '../../services/managerService';
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
      const response = await managerService.getUsers({ page, limit: 10 });
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-semibold text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-md bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
