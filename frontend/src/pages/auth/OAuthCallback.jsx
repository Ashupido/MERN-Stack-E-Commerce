import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState('Completing Google login...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Google login did not return a valid token.');
      return;
    }

    loginWithToken(token).catch(() => {
      localStorage.removeItem('token');
      setError('Google login could not be completed. Please try again.');
    });
  }, [loginWithToken, searchParams]);

  return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4 text-white">{error}</div>;
}