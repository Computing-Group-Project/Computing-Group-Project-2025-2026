import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 h-10 pl-2 pr-3 rounded-full shadow-lg border transition-colors duration-300
        bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-xl"
    >
      <div className="relative w-12 h-6 rounded-full transition-colors duration-300 bg-gray-200 dark:bg-slate-600">
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
            ${isDark ? "left-[1.625rem] bg-indigo-500" : "left-0.5 bg-yellow-400"}`}
        >
          {isDark ? (
            <Moon size={12} className="text-white" />
          ) : (
            <Sun size={12} className="text-yellow-800" />
          )}
        </div>
      </div>

      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 select-none">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
