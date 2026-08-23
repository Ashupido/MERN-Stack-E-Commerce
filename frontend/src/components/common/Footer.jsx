import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="hidden border-t border-slate-200 bg-white md:block">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/products" className="text-2xl font-black tracking-tight text-slate-950">
            Pido
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            Shop everyday essentials and discover products built for modern living.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Quick Links</h2>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <Link className="transition hover:text-blue-700" to="/">Home</Link>
            <Link className="transition hover:text-blue-700" to="/products">Products</Link>
            <Link className="transition hover:text-blue-700" to="/cart">Cart</Link>
            <Link className="transition hover:text-blue-700" to="/orders">Orders</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Customer</h2>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <Link className="transition hover:text-blue-700" to="/profile">My Account</Link>
            <Link className="transition hover:text-blue-700" to="/wishlist">Wishlist</Link>
            <Link className="transition hover:text-blue-700" to="/login">Login</Link>
            <Link className="transition hover:text-blue-700" to="/register">Register</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Support</h2>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <span>Help Center</span>
            <span>Shipping</span>
            <span>Returns</span>
            <a className="transition hover:text-blue-700" href="mailto:support@pido.store">support@pido.store</a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
        © 2026 Pido. All rights reserved.
      </div>
    </footer>
  );
}
