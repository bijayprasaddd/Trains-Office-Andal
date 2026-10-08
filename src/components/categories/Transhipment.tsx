import React, { useState } from 'react';
import {
  Plus, Search, Calendar, FileText, Eye, Edit2, Trash2, ArrowRightLeft, ShieldAlert, CheckCircle2,
  Printer
} from 'lucide-react';
import { TranshipmentEntry, WagonEntry, FileAttachment } from '../../types/railway';
import { WagonInputTable } from '../WagonInputTable';
import { AttachmentUploader } from '../AttachmentUploader';

interface TranshipmentProps {
  entries: TranshipmentEntry[];
  onSaveEntry: (entry: TranshipmentEntry) => void;
  onDeleteEntry: (id: string) => void;
  onViewFile: (file: FileAttachment, title: string) => void;
  highlightedRecordId?: string | null;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Transhipment: React.FC<TranshipmentProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onViewFile,
  highlightedRecordId
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'form' | 'details'>('dashboard');
  const [selectedEntry, setSelectedEntry] = useState<TranshipmentEntry | null>(() => {
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
  const [formCommodity, setFormCommodity] = useState<string>('');
  const [formLocation, setFormLocation] = useState<string>('Andal Tranship Line 02');
  const [formTrafficDate, setFormTrafficDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formTrafficMemoNo, setFormTrafficMemoNo] = useState<string>('');
  const [formTrafficAttachment, setFormTrafficAttachment] = useState<FileAttachment | undefined>(undefined);
  const [formCommercialDate, setFormCommercialDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formCommercialMemoNo, setFormCommercialMemoNo] = useState<string>('');
  const [formCommercialAttachment, setFormCommercialAttachment] = useState<FileAttachment | undefined>(undefined);
  const [formContractor, setFormContractor] = useState<string>('UDL Tranship Crane Staff');
  const [formStatus, setFormStatus] = useState<'Initiated' | 'In Progress' | 'Completed'>('Completed');
  const [formLoadedWagons, setFormLoadedWagons] = useState<WagonEntry[]>([
    { id: 'sw-1', owningRailway: 'SER', wagonType: 'BOXN', wagonNumber: '', remarks: 'Sick wagon' }
  ]);
  const [formTranshipWagons, setFormTranshipWagons] = useState<WagonEntry[]>([
    { id: 'fw-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '', remarks: 'Fit wagon' }
  ]);
  const [formRemarks, setFormRemarks] = useState<string>('');

  const handleOpenNew = () => {
    setFormId('');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormCommodity('');
    setFormLocation('Andal Tranship Line 02');
    setFormTrafficDate(new Date().toISOString().slice(0, 10));
    setFormTrafficMemoNo('');
    setFormTrafficAttachment(undefined);
    setFormCommercialDate(new Date().toISOString().slice(0, 10));
    setFormCommercialMemoNo('');
    setFormCommercialAttachment(undefined);
    setFormContractor('UDL Tranship Crane Staff');
    setFormStatus('Completed');
    setFormLoadedWagons([
      { id: 'sw-1', owningRailway: 'SER', wagonType: 'BOXN', wagonNumber: '' }
    ]);
    setFormTranshipWagons([
      { id: 'fw-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '' }
    ]);
    setFormRemarks('');
    setViewMode('form');
  };

  const handleOpenEdit = (entry: TranshipmentEntry) => {
    setFormId(entry.id);
    setFormDate(entry.date);
    setFormCommodity(entry.commodity);
    setFormLocation(entry.transhipmentLocation || 'Andal Tranship Line 02');
    setFormTrafficDate(entry.trafficMemoIssueDate);
    setFormTrafficMemoNo(entry.trafficMemoNo || '');
    setFormTrafficAttachment(entry.trafficMemoAttachment);
    setFormCommercialDate(entry.commercialMemoIssueDate);
    setFormCommercialMemoNo(entry.commercialMemoNo || '');
    setFormCommercialAttachment(entry.commercialMemoAttachment);
    setFormContractor(entry.contractorOrStaff || '');
    setFormStatus(entry.status);
    setFormLoadedWagons([...entry.loadedWagons]);
    setFormTranshipWagons([...entry.transhipWagons]);
    setFormRemarks(entry.remarks || '');
    setViewMode('form');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCommodity.trim()) {
      alert('Please enter Commodity / Content.');
      return;
    }

    const d = new Date(formDate);
    const validLoaded = formLoadedWagons.filter((w) => w.wagonNumber.trim() !== '');
    const validTranship = formTranshipWagons.filter((w) => w.wagonNumber.trim() !== '');

    const newEntry: TranshipmentEntry = {
      id: formId || 'ts-' + Date.now(),
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      date: formDate,
      commodity: formCommodity.trim(),
      transhipmentLocation: formLocation.trim(),
      trafficMemoIssueDate: formTrafficDate,
      trafficMemoNo: formTrafficMemoNo.trim() || undefined,
      trafficMemoAttachment: formTrafficAttachment,
      commercialMemoIssueDate: formCommercialDate,
      commercialMemoNo: formCommercialMemoNo.trim() || undefined,
      commercialMemoAttachment: formCommercialAttachment,
      contractorOrStaff: formContractor.trim() || undefined,
      status: formStatus,
      loadedWagons: validLoaded.length > 0 ? validLoaded : formLoadedWagons,
      transhipWagons: validTranship.length > 0 ? validTranship : formTranshipWagons,
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
      const matchComm = item.commodity.toLowerCase().includes(q);
      const matchSick = item.loadedWagons.some((w) =>
        w.wagonNumber.toLowerCase().includes(q) || w.owningRailway.toLowerCase().includes(q)
      );
      const matchFit = item.transhipWagons.some((w) =>
        w.wagonNumber.toLowerCase().includes(q) || w.owningRailway.toLowerCase().includes(q)
      );
      if (!matchComm && !matchSick && !matchFit) return false;
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
                <h2 className="text-lg font-bold text-white">
                  Transhipment Operation · {selectedEntry.commodity}
                </h2>
                <p className="text-xs text-slate-400">
                  Date: {selectedEntry.date} · Location: {selectedEntry.transhipmentLocation}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Transhipment Date</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedEntry.date}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Commodity Transhipped</span>
                <span className="font-bold text-sm text-blue-900">{selectedEntry.commodity}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Handling Location</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedEntry.transhipmentLocation}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Status</span>
                <span className="font-bold text-sm text-emerald-700">{selectedEntry.status}</span>
              </div>
            </div>

            {/* Comparison Grid: Sick Loaded vs Fit Tranship */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-red-200 rounded-xl overflow-hidden bg-red-50/20">
                <div className="bg-red-900 text-white p-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Sick Loaded Wagon (Content Origin)
                  </span>
                </div>
                <div className="p-3">
                  <WagonInputTable
                    wagons={selectedEntry.loadedWagons}
                    onChange={() => {}}
                    readOnly={true}
                    title="Sick Wagon List"
                  />
                </div>
              </div>

              <div className="border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50/20">
                <div className="bg-emerald-900 text-white p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Fit Tranship Wagon (Content Receiving)
                  </span>
                </div>
                <div className="p-3">
                  <WagonInputTable
                    wagons={selectedEntry.transhipWagons}
                    onChange={() => {}}
                    readOnly={true}
                    title="Fit Receiving Wagon List"
                  />
                </div>
              </div>
            </div>

            {/* Memos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Traffic Memo Issued</h4>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Ref: {selectedEntry.trafficMemoNo || 'Traffic Memo Issued'} · Date: {selectedEntry.trafficMemoIssueDate}
                  </p>
                </div>
                {selectedEntry.trafficMemoAttachment ? (
                  <button
                    type="button"
                    onClick={() => onViewFile(selectedEntry.trafficMemoAttachment!, 'Transhipment Traffic Memo')}
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
                  <h4 className="font-bold text-xs text-slate-900">Commercial Memo Issued</h4>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Ref: {selectedEntry.commercialMemoNo || 'Commercial Memo Issued'} · Date: {selectedEntry.commercialMemoIssueDate}
                  </p>
                </div>
                {selectedEntry.commercialMemoAttachment ? (
                  <button
                    type="button"
                    onClick={() => onViewFile(selectedEntry.commercialMemoAttachment!, 'Transhipment Commercial Memo')}
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

            {selectedEntry.remarks && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <strong>Remarks / Log:</strong>
                <p className="text-slate-600 mt-1">{selectedEntry.remarks}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- 2. CREATE / EDIT FORM ----------------- */}
      {viewMode === 'form' && (
        <form onSubmit={handleSaveForm} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-white">
                {formId ? 'Edit Transhipment Operation' : 'Log New Wagon Transhipment'}
              </h2>
              <p className="text-xs text-slate-400">
                Transfer of commodity contents from Sick Wagon into Fit Wagon
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Transhipment Date <span className="text-red-500">*</span>
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
                  2. Commodity / Content Transhipped <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formCommodity}
                  onChange={(e) => setFormCommodity(e.target.value)}
                  placeholder="e.g. Coal, Pig Iron, Steel Billets, Cement Bags"
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Transhipment Location
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Andal Tranship Line 02 / Crane Bay"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            {/* Loaded (Sick) Wagons Entry - 3 Columns */}
            <div>
              <div className="mb-1 text-xs font-bold text-red-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>A. Loaded Wagon Entry (Sick Wagon) - 3 Columns</span>
              </div>
              <WagonInputTable
                wagons={formLoadedWagons}
                onChange={setFormLoadedWagons}
                title="Sick Loaded Wagons (Owning Rly, Type, Wagon No)"
                badge="Sick Wagon Origin"
              />
            </div>

            {/* Tranship (Fit) Wagons Entry - 3 Columns */}
            <div>
              <div className="mb-1 text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>B. Tranship Wagon Entry (Fit Wagon Receiving Content) - 3 Columns</span>
              </div>
              <WagonInputTable
                wagons={formTranshipWagons}
                onChange={setFormTranshipWagons}
                title="Fit Tranship Wagons (Owning Rly, Type, Wagon No)"
                badge="Fit Wagon Destination"
              />
            </div>

            {/* Traffic Memo Issued & Commercial Memo Issued Uploaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">
                  Traffic Memo Issued
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={formTrafficDate}
                      onChange={(e) => setFormTrafficDate(e.target.value)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Memo Ref</label>
                    <input
                      type="text"
                      value={formTrafficMemoNo}
                      onChange={(e) => setFormTrafficMemoNo(e.target.value)}
                      placeholder="e.g. TM/TS/4481"
                      className="w-full text-xs font-mono uppercase px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
                <AttachmentUploader
                  label="Traffic Memo Issued (Pic / PDF Upload)"
                  sublabel="Traffic department transhipment order"
                  attachment={formTrafficAttachment}
                  onAttach={setFormTrafficAttachment}
                  onView={(f) => onViewFile(f, 'Traffic Memo Transhipment')}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">
                  Commercial Memo Issued
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={formCommercialDate}
                      onChange={(e) => setFormCommercialDate(e.target.value)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Memo Ref</label>
                    <input
                      type="text"
                      value={formCommercialMemoNo}
                      onChange={(e) => setFormCommercialMemoNo(e.target.value)}
                      placeholder="e.g. CM/TS/8821"
                      className="w-full text-xs font-mono uppercase px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
                <AttachmentUploader
                  label="Commercial Memo Issued (Pic / PDF Upload)"
                  sublabel="Commercial verification and seal memo"
                  attachment={formCommercialAttachment}
                  onAttach={setFormCommercialAttachment}
                  onView={(f) => onViewFile(f, 'Commercial Memo Transhipment')}
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks</label>
              <textarea
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                rows={2}
                placeholder="Crane operation notes, seal numbers, supervisor remarks..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              />
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
                Save Transhipment Operation
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ----------------- 3. DASHBOARD VIEW (MATCHING VIDEO 01:21) ----------------- */}
      {viewMode === 'dashboard' && (
        <div className="space-y-4">
          {/* Top Title & + New Entry Button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-800 text-white rounded-lg">
                  <ArrowRightLeft className="w-5 h-5 text-amber-300" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                  Transhipment Register
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Sick wagon to fit wagon transhipment operations register at Andal Yard.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0a355c] hover:bg-[#072540] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ NEW TRANSHIPMENT ENTRY</span>
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
                  placeholder="Search reason, ID, wagon..."
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
                  Transhipments for {MONTH_NAMES[selectedMonth - 1]} {selectedYear} ({filteredEntries.length} records found)
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
                    <th className="py-2.5 px-4">SICK REASON / DEFECT</th>
                    <th className="py-2.5 px-3">SICK WAGONS</th>
                    <th className="py-2.5 px-3">FIT WAGONS</th>
                    <th className="py-2.5 px-3">TRAFFIC MEMO</th>
                    <th className="py-2.5 px-3">COMMERCIAL MEMO</th>
                    <th className="py-2.5 px-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 bg-slate-50/50">
                        <ArrowRightLeft className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">
                          No transhipment operations recorded for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
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
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {item.commodity}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-red-700">
                          {item.loadedWagons.length}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                          {item.transhipWagons.length}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          Issued: {item.trafficMemoIssueDate}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          Issued: {item.commercialMemoIssueDate}
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
