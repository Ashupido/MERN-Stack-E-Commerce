import { useEffect, useState } from 'react';
import { Search, Store, UserCheck } from 'lucide-react';
import userService from '../../services/userService';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminSellers({ addToast }) {
  const [sellers, setSellers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSellers, setTotalSellers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSellers = async () => {
      try {
        setLoading(true); setError('');
        const data = await userService.getUsers({ role: 'seller', search, page, limit: 10 });
        setSellers(data.users || []); setTotalSellers(data.totalUsers || 0); setTotalPages(data.totalPages || 1);
      } catch {
        const message = 'Unable to load sellers.';
        setError(message); addToast?.(message, 'error');
      } finally { setLoading(false); }
    };
    loadSellers();
  }, [addToast, page, search]);

  const activeSellers = sellers.filter((seller) => seller.status === 'active').length;
  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">Marketplace</p><h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Seller Management</h1><p className="mt-2 text-sm text-slate-400">Review marketplace sellers and their account status.</p></div>
        <div className="relative w-full sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search sellers..." className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" /></div>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2"><SummaryCard icon={Store} label="Registered Sellers" value={totalSellers} tone="amber" /><SummaryCard icon={UserCheck} label="Active on This Page" value={activeSellers} tone="emerald" /></div>
      {error && <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/50 p-4 text-sm font-medium text-red-200">{error}</div>}
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4"><h2 className="font-bold text-white">Seller Directory</h2><span className="text-sm text-slate-400">{totalSellers} total</span></div>
        {loading ? <div className="py-14"><Spinner label="Loading sellers..." /></div> : sellers.length === 0 ? <div className="px-5 py-14 text-center text-sm text-slate-500">No sellers match this search.</div> : <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-800"><thead className="bg-slate-950/50 text-left text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Seller</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Joined</th></tr></thead><tbody className="divide-y divide-slate-800">{sellers.map((seller) => <tr key={seller._id} className="transition hover:bg-slate-800/50"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-sm font-black text-amber-300">{seller.name?.charAt(0)?.toUpperCase() || 'S'}</div><span className="font-semibold text-white">{seller.name}</span></div></td><td className="px-5 py-4 text-sm text-slate-400">{seller.email}</td><td className="px-5 py-4"><StatusBadge status={seller.status || 'inactive'} /></td><td className="px-5 py-4 text-sm text-slate-400">{seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : '—'}</td></tr>)}</tbody></table></div>}
        {totalPages > 1 && <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4"><button onClick={() => setPage(page - 1)} disabled={page === 1} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-40">Previous</button><span className="text-sm text-slate-400">Page {page} of {totalPages}</span><button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-40">Next</button></div>}
      </section>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }) {
  const style = tone === 'emerald' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300';
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-400">{label}</p><p className="mt-1 text-3xl font-black text-white">{value}</p></div><div className={`rounded-xl p-3 ${style}`}><Icon className="h-5 w-5" /></div></div></div>;
}
