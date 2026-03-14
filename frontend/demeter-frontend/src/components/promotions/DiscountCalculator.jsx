import React, { useState, useEffect } from 'react';
import api from '../../utils/api.js';

const DiscountCalculator = ({ cafeteriaId }) => {
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
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-dark-text">Active Discounts</h3>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : discounts.length > 0 ? (
        <div className="space-y-3">
          {discounts.map((discount) => (
            <div
              key={discount.discountId}
              className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-blue-600">{formatValue(discount)}</p>
                  <p className="text-sm text-gray-600 dark:text-dark-textMuted mt-1">
                    Items: {discount.applicableItems || 'All'}
                  </p>
                  {discount.requirements && (
                    <p className="text-xs text-gray-500 dark:text-dark-textMuted mt-1">{discount.requirements}</p>
                  )}
                </div>
                <div className="text-right">
                  {discount.aiGenerated && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      AI Generated
                    </span>
                  )}
                  {discount.endDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Expires: {new Date(discount.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-dark-textMuted text-center py-4">
          No active discounts for this cafeteria
        </p>
      )}
    </div>
  );
};

export default DiscountCalculator;
