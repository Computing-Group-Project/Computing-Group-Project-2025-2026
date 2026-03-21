import React, { useState, useEffect } from 'react';
import api from '../../utils/api.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/api/admin/audit');
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLogs(data);
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const actionTypes = [...new Set(logs.map(l => l.action).filter(Boolean))].sort();

  const filtered = logs.filter(log => {
    const matchSearch = !search ||
      (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.targetTable || '').toLowerCase().includes(search.toLowerCase()) ||
      String(log.userId || '').includes(search) ||
      (log.ipAddress || '').includes(search);
    const matchAction = !filterAction || log.action === filterAction;
    return matchSearch && matchAction;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by action, table, user ID, or IP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-textMuted dark:placeholder-dark-textMuted focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent"
        />
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent"
        >
          <option value="">All Actions</option>
          {actionTypes.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-light-textMuted dark:text-dark-textMuted py-8">No audit log entries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-light-border dark:border-dark-border">
                <th className="text-left py-3 px-2 text-light-textMuted dark:text-dark-textMuted font-medium">Timestamp</th>
                <th className="text-left py-3 px-2 text-light-textMuted dark:text-dark-textMuted font-medium">User ID</th>
                <th className="text-left py-3 px-2 text-light-textMuted dark:text-dark-textMuted font-medium">Action</th>
                <th className="text-left py-3 px-2 text-light-textMuted dark:text-dark-textMuted font-medium">Target</th>
                <th className="text-left py-3 px-2 text-light-textMuted dark:text-dark-textMuted font-medium">Status</th>
                <th className="text-left py-3 px-2 text-light-textMuted dark:text-dark-textMuted font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, idx) => (
                <tr key={log.auditLogId || idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-2 text-light-text dark:text-dark-text whitespace-nowrap">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                  </td>
                  <td className="py-3 px-2 text-light-text dark:text-dark-text">{log.userId ?? 'N/A'}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      {log.action || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-light-text dark:text-dark-text">
                    {log.targetTable || '-'}{log.targetId ? ` #${log.targetId}` : ''}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === 'SUCCESS'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {log.status || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-light-textMuted dark:text-dark-textMuted text-xs">{log.ipAddress || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-4">
        Showing {filtered.length} of {logs.length} entries
      </p>
    </div>
  );
};

export default AuditLogTable;
