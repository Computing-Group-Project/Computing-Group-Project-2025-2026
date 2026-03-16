import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../utils/api.js";

export const AuthContext = createContext();

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(() => {
    const stored = localStorage.getItem("authData");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (isTokenExpired(parsed?.token)) {
      localStorage.removeItem("authData");
      return null;
    }
    return parsed;
  });

  // Periodically check token expiry
  useEffect(() => {
    if (!authData?.token) return;
    const interval = setInterval(() => {
      if (isTokenExpired(authData.token)) {
        localStorage.removeItem("authData");
        setAuthData(null);
      }
    }, 60000); // check every minute
    return () => clearInterval(interval);
  }, [authData?.token]);

  const login = useCallback(async (username, password) => {
    const response = await api.post("/api/auth/login", { username, password });
    const data = response.data.data; // ApiResponse wraps in .data
    const auth = {
      token: data.token,
      userId: data.userId,
      username: data.username,
      role: data.role,
      assignedCafeteriaId: data.assignedCafeteriaId,
      loginAt: Date.now(),
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
