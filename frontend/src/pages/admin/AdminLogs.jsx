import { useEffect, useState, useCallback, useRef } from 'react';
import { Activity, FileText, AlertTriangle, Info, Shield } from 'lucide-react';
import adminService from '../../services/adminService';
import Spinner from '../../components/common/Spinner';
import DataTable from '../../components/admin/DataTable';

export default function AdminLogs({ addToast }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Ref to skip filter effect on initial mount
  const isInitialMount = useRef(true);

  const fetchLogs = useCallback(async (page) => {
    try {
      setLoading(true);
      setError('');
      const response = await adminService.getAdminLogs({
        page,
        limit: 15,
        level: filterLevel,
        search: searchTerm,
      });
      setLogs(response.logs || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch {
      const errorMessage = 'Failed to load activity logs.';
      setError(errorMessage);
      addToast?.(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterLevel, addToast]);

  useEffect(() => {
    // On filter/search change, reset to page 1. Skip initial mount.
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // This will trigger the pagination useEffect to fetch the data for page 1
      setCurrentPage(1);
    }
  }, [searchTerm, filterLevel]);

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage, fetchLogs]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getLevelVisuals = (level) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return { Icon: AlertTriangle, color: 'text-red-400', label: 'Error' };
      case 'warn':
        return { Icon: AlertTriangle, color: 'text-amber-400', label: 'Warning' };
      case 'auth':
        return { Icon: Shield, color: 'text-blue-400', label: 'Auth' };
      case 'info':
        return { Icon: Info, color: 'text-cyan-400', label: 'Info' };
      default:
        return { Icon: FileText, color: 'text-slate-400', label: 'Log' };
    }
  };

  if (loading && logs.length === 0) return <Spinner label="Loading Logs..." />;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">Audit trail</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">System Activity Logs</h1>
          <p className="mt-2 text-sm text-slate-400">Review administrative events and platform activity in one place.</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-300 sm:self-auto">
          <Activity className="h-4 w-4 text-cyan-400" /> {logs.length} events on this page
        </div>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-900/50 p-4 text-center text-red-200">{error}</div>}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-sm font-semibold text-slate-300">Filter activity</p>
        <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md border-slate-700 bg-slate-800 p-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="rounded-md border-slate-700 bg-slate-800 p-2 text-white focus:border-cyan-500 focus:ring-cyan-500"
        >
          <option value="all">All Levels</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
          <option value="auth">Auth</option>
        </select>
        </div>
      </div>

      {logs.length === 0 && !loading ? (
        <div className="py-10 text-center text-slate-500">No logs found for the current filter.</div>
      ) : (
        <>
          <DataTable
            headers={[
              { key: 'level', label: 'Level' },
              { key: 'action', label: 'Action' },
              { key: 'details', label: 'Details' },
              { key: 'user', label: 'User' },
              { key: 'timestamp', label: 'Timestamp' },
            ]}
            data={logs.map((log) => {
              const { Icon, color, label } = getLevelVisuals(log.level);
              return {
                level: <div className={`flex items-center gap-2 font-semibold ${color}`}><Icon className="h-4 w-4" /> {label}</div>,
                action: <span className="font-bold text-white">{log.action}</span>,
                details: <span className="text-sm text-slate-400">{log.details || log.target || 'N/A'}</span>,
                user: <span className="text-sm text-slate-300">{log.user?.name || 'System'}</span>,
                timestamp: <span className="text-sm text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>,
              };
            })}
          />
          {totalPages > 1 && <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
        </>
      )}
    </div>
  );
}

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="rounded-md bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
        Previous
      </button>
      <span className="font-semibold text-slate-400">
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-md bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
        Next
      </button>
    </div>
  );
}
