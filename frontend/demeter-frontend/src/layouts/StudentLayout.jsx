import React from "react";
import Navbar from "../components/commen/Navbar";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        {children}
      </main>
    </div>
  );
}