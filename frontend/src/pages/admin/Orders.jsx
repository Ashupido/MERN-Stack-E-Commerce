import { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Spinner from '../../components/common/Spinner';
import DataTable from '../../components/admin/DataTable'; // Assuming DataTable component exists
export default function AdminOrders({ addToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminOrders(); // Corrected to use adminService
      setOrders(res.data);
    } catch (err) {
      addToast?.('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status });
      await adminService.updateOrderStatus(id, status);
      addToast?.('Order updated', 'success');
      fetchOrders();
    } catch (err) {
      addToast?.('Failed to update order', 'error');
    }
  };

  if (loading) return <Spinner label="Loading orders" />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-black text-white">Order Management</h1>

        <DataTable
          headers={[
            { key: 'orderId', label: 'Order ID' },
            { key: 'customer', label: 'Customer' },
            { key: 'products', label: 'Products' },
            { key: 'total', label: 'Total' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions', align: 'right' },
          ]}
          data={orders.map((o) => ({
            orderId: <span className="font-bold text-white">#{o._id.slice(-6)}</span>,
            customer: <span className="text-gray-300">{o.user?.name || 'N/A'}</span>,
            products: (
              <ul className="list-disc list-inside text-gray-400 text-sm">
                {o.items.map((item, idx) => (
                  <li key={idx}>
                    {item.product?.name || 'Product'} (x{item.quantity})
                  </li>
                ))}
              </ul>
            ),
            total: <span className="text-emerald-300">${Number(o.total || 0).toFixed(2)}</span>,
            status: <span className="text-gray-300 capitalize">{o.status}</span>,
            actions: (
              <select
                value={o.status}
                onChange={(e) => updateStatus(o._id, e.target.value)}
                className="mr-2 rounded-md bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ),
          }))}
          noDataMessage="No orders found."
        />
      </div>
    </div>
  );
}
