import React, { useState } from 'react';
import {
  Plus, Search, Calendar, FileText, Eye, Edit2, Trash2,
  GitBranch, ArrowRight, CornerDownRight, ShieldCheck,
  Printer
} from 'lucide-react';
import { PCMLDiversionEntry, WagonEntry, FileAttachment } from '../../types/railway';
import { WagonInputTable } from '../WagonInputTable';
import { AttachmentUploader } from '../AttachmentUploader';

interface PCMLDiversionProps {
  entries: PCMLDiversionEntry[];
  onSaveEntry: (entry: PCMLDiversionEntry) => void;
  onDeleteEntry: (id: string) => void;
  onViewFile: (file: FileAttachment, title: string) => void;
  highlightedRecordId?: string | null;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const PCMLDiversion: React.FC<PCMLDiversionProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onViewFile,
  highlightedRecordId
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'form' | 'details'>('dashboard');
  const [selectedEntry, setSelectedEntry] = useState<PCMLDiversionEntry | null>(() => {
    if (highlightedRecordId) {
      return entries.find((e) => e.id === highlightedRecordId) || null;
    }
    return null;
  });

  // Filters
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [formId, setFormId] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formDateOfDivt, setFormDateOfDivt] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formFromStation, setFormFromStation] = useState<string>('');
  const [formToStation, setFormToStation] = useState<string>('');
  const [formDivertedToStation, setFormDivertedToStation] = useState<string>('');
  const [formDivtMemoNo, setFormDivtMemoNo] = useState<string>('');
  const [formDivtMemoAttachment, setFormDivtMemoAttachment] = useState<FileAttachment | undefined>(undefined);
  const [formNrLetterRef, setFormNrLetterRef] = useState<string>('');
  const [formNrLetterAttachment, setFormNrLetterAttachment] = useState<FileAttachment | undefined>(undefined);
  const [formReason, setFormReason] = useState<string>('Piecemeal isolated wagon diverted to nearby industrial siding.');
  const [formAuthorisedBy, setFormAuthorisedBy] = useState<string>('Sr. DOM / Asansol (ASN)');
  const [formStatus, setFormStatus] = useState<'Proposed' | 'Approved' | 'Diverted'>('Diverted');
  const [formWagons, setFormWagons] = useState<WagonEntry[]>([
    { id: 'pw-1', owningRailway: 'ER', wagonType: 'BCNHL', wagonNumber: '' }
  ]);
  const [formRemarks, setFormRemarks] = useState<string>('');

  const handleOpenNew = () => {
    setFormId('');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormDateOfDivt(new Date().toISOString().slice(0, 10));
    setFormFromStation('');
    setFormToStation('');
    setFormDivertedToStation('');
    setFormDivtMemoNo('');
    setFormDivtMemoAttachment(undefined);
    setFormNrLetterRef('');
    setFormNrLetterAttachment(undefined);
    setFormReason('Piecemeal isolated wagon diverted to nearby industrial siding.');
    setFormAuthorisedBy('Sr. DOM / Asansol (ASN)');
    setFormStatus('Diverted');
    setFormWagons([
      { id: 'pw-1', owningRailway: 'ER', wagonType: 'BCNHL', wagonNumber: '' }
    ]);
    setFormRemarks('');
    setViewMode('form');
  };

  const handleOpenEdit = (entry: PCMLDiversionEntry) => {
    setFormId(entry.id);
    setFormDate(entry.date);
    setFormDateOfDivt(entry.dateOfDiversion);
    setFormFromStation(entry.fromStation);
    setFormToStation(entry.toStation);
    setFormDivertedToStation(entry.divertedToStation);
    setFormDivtMemoNo(entry.trafficDivtRequestMemoNo || '');
    setFormDivtMemoAttachment(entry.trafficDivtRequestMemoAttachment);
    setFormNrLetterRef(entry.nrCellDivtLetterRef || '');
    setFormNrLetterAttachment(entry.nrCellDivtLetterAttachment);
    setFormReason(entry.reasonForDiversion);
    setFormAuthorisedBy(entry.authorisedBy || '');
    setFormStatus(entry.status);
    setFormWagons([...entry.wagons]);
    setFormRemarks(entry.remarks || '');
    setViewMode('form');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFromStation.trim() || !formToStation.trim() || !formDivertedToStation.trim()) {
      alert('Please fill in From Station, To Station, and Diverted To Station.');
      return;
    }

    const d = new Date(formDate);
    const validWagons = formWagons.filter((w) => w.wagonNumber.trim() !== '');

    const newEntry: PCMLDiversionEntry = {
      id: formId || 'pcml-' + Date.now(),
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      date: formDate,
      dateOfDiversion: formDateOfDivt,
      fromStation: formFromStation.trim().toUpperCase(),
      toStation: formToStation.trim().toUpperCase(),
      divertedToStation: formDivertedToStation.trim().toUpperCase(),
      trafficDivtRequestMemoNo: formDivtMemoNo.trim() || undefined,
      trafficDivtRequestMemoAttachment: formDivtMemoAttachment,
      nrCellDivtLetterRef: formNrLetterRef.trim() || undefined,
      nrCellDivtLetterAttachment: formNrLetterAttachment,
      reasonForDiversion: formReason.trim(),
      authorisedBy: formAuthorisedBy.trim() || undefined,
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
      const matchFrom = item.fromStation.toLowerCase().includes(q);
      const matchTo = item.toStation.toLowerCase().includes(q);
      const matchDivt = item.divertedToStation.toLowerCase().includes(q);
      const matchWagon = item.wagons.some(
        (w) =>
          w.wagonNumber.toLowerCase().includes(q) ||
          w.owningRailway.toLowerCase().includes(q)
      );
      if (!matchFrom && !matchTo && !matchDivt && !matchWagon) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ----------------- 1. DETAILS VIEW ----------------- */}
      {viewMode === 'details' && selectedEntry && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
              >
                &larr; Back to Register
              </button>
              <div>
                <h2 className="text-lg font-bold text-white font-mono">
                  PCML Diversion Record #{selectedEntry.id}
                </h2>
                <p className="text-xs text-slate-400">
                  Diverted To: {selectedEntry.divertedToStation} · Date of Divt: {selectedEntry.dateOfDiversion}
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
            {/* Diversion Route Visual */}
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-600 text-white rounded-lg">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-900 uppercase">Booked Route:</span>
                  <div className="text-sm font-mono font-bold text-slate-900 flex items-center gap-2">
                    <span>{selectedEntry.fromStation}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="line-through text-slate-400">{selectedEntry.toStation}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white px-4 py-2 rounded-lg border border-amber-300">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">
                  Authorised Diverted Destination:
                </span>
                <span className="text-base font-mono font-extrabold text-blue-900">
                  {selectedEntry.divertedToStation}
                </span>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Entry Date</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedEntry.date}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Date of Divt</span>
                <span className="font-mono font-bold text-sm text-amber-900">{selectedEntry.dateOfDiversion}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Authorising Officer</span>
                <span className="font-bold text-sm text-slate-900">{selectedEntry.authorisedBy || 'Sr. DOM / ASN'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Status</span>
                <span className="font-bold text-sm text-emerald-700">{selectedEntry.status}</span>
              </div>
            </div>

            {/* Reason */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <strong className="text-slate-800">Operational Reason for Diversion:</strong>
              <p className="text-slate-700 mt-1">{selectedEntry.reasonForDiversion}</p>
            </div>

            {/* Attached 2 Memos: Traffic Divt Request Memo & NR Cell Divt Letter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Mandatory Diversion Documents (Traffic Request &amp; NR Cell Letter)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Traffic Divt Request Memo</h4>
                    <p className="text-[11px] text-slate-600 font-mono">
                      Ref: {selectedEntry.trafficDivtRequestMemoNo || 'Memo Attached'}
                    </p>
                  </div>
                  {selectedEntry.trafficDivtRequestMemoAttachment ? (
                    <button
                      type="button"
                      onClick={() => onViewFile(selectedEntry.trafficDivtRequestMemoAttachment!, 'Traffic Divt Request Memo')}
                      className="px-3 py-1.5 text-xs font-bold bg-blue-900 text-white rounded-lg flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Memo</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No memo file</span>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">NR Cell Divt Letter</h4>
                    <p className="text-[11px] text-slate-600 font-mono">
                      Ref: {selectedEntry.nrCellDivtLetterRef || 'NR Letter Attached'}
                    </p>
                  </div>
                  {selectedEntry.nrCellDivtLetterAttachment ? (
                    <button
                      type="button"
                      onClick={() => onViewFile(selectedEntry.nrCellDivtLetterAttachment!, 'NR Cell Divt Letter')}
                      className="px-3 py-1.5 text-xs font-bold bg-amber-700 text-white rounded-lg flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Letter</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No letter file</span>
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
                title={`Diverted Wagons (${selectedEntry.wagons.length} Wagons)`}
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
                {formId ? 'Edit PCML Diversion Entry' : 'Log PCML Wagon Diversion'}
              </h2>
              <p className="text-xs text-slate-400">
                Piecemeal distant wagons diverted to nearby destination
              </p>
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
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Entry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Date of Divt (Date of Diversion Executed) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formDateOfDivt}
                  onChange={(e) => setFormDateOfDivt(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg outline-none font-bold"
                  required
                />
              </div>
            </div>

            {/* Wagon Entry - 3 Columns as requested */}
            <div>
              <WagonInputTable
                wagons={formWagons}
                onChange={setFormWagons}
                title="Wagon Entry (3 Columns: Owning Railway, Wagon Type, Wagon Number)"
                badge="Piecemeal Wagon Being Diverted"
              />
            </div>

            {/* Routing: From, To, Diverted To */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase block mb-3">
                Route &amp; Destination Details
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    From (Original Booked Origin) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formFromStation}
                    onChange={(e) => setFormFromStation(e.target.value)}
                    placeholder="e.g. KGG (Khagaria / ECR)"
                    className="w-full text-xs font-mono font-bold uppercase px-3 py-2 border border-slate-300 rounded-lg outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    To (Original Booked Distant Destination) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formToStation}
                    onChange={(e) => setFormToStation(e.target.value)}
                    placeholder="e.g. CBO (Coimbatore / SR)"
                    className="w-full text-xs font-mono font-bold uppercase px-3 py-2 border border-slate-300 rounded-lg outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diverted Destination Station (Diverted To) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formDivertedToStation}
                    onChange={(e) => setFormDivertedToStation(e.target.value)}
                    placeholder="e.g. DGR (Durgapur Chemical Siding / ER)"
                    className="w-full text-xs font-mono font-extrabold uppercase px-3 py-2 border border-amber-300 bg-amber-50 rounded-lg outline-none text-blue-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2 Memo Columns as explicitly specified by user:
                "uske bad 2 coumn honge ek me trafAF Divt request memo-pic/pdf upload, dusra NR cell Divt letter-pic/pdf upload" */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">
                  Column 1: Traffic Divt Request Memo
                </span>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Request Memo Ref Number
                  </label>
                  <input
                    type="text"
                    value={formDivtMemoNo}
                    onChange={(e) => setFormDivtMemoNo(e.target.value)}
                    placeholder="e.g. T-REQ/DIV/UDL/331"
                    className="w-full text-xs font-mono uppercase px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <AttachmentUploader
                  label="Traffic Divt Request Memo (Pic / PDF Upload)"
                  sublabel="Traffic yard request memo"
                  attachment={formDivtMemoAttachment}
                  onAttach={setFormDivtMemoAttachment}
                  onView={(f) => onViewFile(f, 'Traffic Divt Request Memo')}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">
                  Column 2: NR Cell Divt Letter
                </span>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    NR Cell Letter Ref
                  </label>
                  <input
                    type="text"
                    value={formNrLetterRef}
                    onChange={(e) => setFormNrLetterRef(e.target.value)}
                    placeholder="e.g. ASN/CNTL/NR-CELL/DIV-789"
                    className="w-full text-xs font-mono uppercase px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <AttachmentUploader
                  label="NR Cell Divt Letter (Pic / PDF Upload)"
                  sublabel="Northern/Rerouting Control diversion authorisation letter"
                  attachment={formNrLetterAttachment}
                  onAttach={setFormNrLetterAttachment}
                  onView={(f) => onViewFile(f, 'NR Cell Divt Letter')}
                />
              </div>
            </div>

            {/* Reason & Authorisation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Diversion
                </label>
                <input
                  type="text"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="e.g. Isolated piecemeal wagon, operational route breach, receiver request"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorised By (Officer / Control)
                </label>
                <input
                  type="text"
                  value={formAuthorisedBy}
                  onChange={(e) => setFormAuthorisedBy(e.target.value)}
                  placeholder="e.g. Sr. DOM / Asansol (ASN)"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg"
              >
                Save PCML Diversion
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ----------------- 3. DASHBOARD VIEW (MATCHING VIDEO) ----------------- */}
      {viewMode === 'dashboard' && (
        <div className="space-y-4">
          {/* Top Title & + New Entry Button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-900 text-white rounded-lg">
                  <GitBranch className="w-5 h-5 text-purple-300" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                  PCML Diversion Register
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Piecemeal distant wagons diverted to nearer destination with NR Cell sanction.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0a355c] hover:bg-[#072540] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ NEW PCML DIVERSION</span>
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
                  {[2024, 2025, 2026, 2027, 2028].map((yr) => {
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
                  placeholder="Search wagon, origin, diverted to..."
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
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((mShort, idx) => {
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
                  PCML Diversions for {MONTH_NAMES[selectedMonth - 1]} {selectedYear} ({filteredEntries.length} records found)
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
                    <th className="py-2.5 px-4 w-28">DATE OF DIVT</th>
                    <th className="py-2.5 px-3">RECORD ID</th>
                    <th className="py-2.5 px-3">FROM (ORIGIN)</th>
                    <th className="py-2.5 px-3">BOOKED TO</th>
                    <th className="py-2.5 px-4">DIVERTED TO</th>
                    <th className="py-2.5 px-3">WAGONS</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 bg-slate-50/50">
                        <GitBranch className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">
                          No PCML diversions recorded for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-950 whitespace-nowrap">
                          {item.dateOfDiversion}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 font-semibold">
                          {item.id}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                          {item.fromStation}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500 line-through">
                          {item.toStation}
                        </td>
                        <td className="py-3 px-4 font-mono font-extrabold text-blue-950 bg-amber-50/70">
                          {item.divertedToStation}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {item.wagons.length}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800">{item.status}</span>
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
