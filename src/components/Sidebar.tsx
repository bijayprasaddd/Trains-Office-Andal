import React from 'react';
import {
  LayoutDashboard, Train, Truck, ArrowRightLeft, GitBranch,
  Wrench, Search, Printer, Database, Upload, Shield, LogOut,
  ChevronRight
} from 'lucide-react';
import { IRLogo } from './IRLogo';
import { UserSession } from '../types/railway';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenReports: () => void;
  onOpenBackup: () => void;
  onOpenRestore: () => void;
  onLogout: () => void;
  session: UserSession;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenReports,
  onOpenBackup,
  onOpenRestore,
  onLogout,
  session
}) => {
  const menuCategories = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mix_load', label: '1. Mix Load Management', icon: Train },
    { id: 'cym_unloading', label: '2. CYM Unloading', icon: Truck },
    { id: 'transhipment', label: '3. Transhipment', icon: ArrowRightLeft },
    { id: 'pcml_diversion', label: '4. PCML Diversion', icon: GitBranch },
    { id: 'sick_repair', label: '5. Sick Repair', icon: Wrench },
  ];

  return (
    <aside className="no-print w-64 bg-[#0a1b2a] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 bg-[#071522]">
        <div className="flex items-center gap-3">
          <IRLogo size={38} />
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white font-sans uppercase">
              TRAINS OFFICE ANDAL
            </h1>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              EASTERN RAILWAY - ASANSOL DIVISION
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 text-xs">
        {/* Section 1: Main Registers */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
            Operational Registers
          </span>
          <div className="space-y-0.5">
            {menuCategories.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-xs font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Tools & Reports */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
            Tools &amp; Reports
          </span>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Global Wagon Search</span>
            </button>

            <button
              type="button"
              onClick={onOpenReports}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Official Reports</span>
            </button>
          </div>
        </div>

        {/* Section 3: Database & RBAC */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
            Database &amp; System
          </span>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={onOpenBackup}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Backup Database</span>
            </button>

            <button
              type="button"
              onClick={onOpenRestore}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Restore Backup</span>
            </button>

            <div className="px-3 py-2 text-[11px] text-slate-400 flex items-center gap-2 bg-slate-900/60 rounded-lg border border-slate-800 mt-1">
              <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div className="truncate">
                <span className="block font-semibold text-slate-200">Role: {session.roleTitle}</span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {session.role === 'ADMIN' ? 'Full Control' : session.role === 'OPERATOR' ? 'Operator Write' : 'Read Only Viewer'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom User Profile & Logout */}
      <div className="p-3 border-t border-slate-800 bg-[#071522]">
        <div className="flex items-center justify-between mb-2">
          <div className="truncate pr-1">
            <p className="text-xs font-bold text-white truncate">{session.displayName}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate">{session.username} ({session.roleTitle})</p>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
            session.role === 'ADMIN' ? 'bg-amber-400 text-slate-950' :
            session.role === 'OPERATOR' ? 'bg-blue-400 text-slate-950' :
            'bg-slate-600 text-white'
          }`}>
            {session.role}
          </span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full py-1.5 px-2 bg-red-950/70 hover:bg-red-900 text-red-200 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};
