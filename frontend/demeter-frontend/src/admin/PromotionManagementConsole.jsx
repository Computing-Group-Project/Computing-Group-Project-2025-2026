import React, { useState } from 'react';
import { PromotionList, PromoCodeList, DiscountCalculator } from '../promotions';

const PromotionManagementConsole = () => {
  const [activeTab, setActiveTab] = useState('promotions');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Promotion Management</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'promotions'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Promotions
          </button>
          <button
            onClick={() => setActiveTab('codes')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'codes'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Promo Codes
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'calculator'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Discount Calculator
          </button>
        </div>

        {activeTab === 'promotions' && <PromotionList />}
        {activeTab === 'codes' && <PromoCodeList />}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Test Discount Calculation</h2>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Use this tool to preview how discounts will be calculated for different order amounts.
                  </p>
                </div>
              </div>
            </div>
            <DiscountCalculator orderAmount={1000} itemCount={5} userRole="STUDENT" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionManagementConsole;
