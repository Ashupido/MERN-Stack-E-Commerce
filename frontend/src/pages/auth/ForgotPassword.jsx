import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await authService.forgotPassword(email.trim().toLowerCase());
      setMessage(response.message);
    } catch {
      setMessage('If an account exists with this email, password reset instructions have been sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400" aria-hidden="true">?</div>
          <h1 className="mt-4 text-3xl font-black text-white">Forgot Password?</h1>
          <p className="mt-2 text-sm leading-6 text-gray-400">Enter your email and we&apos;ll send you instructions to reset your password.</p>
        </div>
        {message ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/50 p-4 text-center text-sm leading-6 text-emerald-100">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label htmlFor="forgot-email" className="block text-sm font-bold text-gray-300">Email Address</label>
            <input id="forgot-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" autoComplete="email" className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" />
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-black text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Sending...' : 'Send Reset Link'}</button>
          </form>
        )}
        <Link to="/login" className="mt-7 block text-center text-sm font-semibold text-blue-400 transition hover:text-blue-300">Back to Login</Link>
      </div>
    </div>
  );
}
