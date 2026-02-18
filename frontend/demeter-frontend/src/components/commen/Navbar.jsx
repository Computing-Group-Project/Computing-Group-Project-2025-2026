import React from "react";
import { Moon, Sun, ShoppingBag, LogOut } from "lucide-react";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <header className="w-full border-b bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DBAF83] font-bold text-white">
            D
          </div>
          <span className="text-lg font-semibold text-[#DBAF83]">
            Demeter
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">

          <div className="flex items-center gap-3 rounded-full border bg-gray-50 px-3 py-2 dark:bg-gray-800 dark:border-gray-700">

            {/* Profile image */}
            <div className="h-8 w-8 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/833/833524.png"
                alt="coin"
                className="h-6 w-6 object-contain"
              />
            </div>

            {/* Balance */}
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">
              450 GK
            </span>

            {/* Plus Button */}
            <button
              className="
                  flex items-center justify-center
                  h-8 w-8
                  rounded-full
                  bg-rose-300 text-gray-800
                  dark:bg-teal-400 dark:text-white
                  text-1xl font-medium leading-none
                  transition hover:scale-105 active:scale-95
            "
            >
              +
            </button>

          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-gray-700" />
            )}
          </button>

          {/* Orders */}
          <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ShoppingBag size={20} className="text-gray-700 dark:text-gray-200" />
          </button>

          {/* Profile */}
          <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-500" />

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Logout */}
          <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <LogOut size={20} className="text-red-500" />
          </button>

        </div>
      </div>
    </header>
  );
}