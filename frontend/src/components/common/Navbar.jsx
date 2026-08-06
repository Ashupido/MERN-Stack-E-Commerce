import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  Baby,
  BookOpen,
  Car,
  ChevronDown,
  Heart,
  Home,
  Menu,
  PackageCheck,
  RotateCcw,
  Search,
  Shirt,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  UserRound,
  Volleyball,
  Zap,
} from 'lucide-react';

const categories = [
  [Store, 'Electronics'],
  [Shirt, 'Fashion'],
  [Home, 'Home & Kitchen'],
  [Sparkles, 'Beauty & Personal Care'],
  [Volleyball, 'Sports & Outdoors'],
  [Baby, 'Toys & Games'],
  [Car, 'Automotive'],
  [BookOpen, 'Books & Stationery'],
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
  }, [location.search]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleUserClick = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user.role === 'seller') {
      navigate('/seller/dashboard');
    } else {
      navigate('/profile');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="hidden border-b border-slate-200 bg-stone-50 text-[13px] font-semibold text-slate-900 lg:block">
        <div className="mx-auto flex h-9 max-w-[1800px] items-center justify-between px-10">
          <div className="flex items-center gap-10">
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Free delivery on orders over $50
            </span>
            <span className="inline-flex items-center gap-2">
              <PackageCheck className="h-4 w-4" />
              30-day free returns
            </span>
          </div>
          <div className="flex items-center gap-10">
            <span>Help Center</span>
            <NavLink to="/orders" className="hover:text-blue-700">Track Order</NavLink>
            <span>Sell on Pido</span>
            <span className="inline-flex items-center gap-1">
              English | USD <ChevronDown className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#061428] text-white">
        <div className="mx-auto flex min-h-[76px] max-w-[1800px] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="mr-2 flex shrink-0 items-center text-4xl font-black tracking-tight sm:text-5xl"
          >
            P<span className="text-amber-400">i</span>do
          </Link>

          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="hidden h-10 items-center gap-3 rounded-md px-3 text-sm font-bold transition hover:bg-white/10 lg:inline-flex"
            aria-label="Toggle categories"
          >
            <Menu className="h-6 w-6" />
            All Categories
          </button>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const params = new URLSearchParams(location.search);
              const category = params.get('category');
              const next = new URLSearchParams();
              if (category) next.set('category', category);
              if (searchQuery.trim()) next.set('q', searchQuery.trim());
              navigate(`/products${next.toString() ? `?${next.toString()}` : ''}`);
            }}
            className="hidden min-w-0 flex-1 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-black/10 md:flex"
          >
            <button type="button" className="border-r border-slate-200 px-5 text-sm font-semibold text-slate-900">
              <span className="inline-flex items-center gap-1">
                All <ChevronDown className="h-3.5 w-3.5" />
              </span>
            </button>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search for products, brands and more..."
              className="min-w-0 flex-1 px-5 text-sm font-medium text-slate-800 outline-none"
            />
            <button type="submit" className="flex w-16 items-center justify-center bg-amber-400 text-2xl font-black text-slate-950 transition hover:bg-amber-300">
              <Search className="h-6 w-6" />
            </button>
          </form>

          <div className="ml-auto hidden items-center gap-6 lg:flex">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleUserClick}
                  className="inline-flex items-center gap-2 text-left text-sm font-bold leading-tight hover:text-amber-200"
                >
                  <UserRound className="h-7 w-7 text-amber-400" />
                  <span>
                    <span className="block text-xs font-semibold text-slate-300">Hello, {user?.name?.split(' ')[0] || 'User'}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-white">
                      Profile <ChevronDown className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </button>

                <NavLink to="/profile" className="inline-flex items-center gap-1 text-sm font-bold leading-tight hover:text-amber-200">
                  Profile
                </NavLink>

                <NavLink to="/orders" className="inline-flex items-center gap-2 text-sm font-bold leading-tight hover:text-amber-200">
                  <RotateCcw className="h-6 w-6" />
                  <span>Orders</span>
                </NavLink>

                {user?.role === 'admin' && (
                  <NavLink to="/admin/dashboard" className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-3 py-1.5 text-sm font-black text-slate-950 transition hover:bg-cyan-400">
                    Admin
                  </NavLink>
                )}
                {(user?.role === 'seller' || user?.role === 'admin') && (
                  <NavLink to="/seller/dashboard" className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-3 py-1.5 text-sm font-black text-slate-950 transition hover:bg-amber-300">
                    Seller
                  </NavLink>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-black text-white transition hover:bg-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-amber-400 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-amber-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/cart')}
            className="relative flex h-11 items-center gap-2 rounded-md px-2 text-sm font-bold transition hover:bg-white/10"
          >
            <ShoppingCart className="h-9 w-9" />
            <span className="absolute -top-1 left-6 flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-black text-slate-950">
              {cartCount}
            </span>
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>

        <div className="px-4 pb-4 md:hidden">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const params = new URLSearchParams(location.search);
              const category = params.get('category');
              const next = new URLSearchParams();
              if (category) next.set('category', category);
              if (searchQuery.trim()) next.set('q', searchQuery.trim());
              navigate(`/products${next.toString() ? `?${next.toString()}` : ''}`);
            }}
            className="flex overflow-hidden rounded-md bg-white"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 px-4 py-3 text-sm font-medium text-slate-800 outline-none"
            />
            <button type="submit" className="flex w-14 items-center justify-center bg-amber-400 text-slate-950">
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      <nav className="hidden bg-white lg:block">
        <div className="mx-auto flex h-14 max-w-[1800px] items-center justify-between gap-4 overflow-x-auto px-10 text-sm font-semibold text-slate-900">
          {categories.map(([Icon, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                const params = new URLSearchParams(location.search);
                const next = new URLSearchParams();
                next.set('category', label);
                if (params.get('q')) {
                  next.set('q', params.get('q'));
                }
                navigate(`/products${next.toString() ? `?${next.toString()}` : ''}`);
              }}
              className="flex shrink-0 items-center gap-3 hover:text-blue-700"
            >
              <Icon className="h-5 w-5 text-slate-700" />
              {label}
            </button>
          ))}
          <a href="#deals" className="flex shrink-0 items-center gap-2 font-black text-red-600">
            <Zap className="h-5 w-5 fill-red-600" />
            Deals
          </a>
        </div>
      </nav>

      <div
        className={`grid border-t border-white/10 bg-[#061428] text-white transition-all duration-200 lg:hidden ${
          mobileMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-2 px-4 py-4">
            <NavLink to="/products" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 font-bold hover:bg-white/10">
              Products
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 font-bold hover:bg-white/10">
                  Profile
                </NavLink>
                <NavLink to="/orders" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 font-bold hover:bg-white/10">
                  Orders
                </NavLink>
              </>
            )}
            <NavLink to="/cart" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 font-bold hover:bg-white/10">
              Cart ({cartCount})
            </NavLink>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="rounded-md px-3 py-2 text-left font-bold text-red-400 hover:bg-white/10">
                Logout
              </button>
            ) : (
              <div className="grid gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="rounded-md bg-white/10 px-3 py-2 text-left font-bold hover:bg-white/20"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="rounded-md bg-amber-400 px-3 py-2 text-left font-bold text-slate-950 hover:bg-amber-300"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
