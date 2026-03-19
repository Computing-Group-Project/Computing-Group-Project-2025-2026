import React, { useEffect, useState } from 'react';
import DiscountCard from './DiscountCard';
import api from '../../utils/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const DiscountSuggestion = ({ cafeteriaId }) => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const cId = cafeteriaId || user?.assignedCafeteriaId || 1;
      const res = await api.get(`/api/discounts/cafeteria/${cId}/pending`);
      const pending = res.data || [];
      setSuggestions(pending.map(d => ({
        id: d.discountId,
        type: d.discountType?.toLowerCase() || 'discount',
        title: `${d.discountType || 'Discount'} Suggestion`,
        item: d.applicableItems || 'Various items',
        expiry: d.endDate || 'N/A',
        prediction: `${d.discountValue}${d.discountType === 'PERCENTAGE' ? '%' : ' GK'} off`,
        action: d.requirements || 'AI-generated discount suggestion',
      })));
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [cafeteriaId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const cId = cafeteriaId || user?.assignedCafeteriaId || 1;
      await api.post(`/api/ai/discounts/generate/${cId}`);
      await fetchPending();
    } catch {
      // AI service may be unavailable
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/discounts/${id}/approve?staffUserId=${user?.userId}`);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // Keep suggestion in list on error
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.put(`/api/discounts/${id}/reject`);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 h-full">

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-400 dark:text-amber-400 transition-colors duration-200">
            <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
            <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.812 1.243a3.75 3.75 0 107.516 0c1.652-.253 3.268-.673 4.813-1.243a.75.75 0 00.298-1.206 8.217 8.217 0 01-2.12-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a5.25 5.25 0 004.496 0l.002.1a2.25 2.25 0 01-4.5 0z" clipRule="evenodd" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            AI Suggestions
          </h2>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-amber-400 text-gray-900 hover:bg-amber-500 disabled:opacity-50 transition-colors"
        >
          {generating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {/* card list */}
      <div>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-amber-400 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No pending suggestions. Click Generate to get AI-powered discount ideas.
          </p>
        ) : (
          suggestions.map((suggestion) => (
            <DiscountCard
              key={suggestion.id}
              {...suggestion}
              onApprove={() => handleApprove(suggestion.id)}
              onDismiss={() => handleDismiss(suggestion.id)}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default DiscountSuggestion;
