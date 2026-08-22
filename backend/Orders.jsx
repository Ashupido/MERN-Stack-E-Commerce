import React, { useState, useEffect, useCallback, useRef } from 'react';
import adminService from '../../services/adminService'; // Re-use admin service for fetching orders
import managerService from '../../services/managerService'; // Use manager service for updates
import DataTable from '../../components/admin/DataTable';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../contexts/ToastContext';

export default function ManagerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const isInitialMount = useRef(true);

  const fetchOrders = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await adminService.getOrders({ page, limit: 10 });
      setOrders(response.orders || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError('Failed to load orders.');
      addToast?.('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setCurrentPage(1);
    }
  }, []);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await managerService.updateOrderStatus(id, status);
      addToast?.('Order status updated successfully', 'success');
      fetchOrders(currentPage); // Refresh data
    } catch (err) {
      addToast?.('Failed to update order status', 'error');
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

  if (loading && orders.length === 0) return <Spinner label="Loading Orders..." />;
  if (error) return <div className="text-red-400 text-center p-8">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Order Management</h1>
      <DataTable
        headers={[
          { key: 'orderId', label: 'Order ID' },
          { key: 'customer', label: 'Customer' },
          { key: 'date', label: 'Date' },
          { key: 'total', label: 'Total' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Update Status' },
        ]}
        data={orders.map((o) => ({
          orderId: <span className="font-mono">#{o._id.slice(-6).toUpperCase()}</span>,
          customer: <span>{o.user?.name || 'N/A'}</span>,
          date: <span>{new Date(o.createdAt).toLocaleDateString()}</span>,
          total: <span className="font-bold text-emerald-400">${Number(o.totalAmount || 0).toFixed(2)}</span>,
          status: <span className={`font-bold capitalize ${getStatusColor(o.status)}`}>{o.status}</span>,
          actions: (
            <select
              value={o.status}
              onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
              className="rounded-md bg-slate-800 px-2 py-1 text-sm text-white border border-slate-700 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value: "paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          ),
        }))}
        noDataMessage="No orders found."
      />
      {/* Add PaginationControls if needed */}
    </div>
  );
}