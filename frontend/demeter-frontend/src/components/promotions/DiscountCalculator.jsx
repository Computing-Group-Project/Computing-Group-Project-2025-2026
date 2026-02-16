import React, { useState, useEffect } from 'react';

const DiscountCalculator = ({ orderAmount, itemCount, userRole }) => {
  const [discountInfo, setDiscountInfo] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('best');

  const calculateDiscount = async (endpoint) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        orderAmount: orderAmount || 0,
        ...(itemCount && { itemCount }),
        ...(userRole && { userRole }),
        ...(promoCode && { promoCode }),
      });

      const response = await fetch(
        `http://localhost:8080/api/promotions/engine/${endpoint}?${params}`
      );
      const data = await response.json();
      setDiscountInfo(data);
    } catch (error) {
      console.error('Error calculating discount:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderAmount) {
      if (activeTab === 'best') {
        calculateDiscount('calculate-best');
      } else if (activeTab === 'promo') {
        calculateDiscount('calculate-with-promo');
      } else if (activeTab === 'rules') {
        calculateDiscount('calculate-with-rules');
      }
    }
  }, [orderAmount, itemCount, userRole, activeTab]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Discount Calculator</h3>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter promo code (optional)"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('best')}
          className={`px-3 py-2 rounded text-sm font-medium ${
            activeTab === 'best'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Best Discount
        </button>
        <button
          onClick={() => setActiveTab('promo')}
          className={`px-3 py-2 rounded text-sm font-medium ${
            activeTab === 'promo'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Promo Code
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-2 rounded text-sm font-medium ${
            activeTab === 'rules'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Rules
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin h-8 w-8 text-blue-500 mx-auto">⟳</div>
        </div>
      ) : discountInfo ? (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Original Amount</p>
              <p className="text-lg font-semibold">
                Rs. {discountInfo.originalAmount?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Discount</p>
              <p className="text-lg font-semibold text-green-600">
                -Rs. {discountInfo.discountAmount?.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Final Amount</p>
            <p className="text-2xl font-bold text-blue-600">
              Rs. {discountInfo.finalAmount?.toFixed(2)}
            </p>
          </div>
          {discountInfo.appliedPromoCode && (
            <p className="text-sm text-green-600 mt-3">
              ✓ Promo code "{discountInfo.appliedPromoCode}" applied
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {discountInfo.discountDescription}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          Enter an order amount to calculate discount
        </p>
      )}
    </div>
  );
};

export default DiscountCalculator;
