import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';

export default function NotFound() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const getHomePath = () => {
    const role = auth?.user?.role;
    if (role === 'ADMIN') return '/admin';
    if (role === 'STAFF') return '/staff';
    return '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl font-extrabold text-gray-200 dark:text-gray-800 select-none">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate(getHomePath())}
            className="px-6 py-3 bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold rounded-xl transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
