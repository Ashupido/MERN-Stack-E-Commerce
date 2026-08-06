import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Spinner from '../../components/common/Spinner';
import StatsCard from '../../components/admin/StatsCard';

export default function AdminDashboard({ addToast }) {
  const [metrics, setMetrics] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await adminService.getDashboard();
        setMetrics(data);
      } catch (err) {
        addToast?.('Failed to load admin dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [addToast]);

  if (loading) return <Spinner label="Loading admin dashboard" />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_24%),linear-gradient(135deg,_#111827,_#1f2937_45%,_#030712)] py-6 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-amber-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">Admin Dashboard</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Control Center</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Overview of platform performance and quick actions.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/admin/products" className="rounded-xl bg-amber-500 px-4 py-2.5 font-black text-slate-950 transition hover:bg-amber-400">
              Manage Products
            </Link>
            <Link to="/admin/users" className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 font-black text-white transition hover:bg-white/20">
              Manage Users
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Total Users" value={metrics.users} icon="users" />
          <StatsCard title="Products" value={metrics.products} icon="box" />
          <StatsCard title="Orders" value={metrics.orders} icon="shopping-cart" />
          <StatsCard title="Revenue" value={`$${Number(metrics.revenue).toFixed(2)}`} icon="currency-dollar" />
        </div>
      </div>
    </div>
  );
}
