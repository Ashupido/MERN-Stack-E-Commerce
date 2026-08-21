import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login({ addToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  useEffect(() => {
    document.title = 'Login | Pido';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!normalizedEmail || !password.trim()) {
      setFormError('Please enter both your email and password.');
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await login(normalizedEmail, password);
      const user = response.user;
      addToast?.(`Welcome back, ${user?.name || 'User'}!`, 'success');

      if (from) {
        navigate(from, { replace: true });
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'seller') {
        navigate('/seller/dashboard');
      } else if (user?.role === 'manager') {
        navigate('/profile');
      } else {
        navigate('/products');
      }
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Login failed';
      setFormError(message);
      addToast?.(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <h1 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl">Login</h1>
        <p className="mb-8 mt-2 text-center text-gray-400">Welcome back to Pido</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Password"
              required
            />
          </div>

          {formError && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/70 px-3 py-2 text-sm font-medium text-red-100">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-700"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-400 transition hover:text-blue-300">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
