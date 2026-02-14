import React from 'react';

const DiscountCard = ({ title, item, expiry, prediction, action, type }) => {
  // change colors based on the type of alert (Surplus = Red, Bundle = Blue)
  const isSurplus = type === 'surplus';

  return (
    <div className={`border rounded-xl p-4 mb-4 transition-all hover:shadow-md ${
      isSurplus 
        ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30' 
        : 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30'
    }`}>
      
      {/* card header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className={`font-bold text-sm uppercase tracking-wide ${
            isSurplus ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'
          }`}>
            {title}: <span className="text-gray-900 dark:text-gray-100">{item}</span>
          </h4>
        </div>
        
        {/* expiry badge */}
        <span className="text-xs font-mono bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 px-2 py-0.5 rounded text-center">
          Expires in {expiry}
        </span>
      </div>

      {/* prediction text */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        Inventory tracking predicts <strong className="text-gray-800 dark:text-gray-200">{prediction}</strong> by closing. 
        <br />
        Suggested Action: {action}
      </p>

      {/* btns */}
      <div className="flex gap-3">
        {/* approve btn */}
        <button className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-colors ${
          isSurplus 
            ? 'bg-red-400 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}>
          Approve
        </button>

        {/* dismiss btn */}
        <button className="flex-1 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
          Dismiss
        </button>
      </div>

    </div>
  );
};

export default DiscountCard;