import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartNoAxesCombined, CircleDollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import adminService from '../../services/adminService';
import Spinner from '../../components/common/Spinner';

const formatCurrency = (value) => `ETB ${Number(value || 0).toLocaleString()}`;

export default function AdminReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      try {
        setError('');
        setReport(await adminService.getDashboard());
      } catch {
        setError('Unable to load report data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  if (loading) return <Spinner label="Loading reports..." />;

  const monthlySales = report?.monthlySales || [];
  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">Analytics</p><h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Reports & Analytics</h1><p className="mt-2 max-w-2xl text-sm text-slate-400">A live overview of revenue, orders, customers, and catalog activity.</p></div>
        <div className="inline-flex items-center gap-2 self-start rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300 sm:self-auto"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Live platform data</div>
      </div>
      {error && <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/50 p-4 text-sm font-medium text-red-200">{error}</div>}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ReportCard icon={CircleDollarSign} title="Paid Revenue" value={formatCurrency(report?.totalRevenue)} tone="emerald" />
        <ReportCard icon={ShoppingBag} title="Total Orders" value={Number(report?.totalOrders || 0).toLocaleString()} tone="cyan" />
        <ReportCard icon={Users} title="Customers" value={Number(report?.totalUsers || 0).toLocaleString()} tone="violet" />
        <ReportCard icon={Package} title="Catalog Products" value={Number(report?.totalProducts || 0).toLocaleString()} tone="amber" />
      </div>
      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/15 sm:p-6">
        <div className="flex items-center gap-3"><div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-300"><ChartNoAxesCombined className="h-5 w-5" /></div><div><h2 className="font-bold text-white">Monthly Sales</h2><p className="text-sm text-slate-400">Paid revenue grouped by month.</p></div></div>
        <div className="mt-6 h-80">{monthlySales.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={monthlySales} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}><CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.15)" /><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} /><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px' }} formatter={(value) => formatCurrency(value)} /><Bar dataKey="revenue" name="Revenue" fill="#22d3ee" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">No paid sales data is available yet.</div>}</div>
      </section>
    </div>
  );
}

function ReportCard({ icon: Icon, title, value, tone }) {
  const tones = { emerald: 'bg-emerald-500/10 text-emerald-300', cyan: 'bg-cyan-500/10 text-cyan-300', violet: 'bg-violet-500/10 text-violet-300', amber: 'bg-amber-500/10 text-amber-300' };
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-400">{title}</p><p className="mt-2 text-2xl font-black text-white">{value}</p></div><div className={`rounded-xl p-3 ${tones[tone]}`}><Icon className="h-5 w-5" /></div></div></div>;
}
