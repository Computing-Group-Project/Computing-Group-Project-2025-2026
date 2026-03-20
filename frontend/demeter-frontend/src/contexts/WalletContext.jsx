import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api.js";
import { useAuth } from "./AuthContext.jsx";
import { connectWebSocket, subscribe, disconnectWebSocket } from "../utils/websocket.js";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const fetchBalance = useCallback(async () => {
    try {
      if (!isAuthenticated || user?.role !== "STUDENT") return;

      setLoading(true);
      setError(null);
      const response = await api.get("/api/wallet/balance");
      setBalance(parseFloat(response.data.data.balance) || 0);
    } catch (err) {
      console.error("Failed to fetch wallet balance:", err);
      setError("Failed to load balance");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  // Re-fetch balance when auth state changes (login/logout)
  useEffect(() => {
    if (isAuthenticated && user?.role === "STUDENT") {
      fetchBalance();
    } else {
      setBalance(0);
    }
  }, [isAuthenticated, user?.role, fetchBalance]);

  // Subscribe to WebSocket for real-time balance updates
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "STUDENT") return;

    connectWebSocket((stompClient) => {
      subscribe(stompClient, "/topic/orders", () => {
        fetchBalance();
      });
      subscribe(stompClient, `/user/${user.username}/queue/notifications`, (msg) => {
        if (msg.type === "TOPUP_APPROVED") {
          fetchBalance();
        }
      });
    });

    return () => disconnectWebSocket();
  }, [isAuthenticated, user?.role, user?.username, fetchBalance]);

  const refreshBalance = fetchBalance;

  const addFunds = (amount) => {
    setBalance((prev) => prev + amount);
  };

  const deductFunds = (amount) => {
    setBalance((prev) => prev - amount);
  };

  return (
    <WalletContext.Provider value={{ balance, addFunds, deductFunds, refreshBalance, loading, error }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
