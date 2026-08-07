import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, ShoppingCart, DollarSign, UserCheck, Package, RefreshCw, Truck, CheckCircle, XCircle } from 'lucide-react';

import adminService from '../../services/adminService';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminDashboard({ addToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');

  // --- Sample Data for UI Development ---
  const sampleDashboardData = {
    totalRevenue: 75940,
    totalOrders: 1250,
    totalUsers: 850,
    activeSellers: 45,
    orderStatusDistribution: [
      { name: 'Pending', value: 40 },
      { name: 'Shipped', value: 300 },
      { name: 'Delivered', value: 890 },
      { name: 'Cancelled', value: 20 },
    ],
    monthlySales: [
      { name: 'Jan', revenue: 4000 },
      { name: 'Feb', revenue: 3000 },
      { name: 'Mar', revenue: 5000 },
      { name: 'Apr', revenue: 4500 },
      { name: 'May', revenue: 6000 },
      { name: 'Jun', revenue: 8200 },
    ],
    recentOrders: [
      { _id: '64a5f1a4b4c1e1d3f4e5f6a7', user: { name: 'John Doe' }, createdAt: new Date().toISOString(), status: 'delivered', totalAmount: 199.99 },
      { _id: '64a5f1a4b4c1e1d3f4e5f6a8', user: { name: 'Jane Smith' }, createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'shipped', totalAmount: 49.50 },
      { _id: '64a5f1a4b4c1e1d3f4e5f6a9', user: { name: 'Peter Jones' }, createdAt: new Date(Date.now() - 172800000).toISOString(), status: 'pending', totalAmount: 250.00 },
      { _id: '64a5f1a4b4c1e1d3f4e5f6b0', user: { name: 'Mary Jane' }, createdAt: new Date(Date.now() - 259200000).toISOString(), status: 'cancelled', totalAmount: 89.00 },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        // In a real app, you'd pass the timeRange to the service
        const dashboardData = await adminService.getDashboard({ period: timeRange });
        // Use real data if available, otherwise fall back to sample data
        if (dashboardData && Object.keys(dashboardData).length > 0) {
          setData(dashboardData);
        } else {
          throw new Error("No data received from API.");
        }
      } catch (err) {
        setError('Failed to load live data. Displaying sample data.');
        setData(sampleDashboardData); // Fallback to sample data on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast, timeRange]);

  const { stats, orderStatusDistribution, monthlySales, recentOrders } = useMemo(() => {
    return {
      stats: {
        totalRevenue: data?.totalRevenue || 0,
        totalOrders: data?.totalOrders || 0,
        totalUsers: data?.totalUsers || 0,
        activeSellers: data?.activeSellers || 0,
      },
      orderStatusDistribution: data?.orderStatusDistribution || [],
      monthlySales: data?.monthlySales || [],
      recentOrders: data?.recentOrders || [],
    };
  }, [data]);

  if (loading && !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Spinner label="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 text-slate-200">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-slate-400">Welcome back! Here's a snapshot of your platform's performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>

        {error && <div className="mb-6 rounded-lg bg-red-900/50 p-4 text-center text-red-200">{error}</div>}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={DollarSign} title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} trend="+2.5%" color="text-emerald-400" />
          <StatCard icon={ShoppingCart} title="Total Orders" value={stats.totalOrders.toLocaleString()} trend="+5.2%" color="text-cyan-400" />
          <StatCard icon={Users} title="Total Users" value={stats.totalUsers.toLocaleString()} trend="+1.8%" color="text-amber-400" />
          <StatCard icon={UserCheck} title="Active Sellers" value={stats.activeSellers.toLocaleString()} trend="-0.5%" color="text-rose-400" />
        </div>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Main Chart */}
          <ChartCard title="Sales Over Time" className="lg:col-span-3">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySales} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} tickLine={{ stroke: '#475569' }} />
                <YAxis tick={{ fill: '#94a3b8' }} tickLine={{ stroke: '#475569' }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} labelStyle={{ color: '#cbd5e1' }} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Line type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Pie Chart */}
          <ChartCard title="Order Status" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={orderStatusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {orderStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Orders Table */}
        <div className="mt-8">
          <ChartCard title="Recent Orders">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentOrders.length > 0 ? recentOrders.map((order) => (
                    <tr key={order._id} className="transition-colors hover:bg-slate-800/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">{order.user?.name || 'N/A'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm"><StatusBadge status={order.status} /></td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-emerald-400">${Number(order.totalAmount || 0).toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-slate-500">No recent orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Link to="/admin/orders" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">View all orders &rarr;</Link>
            </div>
          </ChartCard>
        </div>

      </div>
    </div>
  );
}

// --- Reusable Components ---

function StatCard({ icon: Icon, title, value, trend, color }) {
  const trendColor = trend?.startsWith('+') ? 'text-emerald-400' : 'text-rose-400';
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition-all duration-300 hover:border-slate-700 hover:shadow-cyan-500/10">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${color} bg-opacity-10`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      {trend && (
        <p className="mt-2 text-xs text-slate-500">
          <span className={`font-semibold ${trendColor}`}>{trend}</span> vs last month
        </p>
      )}
    </div>
  );
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6 shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

const PIE_COLORS = ['#34d399', '#60a5fa', '#facc15', '#f87171', '#93c5fd'];
