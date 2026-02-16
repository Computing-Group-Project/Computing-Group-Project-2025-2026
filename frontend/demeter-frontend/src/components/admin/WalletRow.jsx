import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

function WalletTable() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('500');

  // Sample student data
  const allStudents = [
    { id: 'u4', name: 'Jamie Chen', balance: 120 },
    { id: 'u5', name: 'Marcus Johnson', balance: 86 },
    { id: 'u6', name: 'Alex Mercer', balance: 450 },
  ];

  // Filter students based on search query
  const filteredStudents = searchQuery
    ? allStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.id.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <svg 
            className={`w-6 h-6 ${theme === 'light' ? 'text-rose-400' : 'text-teal-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
            Student Wallet Top-up
          </h2>
        </div>
        <p className="text-base text-light-textMuted dark:text-dark-textMuted ml-8">
          Search for a student to manually add funds to their account.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-3">
          Find Student
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 dark:text-dark-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-textMuted dark:placeholder-dark-textMuted focus:outline-none focus:ring-0 focus:border-light-border dark:focus:border-dark-border transition-all"
          />
        </div>
      </div>

      {/* Student Results */}
      {!selectedStudent && searchQuery && filteredStudents.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {filteredStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => handleSelectStudent(student)}
              className="bg-white dark:bg-dark-bg rounded-xl border border-light-border dark:border-dark-border p-4 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-gray-600 dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-light-text dark:text-dark-text">
                      {student.name}
                    </h3>
                    <p className="text-sm text-light-textMuted dark:text-dark-textMuted">
                      ID: {student.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-sm">GK {student.balance}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Student Card */}
      {selectedStudent && (
        <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-gray-600 dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-light-text dark:text-dark-text text-lg">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-sm text-light-textMuted dark:text-dark-textMuted">
                      Current Balance: <span className="font-medium text-amber-600 dark:text-amber-400">GK {selectedStudent.balance}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClearStudent}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Amount to Add (GK)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-textMuted dark:text-dark-textMuted">+</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-36 pl-8 pr-4 py-2.5 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-0 focus:border-light-border dark:focus:border-dark-border"
                    min="0"
                  />
                </div>
              </div>

              {/* Confirm Top Up Button*/}
              <button className="px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap mt-7 bg-light-accent dark:bg-dark-accent text-gray-800 dark:text-white hover:opacity-90">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Confirm Top Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {searchQuery && filteredStudents.length === 0 && !selectedStudent && (
        <div className="text-center py-8 text-light-textMuted dark:text-dark-textMuted">
          No students found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}

export default WalletTable;