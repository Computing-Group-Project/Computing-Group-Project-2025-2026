import React from 'react';

const QueueItem = ({ order, onCancel, onAccept, onMarkReady, onMarkCompleted }) => {
  // destructure the order object for easier access
  const { id, time, items, status } = order;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm mb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-200">
      
      {/* order details */}
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-1">
          {/* order ID */}
          <span className="font-bold text-gray-800 dark:text-white text-lg">
            #{id}
          </span>
          
          {/* time badge */}
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
             🕒 {time}
          </span>
        </div>
        
        {/* food list */}
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
          {items.join(", ")}
        </p>
      </div>

      {/* btns */}
      <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
        
        {status === 'Pending' && (
          <>
            {/* reject */}
            <button onClick={onCancel} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30 transition-colors" title="Cancel Order">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* accept */}
            <button onClick={onAccept} className="flex-1 md:flex-none px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm shadow-emerald-200 dark:shadow-none transition-colors">
              Accept
            </button>
          </>
        )}

        {status === 'Preparing' && (
          <button onClick={onMarkReady} className="flex-1 md:flex-none px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-semibold rounded-lg transition-colors border border-gray-200 dark:border-gray-600">
            Mark Ready
          </button>
        )}

        {status === 'Ready' && onMarkCompleted && (
          <button onClick={onMarkCompleted} className="flex-1 md:flex-none px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold rounded-lg transition-colors">
            Complete
          </button>
        )}

      </div>
    </div>
  );
};

export default QueueItem;