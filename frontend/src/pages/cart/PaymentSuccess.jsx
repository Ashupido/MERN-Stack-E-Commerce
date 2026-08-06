import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import { useCart } from '../../context/CartContext';
import Spinner from '../../components/common/Spinner';

export default function PaymentSuccess({ addToast }) {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref') || searchParams.get('trx_ref');
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!txRef) {
        setLoading(false);
        setMessage('No payment transaction reference found.');
        return;
      }

      try {
        setLoading(true);
        const res = await paymentService.verifyPayment(txRef);
        if (res.order) {
          setOrder(res.order);
          setSuccess(true);
          setMessage('Payment verified successfully!');
          await clearCart();
          addToast?.('Payment verified and order placed successfully!', 'success');
        } else {
          setMessage(res.message || 'Payment status unknown.');
        }
      } catch (err) {
        console.error('Payment verification failed:', err);
        const errorMsg = err.response?.data?.message || err.message || 'Payment verification failed';
        setMessage(errorMsg);
        addToast?.(errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [txRef]);

  if (loading) {
    return <Spinner label="Verifying payment status with Chapa..." />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center shadow-2xl shadow-black/40">
        {success ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-4xl text-emerald-400 ring-1 ring-emerald-500/30">
              ✓
            </div>
            <h1 className="mt-6 text-3xl font-black text-white">Payment Successful!</h1>
            <p className="mt-2 text-sm text-gray-400">{message}</p>

            {order && (
              <div className="my-6 rounded-xl border border-gray-800 bg-gray-950 p-4 text-left">
                <p className="text-xs font-bold uppercase text-gray-500">Order Reference</p>
                <p className="mt-1 font-mono text-sm font-bold text-gray-200">{order._id}</p>

                <div className="mt-3 flex justify-between border-t border-gray-800 pt-3 text-sm font-bold">
                  <span className="text-gray-400">Total Paid</span>
                  <span className="text-emerald-300">ETB {Number(order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/orders"
                className="flex-1 rounded-xl bg-emerald-500 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-emerald-400"
              >
                View My Orders
              </Link>
              <Link
                to="/products"
                className="flex-1 rounded-xl border border-gray-700 py-3 text-center text-sm font-bold text-gray-300 transition hover:border-gray-500 hover:bg-white/5"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-4xl text-amber-400 ring-1 ring-amber-500/30">
              ⚠️
            </div>
            <h1 className="mt-6 text-2xl font-black text-white">Payment Verification Issue</h1>
            <p className="mt-2 text-sm text-gray-400">{message}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/orders"
                className="flex-1 rounded-xl bg-amber-400 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-amber-300"
              >
                Check Orders Page
              </Link>
              <Link
                to="/cart"
                className="flex-1 rounded-xl border border-gray-700 py-3 text-center text-sm font-bold text-gray-300 transition hover:border-gray-500 hover:bg-white/5"
              >
                Back to Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
