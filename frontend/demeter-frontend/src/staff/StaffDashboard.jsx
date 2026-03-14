import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/staff/StatCard';
import QueueList from '../components/staff/QueueList';
import DiscountSuggestion from '../components/staff/DiscountSuggestion';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../utils/api.js';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const [stats, setStats] = useState({ pending: 0, completed: 0, revenue: 0 });

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'STAFF' && user?.role !== 'ADMIN')) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const cafeteriaId = user.assignedCafeteriaId || 1;
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
  }, [isAuthenticated, user]);

  const handleExitShift = () => {
    logout();
    navigate('/login');
  };

  const cafeteriaId = user?.assignedCafeteriaId || 1;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">

      {/* header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Staff Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Staff: {user?.username || 'Unknown'} | Cafeteria #{cafeteriaId}
          </p>
        </div>

        <button
          onClick={handleExitShift}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          Exit Shift
        </button>
      </div>

      {/* stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          value={String(stats.pending)}
          title="Pending Orders"
          isHighlighted={true}
          valueColor="text-gray-900 dark:text-gray-900"
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

      {/* queue + AI row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full">
          <QueueList cafeteriaId={cafeteriaId} />
        </div>
        <div className="w-full">
          <DiscountSuggestion />
        </div>
      </div>

    </div>
  );
};

export default StaffDashboard;
