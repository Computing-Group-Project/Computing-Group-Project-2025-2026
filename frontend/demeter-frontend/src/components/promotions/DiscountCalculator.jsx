import React, { useState, useEffect } from 'react';
import api from '../../utils/api.js';

const DiscountCalculator = ({ cafeteriaId, cafeteriaName }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cafeteriaId) {
      fetchActiveDiscounts();
    }
  }, [cafeteriaId]);

  const fetchActiveDiscounts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/discounts/cafeteria/${cafeteriaId}/active`);
      setDiscounts(res.data);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (discount) => {
    switch (discount.discountType) {
      case 'PERCENTAGE':
        return `${discount.discountValue}% off`;
      case 'FIXED_AMOUNT':
        return `${discount.discountValue} GK off`;
      case 'BOGO':
        return 'Buy 1 Get 1 Free';
      case 'COMBO_FIXED_PRICE':
        return `Combo for ${discount.discountValue} GK`;
      default:
        return `${discount.discountValue}`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">{cafeteriaName || 'Active Discounts'}</h3>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : discounts.length > 0 ? (
        <div className="space-y-3">
          {discounts.map((discount) => (
            <div
              key={discount.discountId}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-amber-600 dark:text-amber-400">{formatValue(discount)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Items: {discount.applicableItems || 'All'}
                  </p>
                  {discount.requirements && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{discount.requirements}</p>
                  )}
                </div>
                <div className="text-right">
                  {discount.aiGenerated && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      AI Generated
                    </span>
                  )}
                  {discount.endDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Expires: {new Date(discount.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No active discounts for this cafeteria
        </p>
      )}
    </div>
  );
};

export default DiscountCalculator;
