import React, { useState, useEffect } from 'react';
import api from '../../utils/api.js';

const PromotionForm = ({ discountId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    cafeteriaId: 1,
    discountType: 'PERCENTAGE',
    discountValue: 0,
    applicableItems: '',
    requirements: '',
    aiGenerated: false,
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (discountId) {
      fetchDiscount(discountId);
    }
  }, [discountId]);

  const fetchDiscount = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/discounts/${id}`);
      setFormData(res.data);
    } catch (err) {
      setError('Failed to load discount');
      if (import.meta.env.DEV) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value === '' ? null : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = discountId
        ? await api.put(`/api/discounts/${discountId}`, formData)
        : await api.post('/api/discounts', formData);

      onSave?.(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save discount');
      if (import.meta.env.DEV) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-dark-text">
        {discountId ? 'Edit Discount' : 'Create Discount'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-textMuted mb-1">
              Cafeteria ID *
            </label>
            <input
              type="number"
              name="cafeteriaId"
              value={formData.cafeteriaId || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cafeteria ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-textMuted mb-1">
              Discount Type *
            </label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED_AMOUNT">Fixed Amount (GK)</option>
              <option value="BOGO">Buy One Get One Free</option>
              <option value="COMBO_FIXED_PRICE">Combo Fixed Price</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-textMuted mb-1">
              Discount Value *
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Value"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-textMuted mb-1">
              Applicable Items
            </label>
            <input
              type="text"
              name="applicableItems"
              value={formData.applicableItems || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., [1, 2, 3] or ALL"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-textMuted mb-1">
            Requirements
          </label>
          <textarea
            name="requirements"
            value={formData.requirements || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Min Order Value: 50 GK"
            rows="2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-textMuted mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-textMuted mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-textMuted">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="rounded"
            />
            Active
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-dark-textMuted bg-gray-100 dark:bg-dark-bg rounded-lg hover:bg-gray-200 dark:hover:bg-dark-border"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionForm;
