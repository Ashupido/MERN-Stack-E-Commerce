import { useEffect, useState, useRef, useCallback } from 'react';
import adminService from '../../services/adminService';
import Spinner from '../../components/common/Spinner';
import DataTable from '../../components/admin/DataTable';
import StatsCard from '../../components/admin/StatsCard';
import { ShoppingCart, RefreshCw, Truck, CheckCircle, XCircle } from 'lucide-react';

export default function AdminOrders({ addToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Ref to skip filter effect on initial mount
  const isInitialMount = useRef(true);

  const fetchOrders = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await adminService.getOrders({
        page,
        limit: 10,
        status: filterStatus,
        search: searchTerm,
      });
      setOrders(response.orders || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      addToast?.('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    } // Dependencies for useCallback
  }, [searchTerm, filterStatus, addToast]);

  const fetchStats = async () => {
    try {
      const summary = await adminService.getDashboard();
      setStats(summary);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
    // On filter/search change, reset to page 1. Skip initial mount.
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // This will trigger the pagination useEffect to fetch the data for page 1
      setCurrentPage(1);
    }
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminService.updateOrderStatus(id, status);
      addToast?.('Order updated', 'success');
      fetchOrders(currentPage); // Refresh the current page
    } catch (err) {
      addToast?.('Failed to update order', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'confirmed': return 'text-blue-400';
      case 'shipped': return 'text-cyan-400';
      case 'delivered': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading && orders.length === 0) return <Spinner label="Loading orders" />;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="mb-6 text-4xl font-bold">Order Management</h1>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard icon={<ShoppingCart className="h-6 w-6" />} title="Total Orders" value={stats.totalOrders || 0} />
        <StatsCard icon={<RefreshCw className="h-6 w-6 text-yellow-400" />} title="Pending" value={stats.pendingOrders || 0} />
        <StatsCard icon={<CheckCircle className="h-6 w-6 text-blue-400" />} title="Confirmed/Paid" value={stats.paidOrders || 0} />
        <StatsCard icon={<Truck className="h-6 w-6 text-cyan-400" />} title="Shipped" value={stats.shippedOrders || 0} />
        <StatsCard icon={<XCircle className="h-6 w-6 text-red-400" />} title="Cancelled" value={stats.cancelledOrders || 0} />
      </div>

      {/* Filters */}
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Search orders by ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-4 rounded bg-gray-700 p-2 text-white placeholder-gray-400"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded bg-gray-700 p-2 text-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {orders.length === 0 && !loading ? (
        <div className="text-center text-gray-400 py-10">No orders found for this filter.</div>
      ) : (
        <>
          <DataTable
            headers={[
              { key: 'orderId', label: 'Order ID' },
              { key: 'customer', label: 'Customer' },
              { key: 'date', label: 'Date' },
              { key: 'total', label: 'Total' },
              { key: 'status', label: 'Status' },
              { key: 'actions', label: 'Update Status', align: 'right' },
            ]}
            data={orders.map((o) => ({
              orderId: <span className="font-mono font-bold text-white">#{o._id.slice(-6).toUpperCase()}</span>,
              customer: <span className="text-gray-300">{o.user?.name || 'N/A'}</span>,
              date: <span className="text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>,
              total: <span className="font-bold text-emerald-300">${Number(o.totalAmount || 0).toFixed(2)}</span>,
              status: <span className={`font-bold capitalize ${getStatusColor(o.status)}`}>{o.status}</span>,
              actions: (
                <select
                  value={o.status}
                  onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                  className="rounded-md bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              ),
            }))}
            noDataMessage="No orders found."
          />

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
        </>
      )}
    </div>
  );
}
