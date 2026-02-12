import React from 'react';
import DiscountCard from './DiscountCard';

const DiscountSuggestion = () => {
  // mock data
  const suggestions = [
    {
      id: 1,
      type: 'surplus',
      title: 'Surplus Alert',
      item: 'Croissants',
      expiry: '2h',
      prediction: '15 unsold units',
      action: 'Apply 50% discount for next hour.'
    },
    {
      id: 2,
      type: 'bundle',
      title: 'Bundle Opportunity',
      item: 'Iced Coffee + Muffin',
      expiry: '4h',
      prediction: 'Low sales velocity',
      action: 'Create "Afternoon Snack" bundle at 15% off.'
    }
  ];

  return (
    // main container
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 h-full">
      
      {/* header */}
      <div className="flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-400 dark:text-teal-400 transition-colors duration-200">
          <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
          <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.812 1.243a3.75 3.75 0 107.516 0c1.652-.253 3.268-.673 4.813-1.243a.75.75 0 00.298-1.206 8.217 8.217 0 01-2.12-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a5.25 5.25 0 004.496 0l.002.1a2.25 2.25 0 01-4.5 0z" clipRule="evenodd" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          AI Suggestions
        </h2>
      </div>

      {/* card list */}
      <div>
        {suggestions.map((suggestion) => (
          <DiscountCard 
            key={suggestion.id}
            {...suggestion} // passes all properties 
          />
        ))}
      </div>
      
    </div>
  );
};

export default DiscountSuggestion;