import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/staff/StatCard';
import QueueList from '../components/staff/QueueList';
import DiscountSuggestion from '../components/staff/DiscountSuggestion';
import MenuEditor from '../components/staff/MenuEditor';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../utils/api.js';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({ pending: 0, completed: 0, revenue: 0 });
  const [cafeteriaName, setCafeteriaName] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const cafeteriaId = user?.assignedCafeteriaId || 1;

    // Fetch cafeteria name
    const fetchCafeteria = async () => {
      try {
        const res = await api.get(`/api/cafeterias/${cafeteriaId}`);
        setCafeteriaName(res.data.data?.name || `Cafeteria #${cafeteriaId}`);
      } catch {
        setCafeteriaName(`Cafeteria #${cafeteriaId}`);
      }
    };
    fetchCafeteria();

    const fetchStats = async () => {
      try {
        const res = await api.get(`/api/orders/cafeteria/${cafeteriaId}`);
        const orders = res.data.data || [];

        const pending = orders.filter(o => o.status === 'PLACED' || o.status === 'CONFIRMED' || o.status === 'PREPARING').length;
        const completed = orders.filter(o => o.status === 'COMPLETED').length;
        const revenue = orders
          .filter(o => o.status === 'COMPLETED')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        setStats({ pending, completed, revenue });
      } catch {
        // Keep defaults
      }
    };
    fetchStats();
  }, [user]);

  const cafeteriaId = user?.assignedCafeteriaId || 1;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Staff Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Staff: {((user?.username || 'Unknown').charAt(0).toUpperCase() + (user?.username || 'Unknown').slice(1))} | {cafeteriaName || `Cafeteria #${cafeteriaId}`}
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-amber-400 text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'}`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'menu' ? 'bg-amber-400 text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'}`}
        >
          Menu
        </button>
        <button
          onClick={() => navigate('/staff/promotions')}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Promotions
        </button>
      </div>

      {activeTab === 'orders' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              value={String(stats.pending)}
              title="Pending Orders"
              isHighlighted={true}
              valueColor="text-red-800 dark:text-red-400"
            />
            <StatCard
              value={String(stats.completed)}
              title="Completed Today"
              isHighlighted={false}
              valueColor="text-emerald-500"
            />
            <StatCard
              value={`GK ${stats.revenue.toFixed(0)}`}
              title="Today's Revenue"
              isHighlighted={false}
              valueColor="text-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full">
              <QueueList cafeteriaId={cafeteriaId} />
            </div>
            <div className="w-full">
              <DiscountSuggestion cafeteriaId={cafeteriaId} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'menu' && (
        <MenuEditor cafeteriaId={cafeteriaId} />
      )}

    </div>
  );
};

export default StaffDashboard;
