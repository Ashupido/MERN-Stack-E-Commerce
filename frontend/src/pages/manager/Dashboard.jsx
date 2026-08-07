import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingCart, Clock } from 'lucide-react';
import managerService from '../../services/managerService';
import Spinner from '../../components/common/Spinner';

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex items-center gap-4">
    <div className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg ${color} bg-opacity-20`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

const PIE_COLORS = ['#34d399', '#facc15', '#60a5fa', '#f87171', '#93c5fd'];

export default function ManagerDashboard({ addToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summary = await managerService.getDashboardSummary();
        setData(summary);
      } catch (err) {
        setError('Failed to load dashboard data.');
        addToast?.('Failed to load dashboard data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast]);

  if (loading) return <Spinner label="Loading Dashboard..." />;
  if (error) return <div className="text-red-400 text-center p-8">{error}</div>;

  const stats = {
    totalRevenue: data?.totalRevenue || 0,
    totalOrders: data?.totalOrders || 0,
    pendingOrders: data?.pendingOrders || 0,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manager Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard icon={<DollarSign className="h-6 w-6" />} title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} color="text-emerald-400" />
        <StatCard icon={<ShoppingCart className="h-6 w-6" />} title="Total Orders" value={stats.totalOrders.toLocaleString()} color="text-cyan-400" />
        <StatCard icon={<Clock className="h-6 w-6" />} title="Pending Orders" value={stats.pendingOrders.toLocaleString()} color="text-amber-400" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Monthly Sales">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.salesPerMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="sales" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Order Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data?.orderStatusDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data?.orderStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}