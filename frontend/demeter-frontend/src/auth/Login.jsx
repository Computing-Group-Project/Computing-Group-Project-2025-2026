import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Shield, ChefHat } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already-authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === "ADMIN") navigate("/admin", { replace: true });
      else if (user.role === "STAFF") navigate("/staff", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (overrideUsername, overridePassword) => {
    const u = overrideUsername || username;
    const p = overridePassword || password;

    if (!u || !p) {
      setError("Please enter username and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const auth = await login(u, p);

      if (auth.role === "ADMIN") {
        navigate("/admin");
      } else if (auth.role === "STAFF") {
        navigate("/staff");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gradient-to-br dark:from-[#1f2a37] dark:to-[#334155] transition-colors">
      <div className="w-[90vw] max-w-[430px] bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] shadow-2xl rounded-2xl p-6 sm:p-10 text-gray-900 dark:text-white relative overflow-hidden">

        {/* top glow border */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-teal-400 rounded-t-2xl"></div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-teal-400/20 w-14 h-14 flex items-center justify-center rounded-full">
            <GraduationCap className="text-teal-400" size={28}/>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white">Demeter</h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1 mb-8">
          Bastion University Smart Cafeteria
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Username */}
        <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#334155] bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-teal-400 mb-4"
        />

        {/* Password */}
        <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#334155] bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-teal-400 mb-5"
        />

        {/* Login Button */}
        <button
          onClick={() => handleLogin()}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-[#334155]"></div>
          <span className="px-4 text-xs tracking-widest text-gray-500 dark:text-gray-400">QUICK LOGIN</span>
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-[#334155]"></div>
        </div>

        {/* Staff + Admin quick login */}
        <div className="flex gap-4">
          <button
            onClick={() => handleLogin("swain", "pass")}
            disabled={loading}
            className="flex items-center justify-center gap-2 flex-1 border border-gray-300 dark:border-[#334155] text-gray-700 dark:text-white rounded-lg py-3 hover:border-teal-400 transition disabled:opacity-50"
          >
            <ChefHat size={18}/> Staff
          </button>

          <button
            onClick={() => handleLogin("admin_user", "pass")}
            disabled={loading}
            className="flex items-center justify-center gap-2 flex-1 border border-gray-300 dark:border-[#334155] text-gray-700 dark:text-white rounded-lg py-3 hover:border-teal-400 transition disabled:opacity-50"
          >
            <Shield size={18}/> Admin
          </button>
        </div>
      </div>
    </div>
  );
}
