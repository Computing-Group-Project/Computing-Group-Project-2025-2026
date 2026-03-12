import React from 'react';

const StatCard = ({ title, value, subtext, isHighlighted = false, valueColor }) => {
  
  // bg logic (changes with theme)
  const highlightBg = "bg-red-200 border-red-300 text-gray-500 dark:bg-teal-500 dark:border-teal-400 dark:text-white";
  const standardBg = "bg-white border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-teal-800 dark:text-gray-400";

  const currentBg = isHighlighted ? highlightBg : standardBg;

  return (
    <div className={`p-6 rounded-2xl shadow-sm border ${currentBg} transition-colors duration-200`}>
      <div className="flex flex-col items-center justify-center text-center">
        
        {/* the number - color passed as a prop */}
        <h3 className={`text-4xl font-bold tracking-tight mb-1 ${valueColor}`}>
          {value}
        </h3>
        
        {/* title */}
        <p className="text-sm font-medium uppercase tracking-wide  ">
          {title}
        </p>

        {/* subtext-optional */}
        {subtext && (
          <p className="text-xs opacity-60 mt-1 font-light text-gray-400">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;