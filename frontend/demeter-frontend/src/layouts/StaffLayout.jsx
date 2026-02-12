import React from 'react';
import Navbar from '../components/staff/NavBar'; 

const StaffLayout = ({ children }) => {
  return (
    // main container 
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      
      {/* navbar - fixed at the top */}
      <Navbar />

      {/* main content */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
      
    </div>
  );
};

export default StaffLayout;