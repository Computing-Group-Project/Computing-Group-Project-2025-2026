import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../contexts/ToastContext.jsx';
import api from '../../utils/api.js';
import { connectWebSocket, subscribe, disconnectWebSocket } from '../../utils/websocket.js';

function WalletTable() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('500');
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const res = await api.get('/api/wallet/topup-requests');
      setPendingRequests(res.data.data || []);
    } catch {
      setPendingRequests([]);
    } finally {
      setPendingLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/api/admin/users?role=STUDENT');
        const users = res.data.data || [];
        setAllStudents(users.map(u => ({
          id: u.id,
          name: u.username.charAt(0).toUpperCase() + u.username.slice(1),
          balance: u.krakensBalance ?? 0,
        })));
      } catch {
        setAllStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  // Subscribe to WebSocket for real-time pending request notifications
  useEffect(() => {
    connectWebSocket((stompClient) => {
      subscribe(stompClient, '/topic/admin', (msg) => {
        if (msg.type === 'TOPUP_REQUEST') {
          fetchPendingRequests();
        }
      });
    });

    return () => disconnectWebSocket();
  }, [fetchPendingRequests]);

  const filteredStudents = searchQuery
    ? allStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(student.id).includes(searchQuery)
      )
    : allStudents;

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setSearchQuery('');
    setTopUpAmount('500');
  };

  const handleTopUp = async () => {
    if (!selectedStudent || !topUpAmount) return;
    const amount = parseFloat(topUpAmount);
    if (amount <= 0) return;

    try {
      await api.post('/api/wallet/topup', {
        userId: selectedStudent.id,
        amount: amount,
      });
      showToast(`Successfully added ${amount} GK to ${selectedStudent.name}'s wallet`, 'success');
      handleClearStudent();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to top up', 'error');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/wallet/topup-requests/${id}/approve`);
      showToast('Top-up request approved', 'success');
      fetchPendingRequests();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve request', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/wallet/topup-requests/${id}/reject`);
      showToast('Top-up request rejected', 'success');
      fetchPendingRequests();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject request', 'error');
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Pending Top-Up Requests */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
              Pending Top-Up Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  {pendingRequests.length}
                </span>
              )}
            </h2>
          </div>
          <p className="text-base text-light-textMuted dark:text-dark-textMuted ml-8">
            Review and approve or reject student wallet top-up requests.
          </p>
        </div>

        {pendingLoading && (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {!pendingLoading && pendingRequests.length === 0 && (
          <div className="text-center py-8 text-light-textMuted dark:text-dark-textMuted">
            No pending top-up requests
          </div>
        )}

        {!pendingLoading && pendingRequests.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.requestId}
                className="bg-gray-50 dark:bg-dark-bg rounded-xl border border-light-border dark:border-dark-border p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-light-text dark:text-dark-text">
                      {req.username?.charAt(0).toUpperCase() + req.username?.slice(1)}
                    </h3>
                    <p className="text-xs text-light-textMuted dark:text-dark-textMuted">
                      {formatDateTime(req.requestedAt)}
                    </p>
                  </div>
                </div>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-3">
                  {Number(req.amount).toFixed(2)} GK
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(req.requestId)}
                    className="flex-1 py-2 rounded-lg font-medium text-sm bg-green-500 hover:bg-green-600 text-white transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.requestId)}
                    className="flex-1 py-2 rounded-lg font-medium text-sm bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Top-Up */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 text-light-accent dark:text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">Manual Wallet Top-up</h2>
          </div>
          <p className="text-base text-light-textMuted dark:text-dark-textMuted ml-8">Search for a student to manually add funds to their account.</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-3">Find Student</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); if (selectedStudent) setSelectedStudent(null); }}
            placeholder="Search by name or ID..."
            className="w-full pl-4 pr-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-textMuted dark:placeholder-dark-textMuted focus:outline-none transition-all"
          />
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-teal-400 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {/* Results */}
        {!selectedStudent && searchQuery && filteredStudents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStudents.slice(0, 10).map((student) => (
              <button key={student.id} onClick={() => handleSelectStudent(student)} className="bg-white dark:bg-dark-bg rounded-xl border border-light-border dark:border-dark-border p-4 hover:shadow-md transition-shadow text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-gray-600 dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-light-text dark:text-dark-text">{student.name}</h3>
                      <p className="text-sm text-light-textMuted dark:text-dark-textMuted">ID: {student.id}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">GK {Number(student.balance).toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selected student */}
        {selectedStudent && (
          <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-5">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              <div className="flex-1 bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-gray-600 dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-light-text dark:text-dark-text text-lg">{selectedStudent.name}</h3>
                      <p className="text-sm text-light-textMuted dark:text-dark-textMuted">User ID: {selectedStudent.id}</p>
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Balance: GK {Number(selectedStudent.balance).toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={handleClearStudent} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-light-text dark:text-dark-text mb-2">Amount to Add (GK)</label>
                  <input type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} className="w-36 pl-4 pr-4 py-2.5 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none" min="0" />
                </div>
                <button onClick={handleTopUp} className="px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap mt-7 bg-light-accent hover:opacity-90 text-white dark:bg-dark-accent dark:text-white">
                  Confirm Top Up
                </button>
              </div>
            </div>
          </div>
        )}

        {searchQuery && filteredStudents.length === 0 && !selectedStudent && (
          <div className="text-center py-8 text-light-textMuted dark:text-dark-textMuted">No students found matching &quot;{searchQuery}&quot;</div>
        )}
      </div>
    </div>
  );
}

export default WalletTable;
