import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts';
import api from '../../utils/api.js';

const PERIODS = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'quarterly', label: 'Quarterly' },
];

const STATUS_COLORS = {
  PLACED: '#3b82f6',
  CONFIRMED: '#eab308',
  PREPARING: '#f97316',
  READY: '#a855f7',
  COMPLETED: '#22c55e',
  CANCELLED: '#ef4444',
};

function AnalyticsDashboard() {
  const [period, setPeriod] = useState('monthly');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [period, startDate, endDate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/admin/analytics/dashboard?period=${period}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      const res = await api.get(url);
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get(`/api/admin/analytics/export?period=${period}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${period}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // silently fail
    }
  };

  const formatGK = (value) => {
    if (value == null) return '0.00';
    return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin h-8 w-8 border-4 border-light-accent dark:border-dark-accent border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-light-textMuted dark:text-dark-textMuted">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-500 font-medium mb-2">Failed to load analytics</p>
        <p className="text-light-textMuted dark:text-dark-textMuted text-sm mb-4">{error}</p>
        <button onClick={fetchAnalytics} className="px-4 py-2 rounded-lg font-medium bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Prepare chart data
  const orderStatusData = Object.entries(data.ordersByStatus || {}).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const revenueChartData = (data.revenueByPeriod || []).map(entry => ({
    period: entry.period,
    revenue: Number(entry.revenue) || 0,
    orders: entry.orderCount || 0,
  }));

  const topItemsChartData = (data.topSellingItems || []).slice(0, 8).map(item => ({
    name: item.itemName?.length > 20 ? item.itemName.substring(0, 18) + '...' : item.itemName,
    fullName: item.itemName,
    quantity: item.totalQuantity,
    revenue: Number(item.totalRevenue) || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium text-light-text dark:text-dark-text mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.name === 'revenue' ? `${formatGK(entry.value)} GK` : entry.value}
          </p>
        ))}
      </div>
    );
  };

  const PieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    const total = orderStatusData.reduce((sum, d) => sum + d.value, 0);
    const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    return (
      <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium text-light-text dark:text-dark-text">{name}</p>
        <p className="text-xs text-light-textMuted dark:text-dark-textMuted">{value} orders ({pct}%)</p>
      </div>
    );
  };

  const BarTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0]?.payload;
    return (
      <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium text-light-text dark:text-dark-text">{item?.fullName}</p>
        <p className="text-xs text-light-textMuted dark:text-dark-textMuted">Qty: {item?.quantity}</p>
        <p className="text-xs text-light-textMuted dark:text-dark-textMuted">Revenue: {formatGK(item?.revenue)} GK</p>
      </div>
    );
  };

  return (
    <div>
      {/* Period Selector */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Analytics Overview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 transition-colors"
            >
              Export CSV
            </button>
            <div className="inline-flex gap-1 rounded-full bg-gray-200 dark:bg-dark-card p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    period === p.key
                      ? 'bg-white dark:bg-white text-gray-900 shadow-sm'
                      : 'bg-transparent text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-light-textMuted dark:text-dark-textMuted">From:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-light-text dark:text-dark-text" />
          <label className="text-sm text-light-textMuted dark:text-dark-textMuted">To:</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-light-text dark:text-dark-text" />
          {(startDate || endDate) && (
            <button onClick={() => { setStartDate(''); setEndDate(''); }}
              className="text-sm text-red-500 hover:text-red-400">Clear</button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Orders" value={data.totalOrders ?? 0} icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        } />
        <StatCard title="Total Revenue" value={`${formatGK(data.totalRevenue)} GK`} icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        } />
        <StatCard title="Avg Order Value" value={`${formatGK(data.averageOrderValue)} GK`} icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        } />
        <StatCard title="Total Students" value={data.totalStudents ?? 0} icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        } />
      </div>

      {/* === CHARTS SECTION === */}

      {/* Chart 1: Revenue Over Time (Area Chart) */}
      {revenueChartData.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-6 mb-8">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">Revenue Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="revenue" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} fill="url(#revenueGradient)" name="revenue" />
                <Area yAxisId="orders" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} fill="url(#ordersGradient)" name="orders" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-3 text-xs text-light-textMuted dark:text-dark-textMuted">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span>Revenue (GK)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span>Orders</span>
          </div>
        </div>
      )}

      {/* Charts Row: Order Status Pie + Top Items Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* Chart 2: Orders by Status (Donut Chart) */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-6">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">Orders by Status</h3>
          {orderStatusData.length === 0 ? (
            <p className="text-light-textMuted dark:text-dark-textMuted text-sm">No order data available.</p>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-light-textMuted dark:text-dark-textMuted">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 3: Top Selling Items (Horizontal Bar Chart) */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-6">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">Top Selling Items</h3>
          {topItemsChartData.length === 0 ? (
            <p className="text-light-textMuted dark:text-dark-textMuted text-sm">No items data available.</p>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItemsChartData} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={120} />
                  <Tooltip content={<BarTooltip />} />
                  <Bar dataKey="quantity" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* === TABLES SECTION === */}

      {/* Cafeteria Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-6">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">Top Selling Items</h3>
          {(!data.topSellingItems || data.topSellingItems.length === 0) ? (
            <p className="text-light-textMuted dark:text-dark-textMuted text-sm">No items data available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border">
                    <th className="text-left py-2 pr-4 font-medium text-light-textMuted dark:text-dark-textMuted">Item</th>
                    <th className="text-right py-2 px-4 font-medium text-light-textMuted dark:text-dark-textMuted">Qty</th>
                    <th className="text-right py-2 pl-4 font-medium text-light-textMuted dark:text-dark-textMuted">Revenue (GK)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topSellingItems.map((item, idx) => (
                    <tr key={item.itemId ?? idx} className="border-b border-light-border/50 dark:border-dark-border/50 last:border-0">
                      <td className="py-2.5 pr-4 text-light-text dark:text-dark-text">{item.itemName}</td>
                      <td className="py-2.5 px-4 text-right text-light-textMuted dark:text-dark-textMuted">{item.totalQuantity}</td>
                      <td className="py-2.5 pl-4 text-right font-medium text-light-text dark:text-dark-text">{formatGK(item.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-6">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">Cafeteria Performance</h3>
          {(!data.cafeteriaStats || data.cafeteriaStats.length === 0) ? (
            <p className="text-light-textMuted dark:text-dark-textMuted text-sm">No cafeteria data available.</p>
          ) : (
            <div className="space-y-4">
              {data.cafeteriaStats.map((cafe) => (
                <div key={cafe.cafeteriaId} className="p-4 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border/50 dark:border-dark-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-light-text dark:text-dark-text">{cafe.cafeteriaName}</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-light-text dark:text-dark-text font-medium">{cafe.averageRating?.toFixed(1) ?? 'N/A'}</span>
                      <span className="text-light-textMuted dark:text-dark-textMuted">({cafe.totalReviews ?? 0})</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-light-textMuted dark:text-dark-textMuted">Orders: </span>
                      <span className="font-medium text-light-text dark:text-dark-text">{cafe.orderCount}</span>
                    </div>
                    <div>
                      <span className="text-light-textMuted dark:text-dark-textMuted">Revenue: </span>
                      <span className="font-medium text-light-text dark:text-dark-text">{formatGK(cafe.revenue)} GK</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-6">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">Recent Orders</h3>
        {(!data.recentOrders || data.recentOrders.length === 0) ? (
          <p className="text-light-textMuted dark:text-dark-textMuted text-sm">No recent orders.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  <th className="text-left py-2 pr-4 font-medium text-light-textMuted dark:text-dark-textMuted">Order ID</th>
                  <th className="text-left py-2 px-4 font-medium text-light-textMuted dark:text-dark-textMuted">Status</th>
                  <th className="text-right py-2 px-4 font-medium text-light-textMuted dark:text-dark-textMuted">Amount (GK)</th>
                  <th className="text-left py-2 pl-4 font-medium text-light-textMuted dark:text-dark-textMuted">Placed At</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.orderId} className="border-b border-light-border/50 dark:border-dark-border/50 last:border-0">
                    <td className="py-2.5 pr-4 text-light-text dark:text-dark-text font-medium">#{order.orderId}</td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        order.status === 'PLACED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        order.status === 'READY' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-light-text dark:text-dark-text">{formatGK(order.totalAmount)}</td>
                    <td className="py-2.5 pl-4 text-light-textMuted dark:text-dark-textMuted">{formatDate(order.placedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-light-textMuted dark:text-dark-textMuted">{title}</span>
        <div className="text-light-accent dark:text-dark-accent">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-light-text dark:text-dark-text">{value}</p>
    </div>
  );
}

export default AnalyticsDashboard;
