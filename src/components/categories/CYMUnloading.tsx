import React, { useState } from 'react';
import {
  Plus, Search, Calendar, FileText, Eye, Edit2, Trash2,
  CheckCircle2, ArrowRight, CornerDownRight, ExternalLink,
  Truck, Printer
} from 'lucide-react';
import { CYMUnloadingEntry, WagonEntry, FileAttachment } from '../../types/railway';
import { WagonInputTable } from '../WagonInputTable';
import { AttachmentUploader } from '../AttachmentUploader';

interface CYMUnloadingProps {
  entries: CYMUnloadingEntry[];
  onSaveEntry: (entry: CYMUnloadingEntry) => void;
  onDeleteEntry: (id: string) => void;
  onViewFile: (file: FileAttachment, title: string) => void;
  highlightedRecordId?: string | null;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CYMUnloading: React.FC<CYMUnloadingProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onViewFile,
  highlightedRecordId
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'form' | 'details'>('dashboard');
  const [selectedEntry, setSelectedEntry] = useState<CYMUnloadingEntry | null>(() => {
    if (highlightedRecordId) {
      return entries.find((e) => e.id === highlightedRecordId) || null;
    }
    return null;
  });

  // Filters
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September default
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [formId, setFormId] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formLineNo, setFormLineNo] = useState<string>('Yard Line No. 04');
  const [formTrafficDate, setFormTrafficDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formTrafficMemoNo, setFormTrafficMemoNo] = useState<string>('');
  const [formTrafficAttachment, setFormTrafficAttachment] = useState<FileAttachment | undefined>(undefined);
  const [formCommercialDate, setFormCommercialDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formCommercialMemoNo, setFormCommercialMemoNo] = useState<string>('');
  const [formCommercialAttachment, setFormCommercialAttachment] = useState<FileAttachment | undefined>(undefined);
  const [formDespatchedOutside, setFormDespatchedOutside] = useState<boolean>(false);
  const [formOutsideDestination, setFormOutsideDestination] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'In Unloading' | 'Released' | 'Despatched'>('Released');
  const [formWagons, setFormWagons] = useState<WagonEntry[]>([
    { id: 'cw-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '' }
  ]);
  const [formRemarks, setFormRemarks] = useState<string>('');

  const YEARS = [2024, 2025, 2026, 2027, 2028];
  const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleOpenNew = () => {
    setFormId('');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormLineNo('Yard Line No. 04');
    setFormTrafficDate(new Date().toISOString().slice(0, 10));
    setFormTrafficMemoNo('');
    setFormTrafficAttachment(undefined);
    setFormCommercialDate(new Date().toISOString().slice(0, 10));
    setFormCommercialMemoNo('');
    setFormCommercialAttachment(undefined);
    setFormDespatchedOutside(false);
    setFormOutsideDestination('');
    setFormStatus('Released');
    setFormWagons([
      { id: 'cw-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '' }
    ]);
    setFormRemarks('');
    setViewMode('form');
  };

  const handleOpenEdit = (entry: CYMUnloadingEntry) => {
    setFormId(entry.id);
    setFormDate(entry.date);
    setFormLineNo(entry.lineNo);
    setFormTrafficDate(entry.trafficMemoIssueDate);
    setFormTrafficMemoNo(entry.trafficMemoNo || '');
    setFormTrafficAttachment(entry.trafficMemoAttachment);
    setFormCommercialDate(entry.commercialReleaseDate);
    setFormCommercialMemoNo(entry.commercialMemoNo || '');
    setFormCommercialAttachment(entry.commercialMemoAttachment);
    setFormDespatchedOutside(entry.despatchedOutside);
    setFormOutsideDestination(entry.outsideDestination || '');
    setFormStatus(entry.status);
    setFormWagons([...entry.wagons]);
    setFormRemarks(entry.remarks || '');
    setViewMode('form');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(formDate);
    const validWagons = formWagons.filter((w) => w.wagonNumber.trim() !== '');

    const newEntry: CYMUnloadingEntry = {
      id: formId || 'cym-' + Date.now(),
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      date: formDate,
      lineNo: formLineNo.trim() || 'Yard Line 01',
      trafficMemoIssueDate: formTrafficDate,
      trafficMemoNo: formTrafficMemoNo.trim() || undefined,
      trafficMemoAttachment: formTrafficAttachment,
      commercialReleaseDate: formCommercialDate,
      commercialMemoNo: formCommercialMemoNo.trim() || undefined,
      commercialMemoAttachment: formCommercialAttachment,
      despatchedOutside: formDespatchedOutside,
      outsideDestination: formDespatchedOutside ? formOutsideDestination.trim().toUpperCase() : undefined,
      status: formStatus,
      wagons: validWagons.length > 0 ? validWagons : formWagons,
      remarks: formRemarks.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    onSaveEntry(newEntry);
    setSelectedEntry(newEntry);
    setViewMode('details');
  };

  const filteredEntries = entries.filter((item) => {
    if (item.year !== selectedYear) return false;
    if (item.month !== selectedMonth) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLine = item.lineNo.toLowerCase().includes(q);
      const matchDest = (item.outsideDestination || '').toLowerCase().includes(q);
      const matchWagon = item.wagons.some(
        (w) =>
          w.wagonNumber.toLowerCase().includes(q) ||
          w.owningRailway.toLowerCase().includes(q)
      );
      if (!matchLine && !matchDest && !matchWagon) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ----------------- 1. FULL DETAILS VIEW ----------------- */}
      {viewMode === 'details' && selectedEntry && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
              >
                &larr; Back to Dashboard
              </button>
              <div>
                <h2 className="text-lg font-bold text-white font-mono">
                  CYM Unloading Work · {selectedEntry.date}
                </h2>
                <p className="text-xs text-slate-400">
                  Location: {selectedEntry.lineNo} · Record #{selectedEntry.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(selectedEntry)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1.5 border border-slate-700"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Entry</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Meta Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Unloading Date</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedEntry.date}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Yard Siding / Line</span>
                <span className="font-mono font-bold text-sm text-blue-900">{selectedEntry.lineNo}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Traffic Memo Issue Date</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedEntry.trafficMemoIssueDate}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Commercial Release Date</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedEntry.commercialReleaseDate}</span>
              </div>
            </div>

            {/* Outside Despatch Flag */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Wagon Despatch Status:
                </span>
                {selectedEntry.despatchedOutside ? (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      DESPATCHED OUTSIDE ANDAL
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-900">
                      Destination: {selectedEntry.outsideDestination}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 mt-1">
                    Wagon released within Andal Yard for normal sorting/marshalling.
                  </p>
                )}
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded bg-blue-100 text-blue-900 border border-blue-200">
                Status: {selectedEntry.status}
              </span>
            </div>

            {/* Attached Memos */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Traffic &amp; Commercial Memos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Traffic Yard Memo</h4>
                    <p className="text-[11px] text-slate-600 font-mono">
                      Ref: {selectedEntry.trafficMemoNo || 'Official Memo Issued'}
                    </p>
                    <span className="text-[10px] text-slate-500 block">Issue Date: {selectedEntry.trafficMemoIssueDate}</span>
                  </div>
                  {selectedEntry.trafficMemoAttachment ? (
                    <button
                      type="button"
                      onClick={() => onViewFile(selectedEntry.trafficMemoAttachment!, 'Traffic Memo')}
                      className="px-3 py-1.5 text-xs font-bold bg-blue-900 text-white rounded-lg flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Memo</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No memo file</span>
                  )}
                </div>

                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Commercial Release Memo</h4>
                    <p className="text-[11px] text-slate-600 font-mono">
                      Ref: {selectedEntry.commercialMemoNo || 'Commercial Release'}
                    </p>
                    <span className="text-[10px] text-slate-500 block">Release Date: {selectedEntry.commercialReleaseDate}</span>
                  </div>
                  {selectedEntry.commercialMemoAttachment ? (
                    <button
                      type="button"
                      onClick={() => onViewFile(selectedEntry.commercialMemoAttachment!, 'Commercial Release Memo')}
                      className="px-3 py-1.5 text-xs font-bold bg-amber-700 text-white rounded-lg flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Memo</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No memo file</span>
                  )}
                </div>
              </div>
            </div>

            {/* Wagons */}
            <div>
              <WagonInputTable
                wagons={selectedEntry.wagons}
                onChange={() => {}}
                readOnly={true}
                title={`Wagons Unloaded Under CYM Supervision (${selectedEntry.wagons.length} Wagons)`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 2. CREATE / EDIT FORM ----------------- */}
      {viewMode === 'form' && (
        <form onSubmit={handleSaveForm} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-white">
                {formId ? 'Edit CYM Unloading Entry' : 'Log CYM Unloading Work'}
              </h2>
              <p className="text-xs text-slate-400">Chief Yard Master (CYM) Andal Unloading Register</p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('dashboard')}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Unloading Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Yard Line / Wharf Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formLineNo}
                  onChange={(e) => setFormLineNo(e.target.value)}
                  placeholder="e.g. Line No. 04, Coal Wharf Line 2"
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Operation Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="In Unloading">In Unloading</option>
                  <option value="Released">Released</option>
                  <option value="Despatched">Despatched</option>
                </select>
              </div>
            </div>

            {/* 3-Column Wagon Table */}
            <div>
              <WagonInputTable
                wagons={formWagons}
                onChange={setFormWagons}
                title="Wagons Unloaded (3 Column Table)"
                badge="Owning Railway, Wagon Type, Wagon Number"
              />
            </div>

            {/* Traffic Memo Column & Commercial Release Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Traffic Memo Box */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">
                  Traffic Memo Information
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Traffic Memo Issue Date
                    </label>
                    <input
                      type="date"
                      value={formTrafficDate}
                      onChange={(e) => setFormTrafficDate(e.target.value)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Memo Number
                    </label>
                    <input
                      type="text"
                      value={formTrafficMemoNo}
                      onChange={(e) => setFormTrafficMemoNo(e.target.value)}
                      placeholder="e.g. TM/CYM/1029"
                      className="w-full text-xs font-mono uppercase px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>

                <AttachmentUploader
                  label="Traffic Memo (Pic / PDF Upload)"
                  sublabel="Upload copy of Traffic Memo issued for unloading"
                  attachment={formTrafficAttachment}
                  onAttach={setFormTrafficAttachment}
                  onView={(f) => onViewFile(f, 'Traffic Memo Upload')}
                />
              </div>

              {/* Commercial Release Box */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">
                  Commercial Release Information
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Commercial Release Date
                    </label>
                    <input
                      type="date"
                      value={formCommercialDate}
                      onChange={(e) => setFormCommercialDate(e.target.value)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Release Note / Memo Ref
                    </label>
                    <input
                      type="text"
                      value={formCommercialMemoNo}
                      onChange={(e) => setFormCommercialMemoNo(e.target.value)}
                      placeholder="e.g. CRM/UDL/5520"
                      className="w-full text-xs font-mono uppercase px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>

                <AttachmentUploader
                  label="Commercial Memo (Pic / PDF Upload)"
                  sublabel="Upload commercial clearance / release document"
                  attachment={formCommercialAttachment}
                  onAttach={setFormCommercialAttachment}
                  onView={(f) => onViewFile(f, 'Commercial Release Memo')}
                />
              </div>
            </div>

            {/* Wagon Despatched Outside Option as requested */}
            <div className="p-4 bg-amber-50/70 rounded-lg border border-amber-200">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-amber-950">
                <input
                  type="checkbox"
                  checked={formDespatchedOutside}
                  onChange={(e) => setFormDespatchedOutside(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-900 cursor-pointer"
                />
                <span>Wagon Despatched Outside Andal Yard (Outside Despatch Option)</span>
              </label>

              {formDespatchedOutside && (
                <div className="mt-3 pl-6 grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Outside Destination Station <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formOutsideDestination}
                      onChange={(e) => setFormOutsideDestination(e.target.value)}
                      placeholder="e.g. DGR-SAIL, ASN, Burnpur IISCO, KGP"
                      className="w-full text-xs font-bold uppercase px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      required={formDespatchedOutside}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operational Supervision Remarks
              </label>
              <textarea
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                rows={2}
                placeholder="Optional supervision notes..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg cursor-pointer shadow-xs"
              >
                Save CYM Unloading Work
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ----------------- 3. DASHBOARD VIEW (MATCHING VIDEO 00:51) ----------------- */}
      {viewMode === 'dashboard' && (
        <div className="space-y-4">
          {/* Top Title & + New Entry Button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-900 text-white rounded-lg">
                  <Truck className="w-5 h-5 text-emerald-300" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                  CYM Unloading Register
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Year - Month - Date wise yard line unloading &amp; outside wagon dispatch register.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0a355c] hover:bg-[#072540] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ NEW CYM ENTRY</span>
            </button>
          </div>

          {/* Filter Card */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3.5">
            {/* Row 1: SELECT OPERATIONAL YEAR & Search */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider min-w-[170px]">
                  SELECT OPERATIONAL YEAR:
                </span>
                <div className="flex items-center gap-1.5">
                  {YEARS.map((yr) => {
                    const isActive = selectedYear === yr;
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setSelectedYear(yr)}
                        className={`px-3.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#08223B] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {yr}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search line, dest, ID..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 text-slate-800"
                />
              </div>
            </div>

            {/* Row 2: SELECT MONTH */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider min-w-[170px]">
                SELECT MONTH ({selectedYear}):
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {MONTHS_SHORT.map((mShort, idx) => {
                  const monthNum = idx + 1;
                  const isActive = selectedMonth === monthNum;
                  return (
                    <button
                      key={mShort}
                      type="button"
                      onClick={() => setSelectedMonth(monthNum)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {mShort}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  CYM Unloadings for {MONTH_NAMES[selectedMonth - 1]} {selectedYear} ({filteredEntries.length} records found)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-4 w-28">DATE</th>
                    <th className="py-2.5 px-3">RECORD ID</th>
                    <th className="py-2.5 px-3">LINE NUMBER</th>
                    <th className="py-2.5 px-3">WAGON COUNT</th>
                    <th className="py-2.5 px-3">TRAFFIC MEMO</th>
                    <th className="py-2.5 px-3">COMMERCIAL RELEASE</th>
                    <th className="py-2.5 px-3">OUTSIDE DESPATCH</th>
                    <th className="py-2.5 px-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 bg-slate-50/50">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">
                          No CYM Unloading work recorded for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 font-semibold">
                          {item.id}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {item.lineNo}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {item.wagons.length}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          {item.trafficMemoIssueDate}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          {item.commercialReleaseDate}
                        </td>
                        <td className="py-3 px-3">
                          {item.despatchedOutside ? (
                            <span className="font-bold text-emerald-800 font-mono">
                              YES ({item.outsideDestination})
                            </span>
                          ) : (
                            <span className="text-slate-400">NO</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEntry(item);
                              setViewMode('details');
                            }}
                            className="px-3.5 py-1 text-xs font-bold text-white bg-[#0a355c] hover:bg-[#072540] rounded transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>VIEW</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
