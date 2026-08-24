import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PasswordInput from '../../components/common/PasswordInput';
import authService from '../../services/authService';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.resetPassword(searchParams.get('token'), password, confirmPassword);
      setMessage(response.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-2xl sm:p-8">
        <h1 className="text-3xl font-black text-white">Create New Password</h1>
        {message ? (
          <div className="mt-6 space-y-5">
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-950/50 p-4 text-emerald-100">{message}</p>
            <Link to="/login" className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-black text-white">Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <PasswordInput id="reset-password" label="New Password" value={password} onChange={(event) => setPassword(event.target.value)} required className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-400" />
            <PasswordInput id="reset-confirm-password" label="Confirm Password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-400" />
            {error && <p className="rounded-lg border border-red-500/30 bg-red-950/70 p-3 text-sm text-red-100">{error}</p>}
            <button disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-black text-white transition hover:bg-blue-500 disabled:opacity-60">{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
