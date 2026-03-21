import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Shield, ChefHat, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

const portals = [
  {
    role: "STUDENT",
    label: "Student",
    icon: GraduationCap,
    accent: "teal",
    description: "Order food, track deliveries, manage your wallet",
    bg: "bg-teal-400",
    bgHover: "hover:border-teal-400",
    bgLight: "bg-teal-400/10",
    textAccent: "text-teal-400",
    btnClass: "bg-teal-400 hover:bg-teal-300 text-slate-900",
    focusRing: "focus:border-teal-400",
    glowColor: "bg-teal-400",
  },
  {
    role: "STAFF",
    label: "Staff",
    icon: ChefHat,
    accent: "amber",
    description: "Manage orders, update menus, handle your cafeteria",
    bg: "bg-amber-400",
    bgHover: "hover:border-amber-400",
    bgLight: "bg-amber-400/10",
    textAccent: "text-amber-400",
    btnClass: "bg-amber-400 hover:bg-amber-300 text-slate-900",
    focusRing: "focus:border-amber-400",
    glowColor: "bg-amber-400",
  },
  {
    role: "ADMIN",
    label: "Admin",
    icon: Shield,
    accent: "red",
    description: "System management, analytics, user administration",
    bg: "bg-red-500",
    bgHover: "hover:border-red-500",
    bgLight: "bg-red-500/10",
    textAccent: "text-red-400",
    btnClass: "bg-red-500 hover:bg-red-400 text-white",
    focusRing: "focus:border-red-500",
    glowColor: "bg-red-500",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [selectedPortal, setSelectedPortal] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === "ADMIN") navigate("/admin", { replace: true });
      else if (user.role === "STAFF") navigate("/staff", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const auth = await login(username, password);

      if (auth.role === "ADMIN") navigate("/admin");
      else if (auth.role === "STAFF") navigate("/staff");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedPortal(null);
    setUsername("");
    setPassword("");
    setError("");
  };

  const portal = portals.find((p) => p.role === selectedPortal);

  if (!selectedPortal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gradient-to-br dark:from-[#0f172a] dark:to-[#1e293b] transition-colors px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Demeter</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Bastion University Smart Cafeteria
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.role}
                onClick={() => setSelectedPortal(p.role)}
                className={`group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] ${p.bgHover} transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className={`w-16 h-16 rounded-2xl ${p.bgLight} flex items-center justify-center transition-colors`}>
                  <Icon className={p.textAccent} size={30} />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {p.label}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const Icon = portal.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gradient-to-br dark:from-[#0f172a] dark:to-[#1e293b] transition-colors px-4">
      <div className="w-full max-w-[430px] bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] shadow-2xl rounded-2xl p-6 sm:p-10 text-gray-900 dark:text-white relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-[3px] ${portal.glowColor} rounded-t-2xl`}></div>

        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex justify-center mb-5">
          <div className={`${portal.bgLight} w-14 h-14 flex items-center justify-center rounded-full`}>
            <Icon className={portal.textAccent} size={28} />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white">Demeter</h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1 mb-8">
          {portal.label} Portal
        </p>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
          {selectedPortal === "STUDENT" ? "Username or University ID" : "Username"}
        </label>
        <input
          type="text"
          placeholder={selectedPortal === "STUDENT" ? "Enter your username or university ID" : "Enter your username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full p-3 rounded-lg border border-gray-300 dark:border-[#334155] bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${portal.focusRing} mb-4`}
        />

        <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className={`w-full p-3 rounded-lg border border-gray-300 dark:border-[#334155] bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${portal.focusRing} mb-5`}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition disabled:opacity-50 ${portal.btnClass}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
