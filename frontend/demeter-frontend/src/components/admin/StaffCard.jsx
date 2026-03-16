import React from 'react';
function StaffCard({ staff, onDelete }) {

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border overflow-hidden shadow-sm">
      {/* Top Section*/}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar Icon */}
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-dark-bg flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-gray-600 dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          {/* Info */}
          <div>
            <h3 className="font-semibold text-light-text dark:text-dark-text text-base">
              {staff.name}
            </h3>
            <p className="text-sm text-light-textMuted dark:text-dark-textMuted">
              ID: {staff.id}{staff.cafeteria ? ` · ${staff.cafeteria}` : ''}
            </p>
          </div>
        </div>

        {/* Delete Button */}
        <button 
          onClick={() => onDelete(staff.id)}
          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Bottom Section - Status */}
      <div className="bg-gray-50 dark:bg-dark-bg px-5 py-3 flex items-center justify-between border-t border-light-border dark:border-dark-border">
        <span className="inline-flex items-center text-sm font-medium text-emerald-700 dark:text-teal-400">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {staff.status}
        </span>
        
        <p className="text-sm text-light-textMuted dark:text-dark-textMuted">
          Joined: {staff.joinedDate}
        </p>
      </div>
    </div>
  );
}

export default React.memo(StaffCard);