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
  const [cafeterias, setCafeterias] = useState([]);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const res = await api.get('/api/cafeterias');
        setCafeterias(res.data.data || []);
      } catch {
        setCafeterias([
          { cafeteriaId: 1, name: 'The Last Drop' },
          { cafeteriaId: 2, name: 'Hex Core Cafe' },
          { cafeteriaId: 3, name: 'Skyline Sips' },
        ]);
      }
    };
    fetchCafeterias();
  }, []);

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

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
        {discountId ? 'Edit Discount' : 'Create Discount'}
      </h3>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cafeteria *
            </label>
            <select name="cafeteriaId" value={formData.cafeteriaId || ''} onChange={handleChange} required className={inputClass}>
              <option value="">Select cafeteria</option>
              {cafeterias.map(c => (
                <option key={c.cafeteriaId} value={c.cafeteriaId}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Discount Type *
            </label>
            <select name="discountType" value={formData.discountType} onChange={handleChange} className={inputClass}>
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED_AMOUNT">Fixed Amount (GK)</option>
              <option value="BOGO">Buy One Get One Free</option>
              <option value="COMBO_FIXED_PRICE">Combo Fixed Price</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Discount Value *
            </label>
            <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required step="0.01" className={inputClass} placeholder="Value" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Applicable Items
            </label>
            <input type="text" name="applicableItems" value={formData.applicableItems || ''} onChange={handleChange} className={inputClass} placeholder="e.g., [1, 2, 3] or ALL" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Requirements
          </label>
          <textarea name="requirements" value={formData.requirements || ''} onChange={handleChange} className={inputClass} placeholder="e.g., Min Order Value: 50 GK" rows="2" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="rounded" />
            Active
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-amber-400 text-gray-900 rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionForm;
