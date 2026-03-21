import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PromotionList, DiscountCalculator } from '../components/promotions';
import api from '../utils/api.js';

const PromotionManagementConsole = () => {
  const [activeTab, setActiveTab] = useState('discounts');
  const [cafeterias, setCafeterias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/cafeterias')
      .then(res => setCafeterias(res.data.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => navigate('/staff')}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Discount Management
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-12">
          Manage discounts and view active promotions across cafeterias.
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('discounts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'discounts'
              ? 'bg-amber-400 text-gray-900'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
          }`}
        >
          All Discounts
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-amber-400 text-gray-900'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
          }`}
        >
          Active by Cafeteria
        </button>
      </div>

      {activeTab === 'discounts' && <PromotionList />}
      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cafeterias.map(c => (
            <DiscountCalculator key={c.cafeteriaId} cafeteriaId={c.cafeteriaId} cafeteriaName={c.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionManagementConsole;
