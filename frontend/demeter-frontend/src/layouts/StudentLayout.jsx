import React, { useState, useEffect } from "react";
import Navbar from "../components/commen/Navbar";

export default function StudentLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        {children}
      </main>
    </div>
  );
}