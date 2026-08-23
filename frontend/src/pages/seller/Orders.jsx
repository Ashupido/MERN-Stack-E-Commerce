import { ClipboardList } from 'lucide-react';

export default function SellerOrders() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Merchant Workspace</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">My Orders</h1>
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
          <ClipboardList className="mx-auto h-12 w-12 text-amber-400" />
          <h2 className="mt-4 text-xl font-black">Order management is ready</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
            Orders connected to your seller account will appear here when available.
          </p>
        </div>
      </div>
    </div>
  );
}
