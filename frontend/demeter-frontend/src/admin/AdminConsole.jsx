import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import StaffCard from '../components/admin/StaffCard';
import WalletTable from '../components/admin/WalletTable';

function AdminConsole() {
  // We get the current theme and the function to change it from our Context
  const { theme, toggleTheme } = useTheme();
  // Tracks if we are looking at 'staff' or 'wallets'
  const [activeTab, setActiveTab] = useState('staff');
  // Controls if the 'Add Staff' form is visible
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  // staffList
  const [staffList, setStaffList] = useState([
    { id: 'u2', name: 'Sarah Staff', status: 'Active', joinedDate: 'Today' },
    { id: 'u6', name: 'Emily Davis', status: 'Active', joinedDate: 'Today' }
  ]);

  // Adding a new staff member to the list
  const handleAddStaff = (e) => {
    e.preventDefault();
    if (staffName.trim()) {
      const newStaff = {
        name: staffName,
        id: `u${staffList.length + 3}`,
        status: 'Active',
        joinedDate: 'Today'
      };
      setStaffList([...staffList, newStaff]);
      setStaffName('');
      setIsModalOpen(false);
    }
  };
// removing a perosn from the list
  const handleDeleteStaff = (id) => {
    setStaffList(staffList.filter(staff => staff.id !== id));
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-white dark:bg-dark-bg border-b border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg bg-light-accent dark:bg-dark-accent text-white dark:text-dark-bg">
                D
              </div>
              <span className="text-xl font-semibold text-light-text dark:text-dark-text">
                Demeter
              </span>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-transparent text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              {/* Profile */}
              <button className="w-10 h-10 rounded-full bg-gray-300 dark:bg-dark-card flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6 text-gray-600 dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {/* Logout */}
              <button className="p-2 text-red-500 hover:text-red-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Admin Console
          </h1>
          <p className="text-base text-light-textMuted dark:text-dark-textMuted">
            Manage staff, students, and system finances.
          </p>
        </div>

        {/* Tabs*/}
        <div className="mb-8">
          <div className="inline-flex gap-1 rounded-full bg-gray-200 dark:bg-dark-card p-1">
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'staff'
                  ? 'bg-white dark:bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              Staff Management
            </button>
            <button
              onClick={() => setActiveTab('wallets')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'wallets'
                  ? 'bg-white dark:bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              Student Wallets
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'staff' && (
          <div>
            {/* Staff Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-light-text dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                  Staff Members ({staffList.length})
                </h2>
              </div>
              
              {/* Add New Staff Button*/}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-light-accent dark:bg-dark-accent text-gray-800 dark:text-white hover:opacity-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Staff
              </button>
            </div>

            {/* Add Staff Form */}
            {isModalOpen && (
              <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-6 mb-6 shadow-sm">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Add New Staff Member
                </h3>
                <form onSubmit={handleAddStaff}>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-2.5 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-textMuted dark:placeholder-dark-textMuted focus:outline-none focus:ring-0 focus:border-light-border dark:focus:border-dark-border"
                      />
                    </div>
                    {/* Create Account Button */}
                    <button
                      type="submit"
                      disabled={!staffName.trim()}
                      className={
                        staffName.trim()
                          ? 'px-6 py-2.5 rounded-lg font-medium transition-colors bg-light-accent dark:bg-dark-accent text-gray-800 dark:text-white hover:opacity-90 cursor-pointer'
                          : 'px-6 py-2.5 rounded-lg font-medium transition-colors bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }
                    >
                      Create Account
                    </button>
                    {/* Cancel Button*/}
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setStaffName('');
                      }}
                      className="px-6 py-2.5 text-light-text dark:text-dark-text rounded-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-dark-bg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Staff Cards */}
            <div className="grid grid-cols-2 gap-4">
              {staffList.map(staff => (
                <StaffCard 
                  key={staff.id} 
                  staff={staff} 
                  onDelete={handleDeleteStaff}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <WalletTable />
        )}
      </main>
    </div>
  );
}

export default AdminConsole;