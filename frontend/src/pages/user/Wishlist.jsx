import { useEffect, useState } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { useCurrency } from '../../context/CurrencyContext';
import { normalizeProductImageUrl } from '../../utils/helpers';

export default function Wishlist({ addToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState('');
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await API.get('/wishlist');
        setProducts(response.data?.products || []);
      } catch (requestError) {
        const message = requestError.response?.data?.error || requestError.response?.data?.message || 'Failed to load wishlist';
        setError(message);
        addToast?.(message, 'error');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [addToast]);

  const removeProduct = async (productId) => {
    setRemovingId(productId);
    try {
      await API.delete(`/wishlist/remove/${productId}`);
      setProducts((current) => current.filter((product) => product._id !== productId));
      addToast?.('Product removed from wishlist', 'success');
    } catch (requestError) {
      const message = requestError.response?.data?.error || requestError.response?.data?.message || 'Failed to remove product';
      addToast?.(message, 'error');
    } finally {
      setRemovingId('');
    }
  };

  if (loading) return <Spinner label="Loading wishlist..." />;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">Saved for later</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">My Wishlist</h1>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
            {products.length} item{products.length === 1 ? '' : 's'}
          </span>
        </div>

        {error && <p className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}

        {products.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <Heart className="mx-auto h-12 w-12 text-rose-300" />
            <h2 className="mt-4 text-xl font-black text-slate-900">Your wishlist is empty</h2>
            <p className="mt-2 text-slate-500">Save products you love and find them here later.</p>
            <button onClick={() => navigate('/products')} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800">
              <ShoppingBag className="h-4 w-4" />
              Browse products
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const image = normalizeProductImageUrl(product.images?.[0] || product.image);
              return (
                <article key={product._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <button type="button" onClick={() => navigate(`/product/${product._id}`)} className="block w-full text-left">
                    <div className="aspect-square bg-slate-100">
                      {image ? <img src={image} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400">No image</div>}
                    </div>
                    <div className="p-4">
                      <h2 className="truncate font-bold text-slate-900">{product.name}</h2>
                      <p className="mt-2 font-black text-emerald-700">{formatCurrency(product.price)}</p>
                    </div>
                  </button>
                  <div className="border-t border-slate-100 p-4">
                    <button type="button" onClick={() => removeProduct(product._id)} disabled={removingId === product._id} className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50">
                      <Trash2 className="h-4 w-4" />
                      {removingId === product._id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
