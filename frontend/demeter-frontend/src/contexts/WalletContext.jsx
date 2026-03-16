import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api.js";
import { connectWebSocket, subscribe, disconnectWebSocket } from "../utils/websocket.js";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBalance = useCallback(async () => {
    try {
      const authData = localStorage.getItem("authData");
      if (!authData) return;

      const { role } = JSON.parse(authData);
      if (role !== "STUDENT") return;

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
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Subscribe to WebSocket for real-time balance updates
  useEffect(() => {
    const authData = localStorage.getItem("authData");
    if (!authData) return;

    const { role } = JSON.parse(authData);
    if (role !== "STUDENT") return;

    connectWebSocket((stompClient) => {
      // Refresh balance whenever an order event occurs (payment, refund, etc.)
      subscribe(stompClient, "/topic/orders", () => {
        fetchBalance();
      });
    });

    return () => disconnectWebSocket();
  }, [fetchBalance]);

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
