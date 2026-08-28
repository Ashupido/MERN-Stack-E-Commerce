import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';
import sellerService from '../../services/sellerService';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import { useToast } from '../../hooks/useToast';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await sellerService.getOrders({ page: currentPage, limit: 10 });
      setOrders(response.orders || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Failed to load orders');
      addToast?.('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      default:
        return <Package className="h-5 w-5 text-blue-400" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <Spinner label="Loading Orders..." />;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Merchant Workspace</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">My Orders</h1>

        {error && (
          <div className="mt-4 rounded-lg border border-red-800 bg-red-900/20 p-4 text-red-400">
            {error}
          </div>
        )}

        {!loading && orders.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
            <ShoppingBag className="mx-auto h-12 w-12 text-amber-400" />
            <h2 className="mt-4 text-xl font-black">No orders yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Orders containing your products will appear here when customers make purchases.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition hover:border-slate-700"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-black text-white">Order #{order._id.slice(-8)}</h3>
                        <p className="text-sm text-slate-400">
                          Customer: {order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 border-t border-slate-800 pt-2">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.name}
                              className="h-12 w-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/no-image.png';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-white">{item.name}</p>
                            <p className="text-sm text-slate-400">
                              Qty: {item.quantity} × ETB {item.price?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <p className="font-bold text-amber-400">
                            ETB {((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-400">Total</p>
                    <p className="text-2xl font-black text-amber-400">
                      ETB {order.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                    <div className="mt-2 flex flex-col gap-2">
                      <StatusBadge status={order.status} />
                      <StatusBadge status={order.paymentStatus} type="payment" />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="font-bold text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
