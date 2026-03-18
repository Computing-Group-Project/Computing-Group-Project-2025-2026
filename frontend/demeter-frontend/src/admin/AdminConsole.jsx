import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import StaffCard from '../components/admin/StaffCard';
import WalletTable from '../components/admin/WalletTable';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import AuditLogTable from '../components/admin/AuditLogTable';
import api from '../utils/api.js';

function AdminConsole() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('staff');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({ username: '', password: '', cafeteriaId: 1 });
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [cafeterias, setCafeterias] = useState([]);

  useEffect(() => {
    if (activeTab === 'staff') fetchStaff();
  }, [activeTab]);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const res = await api.get('/api/cafeterias');
        setCafeterias(res.data.data || []);
      } catch {
        setCafeterias([]);
      }
    };
    fetchCafeterias();
  }, []);

  const getCafeteriaName = (id) => {
    const cafe = cafeterias.find(c => c.cafeteriaId === id);
    return cafe ? cafe.name : `Cafeteria #${id}`;
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get('/api/admin/users?role=STAFF');
      setStaffList((res.data.data || []).map(u => ({
        id: u.id,
        name: u.username.charAt(0).toUpperCase() + u.username.slice(1),
        status: 'Active',
        joinedDate: 'N/A',
        cafeteria: u.assignedCafeteriaId ? getCafeteriaName(u.assignedCafeteriaId) : 'Unassigned',
      })));
    } catch {
      setStaffList([]);
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaffData.username.trim() || !newStaffData.password.trim()) return;

    try {
      await api.post('/api/admin/staff', {
        username: newStaffData.username,
        password: newStaffData.password,
        cafeteriaId: newStaffData.cafeteriaId,
      });
      setNewStaffData({ username: '', password: '', cafeteriaId: 1 });
      setIsModalOpen(false);
      fetchStaff();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create staff', 'error');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      fetchStaff();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-white dark:bg-dark-bg border-b border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg bg-light-accent dark:bg-dark-accent text-white dark:text-dark-bg">D</div>
              <span className="text-xl font-semibold text-light-text dark:text-dark-text">Demeter</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { logout(); navigate('/login'); }} className="p-2 text-red-500 hover:text-red-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">Admin Console</h1>
          <p className="text-base text-light-textMuted dark:text-dark-textMuted">Manage staff, students, and system finances.</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex flex-wrap gap-1 rounded-full bg-gray-200 dark:bg-dark-card p-1">
            <button onClick={() => setActiveTab('staff')} className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'staff' ? 'bg-white dark:bg-white text-gray-900 shadow-sm' : 'bg-transparent text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text'}`}>Staff Management</button>
            <button onClick={() => setActiveTab('wallets')} className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'wallets' ? 'bg-white dark:bg-white text-gray-900 shadow-sm' : 'bg-transparent text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text'}`}>Student Wallets</button>
            <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-white text-gray-900 shadow-sm' : 'bg-transparent text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text'}`}>Analytics</button>
            <button onClick={() => setActiveTab('audit')} className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'audit' ? 'bg-white dark:bg-white text-gray-900 shadow-sm' : 'bg-transparent text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text'}`}>Audit Log</button>
            <button onClick={() => navigate('/admin/promotions')} className="px-6 py-2 rounded-full font-medium transition-all bg-transparent text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text">Promotions</button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'staff' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Staff Members ({staffList.length})</h2>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-light-accent dark:bg-dark-accent text-gray-800 dark:text-white hover:opacity-90">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add New Staff
              </button>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setIsModalOpen(false)}>
                <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-8 border border-light-border dark:border-dark-border shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                  <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">Add New Staff Member</h2>
                  <form onSubmit={handleAddStaff}>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Username</label>
                        <input type="text" required value={newStaffData.username} onChange={(e) => setNewStaffData({ ...newStaffData, username: e.target.value })} placeholder="e.g. john_doe" className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-textMuted dark:placeholder-dark-textMuted focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Password</label>
                        <input type="password" required value={newStaffData.password} onChange={(e) => setNewStaffData({ ...newStaffData, password: e.target.value })} placeholder="Min 8 chars, letters + numbers" className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-textMuted dark:placeholder-dark-textMuted focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Assigned Cafeteria</label>
                        <select value={newStaffData.cafeteriaId} onChange={(e) => setNewStaffData({ ...newStaffData, cafeteriaId: parseInt(e.target.value) })} className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all">
                          {cafeterias.length > 0 ? cafeterias.map(c => (
                            <option key={c.cafeteriaId} value={c.cafeteriaId}>{c.name} ({c.cafeteriaId})</option>
                          )) : (
                            <option value={1}>Loading cafeterias...</option>
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-8">
                      <button type="submit" className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors bg-light-accent dark:bg-dark-accent text-gray-800 dark:text-white hover:opacity-90">Create Account</button>
                      <button type="button" onClick={() => { setIsModalOpen(false); setNewStaffData({ username: '', password: '', cafeteriaId: 1 }); }} className="px-6 py-3 border border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors font-medium">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loadingStaff ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-teal-400 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {staffList.map(staff => (
                  <StaffCard key={staff.id} staff={staff} onDelete={handleDeleteStaff} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wallets' && <WalletTable />}

        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {activeTab === 'audit' && (
          <div>
            <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6">Audit Log</h2>
            <AuditLogTable />
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminConsole;
