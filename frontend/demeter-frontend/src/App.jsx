import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext.jsx";
import { WalletProvider } from "./contexts/WalletContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import StudentHome from "./student/StudentHome.jsx";
import CafeMenu from "./student/CafeMenu.jsx";
import Wallet from "./student/Wallet.jsx";
import Cart from "./student/Cart.jsx";
import Orders from "./student/Orders.jsx";
import Login from "./auth/Login.jsx";
import AdminConsole from "./admin/AdminConsole.jsx";
import PromotionManagementConsole from "./staff/PromotionManagementConsole.jsx";
import StaffDashboard from "./staff/StaffDashboard.jsx";
import StaffLayout from "./layouts/StaffLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ThemeToggle from "./components/common/ThemeToggle.jsx";
import NotFound from "./components/common/NotFound.jsx";

function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
      <ToastProvider>
      <AuthProvider>
        <WalletProvider>
          <CartProvider>
            <BrowserRouter>
              <ThemeToggle />
              <Routes>
                <Route path="/login" element={<Login />} />

                {/* Student routes */}
                <Route path="/" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentHome /></ProtectedRoute>} />
                <Route path="/cafe/:id" element={<ProtectedRoute allowedRoles={["STUDENT"]}><CafeMenu /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Wallet /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Cart /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Orders /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminLayout><AdminConsole /></AdminLayout></ProtectedRoute>} />

                {/* Staff routes */}
                <Route path="/staff" element={<ProtectedRoute allowedRoles={["STAFF", "ADMIN"]}><StaffLayout><StaffDashboard /></StaffLayout></ProtectedRoute>} />
                <Route path="/staff/promotions" element={<ProtectedRoute allowedRoles={["STAFF"]}><StaffLayout><PromotionManagementConsole /></StaffLayout></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </WalletProvider>
      </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
