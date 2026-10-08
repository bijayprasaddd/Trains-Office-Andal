import React from 'react';
import { IRLogo } from './IRLogo';
import { Search, Database, Printer, LogIn, LogOut, Clock, ShieldCheck } from 'lucide-react';
import { UserSession } from '../types/railway';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBackToHome?: () => void;
  onOpenUniversalSearch: () => void;
  onOpenBackupModal: () => void;
  onOpenPrintReport: () => void;
  onOpenLoginModal: () => void;
  userSession: UserSession;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onBackToHome,
  onOpenUniversalSearch,
  onOpenBackupModal,
  onOpenPrintReport,
  onOpenLoginModal,
  userSession,
  onLogout
}) => {
  const navItems = [
    { id: 'mix_load', label: '1. Mix Load Management' },
    { id: 'cym_unloading', label: '2. CYM Unloading' },
    { id: 'transhipment', label: '3. Transhipment' },
    { id: 'pcml_diversion', label: '4. PCML Diversion' },
    { id: 'sick_repair', label: '5. Sick Repair' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none no-print">
      {/* Top operational banner bar */}
      <div className="bg-[#08223B] border-b border-blue-900/50 px-6 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>EASTERN RAILWAY · ASANSOL DIVISION</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-mono">STATION CODE: UDL · ANDAL MARSHALLING YARD</span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Role: <strong className="text-amber-300 font-mono">{userSession.role}</strong> ({userSession.roleTitle})
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title & Indian Railway Crest */}
        <div
          onClick={() => {
            if (onBackToHome) onBackToHome();
            else onTabChange('mix_load');
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          title="Return to 5-Options Main Dashboard"
        >
          <IRLogo size={42} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                TRAINS OFFICE ANDAL
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.5 rounded">
                UDL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-medium flex items-center gap-1.5">
              <span>Yard Operations System</span>
              {onBackToHome && (
                <span className="text-amber-400 hover:underline">
                  (← Back to 5 Options)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (The 5 Operational Categories) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="px-2.5 py-1.5 text-xs font-bold rounded-md text-amber-400 hover:bg-slate-800/80 transition-colors mr-1 cursor-pointer"
              title="Return to 5 Options Dashboard"
            >
              ← 5 Options
            </button>
          )}
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-800 text-white shadow-xs border border-blue-600'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Search, Reports, Backup, User) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenUniversalSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            title="Search any Wagon Number across all 5 modules"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Trace Wagon</span>
          </button>

          <button
            type="button"
            onClick={onOpenPrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            title="Print Official Shift Report / PDF"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Reports / PDF</span>
          </button>

          <button
            type="button"
            onClick={onOpenBackupModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            title="Backup data or restore backup file"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Data Backup</span>
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1"></div>

          {userSession.isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/60 rounded-lg transition-colors"
              title="Logout session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Logout</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Secondary Nav Bar if screen narrow */}
      <div className="lg:hidden px-4 py-2 bg-slate-950 border-t border-slate-800 flex overflow-x-auto gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-blue-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
