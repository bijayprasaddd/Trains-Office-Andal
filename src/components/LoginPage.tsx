import React, { useState } from 'react';
import { Lock, User, KeyRound, ShieldAlert, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { IRLogo } from './IRLogo';
import { RailwayRole, UserSession } from '../types/railway';
import { authenticateUser, VALID_USERS } from '../services/storage';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<RailwayRole>('ADMIN');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Role quick switch helper
  const handleSelectRole = (role: RailwayRole) => {
    setSelectedRole(role);
    setError('');
    if (role === 'ADMIN') {
      setUsername('admin');
      setPassword('admin123');
    } else if (role === 'OPERATOR') {
      setUsername('operator');
      setPassword('op123');
    } else {
      setUsername('viewer');
      setPassword('view123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const user = authenticateUser(username, password);
    if (!user) {
      setError('Invalid Login ID or Password. Please check credentials.');
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(user);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-[#0B192C] flex flex-col justify-between text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Railway Authority Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-semibold text-slate-200 tracking-wide">
            EASTERN RAILWAY · ASANSOL DIVISION
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-amber-400 font-mono hidden sm:inline">
            ANDAL MARSHALLING YARD (STATION CODE: UDL)
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          SECURE TERMINAL ACCESS SYSTEM
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-xl">
          {/* Official Emblem & Branding */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-3 ring-4 ring-slate-800/50">
              <IRLogo size={68} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              TRAINS OFFICE ANDAL
            </h1>
            <p className="text-amber-400 text-xs sm:text-sm font-semibold tracking-wider mt-1 uppercase">
              Freight Operations &amp; Rolling Stock Management Portal
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Eastern Railway · Asansol Division (UDL Yard)
            </p>
          </div>

          {/* Secure Login Box */}
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Step 1: Select 1 of 3 Roles */}
            <div className="bg-slate-950/90 p-4 border-b border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                Select Authorized Login Profile (3 Types)
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {/* 1. Admin (CTNC I/C) */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('ADMIN')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'ADMIN'
                      ? 'bg-amber-500/15 border-amber-400 text-white ring-2 ring-amber-400/30'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                      1. ADMIN
                    </span>
                    {selectedRole === 'ADMIN' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold text-white leading-tight">
                      CTNC (I/C)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      In-Charge Admin
                    </div>
                  </div>
                </button>

                {/* 2. Trains Office (Operator) */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('OPERATOR')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'OPERATOR'
                      ? 'bg-blue-600/15 border-blue-400 text-white ring-2 ring-blue-400/30'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white">
                      2. OPERATOR
                    </span>
                    {selectedRole === 'OPERATOR' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold text-white leading-tight">
                      TRAINS OFFICE
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      CTNC Operator
                    </div>
                  </div>
                </button>

                {/* 3. Yard Staff (Viewer) */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('VIEWER')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'VIEWER'
                      ? 'bg-emerald-600/15 border-emerald-400 text-white ring-2 ring-emerald-400/30'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                      3. VIEWER
                    </span>
                    {selectedRole === 'VIEWER' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold text-white leading-tight">
                      YARD STAFF
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      Read-Only Viewer
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Login Credentials Form */}
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Login ID / Employee Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter Login ID"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter Password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Trains Office Andal System</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Footer */}
            <div className="bg-slate-950/60 p-4 border-t border-slate-800/80 text-[11px] text-slate-400">
              <div className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Authorized Andal Railway Personnel Credentials:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px] mt-2">
                <div
                  onClick={() => handleSelectRole('ADMIN')}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-amber-400/50"
                >
                  <span className="text-amber-400 font-bold">1. Admin:</span> admin / admin123
                </div>
                <div
                  onClick={() => handleSelectRole('OPERATOR')}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-blue-400/50"
                >
                  <span className="text-blue-400 font-bold">2. Operator:</span> operator / op123
                </div>
                <div
                  onClick={() => handleSelectRole('VIEWER')}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-emerald-400/50"
                >
                  <span className="text-emerald-400 font-bold">3. Viewer:</span> viewer / view123
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-5 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500/70" />
            <span>
              Restricted to Indian Railways Andal Marshalling Yard Personnel. Offline &amp; Network Capable.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-3 text-center text-slate-500 text-xs">
        Indian Railways · Eastern Railway · Trains Office Andal (UDL) · Freight Operations Division
      </footer>
    </div>
  );
};
