import { Save, Store } from 'lucide-react';

export default function SellerSettings() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Merchant Workspace</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Store Settings</h1>
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <Store className="h-6 w-6 text-amber-400" />
            <div>
              <h2 className="font-black">Store profile</h2>
              <p className="mt-1 text-sm text-slate-400">Manage the details customers see.</p>
            </div>
          </div>
          <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
            <label className="grid gap-2 text-sm font-bold text-slate-300 sm:col-span-2">
              Store name
              <input className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400" placeholder="Your store name" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-300">
              Contact email
              <input type="email" className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400" placeholder="store@example.com" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-300">
              Phone number
              <input type="tel" className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400" placeholder="+251 ..." />
            </label>
            <button type="submit" className="inline-flex w-fit items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-300 sm:col-span-2">
              <Save className="h-4 w-4" />
              Save settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
