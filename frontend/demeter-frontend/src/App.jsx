import { ThemeProvider } from './contexts/ThemeContext';
import AdminConsole from './admin/AdminConsole';

function App() {
  return (
    <ThemeProvider>
      <AdminConsole />
    </ThemeProvider>
import React from 'react';
import StaffDashboard from './staff/StaffDashboard';
import StaffLayout from './layouts/StaffLayout';

function App() {
  return (
    <StaffLayout>
      <StaffDashboard/>
    </StaffLayout>
  );
}

export default App;