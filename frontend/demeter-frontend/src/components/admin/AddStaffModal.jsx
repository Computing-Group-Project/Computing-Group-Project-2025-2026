import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

function AddStaffModal({ isOpen, onClose, onAdd }) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    status: 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, joinedDate: 'Today' });
    setFormData({ name: '', id: '', status: 'Active' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-8 border border-light-border dark:border-dark-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
            Add New Staff Member
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-textMuted dark:placeholder-dark-textMuted focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all"
                placeholder="e.g. John Doe"
              />
            </div>

            {/* ID Input */}
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Staff ID
              </label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-textMuted dark:placeholder-dark-textMuted focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all"
                placeholder="e.g., u7"
              />
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                theme === 'light'
                  ? 'bg-light-accent hover:bg-pink-600 text-white'
                  : 'bg-dark-accent hover:bg-teal-600 text-white'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStaffModal;