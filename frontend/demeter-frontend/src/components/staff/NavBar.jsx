import React, { useState, useEffect } from 'react';

const Navbar = () => {
  // state: keep track of mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // effect
  useEffect(() => {
    // check if the html tag already has the 'dark' class (from previous sessions)
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  // toggle btn
  const toggleTheme = () => {
    if (isDarkMode) {
      // switch to light
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      // switch to dark
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center transition-colors duration-300">
      
      {/* logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
          D
        </div>
        <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
          Demeter
        </span>
      </div>

      {/* controls */}
      <div className="flex items-center gap-4">
        
        {/* toggle btn */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? (
            // sun 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            // moon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        {/* user profile */}
        <div className="flex items-center gap-3">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-100"
          />
          
          {/* logout btn */}
          <button className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-600 transition-colors" title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;