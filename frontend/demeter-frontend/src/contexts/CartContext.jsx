import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useToast } from "./ToastContext.jsx";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { showToast } = useToast();
  const showToastRef = useRef(showToast);
  useEffect(() => { showToastRef.current = showToast; }, [showToast]);

  const addToCart = (item) => {
    setCart((prev) => {
      // If cart has items from a different cafeteria, auto-clear and notify
      if (prev.length > 0 && prev[0].cafeteriaId !== item.cafeteriaId) {
        showToastRef.current("Cart cleared — switched to a different cafeteria.", "info");
        return [item];
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
