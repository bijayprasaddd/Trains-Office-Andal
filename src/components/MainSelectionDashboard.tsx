import React from 'react';
import {
  Train, Truck, ArrowRightLeft, GitBranch, Wrench, Search,
  Printer, Database, LogOut, ArrowRight, Clock, ShieldCheck,
  ChevronRight, Calendar, User, FileText
} from 'lucide-react';
import { IRLogo } from './IRLogo';
import { AppDatabase, UserSession } from '../types/railway';

interface MainSelectionDashboardProps {
  userSession: UserSession;
  database: AppDatabase;
  onSelectCategory: (categoryId: string) => void;
  onOpenUniversalSearch: () => void;
  onOpenPrintReport: () => void;
  onOpenBackupModal: () => void;
  onLogout: () => void;
}

export const MainSelectionDashboard: React.FC<MainSelectionDashboardProps> = ({
  userSession,
  database,
  onSelectCategory,
  onOpenUniversalSearch,
  onOpenPrintReport,
  onOpenBackupModal,
  onLogout
}) => {
  const categories = [
    {
      id: 'mix_load',
      number: '1',
      title: 'MIX LOAD MANAGEMENT',
      hindiDesc: 'Incoming & Outgoing Mix Loads',
      description: 'Year & Month-wise Mix Trains, Departure/Arrival Dates, Engine No, Out Time, BPC photo/PDF, Vehicle Guidance & 4-Column Wagon Roster.',
      icon: Train,
      count: database.mixLoads.length,
      countLabel: 'Loads Recorded',
      gradient: 'from-blue-900 to-indigo-950',
      borderHover: 'hover:border-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      tag: 'Incoming & Outgoing'
    },
    {
      id: 'cym_unloading',
      number: '2',
      title: 'CYM UNLOADING',
      hindiDesc: 'Chief Yard Master Wagon Unloading',
      description: 'Year & Month-wise operational dashboard for wagons unloaded in CYM, Traffic memo issue date/PDF, Commercial release date, Line No & Despatch destination.',
      icon: Truck,
      count: database.cymUnloadings.length,
      countLabel: 'Entries Recorded',
      gradient: 'from-emerald-900 to-teal-950',
      borderHover: 'hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      tag: 'Yard Unloading'
    },
    {
      id: 'transhipment',
      number: '3',
      title: 'TRANSHIPMENT',
      hindiDesc: 'Sick Wagon to Fit Wagon Transhipment',
      description: 'Year & Month register for transferring contents from sick wagons into fit wagons. Dual 4-column rosters (Loaded vs Transhipped) with Traffic & Commercial memo uploads.',
      icon: ArrowRightLeft,
      count: database.transhipments.length,
      countLabel: 'Transfers Recorded',
      gradient: 'from-amber-900 to-yellow-950',
      borderHover: 'hover:border-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      tag: 'Sick-to-Fit Transfer'
    },
    {
      id: 'pcml_diversion',
      number: '4',
      title: 'PCML DIVERSION',
      hindiDesc: 'Piecemeal Wagon Route Diversion',
      description: 'Distant destination isolated piecemeal wagons diverted to nearer stations with From/To tracking, Diverted Destination, Traffic Request Memo & NR Cell Letter upload.',
      icon: GitBranch,
      count: database.pcmlDiversions.length,
      countLabel: 'Diversions Recorded',
      gradient: 'from-purple-900 to-fuchsia-950',
      borderHover: 'hover:border-purple-400',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      tag: 'Traffic Diversion'
    },
    {
      id: 'sick_repair',
      number: '5',
      title: 'SICK REPAIR',
      hindiDesc: 'Sick Lines & Depot Repair Fit Register',
      description: '3 Dedicated Sub-categories: Down Sick Line, Up Sick Line & BOXN Depot. Track repair fit wagons, date-wise counts, Type of Fit certification and TXR fit memos.',
      icon: Wrench,
      count: database.sickRepairs.length,
      countLabel: 'Fit Records',
      gradient: 'from-rose-900 to-red-950',
      borderHover: 'hover:border-rose-400',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      tag: 'Down/Up Lines & Depot'
    }
  ];

  const totalWagonsLogged =
    database.mixLoads.reduce((sum, m) => sum + m.wagons.length, 0) +
    database.cymUnloadings.reduce((sum, c) => sum + c.wagons.length, 0) +
    database.transhipments.reduce((sum, t) => sum + t.loadedWagons.length + t.transhipWagons.length, 0) +
    database.pcmlDiversions.reduce((sum, p) => sum + p.wagons.length, 0) +
    database.sickRepairs.reduce((sum, s) => sum + s.wagons.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="bg-[#08223B] border-b border-blue-900/50 px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-amber-400 tracking-wide">
              EASTERN RAILWAY · ASANSOL DIVISION
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-300 font-mono hidden md:inline">
              ANDAL MARSHALLING YARD (UDL)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Role:{' '}
                <strong className="text-amber-300 font-mono">
                  {userSession.role} ({userSession.roleTitle})
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <IRLogo size={46} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  TRAINS OFFICE ANDAL
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider">
                  UDL YARD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Operating Yard Control &amp; Freight Documentation Terminal
              </p>
            </div>
          </div>

          {/* Quick Tools & Logout */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenUniversalSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Trace Wagon</span>
            </button>

            <button
              type="button"
              onClick={onOpenPrintReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Reports / PDF</span>
            </button>

            <button
              type="button"
              onClick={onOpenBackupModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            <div className="h-6 w-px bg-slate-800 mx-1"></div>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* Welcome Staff Banner */}
        <div className="bg-linear-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
                  LOGGED IN AS: {userSession.role} ({userSession.roleTitle})
                </span>
                <span className="text-slate-400 text-xs">
                  · {userSession.designation}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Welcome, {userSession.displayName}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                Please select one of the 5 operational categories below to open its dedicated dashboard, view records, manage registers, or upload documentation.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 px-4 self-start md:self-auto">
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">
                  Total Wagons Indexed
                </div>
                <div className="text-xl font-black font-mono text-amber-400">
                  {totalWagonsLogged}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800"></div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">
                  Active Modules
                </div>
                <div className="text-xl font-black font-mono text-emerald-400">
                  5 Categories
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Categories Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Select Operational Category
              </h3>
              <p className="text-xs text-slate-400">
                Click any category card to open its dedicated full workspace
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`group bg-slate-900/90 border border-slate-800 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.01] hover:shadow-2xl hover:bg-slate-850 ${cat.borderHover}`}
                >
                  <div>
                    {/* Top row with Category number and icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950">
                          OPTION {cat.number}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${cat.badgeBg}`}>
                          {cat.tag}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 group-hover:bg-amber-400/20 group-hover:text-amber-400 flex items-center justify-center text-slate-300 transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Category Title */}
                    <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {cat.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Card Footer with count and action button */}
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                        Current Status
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {cat.count} {cat.countLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Supplementary 6th Card: Universal Wagon Trace & Search */}
            <div
              onClick={onOpenUniversalSearch}
              className="group bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:border-amber-400/80 hover:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-500 text-white">
                    CROSS-MODULE
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-blue-500/20 group-hover:text-blue-400 flex items-center justify-center text-slate-300 transition-colors">
                    <Search className="w-5 h-5" />
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  UNIVERSAL WAGON SEARCH
                </h4>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Search any 11-digit or 6-digit Wagon Number or Owning Railway across all 5 operational categories instantly with complete movement history.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-blue-400 font-semibold">
                  Trace Across System
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch Trace</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 px-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <IRLogo size={24} />
            <span>TRAINS OFFICE ANDAL · ASANSOL DIVISION · EASTERN RAILWAY</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            SECURE ACCESS · USER: {userSession.username} ({userSession.role})
          </div>
        </div>
      </footer>
    </div>
  );
};
