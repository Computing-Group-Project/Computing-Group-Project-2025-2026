import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import StaffLayout from "./layouts/StaffLayout";
import StudentLayout from "./layouts/StudentLayout";
import AdminConsole from "./admin/AdminConsole";
import StaffDashboard from "./staff/StaffDashboard";
import Checkout from "./student/Checkout";
import Orders from "./student/Orders";

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/admin" element={<AdminConsole />} />
                    <Route path="/" element={<Checkout />} />
                    <Route path="/staff" element={
                        <StaffLayout>
                            <StaffDashboard />
                        </StaffLayout>} />
                    <Route path="/checkout" element={<Checkout />} />
                  <Route
  path="/orders"
  element={
    <StudentLayout>
      <Orders />
    </StudentLayout>
  }
/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
//changed the Structure of the previous code and fixed some errors