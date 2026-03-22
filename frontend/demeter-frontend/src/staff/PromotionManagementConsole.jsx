import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PromotionList } from '../components/promotions';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../utils/api.js';

const PromotionManagementConsole = () => {
  const { user } = useAuth();
  const [cafeteriaName, setCafeteriaName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.assignedCafeteriaId) {
      api.get(`/api/cafeterias/${user.assignedCafeteriaId}`)
        .then(res => setCafeteriaName(res.data.data?.name || ''))
        .catch(() => {});
    }
  }, [user?.assignedCafeteriaId]);

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
        {cafeteriaName && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-12">
            Manage discounts for {cafeteriaName}.
          </p>
        )}
      </div>

      <PromotionList />
    </div>
  );
};

export default PromotionManagementConsole;
