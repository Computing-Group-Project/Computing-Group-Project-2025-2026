import React from 'react';
import StatCard from '../components/staff/StatCard';
import QueueList from '../components/staff/QueueList';
import DiscountSuggestion from '../components/staff/DiscountSuggestion';

const StaffDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">
      
      {/* header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Hex-Core Cafe Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Staff: Sarah Staff
          </p>
        </div>
        
        {/* exit shift btn */}
        <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
          Exit Shift
        </button>
      </div>

      {/* stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* pending orders */}
        <StatCard 
          value="12" 
          title="Pending Orders" 
          isHighlighted={true} 
          valueColor="text-gray-900 dark:text-gray-900"
        />
        
        {/* completed today */}
        <StatCard 
          value="45" 
          title="Completed Today" 
          isHighlighted={false}
          valueColor="text-emerald-500" 
        />
        
        {/* revenue */}
        <StatCard 
          value="GK 1250" 
          title="Today's Revenue" 
          isHighlighted={false} 
          valueColor="text-yellow-500"
        />
        
      </div>

      {/* queue + AI row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* queue */}
        <div className="w-full">
           <QueueList />
        </div>

        {/* AI suggestions */}
        <div className="w-full">
           <DiscountSuggestion />
        </div>

      </div>

    </div>
  );
};

export default StaffDashboard;