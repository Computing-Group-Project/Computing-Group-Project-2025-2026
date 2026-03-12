import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx";
import StudentHome from "./student/StudentHome.jsx";
import CafeMenu from "./student/CafeMenu.jsx";
import Wallet from "./student/Wallet.jsx";
import Cart from "./student/Cart.jsx";
import Orders from "./student/Orders.jsx";

import Login from "./auth/Login.jsx";
function App() {
  return (
    <WalletProvider>
      <CartProvider>

        <BrowserRouter>

          <Routes>
            <Route path="/login" element={<Login />} />
      
            <Route path="/" element={<StudentHome />} />
            <Route path="/cafe/:id" element={<CafeMenu />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/login" />} />

          </Routes>

        </BrowserRouter>

      </CartProvider>
    </WalletProvider>
  );
}

export default App;
