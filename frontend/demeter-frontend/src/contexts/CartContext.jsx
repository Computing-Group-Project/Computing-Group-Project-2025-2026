import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "./ToastContext.jsx";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

function getKey(userId) {
  return userId ? `cart_${userId}` : null;
}

function readCart(key) {
  if (!key) return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveCart(key, cart) {
  if (key) localStorage.setItem(key, JSON.stringify(cart));
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const storageKey = getKey(user?.userId);
  const keyRef = useRef(storageKey);

  const [cart, setCart] = useState(() => readCart(storageKey));
  const [pendingItem, setPendingItem] = useState(null);
  const { showToast } = useToast();
  const showToastRef = useRef(showToast);
  useEffect(() => { showToastRef.current = showToast; }, [showToast]);

  useEffect(() => {
    keyRef.current = storageKey;
    setCart(readCart(storageKey)); // eslint-disable-line react-hooks/set-state-in-effect
  }, [storageKey]);

  const setCartAndSave = useCallback((updater) => {
    setCart((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveCart(keyRef.current, next);
      return next;
    });
  }, []);

  const addToCart = useCallback((item) => {
    let added = false;
    setCart((prev) => {
      if (prev.length > 0 && prev[0].cafeteriaId !== item.cafeteriaId) {
        setPendingItem(item);
        return prev;
      }
      added = true;
      const next = [...prev, item];
      saveCart(keyRef.current, next);
      return next;
    });
    return added;
  }, []);

  const confirmSwitch = useCallback(() => {
    if (pendingItem) {
      setCartAndSave([pendingItem]);
      setPendingItem(null);
    }
  }, [pendingItem, setCartAndSave]);

  const cancelSwitch = useCallback(() => {
    setPendingItem(null);
  }, []);

  const removeFromCart = useCallback((index) => {
    setCartAndSave((prev) => prev.filter((_, i) => i !== index));
  }, [setCartAndSave]);

  const updateQuantity = useCallback((index, newQty) => {
    if (newQty < 1) return;
    setCartAndSave((prev) => prev.map((item, i) => {
      if (i !== index) return item;
      return { ...item, qty: newQty, total: item.price * newQty };
    }));
  }, [setCartAndSave]);

  const clearCart = useCallback(() => {
    setCartAndSave([]);
  }, [setCartAndSave]);

  const total = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}

      {pendingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={cancelSwitch}>
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Switch cafeteria?</h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Your cart has items from a different cafeteria. Adding <strong className="text-gray-900 dark:text-white">{pendingItem.title}</strong> will clear your current cart and start a new one.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmSwitch}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
              >
                Switch & Add
              </button>
              <button
                onClick={cancelSwitch}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Keep Current Cart
              </button>
            </div>
          </div>
        </div>
      )}
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
