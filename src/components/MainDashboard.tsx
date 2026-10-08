import React from 'react';
import {
  Train, Truck, ArrowRightLeft, GitBranch, Wrench, Plus,
  ArrowRight, ShieldCheck, Clock, ExternalLink, Calendar,
  ArrowUpRight, ArrowDownLeft, FileText, CheckCircle2
} from 'lucide-react';
import { AppDatabase, UserSession } from '../types/railway';

interface MainDashboardProps {
  database: AppDatabase;
  session: UserSession;
  onNavigate: (tab: string) => void;
  onQuickAdd: (tab: string) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  database,
  session,
  onNavigate,
  onQuickAdd
}) => {
  const outgoingCount = database.mixLoads.filter((m) => m.type === 'outgoing').length;
  const incomingCount = database.mixLoads.filter((m) => m.type === 'incoming').length;
  const cymCount = database.cymUnloadings.length;
  const transhipCount = database.transhipments.length;
  const pcmlCount = database.pcmlDiversions.length;
  const sickRepairCount = database.sickRepairs.length;

  const totalWagons =
    database.mixLoads.reduce((s, m) => s + m.wagons.length, 0) +
    database.cymUnloadings.reduce((s, c) => s + c.wagons.length, 0) +
    database.transhipments.reduce((s, t) => s + t.loadedWagons.length + t.transhipWagons.length, 0) +
    database.pcmlDiversions.reduce((s, p) => s + p.wagons.length, 0) +
    database.sickRepairs.reduce((s, sr) => s + sr.wagons.length, 0);

  const canEdit = session.role === 'ADMIN' || session.role === 'OPERATOR';

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action Buttons (as shown in video 00:07) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                EASTERN RAILWAY · ASANSOL DIVISION · STATION CODE: UDL
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 font-sans">
              Andal Trains Office Operational Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Internal record ledger for Mix Loads, CYM unloading, Wagon transhipments, PCML Diversions, and Sick Line Repairs.
            </p>
          </div>

          {/* Quick Add Buttons on top right */}
          {canEdit && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onQuickAdd('mix_load')}
                className="px-3 py-1.5 bg-[#092b4c] hover:bg-[#071f37] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Mix Load</span>
              </button>

              <button
                type="button"
                onClick={() => onQuickAdd('cym_unloading')}
                className="px-3 py-1.5 bg-[#092b4c] hover:bg-[#071f37] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New CYM Record</span>
              </button>

              <button
                type="button"
                onClick={() => onQuickAdd('transhipment')}
                className="px-3 py-1.5 bg-[#092b4c] hover:bg-[#071f37] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Transhipment</span>
              </button>

              <button
                type="button"
                onClick={() => onQuickAdd('pcml_diversion')}
                className="px-3 py-1.5 bg-[#092b4c] hover:bg-[#071f37] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New PCML</span>
              </button>

              <button
                type="button"
                onClick={() => onQuickAdd('sick_repair')}
                className="px-3 py-1.5 bg-[#092b4c] hover:bg-[#071f37] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Sick Fit</span>
              </button>
            </div>
          )}
        </div>

        {/* ----------------- THE 5 OPERATIONAL CATEGORY CARDS ----------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {/* Card 1: 1. MIX LOAD MANAGEMENT */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4.5 flex flex-col justify-between hover:border-blue-400 hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-900 text-white rounded-lg">
                    <Train className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                    1. MIX LOAD MANAGEMENT
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                  RL REGISTER
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Rake formation, destination dispatch, BPC &amp; Vehicle Guidance archival.
              </p>

              {/* Counters */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold flex items-center justify-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-amber-600" />
                    Outgoing Mix
                  </span>
                  <span className="font-mono font-bold text-base text-slate-900">{outgoingCount}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold flex items-center justify-center gap-1">
                    <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                    Incoming Mix
                  </span>
                  <span className="font-mono font-bold text-base text-slate-900">{incomingCount}</span>
                </div>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onNavigate('mix_load')}
                className="flex-1 py-2 px-3 bg-[#0a355c] hover:bg-[#072540] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Open Mix Register</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onQuickAdd('mix_load')}
                  className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors"
                >
                  + Add
                </button>
              )}
            </div>
          </div>

          {/* Card 2: 2. CYM UNLOADING */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4.5 flex flex-col justify-between hover:border-emerald-400 hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-900 text-white rounded-lg">
                    <Truck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                    2. CYM UNLOADING
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                  CYM REGISTER
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Yard siding / line unloads, traffic memos, and commercial releases.
              </p>

              {/* Counters */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Unloadings</span>
                  <span className="font-mono font-bold text-base text-slate-900">{cymCount}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Yard Sidings</span>
                  <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">Active</span>
                </div>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onNavigate('cym_unloading')}
                className="flex-1 py-2 px-3 bg-[#0a355c] hover:bg-[#072540] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Open CYM Register</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onQuickAdd('cym_unloading')}
                  className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors"
                >
                  + Add
                </button>
              )}
            </div>
          </div>

          {/* Card 3: 3. TRANSHIPMENT */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4.5 flex flex-col justify-between hover:border-amber-400 hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-800 text-white rounded-lg">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                    3. TRANSHIPMENT
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                  TS REGISTER
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Sick wagon transfers into fit wagons with traffic &amp; commercial memos.
              </p>

              {/* Counters */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Transhipments</span>
                  <span className="font-mono font-bold text-base text-slate-900">{transhipCount}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Location</span>
                  <span className="font-mono font-bold text-xs text-blue-900">UDL Yard</span>
                </div>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onNavigate('transhipment')}
                className="flex-1 py-2 px-3 bg-[#0a355c] hover:bg-[#072540] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Open Transhipment</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onQuickAdd('transhipment')}
                  className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors"
                >
                  + Add
                </button>
              )}
            </div>
          </div>

          {/* Card 4: 4. PCML DIVERSION */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4.5 flex flex-col justify-between hover:border-purple-400 hover:shadow-xs transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-900 text-white rounded-lg">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                    4. PCML DIVERSION
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase bg-purple-100 text-purple-900 px-2 py-0.5 rounded border border-purple-200">
                  DIVT REGISTER
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Piecemeal wagons rerouted to nearer destination with Traffic &amp; NR Cell letters.
              </p>

              {/* Counters */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Diversions</span>
                  <span className="font-mono font-bold text-base text-slate-900">{pcmlCount}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Sanction Authority</span>
                  <span className="font-mono font-bold text-xs text-purple-900">NR Cell / ASN</span>
                </div>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onNavigate('pcml_diversion')}
                className="flex-1 py-2 px-3 bg-[#0a355c] hover:bg-[#072540] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Open PCML Register</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onQuickAdd('pcml_diversion')}
                  className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors"
                >
                  + Add
                </button>
              )}
            </div>
          </div>

          {/* Card 5: 5. SICK REPAIR */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4.5 flex flex-col justify-between hover:border-red-400 hover:shadow-xs transition-all md:col-span-2 lg:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-900 text-white rounded-lg">
                    <Wrench className="w-5 h-5 text-amber-300" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                    5. SICK REPAIR SECTION
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase bg-red-100 text-red-900 px-2 py-0.5 rounded border border-red-200">
                  SICK LINE REGISTER
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Down Sick Line, Up Sick Line &amp; BOXN Depot fitness certifications with Type of Fit &amp; C&amp;W TXR memos.
              </p>

              {/* Counters */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Down Sick Line</span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {database.sickRepairs.filter((s) => s.category === 'down_sick_line').length} Orders
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Up Sick Line</span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {database.sickRepairs.filter((s) => s.category === 'up_sick_line').length} Orders
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">BOXN Depot</span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {database.sickRepairs.filter((s) => s.category === 'boxn_depot').length} Orders
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onNavigate('sick_repair')}
                className="flex-1 py-2 px-3 bg-[#0a355c] hover:bg-[#072540] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Open Sick Line Register</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onQuickAdd('sick_repair')}
                  className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors"
                >
                  + Add
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- BOTTOM METRIC SUMMARY STRIP (as in video 00:07) ----------------- */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold block">Total Mix Loads</span>
            <span className="text-xl font-bold font-mono text-slate-900 block mt-0.5">
              {database.mixLoads.length}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {outgoingCount} Outgoing / {incomingCount} Incoming
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold block">CYM Unloadings</span>
            <span className="text-xl font-bold font-mono text-slate-900 block mt-0.5">
              {cymCount}
            </span>
            <span className="text-[10px] text-slate-400">Siding and line register</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold block">Transhipment Records</span>
            <span className="text-xl font-bold font-mono text-slate-900 block mt-0.5">
              {transhipCount}
            </span>
            <span className="text-[10px] text-slate-400">Sick to fit wagon transfers</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold block">PCML Diversions</span>
            <span className="text-xl font-bold font-mono text-slate-900 block mt-0.5">
              {pcmlCount}
            </span>
            <span className="text-[10px] text-slate-400">Piecemeal rerouted rakes</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold block">Sick Line Repairs</span>
            <span className="text-xl font-bold font-mono text-slate-900 block mt-0.5">
              {sickRepairCount}
            </span>
            <span className="text-[10px] text-slate-400">Down, Up &amp; BOXN Depot</span>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200">
            <span className="text-[11px] text-blue-900 font-bold block">Current Total Wagons</span>
            <span className="text-xl font-bold font-mono text-blue-950 block mt-0.5">
              {totalWagons}
            </span>
            <span className="text-[10px] text-blue-700 font-semibold">Total Wagons Logged</span>
          </div>
        </div>
      </div>

      {/* ----------------- RECENT ANDAL YARD LOG ENTRIES ----------------- */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Recent Andal Yard Operations Log
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Live Yard Status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-[11px] font-semibold border-b border-slate-200">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Module</th>
                <th className="py-2 px-3">Details / Name</th>
                <th className="py-2 px-3">Engine / Location</th>
                <th className="py-2 px-3">Wagon Count</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {database.mixLoads.slice(0, 3).map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{m.date}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-[10px] bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded">
                      MIX LOAD
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{m.loadName}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{m.engineNo}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{m.wagons.length} Wagons</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigate('mix_load')}
                      className="text-xs text-blue-900 hover:text-blue-700 font-bold"
                    >
                      View &rarr;
                    </button>
                  </td>
                </tr>
              ))}
              {database.cymUnloadings.slice(0, 2).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{c.date}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">
                      CYM UNLOAD
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{c.lineNo}</td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {c.despatchedOutside ? `Despatched to ${c.outsideDestination}` : 'Yard Released'}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">{c.wagons.length} Wagons</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigate('cym_unloading')}
                      className="text-xs text-blue-900 hover:text-blue-700 font-bold"
                    >
                      View &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
