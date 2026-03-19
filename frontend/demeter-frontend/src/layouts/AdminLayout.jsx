import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import ProfileModal from '../components/common/ProfileModal.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const AdminLayout = ({ children }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const role = user?.role || 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <Navbar
        showBalance={false}
        showCart={false}
        showNotifications={role === 'STAFF'}
        onProfileClick={() => setProfileOpen(!profileOpen)}
        onExitClick={handleLogout}
        profilePhoto={profilePhoto}
      />

      <main className="max-w-7xl mx-auto px-8 py-8">
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
};

export default AdminLayout;
