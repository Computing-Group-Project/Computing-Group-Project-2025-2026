import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext.jsx";
import { WalletProvider } from "./contexts/WalletContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
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
      <WalletProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* Student routes */}
              <Route path="/" element={<StudentHome />} />
              <Route path="/cafe/:id" element={<CafeMenu />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminConsole />} />
              <Route path="/admin/promotions" element={<PromotionManagementConsole />} />

              {/* Staff routes */}
              <Route path="/staff" element={<StaffLayout><StaffDashboard /></StaffLayout>} />

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
