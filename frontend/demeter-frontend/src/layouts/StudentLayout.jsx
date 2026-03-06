import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";

export default function StudentLayout({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white transition-colors duration-300">

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        {children}
      </main>

    </div>
  );
}