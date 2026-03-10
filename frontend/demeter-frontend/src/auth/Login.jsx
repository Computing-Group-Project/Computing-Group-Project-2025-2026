import React from 'react';
import { GraduationCap, Landmark, ShieldCheck } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[450px] bg-[#1e293b]/50 border border-slate-700 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-teal-500/10 p-4 rounded-full mb-4 border border-teal-500/20">
            <GraduationCap className="text-teal-400 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Demeter</h1>
          <p className="text-slate-400 text-sm mt-1">
            Bastion University Smart Cafeteria
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-slate-200 text-sm font-medium ml-1">
              University ID
            </label>
            <input
              type="text"
              placeholder="e.g. 2024-STUD-001"
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
            />
          </div>

          <button className="w-full bg-[#5eead4] hover:bg-teal-300 text-slate-900 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]">
            Login as Student
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Staff Access
            </span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 border border-slate-700 bg-transparent hover:bg-slate-800 text-white py-3 rounded-xl transition-colors text-sm font-medium">
              <Landmark size={18} className="text-slate-400" />
              Staff
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 border border-slate-700 bg-transparent hover:bg-slate-800 text-white py-3 rounded-xl transition-colors text-sm font-medium">
              <ShieldCheck size={18} className="text-slate-400" />
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
