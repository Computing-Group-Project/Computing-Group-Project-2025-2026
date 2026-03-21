import React from 'react';

const typeConfig = {
  bogo: {
    label: 'BOGO',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    accent: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800/40',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    btnApprove: 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500',
  },
  combo: {
    label: 'COMBO',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    accent: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800/40',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    btnApprove: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500',
  },
  percentage: {
    label: 'DISCOUNT',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
    accent: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800/40',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    btnApprove: 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500',
  },
};

const DiscountCard = ({ item, prediction, reason, type, expiry, onApprove, onDismiss }) => {
  const config = typeConfig[type] || typeConfig.percentage;

  const formatExpiry = (date) => {
    if (!date || date === 'N/A') return null;
    try {
      const d = new Date(date);
      const now = new Date();
      const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return 'Expired';
      return `${diffDays}d left`;
    } catch {
      return date;
    }
  };

  const expiryText = formatExpiry(expiry);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all hover:shadow-md ${config.bg} ${config.border}`}>
      {/* Top bar — type badge + value + expiry */}
      <div className="px-4 pt-3.5 pb-2 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${config.badge}`}>
          {config.icon}
          {config.label}
        </span>
        <span className={`text-sm font-bold ${config.accent}`}>{prediction}</span>
        <div className="flex-1" />
        {expiryText && (
          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
            {expiryText}
          </span>
        )}
      </div>

      {/* Item name — the main focus */}
      <div className="px-4 pb-1.5">
        <h4 className="text-[15px] font-semibold text-gray-800 dark:text-gray-100 leading-snug">
          {item}
        </h4>
      </div>

      {/* Reason */}
      {reason && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {reason}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex border-t border-gray-200/60 dark:border-gray-700/40">
        <button
          onClick={onApprove}
          className={`flex-1 py-2.5 text-xs font-semibold text-white transition-colors ${config.btnApprove}`}
        >
          Approve
        </button>
        <button
          onClick={onDismiss}
          className="flex-1 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors border-l border-gray-200/60 dark:border-gray-700/40"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default DiscountCard;
