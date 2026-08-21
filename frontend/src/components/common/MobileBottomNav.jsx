import { Home, ShoppingBag, ShoppingCart, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const navItems = [
  { label: 'Home', to: '/', icon: Home, end: true },
  { label: 'Products', to: '/products', icon: ShoppingBag },
  { label: 'Cart', to: '/cart', icon: ShoppingCart },
  { label: 'Profile', to: '/profile', icon: UserRound },
];

export default function MobileBottomNav() {
  const { cartCount } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1.5 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur md:hidden" aria-label="Mobile navigation">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) => `relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-bold transition ${isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span className="relative">
              <Icon className="h-5 w-5" strokeWidth={2.25} />
              {label === 'Cart' && cartCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-slate-950">
                  {cartCount}
                </span>
              )}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
