import React from "react";
import { Moon, ShoppingBag, LogOut } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">

        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DBAF83] font-bold text-white">
            D
          </div>
          <span className="text-lg font-semibold text-[#DBAF83]">
            Demeter
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">

          {/* Wallet pill */}
          <div className="flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-2">
            <div className="h-6 w-6 overflow-hidden rounded-full bg-gray-200" />
            <span className="font-semibold text-yellow-600">
              450 GK
            </span>
            <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-pink-200 text-lg font-bold text-gray-800">
              +
            </button>
          </div>

          {/* Moon Icon */}
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Moon size={20} className="text-gray-700" />
          </button>

          {/* Orders Icon */}
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <ShoppingBag size={20} className="text-gray-700" />
          </button>

          {/* Profile */}
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200" />

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300" />

          {/* Logout */}
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <LogOut size={20} className="text-red-500" />
          </button>

        </div>
      </div>
    </header>
  );
}