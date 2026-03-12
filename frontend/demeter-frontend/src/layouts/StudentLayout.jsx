import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar.jsx";
import ProfileModal from "../components/common/ProfileModal.jsx";
import { useNavigate } from "react-router-dom";

export default function StudentLayout({ children }) {

  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();

  /* LOGIN PROTECTION */
  useEffect(() => {

    const student = localStorage.getItem("student");

    if (!student) {
      navigate("/login");
    }

  }, []);


  /* DARK MODE SYSTEM */
  useEffect(() => {

    const root = window.document.documentElement;

    if (darkMode)
      root.classList.add("dark");
    else
      root.classList.remove("dark");

  }, [darkMode]);


  /* LOGOUT */
  const handleLogout = () => {

    localStorage.removeItem("student");

    navigate("/login");

  };


  return (

    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onAddBalance={() => navigate("/wallet")}
        onProfileClick={() => setProfileOpen(!profileOpen)}
        onExitClick={handleLogout}
        profilePhoto={profilePhoto}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        {children}
      </main>

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        setProfilePhoto={setProfilePhoto}
        profilePhoto={profilePhoto}
      />

    </div>

  );
}
