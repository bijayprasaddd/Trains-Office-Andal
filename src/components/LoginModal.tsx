import React, { useState } from 'react';
import { X, Lock, User, Clock, ShieldCheck, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { IRLogo } from './IRLogo';
import { UserSession, RailwayRole } from '../types/railway';
import { authenticateUser } from '../services/storage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: UserSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<RailwayRole>('ADMIN');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = authenticateUser(username, password);
    if (!user) {
      setError('Invalid Login ID or Password. Please try again.');
      return;
    }

    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IRLogo size={40} />
            <div>
              <h3 className="font-bold text-base tracking-tight text-white">TRAINS OFFICE ANDAL</h3>
              <p className="text-xs text-amber-400">Shift Switch &amp; Personnel Re-Authentication</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Roles Selector */}
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Switch Staff Profile (3 Types)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSelectRole('ADMIN')}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-amber-100 border-amber-500 text-slate-950 font-bold ring-1 ring-amber-400'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 block w-fit mb-1">
                1. ADMIN
              </span>
              <span className="text-xs font-bold block">CTNC (I/C)</span>
              <span className="text-[10px] text-slate-500 block">Full Control</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('OPERATOR')}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                selectedRole === 'OPERATOR'
                  ? 'bg-blue-100 border-blue-500 text-slate-950 font-bold ring-1 ring-blue-400'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white block w-fit mb-1">
                2. OPERATOR
              </span>
              <span className="text-xs font-bold block">TRAINS OFFICE</span>
              <span className="text-[10px] text-slate-500 block">CTNC Operator</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('VIEWER')}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                selectedRole === 'VIEWER'
                  ? 'bg-emerald-100 border-emerald-500 text-slate-950 font-bold ring-1 ring-emerald-400'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white block w-fit mb-1">
                3. VIEWER
              </span>
              <span className="text-xs font-bold block">YARD STAFF</span>
              <span className="text-[10px] text-slate-500 block">Read-Only</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Login ID / Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter login ID"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-700 outline-none font-mono text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-700 outline-none font-mono text-slate-900"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authenticate Staff Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
