import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar.jsx";
import ProfileModal from "../components/common/ProfileModal.jsx";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";

export default function StudentLayout({ children }) {

  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();
  const { clearCart } = useCart();

  /* LOGIN PROTECTION */
  useEffect(() => {

    const student = localStorage.getItem("student");

    if (!student) {
      navigate("/login");
    }

  }, []);


  /* LOGOUT */
  const handleLogout = () => {

    localStorage.removeItem("student");
    clearCart();

    navigate("/login");

  };


  return (

    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">

      <Navbar
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
