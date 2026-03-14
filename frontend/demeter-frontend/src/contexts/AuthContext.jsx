import { createContext, useContext, useState, useCallback } from "react";
import api from "../utils/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(() => {
    const stored = localStorage.getItem("authData");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username, password) => {
    const response = await api.post("/api/auth/login", { username, password });
    const data = response.data.data; // ApiResponse wraps in .data
    const auth = {
      token: data.token,
      userId: data.userId,
      username: data.username,
      role: data.role,
      assignedCafeteriaId: data.assignedCafeteriaId,
    };
    localStorage.setItem("authData", JSON.stringify(auth));
    setAuthData(auth);
    return auth;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authData");
    setAuthData(null);
  }, []);

  const isAuthenticated = !!authData?.token;

  return (
    <AuthContext.Provider
      value={{
        user: authData,
        token: authData?.token,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
