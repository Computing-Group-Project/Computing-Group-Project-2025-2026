import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Shield, ChefHat } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");

  // Predefined student accounts
  const students = {
    "32566": {
      id: "32566",
      fullName: "Alex Fernando",
      batch: "Batch 2023",
      wallet: 1500
    },
    "32567": {
      id: "32567",
      fullName: "Maria Silva",
      batch: "Batch 2022",
      wallet: 980
    }
  };

  // Predefined staff accounts
  const staff = {
    "S1001": {
      id: "S1001",
      fullName: "John Carter",
      role: "Staff"
    },
    "S1002": {
      id: "S1002",
      fullName: "Linda Brown",
      role: "Staff"
    },
    "A1001": {
      id: "A1001",
      fullName: "Michael Scott",
      role: "Admin"
    }
  };

  const handleStudentLogin = () => {
    if (!studentId) {
      alert("Please enter your University ID");
      return;
    }

    const student = students[studentId];
    if (!student) {
      alert("Student not found");
      return;
    }

    localStorage.setItem("student", JSON.stringify(student));
    navigate("/");
  };

  const handleStaffLogin = (id) => {
    const user = staff[id];
    if (!user) {
      alert("Staff/Admin not found");
      return;
    }

    localStorage.setItem("staff", JSON.stringify(user));

    if (user.role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/staff");
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

        {/* Label */}
        <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">University ID</label>

        {/* Input */}
        <input
          type="text"
          placeholder="e.g. 2024-STUD-001"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#334155] bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-teal-400 mb-5"
        />

        {/* Login Button */}
        <button
          onClick={handleStudentLogin}
          className="w-full py-3 rounded-lg bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 transition"
        >
          Login as Student
        </button>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-[#334155]"></div>
          <span className="px-4 text-xs tracking-widest text-gray-500 dark:text-gray-400">STAFF ACCESS</span>
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-[#334155]"></div>
        </div>

        {/* Staff + Admin */}
        <div className="flex gap-4">
          <button
            onClick={() => handleStaffLogin("S1001")}
            className="flex items-center justify-center gap-2 flex-1 border border-gray-300 dark:border-[#334155] text-gray-700 dark:text-white rounded-lg py-3 hover:border-teal-400 transition"
          >
            <ChefHat size={18}/> Staff
          </button>

          <button
            onClick={() => handleStaffLogin("A1001")}
            className="flex items-center justify-center gap-2 flex-1 border border-gray-300 dark:border-[#334155] text-gray-700 dark:text-white rounded-lg py-3 hover:border-teal-400 transition"
          >
            <Shield size={18}/> Admin
          </button>
        </div>
      </div>
    </div>
  );
}
