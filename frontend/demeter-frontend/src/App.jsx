import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext.jsx";
import { WalletProvider } from "./contexts/WalletContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import StudentHome from "./student/StudentHome.jsx";
import CafeMenu from "./student/CafeMenu.jsx";
import Wallet from "./student/Wallet.jsx";
import Cart from "./student/Cart.jsx";
import Orders from "./student/Orders.jsx";
import Login from "./auth/Login.jsx";
import AdminConsole from "./admin/AdminConsole.jsx";
import PromotionManagementConsole from "./admin/PromotionManagementConsole.jsx";
import StaffDashboard from "./staff/StaffDashboard.jsx";
import StaffLayout from "./layouts/StaffLayout.jsx";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />

                {/* Student routes */}
                <Route path="/" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentHome /></ProtectedRoute>} />
                <Route path="/cafe/:id" element={<ProtectedRoute allowedRoles={["STUDENT"]}><CafeMenu /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Wallet /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Cart /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Orders /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminConsole /></ProtectedRoute>} />
                <Route path="/admin/promotions" element={<ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}><PromotionManagementConsole /></ProtectedRoute>} />

                {/* Staff routes */}
                <Route path="/staff" element={<ProtectedRoute allowedRoles={["STAFF", "ADMIN"]}><StaffLayout><StaffDashboard /></StaffLayout></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
