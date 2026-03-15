import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const staffName = user?.username || 'Staff';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-[#334155] px-6 py-3 flex justify-between items-center transition-colors duration-300">

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
          D
        </div>
        <span className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          Demeter
        </span>
      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(staffName)}`}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#334155] bg-gray-100"
          />

          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-600 transition-colors"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
