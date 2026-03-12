import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { PromotionList, DiscountCalculator } from '../components/promotions';

const PromotionManagementConsole = () => {
  const [activeTab, setActiveTab] = useState('discounts');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const staff = JSON.parse(localStorage.getItem('staff'));
    if (!staff || staff.role !== 'Admin') {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 rounded-lg text-gray-600 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-dark-text">Discount Management</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'discounts'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border'
            }`}
          >
            Discounts
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border'
            }`}
          >
            Active Discounts by Cafeteria
          </button>
        </div>

        {activeTab === 'discounts' && <PromotionList />}
        {activeTab === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DiscountCalculator cafeteriaId={1} />
            <DiscountCalculator cafeteriaId={2} />
            <DiscountCalculator cafeteriaId={3} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionManagementConsole;
