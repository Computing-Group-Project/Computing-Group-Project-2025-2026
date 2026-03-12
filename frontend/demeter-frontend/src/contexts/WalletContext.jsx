import { createContext, useContext, useState } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {

  // load logged student from localStorage
  const storedStudent = JSON.parse(localStorage.getItem("student"));

  const [balance, setBalance] = useState(
    storedStudent?.wallet || 1500
  );

  const addFunds = (amount) => {
    setBalance((prev) => prev + amount);
  };

  const deductFunds = (amount) => {
    setBalance((prev) => prev - amount);
  };

  return (
    <WalletContext.Provider value={{ balance, addFunds, deductFunds }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);