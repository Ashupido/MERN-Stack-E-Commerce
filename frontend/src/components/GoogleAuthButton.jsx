export default function GoogleAuthButton({ disabled = false }) {
  const handleGoogleLogin = () => {
    const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '').replace(/\/api$/, '');
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 text-sm font-black text-gray-900 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v4.1h5.8c-.25 1.32-1.78 3.87-5.8 3.87A6.17 6.17 0 0 1 5.83 12 6.17 6.17 0 0 1 12 5.83c2.3 0 3.85.98 4.73 1.8l3.2-3.1C17.9 2.6 15.22 1.5 12 1.5 6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5c7 0 11.67-4.92 11.67-11.67 0-.78-.08-1.36-.18-1.93H12Z" />
        <path fill="#4285F4" d="M23.49 10.07H12v4.14h6.6c-.31 1.35-1.93 3.96-6.6 3.96a6.18 6.18 0 0 1 0-12.34c2.3 0 3.85.98 4.73 1.8l3.2-3.1C17.9 2.6 15.22 1.5 12 1.5 6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5c7 0 11.67-4.92 11.67-11.67 0-.78-.08-1.36-.18-1.93Z" />
        <path fill="#34A853" d="M12 22.5c3.22 0 5.9-1.06 7.87-2.88l-3.64-2.99c-.98.68-2.3 1.54-4.23 1.54A6.17 6.17 0 0 1 5.83 12H1.5c0 5.8 4.7 10.5 10.5 10.5Z" />
        <path fill="#FBBC05" d="M5.83 12c0-1.07.18-1.86.5-2.58L1.95 6.17A10.5 10.5 0 0 0 1.5 12c0 1.92.52 3.72 1.42 5.27l4.37-3.26A6.18 6.18 0 0 1 5.83 12Z" />
      </svg>
      Continue with Google
    </button>
  );
}
