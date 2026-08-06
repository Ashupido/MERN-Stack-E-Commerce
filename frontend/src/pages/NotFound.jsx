import { Link } from 'react-router-dom'; // Keep this line

export default function NotFound() {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block rounded bg-blue-500 px-4 py-2 text-white">Go Home</Link>
    </div>
  );
}