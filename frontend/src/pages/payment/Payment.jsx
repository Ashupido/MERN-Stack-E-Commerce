import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import paymentService from '../../services/paymentService';
import orderService from '../../services/orderService';
import Spinner from '../../components/common/Spinner';

export default function Payment({ addToast }) {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(true);

  // Fetch order details
  useEffect(() => {
    if (!orderId) {
      setError('Order ID missing');
      addToast?.('Invalid order reference', 'error');
      setOrderLoading(false);
      return;
    }
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(orderId);
        setOrder(data);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to fetch order';
        setError(msg);
        addToast?.(msg, 'error');
      } finally {
        setOrderLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePayNow = async () => {
    if (!orderId) return;
    setLoading(true);
    setError('');
    try {
      addToast?.('Initializing Chapa payment...', 'info');
      const res = await paymentService.initializePayment(orderId);
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        throw new Error('Checkout URL not received');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Payment initialization failed';
      setError(msg);
      addToast?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading || orderLoading) {
    return <Spinner label="Loading..." />;
  }

  // Guard against missing order
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Unable to load order details.</p>
        <button onClick={() => navigate('/')} className="ml-4 underline">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mt-4 text-3xl font-black text-white">Payment</h1>
        {error && (
          <div className="my-4 rounded-lg bg-red-900 p-3 text-sm text-red-100">{error}</div>
        )}
        <div className="grid gap-8 md:grid-cols-3 mt-6">
          {/* Left side: Delivery & Items */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
              <h2 className="mb-2 text-lg font-black text-white">Delivery Information</h2>
              <p className="text-gray-300">{user?.name || 'N/A'}</p>
              <p className="text-gray-300">{user?.email || 'N/A'}</p>
              <p className="text-gray-300">{user?.address || 'Standard Delivery'}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
              <h2 className="mb-2 text-lg font-black text-white">Order Items</h2>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-white">{item.name} x {item.quantity}</span>
                  <span className="text-emerald-300">ETB {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right side: Summary & Pay */}
          <div className="sticky top-24 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-black text-white">Order Summary</h2>
            <div className="flex justify-between text-gray-400 mb-2">
              <span>Subtotal</span>
              <span className="font-bold text-gray-200">ETB {order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400 mb-4">
              <span>Shipping</span>
              <span className="font-bold text-gray-200">Free</span>
            </div>
            <div className="flex justify-between text-xl font-black text-emerald-300 mb-6">
              <span>Total</span>
              <span>ETB {order.totalAmount.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePayNow}
              disabled={loading}
              className="w-full rounded-lg bg-emerald-500 py-3 font-black text-slate-950 transition hover:bg-emerald-400"
            >
              Pay with Chapa
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="mt-3 w-full text-sm font-bold text-gray-400 hover:text-white"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
