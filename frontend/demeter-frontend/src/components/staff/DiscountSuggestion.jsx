import React, { useEffect, useState } from 'react';
import DiscountCard from './DiscountCard';
import api from '../../utils/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const DiscountSuggestion = ({ cafeteriaId }) => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuMap, setMenuMap] = useState({});

  useEffect(() => {
    const cId = cafeteriaId || user?.assignedCafeteriaId || 1;
    api.get(`/api/menus/cafeteria/${cId}`)
      .then(res => {
        const map = {};
        (res.data.data || []).forEach(item => { map[item.menuId] = item.name; });
        setMenuMap(map);
      })
      .catch(() => {});
  }, [cafeteriaId, user?.assignedCafeteriaId]);

  const resolveItemNames = (applicableItems) => {
    if (!applicableItems) return 'Various items';
    try {
      const ids = typeof applicableItems === 'string' ? JSON.parse(applicableItems) : applicableItems;
      if (!Array.isArray(ids) || ids.length === 0) return 'Various items';
      const uniqueNames = [...new Set(ids.map(id => menuMap[id] || `Item #${id}`))];
      return uniqueNames.join(' + ');
    } catch {
      return applicableItems;
    }
  };

  const parseReason = (requirements) => {
    if (!requirements) return null;
    try {
      const parsed = typeof requirements === 'string' ? JSON.parse(requirements) : requirements;
      if (parsed?.reason) return parsed.reason;
      return null;
    } catch {
      return typeof requirements === 'string' ? requirements : null;
    }
  };

  const formatValue = (d) => {
    if (d.discountType === 'BOGO') return 'Buy 1 Get 1 Free';
    if (d.discountType === 'PERCENTAGE') return `${d.discountValue}% off`;
    if (d.discountType === 'COMBO') return `${d.discountValue}% off bundle`;
    return `${d.discountValue} GK off`;
  };

  const fetchPending = async () => {
    try {
      const cId = cafeteriaId || user?.assignedCafeteriaId || 1;
      const res = await api.get(`/api/discounts/cafeteria/${cId}/pending`);
      const pending = res.data || [];
      setSuggestions(pending.map(d => ({
        id: d.discountId,
        type: d.discountType?.toLowerCase() || 'percentage',
        item: resolveItemNames(d.applicableItems),
        expiry: d.endDate || 'N/A',
        prediction: formatValue(d),
        reason: parseReason(d.requirements),
      })));
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(menuMap).length > 0) fetchPending();
  }, [cafeteriaId, menuMap]);

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
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-white leading-tight">
              AI Suggestions
            </h2>
            {suggestions.length > 0 && (
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                {suggestions.length} pending review
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg bg-amber-400 text-gray-900 hover:bg-amber-500 disabled:opacity-50 transition-colors"
        >
          {generating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
              Generating
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Generate
            </>
          )}
        </button>
      </div>

      {/* card list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Loading suggestions...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No pending suggestions</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Click Generate to get AI-powered discount ideas</p>
          </div>
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
