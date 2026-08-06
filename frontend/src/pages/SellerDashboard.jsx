import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Spinner from '../components/common/Spinner';

export default function SellerDashboard({ addToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
       const res = await API.get('/products');

setProducts(res.data?.products || []);
      } catch (err) {
        addToast?.('Failed to load seller inventory', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [addToast]);

  if (loading) return <Spinner label="Loading Seller Dashboard..." />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-8 px-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-xl border border-amber-500/20 bg-gray-900 p-6 shadow-xl shadow-black/20">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Merchant Workspace</p>
          <h1 className="mt-1 text-3xl font-black sm:text-4xl">Seller Dashboard</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <p className="text-xs font-bold uppercase text-gray-500">My Listed Products</p>
            <p className="mt-2 text-3xl font-black text-amber-400">{products.length}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <p className="text-xs font-bold uppercase text-gray-500">Store Status</p>
            <p className="mt-2 text-3xl font-black text-emerald-400">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
