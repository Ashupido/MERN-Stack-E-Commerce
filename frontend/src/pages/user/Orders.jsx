import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import Spinner from '../../components/common/Spinner';

export default function Orders({ addToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await orderService.getMyOrders();
        // Backend returns { totalOrders, orders } or array
        const list = Array.isArray(data) ? data : data.orders || [];
        setOrders(list);
      } catch (err) {
        const message = err.response?.data?.error || err.message || 'Failed to load orders';
        setError(message);
        addToast?.(message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [addToast]);

  const getOrderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      case 'confirmed':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
      case 'shipped':
        return 'border-purple-500/30 bg-purple-500/10 text-purple-300';
      case 'delivered':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
      case 'cancelled':
        return 'border-red-500/30 bg-red-500/10 text-red-300';
      default:
        return 'border-gray-700 bg-gray-800 text-gray-300';
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  if (loading) {
    return <Spinner label="Loading order history..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-400">Order History</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
              My Orders
            </h1>
          </div>
          <p className="text-sm font-semibold text-gray-400">
            Total Orders: {orders.length}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/70 p-4 text-center text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-12 text-center shadow-xl shadow-black/20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-gray-400">
              📦
            </div>
            <h2 className="text-xl font-bold text-white">No Orders Found</h2>
            <p className="mt-2 text-gray-400">You have not placed any orders yet.</p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-500"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const total = order.totalAmount || order.total || 0;
              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-xl shadow-black/20"
                >
                  <div className="grid gap-4 border-b border-gray-800 p-5 sm:grid-cols-2 sm:items-center sm:p-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Order ID</p>
                      <p className="mt-1 break-all font-mono text-sm font-semibold text-gray-200">
                        {order._id}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-start gap-3 sm:justify-end">
                      <span className={`rounded-full border px-3.5 py-1 text-xs font-black uppercase tracking-wider ${getPaymentBadge(order.paymentStatus)}`}>
                        Payment: {order.paymentStatus || 'pending'}
                      </span>
                      <span className={`rounded-full border px-3.5 py-1 text-xs font-black uppercase tracking-wider ${getOrderStatusBadge(order.status)}`}>
                        Status: {order.status || 'pending'}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <div className="rounded-lg bg-gray-950 p-4">
                      <p className="text-xs font-bold uppercase text-gray-500">Order Date</p>
                      <p className="mt-1 text-sm font-bold text-white">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-950 p-4">
                      <p className="text-xs font-bold uppercase text-gray-500">Total Amount</p>
                      <p className="mt-1 text-xl font-black text-emerald-300">
                        ETB {Number(total).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 sm:p-6 sm:pt-0">
                    <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-gray-400">
                      Ordered Products ({order.items?.length || 0})
                    </h3>
                    <div className="grid gap-3">
                      {order.items?.map((item, idx) => {
                        const productName = item.name || item.product?.name || 'Product';
                        const price = item.price || item.product?.price || 0;
                        const qty = item.quantity || 1;
                        return (
                          <div
                            key={`${order._id}-${idx}`}
                            className="flex flex-col justify-between gap-2 rounded-lg border border-gray-800/80 bg-gray-950 p-4 sm:flex-row sm:items-center"
                          >
                            <div>
                              <p className="font-bold text-white">{productName}</p>
                              <p className="mt-1 text-xs text-gray-400">
                                Quantity: <span className="font-bold text-gray-200">{qty}</span> x ETB {Number(price).toFixed(2)}
                              </p>
                            </div>
                            <p className="text-base font-black text-emerald-300 sm:text-right">
                              ETB {(qty * price).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
