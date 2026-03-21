import React from 'react';

const roleColors = {
  STUDENT: { ring: '#14b8a6', inner: 'rgba(20,184,166,0.4)', track: 'border-gray-200 dark:border-gray-700', text: 'text-gray-400 dark:text-gray-500' },
  STAFF: { ring: '#f59e0b', inner: 'rgba(245,158,11,0.4)', track: 'border-gray-200 dark:border-gray-700', text: 'text-gray-400 dark:text-gray-500' },
  ADMIN: { ring: '#ef4444', inner: 'rgba(239,68,68,0.4)', track: 'border-gray-200 dark:border-gray-700', text: 'text-gray-400 dark:text-gray-500' },
};

function getRole() {
  try {
    const data = JSON.parse(localStorage.getItem('authData'));
    return data?.role || null;
  } catch {
    return null;
  }
}

export default function LoadingSpinner({ label }) {
  const role = getRole();
  const colors = roleColors[role] || roleColors.STUDENT;

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <style>{`@keyframes spin-reverse{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}`}</style>
      <div className="relative w-12 h-12">
        <div className={`absolute inset-0 rounded-full ${colors.track}`} style={{ borderWidth: '4px', borderStyle: 'solid' }}></div>
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{ borderWidth: '4px', borderStyle: 'solid', borderColor: `${colors.ring} transparent transparent ${colors.ring}` }}
        ></div>
        <div
          className="absolute inset-2 rounded-full"
          style={{ borderWidth: '4px', borderStyle: 'solid', borderColor: `transparent ${colors.inner} ${colors.inner} transparent`, animation: 'spin-reverse 0.8s linear infinite' }}
        ></div>
      </div>
      {label && (
        <span className={`font-medium ${colors.text} text-sm animate-pulse`}>{label}</span>
      )}
    </div>
  );
}
