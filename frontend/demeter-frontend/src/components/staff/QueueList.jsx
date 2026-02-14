import React from 'react';
import QueueItem from './QueueItem';

const QueueList = () => {
  // mock data
  const mockOrders = [
    { 
      id: 101, 
      time: "2 min ago", 
      items: ["Neuro-Burger", "Void Latte"], 
      status: "Pending" 
    },
    { 
      id: 102, 
      time: "5 min ago", 
      items: ["Scholar's Scone"], 
      status: "Pending" 
    },
    { 
      id: 103, 
      time: "12 min ago", 
      items: ["Quantum Quinoa Bowl", "Sunset Smoothie"], 
      status: "Preparing" 
    },
  ];

  return (
    // main container
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 h-full">
      
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Live Queue
        </h2>
        <span className="animate-pulse bg-red-300 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-200 dark:border-red-900 shadow-sm">
          Busy
        </span>
      </div>

      {/* list */}
      <div className="space-y-4">
        {mockOrders.map((order) => (
          <QueueItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default QueueList;