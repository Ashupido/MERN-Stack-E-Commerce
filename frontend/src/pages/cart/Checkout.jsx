import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import Spinner from '../../components/common/Spinner';
import { normalizeProductImageUrl } from '../../utils/helpers';

export default function Checkout({ addToast }) {
  const { cart, cartTotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePayWithChapa = async () => {
    setError('');

    if (!cart || cart.length === 0) {
      setError('Your cart is empty. Add products before checking out.');
      addToast?.('Cart is empty', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Order
      addToast?.('Creating order...', 'info');
      const orderRes = await orderService.checkout();
      const order = orderRes.order;

      if (!order || !order._id) {
        throw new Error('Order creation failed. Please try again.');
      }

      // Step 2: Initialize Chapa Payment
      addToast?.('Initializing Chapa payment...', 'info');
      const paymentRes = await paymentService.initializePayment(order._id);

      if (paymentRes.checkout_url) {
        addToast?.('Redirecting to Chapa payment portal...', 'success');
        // Redirect to Chapa payment page
        window.location.href = paymentRes.checkout_url;
      } else {
        throw new Error('Failed to obtain Chapa checkout URL.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Checkout failed';
      setError(msg);
      addToast?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner label="Processing checkout and connecting to Chapa payment portal..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Order Confirmation</p>
          <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">Checkout</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/70 p-4 text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {/* Customer & Address Details */}
          <div className="space-y-6 md:col-span-2">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/20">
              <h2 className="border-b border-gray-800 pb-3 text-lg font-black text-white">
                Customer Information
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Name</p>
                  <p className="mt-1 text-base font-bold text-white">{user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Email</p>
                  <p className="mt-1 text-base font-bold text-white">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Phone</p>
                  <p className="mt-1 text-base font-bold text-white">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Shipping Address</p>
                  <p className="mt-1 text-base font-bold text-white">{user?.address || 'Standard Delivery'}</p>
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/20">
              <h2 className="border-b border-gray-800 pb-3 text-lg font-black text-white">
                Items in Order ({cart.length})
              </h2>
              <div className="mt-4 divide-y divide-gray-800">
                {cart.map((item) => (
                  <div key={item._id || item.productId} className="flex justify-between py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-500/10 text-blue-200 ring-1 ring-blue-400/20">
                        <Package className="h-5 w-5" />
                        {normalizeProductImageUrl(item.image || item.images?.[0] || item.product?.image || item.product?.images?.[0]) && (
                          <img
                            src={normalizeProductImageUrl(item.image || item.images?.[0] || item.product?.image || item.product?.images?.[0])}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={(event) => { event.currentTarget.style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-white">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} x ETB {Number(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="font-black text-emerald-300">
                      ETB {(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="md:col-span-1">
            <div className="sticky top-24 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/20">
              <h2 className="text-lg font-black text-white">Payment Method</h2>
              <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <span className="text-lg">💳</span> Chapa Online Payment
                </div>
                <p className="mt-1 text-xs text-gray-300">
                  Supports Telebirr, CBE Birr, Mobile Banking & Cards.
                </p>
              </div>

              <div className="mt-6 border-t border-gray-800 pt-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-200">ETB {cartTotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-400">
                  <span>Total Payable</span>
                  <span className="text-xl font-black text-emerald-300">ETB {cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayWithChapa}
                disabled={loading || cart.length === 0}
                className="mt-6 w-full rounded-lg bg-emerald-500 py-3.5 text-center font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-50"
              >
                Pay with Chapa
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="mt-3 w-full text-center text-xs font-bold text-gray-400 hover:text-white"
              >
                Return to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}