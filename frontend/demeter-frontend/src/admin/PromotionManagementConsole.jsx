import React, { useState } from 'react';
import { PromotionList, DiscountCalculator } from '../components/promotions';

const PromotionManagementConsole = () => {
  const [activeTab, setActiveTab] = useState('discounts');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Discount Management</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'discounts'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Discounts
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
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
