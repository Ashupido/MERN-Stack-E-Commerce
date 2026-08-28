import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, CreditCard, Package, Truck } from 'lucide-react';
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
        return 'border-amber-400/30 bg-amber-400/10 text-amber-300';
      case 'confirmed':
        return 'border-sky-400/30 bg-sky-400/10 text-sky-300';
      case 'processing':
        return 'border-indigo-400/30 bg-indigo-400/10 text-indigo-300';
      case 'shipped':
        return 'border-violet-400/30 bg-violet-400/10 text-violet-300';
      case 'delivered':
        return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300';
      case 'cancelled':
        return 'border-rose-400/30 bg-rose-400/10 text-rose-300';
      default:
        return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30';
      case 'pending':
        return 'bg-amber-400/10 text-amber-300 border-amber-400/30';
      case 'failed':
        return 'bg-rose-400/10 text-rose-300 border-rose-400/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const formatDate = (date) => date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Date unavailable';

  if (loading) {
    return <Spinner label="Loading order history..." />;
  }

  return (
    <div className="min-h-screen bg-white py-6 text-slate-950 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">Order History</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">My Orders</h1>
          </div>
          <div className="w-fit rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Orders</p>
            <p className="mt-1 text-xl font-black text-slate-950">{orders.length}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/70 p-4 text-center text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-200/60 sm:p-12">
            <Package className="mx-auto h-14 w-14 text-slate-500" />
            <h2 className="text-xl font-bold text-slate-950">No Orders Found</h2>
            <p className="mt-2 text-slate-500">You have not placed any orders yet.</p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-500"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => {
              const total = Number(order.totalAmount || order.total || 0);
              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60"
                >
                  <header className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Order ID</p>
                      <p className="mt-1 truncate font-mono text-sm font-bold text-slate-700">#{order._id}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-wider ${getPaymentBadge(order.paymentStatus)}`}>
                        <CreditCard className="h-3.5 w-3.5" /> Payment: {order.paymentStatus || 'pending'}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-wider ${getOrderStatusBadge(order.status)}`}>
                        {order.status?.toLowerCase() === 'delivered' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
                        Status: {order.status || 'pending'}
                      </span>
                    </div>
                  </header>

                  <div className="grid gap-3 border-b border-slate-200 p-5 sm:grid-cols-2 sm:p-6">
                    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                      <CalendarDays className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Order Date</p>
                        <p className="mt-1 text-sm font-bold text-slate-900">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 sm:text-right">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Amount</p>
                      <p className="text-xl font-black text-emerald-300">ETB {total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      <Package className="h-4 w-4" />
                      Ordered Products ({order.items?.length || 0})
                    </h3>
                    <div className="grid gap-2">
                      {order.items?.map((item, idx) => {
                        const productName = item.name || item.product?.name || 'Product';
                        const price = Number(item.price || item.product?.price || 0);
                        const qty = Number(item.quantity || 1);
                        const image = item.image || item.images?.[0] || item.product?.image || item.product?.images?.[0];
                        return (
                          <div
                            key={`${order._id}-${idx}`}
                            className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:gap-4"
                          >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-200 text-slate-500">
                              {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <Package className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-bold text-slate-900">{productName}</p>
                              <p className="mt-1 text-xs text-slate-500">Qty: <span className="font-bold text-slate-700">{qty}</span></p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-xs text-slate-500">ETB {price.toFixed(2)} each</p>
                              <p className="mt-1 text-sm font-black text-emerald-300">ETB {(qty * price).toFixed(2)}</p>
                            </div>
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
