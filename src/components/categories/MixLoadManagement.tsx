import React, { useState } from 'react';
import {
  Plus, Search, ArrowLeft, Train, Clock, Shield, FileText, Eye,
  Edit2, Trash2, Printer, ChevronRight, Calendar, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { MixLoadEntry, WagonEntry, FileAttachment } from '../../types/railway';
import { WagonInputTable } from '../WagonInputTable';
import { AttachmentUploader } from '../AttachmentUploader';

interface MixLoadManagementProps {
  entries: MixLoadEntry[];
  onSaveEntry: (entry: MixLoadEntry) => void;
  onDeleteEntry: (id: string) => void;
  onViewFile: (file: FileAttachment, title: string) => void;
  highlightedRecordId?: string | null;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MixLoadManagement: React.FC<MixLoadManagementProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onViewFile,
  highlightedRecordId
}) => {
  // Navigation / views: 'list' | 'create' | 'details'
  const [viewMode, setViewMode] = useState<'list' | 'form' | 'details'>('list');
  const [selectedLoad, setSelectedLoad] = useState<MixLoadEntry | null>(() => {
    if (highlightedRecordId) {
      return entries.find((e) => e.id === highlightedRecordId) || null;
    }
    return null;
  });

  // Filters
  const [selectedType, setSelectedType] = useState<'all' | 'outgoing' | 'incoming'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September by default
  const [searchQuery, setSearchQuery] = useState<string>('');

  const YEARS = [2024, 2025, 2026, 2027, 2028];
  const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Form State
  const [formId, setFormId] = useState<string>('');
  const [formType, setFormType] = useState<'incoming' | 'outgoing'>('outgoing');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formLoadName, setFormLoadName] = useState<string>('');
  const [formEngineNo, setFormEngineNo] = useState<string>('');
  const [formOutTime, setFormOutTime] = useState<string>('04:30');
  const [formDestination, setFormDestination] = useState<string>('');
  const [formBpcNo, setFormBpcNo] = useState<string>('');
  const [formBpcAttachment, setFormBpcAttachment] = useState<FileAttachment | undefined>(undefined);
  const [formVgAttachment, setFormVgAttachment] = useState<FileAttachment | undefined>(undefined);
  const [formWagons, setFormWagons] = useState<WagonEntry[]>([
    { id: 'w-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '' }
  ]);
  const [formRemarks, setFormRemarks] = useState<string>('');

  // Open Form for New Entry
  const handleOpenNew = () => {
    setFormId('');
    setFormType(selectedType === 'incoming' ? 'incoming' : 'outgoing');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormLoadName('');
    setFormEngineNo('');
    setFormOutTime(new Date().toTimeString().slice(0, 5));
    setFormDestination('');
    setFormBpcNo('');
    setFormBpcAttachment(undefined);
    setFormVgAttachment(undefined);
    setFormWagons([
      { id: 'w-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '' }
    ]);
    setFormRemarks('');
    setViewMode('form');
  };

  // Open Form for Editing
  const handleOpenEdit = (load: MixLoadEntry) => {
    setFormId(load.id);
    setFormType(load.type);
    setFormDate(load.date);
    setFormLoadName(load.loadName);
    setFormEngineNo(load.engineNo);
    setFormOutTime(load.outTime);
    setFormDestination(load.destinationOrOrigin);
    setFormBpcNo(load.bpcNo || '');
    setFormBpcAttachment(load.bpcAttachment);
    setFormVgAttachment(load.vehicleGuidanceAttachment);
    setFormWagons([...load.wagons]);
    setFormRemarks(load.remarks || '');
    setViewMode('form');
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLoadName.trim() || !formEngineNo.trim() || !formDestination.trim()) {
      alert('Please fill in Load Name, Engine No., and Destination / Origin.');
      return;
    }

    const d = new Date(formDate);
    const validWagons = formWagons.filter((w) => w.wagonNumber.trim() !== '');

    const newEntry: MixLoadEntry = {
      id: formId || 'ml-' + Date.now(),
      type: formType,
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      date: formDate,
      loadName: formLoadName.trim().toUpperCase(),
      engineNo: formEngineNo.trim().toUpperCase(),
      outTime: formOutTime,
      destinationOrOrigin: formDestination.trim().toUpperCase(),
      bpcNo: formBpcNo.trim() || undefined,
      bpcAttachment: formBpcAttachment,
      vehicleGuidanceAttachment: formVgAttachment,
      wagons: validWagons.length > 0 ? validWagons : formWagons,
      remarks: formRemarks.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    onSaveEntry(newEntry);
    setSelectedLoad(newEntry);
    setViewMode('details'); // Directly open the complete details page as requested
  };

  // Open Full Details Page
  const handleViewAction = (load: MixLoadEntry) => {
    setSelectedLoad(load);
    setViewMode('details');
  };

  // Filtered entries
  const filteredEntries = entries.filter((item) => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (item.year !== selectedYear) return false;
    if (item.month !== selectedMonth) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLoad = item.loadName.toLowerCase().includes(q);
      const matchLoco = item.engineNo.toLowerCase().includes(q);
      const matchDest = item.destinationOrOrigin.toLowerCase().includes(q);
      const matchWagon = item.wagons.some(
        (w) =>
          w.wagonNumber.toLowerCase().includes(q) ||
          w.owningRailway.toLowerCase().includes(q)
      );
      if (!matchLoad && !matchLoco && !matchDest && !matchWagon) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* ----------------- 1. FULL DETAILS PAGE VIEW ----------------- */}
      {viewMode === 'details' && selectedLoad && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Bar */}
          <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Register</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      selectedLoad.type === 'outgoing'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {selectedLoad.type.toUpperCase()} MIX
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-white font-mono">
                    {selectedLoad.loadName}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Andal Trains Office Record Ref: #{selectedLoad.id} · Created: {selectedLoad.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(selectedLoad)}
                className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Load</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-blue-300" />
                <span>Print Load Sheet</span>
              </button>
            </div>
          </div>

          {/* Operational Meta Grid */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/60">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-[11px] block mb-1">Departure / Entry Date</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedLoad.date}</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-[11px] block mb-1">
                  {selectedLoad.type === 'outgoing' ? 'Destination Station' : 'Origin Station'}
                </span>
                <span className="font-mono font-bold text-sm text-blue-900">
                  {selectedLoad.destinationOrOrigin}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-[11px] block mb-1">Engine / Loco Number</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedLoad.engineNo}</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-[11px] block mb-1">Out Time / Passing Time</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedLoad.outTime} HRS</span>
              </div>
            </div>
          </div>

          {/* Side-by-side BPC & Vehicle Guidance Viewer Cards */}
          <div className="p-6 border-b border-slate-200 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Official Attached Documents (BPC &amp; Vehicle Guidance)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BPC Card */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-900 text-white rounded-lg">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Brake Power Certificate (BPC)</h4>
                    <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                      {selectedLoad.bpcNo ? `Certificate: ${selectedLoad.bpcNo}` : 'BPC Document Attached'}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded mt-1 inline-block">
                      100% Verified Brake Power
                    </span>
                  </div>
                </div>

                {selectedLoad.bpcAttachment ? (
                  <button
                    type="button"
                    onClick={() =>
                      onViewFile(
                        selectedLoad.bpcAttachment!,
                        `BPC - ${selectedLoad.loadName}`
                      )
                    }
                    className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View BPC Photo/PDF</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 italic">No BPC uploaded</span>
                )}
              </div>

              {/* Vehicle Guidance (VG) Card */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-600 text-white rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Vehicle Guidance (VG) Sheet</h4>
                    <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                      Marshalling order &amp; train formation sheet
                    </p>
                    <span className="text-[10px] text-slate-600 font-mono mt-1 inline-block">
                      Wagons: {selectedLoad.wagons.length} Units
                    </span>
                  </div>
                </div>

                {selectedLoad.vehicleGuidanceAttachment ? (
                  <button
                    type="button"
                    onClick={() =>
                      onViewFile(
                        selectedLoad.vehicleGuidanceAttachment!,
                        `Vehicle Guidance - ${selectedLoad.loadName}`
                      )
                    }
                    className="px-3.5 py-2 bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View VG Photo/PDF</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 italic">No VG uploaded</span>
                )}
              </div>
            </div>
          </div>

          {/* Full Wagon Entry Table (3 Columns) */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Marshalling Wagon Ledger ({selectedLoad.wagons.length} Wagons)
                </h3>
                <p className="text-xs text-slate-500">Official 3-column verification table</p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                Total Wagons: {selectedLoad.wagons.length}
              </span>
            </div>

            <WagonInputTable
              wagons={selectedLoad.wagons}
              onChange={() => {}}
              readOnly={true}
              title="Attached Wagons Order"
            />

            {selectedLoad.remarks && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <strong className="text-slate-800">Operational Remarks / Instructions:</strong>
                <p className="text-slate-600 mt-1">{selectedLoad.remarks}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- 2. CREATE / EDIT FORM ----------------- */}
      {viewMode === 'form' && (
        <form onSubmit={handleSaveForm} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-900 rounded-md text-amber-400">
                <Train className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-white">
                  {formId ? 'Edit Mix Load Entry' : 'Add New Mix Load Entry'}
                </h2>
                <p className="text-xs text-slate-400">Trains Office Andal Marshalling Yard Register</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              Cancel
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Type selector */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase">Load Direction / Type:</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="mixType"
                    checked={formType === 'outgoing'}
                    onChange={() => setFormType('outgoing')}
                    className="accent-blue-900"
                  />
                  <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    Outgoing Mix (Despatched from Andal)
                  </span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="mixType"
                    checked={formType === 'incoming'}
                    onChange={() => setFormType('incoming')}
                    className="accent-blue-900"
                  />
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                    Incoming Mix (Arrived at Andal)
                  </span>
                </label>
              </div>
            </div>

            {/* Core Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Date <span className="text-red-500">*</span>
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
                  2. Train / Load Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formLoadName}
                  onChange={(e) => setFormLoadName(e.target.value)}
                  placeholder="e.g. UDL-BPC MIX, DHN EMPTY MIX"
                  className="w-full text-xs font-bold uppercase px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-700 outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. {formType === 'outgoing' ? 'Destination Station' : 'Origin Station'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formDestination}
                  onChange={(e) => setFormDestination(e.target.value)}
                  placeholder="e.g. BPC (Budge Budge), DHN, ASN"
                  className="w-full text-xs font-bold uppercase px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-700 outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  4. Engine No. (Loco No.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formEngineNo}
                  onChange={(e) => setFormEngineNo(e.target.value)}
                  placeholder="e.g. WAG9-31245, WAG7-27120"
                  className="w-full text-xs font-bold uppercase px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-700 outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  5. Out Time / Passing Time (24h) <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formOutTime}
                  onChange={(e) => setFormOutTime(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6. BPC Certificate Number
                </label>
                <input
                  type="text"
                  value={formBpcNo}
                  onChange={(e) => setFormBpcNo(e.target.value)}
                  placeholder="e.g. BPC/UDL/BOXN/8941"
                  className="w-full text-xs font-mono uppercase px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-700 outline-none"
                />
              </div>
            </div>

            {/* Adjacent BPC & Vehicle Guidance Uploaders as specified */}
            <div>
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Required Document Uploads (BPC &amp; Vehicle Guidance)
                </span>
                <p className="text-[11px] text-slate-500">
                  Vehicle guidance column is placed right next to BPC column for unified single-page management.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AttachmentUploader
                  label="BPC Photo / PDF Upload"
                  sublabel="Brake Power Certificate issued by TXR / C&W Andal"
                  attachment={formBpcAttachment}
                  onAttach={setFormBpcAttachment}
                  onView={(f) => onViewFile(f, `BPC - ${formLoadName || 'Preview'}`)}
                />

                <AttachmentUploader
                  label="Vehicle Guidance (VG) Photo / PDF Upload"
                  sublabel="Vehicle Guidance marshalling formation sheet"
                  attachment={formVgAttachment}
                  onAttach={setFormVgAttachment}
                  onView={(f) => onViewFile(f, `Vehicle Guidance - ${formLoadName || 'Preview'}`)}
                />
              </div>
            </div>

            {/* Wagon Entry 3-Column Table */}
            <div>
              <WagonInputTable
                wagons={formWagons}
                onChange={setFormWagons}
                title="Wagon Entry (3 Column Table)"
                badge="Mandatory 3 Columns: Owning Railway, Wagon Type, Wagon Number"
              />
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operational Remarks / Notes
              </label>
              <textarea
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                placeholder="Optional notes, yard line details, driver/guard details..."
                rows={2}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-700 outline-none"
              />
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
              >
                Save Mix Load &amp; Open Details Page
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ----------------- 3. HIERARCHICAL REGISTER LIST VIEW ----------------- */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Top Title & + New Entry Button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-900 text-white rounded-lg">
                  <Train className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                  Mix Load Management
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Year - Month - Date wise railway load register for Andal Yard Office.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0a355c] hover:bg-[#072540] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ NEW MIX LOAD ENTRY</span>
            </button>
          </div>

          {/* Filter Card (exact layout from video 00:24) */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3.5">
            {/* Row 1: Load Type Tabs + Search Input */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase px-2">Load Type:</span>
                <button
                  type="button"
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    selectedType === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Mix Loads
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('outgoing')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    selectedType === 'outgoing'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Outgoing Mix
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('incoming')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    selectedType === 'incoming'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Incoming Mix
                </button>
              </div>

              {/* Search on right */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search load, loco, ID..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800 text-slate-800"
                />
              </div>
            </div>

            {/* Row 2: SELECT OPERATIONAL YEAR (Horizontal pills 2024..2028) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
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

            {/* Row 3: SELECT MONTH (Horizontal tabs Jan..Dec) */}
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
                  Mix Loads for {MONTH_NAMES[selectedMonth - 1]} {selectedYear} ({filteredEntries.length} records found)
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
                    <th className="py-2.5 px-3 w-28">TYPE</th>
                    <th className="py-2.5 px-4">LOAD NAME</th>
                    <th className="py-2.5 px-4">DESTINATION / EX</th>
                    <th className="py-2.5 px-3">ENGINE NO.</th>
                    <th className="py-2.5 px-3">OUT TIME</th>
                    <th className="py-2.5 px-3">WAGON COUNT</th>
                    <th className="py-2.5 px-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 bg-slate-50/50">
                        <Train className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">
                          No loads recorded for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Click &quot;+ NEW MIX LOAD ENTRY&quot; above to log a train movement.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((load) => (
                      <tr
                        key={load.id}
                        className="hover:bg-blue-50/40 transition-colors group"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {load.date}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                              load.type === 'outgoing'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {load.type === 'outgoing' ? 'OUTGOING' : 'INCOMING'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleViewAction(load)}
                            className="font-bold font-mono text-blue-900 hover:text-blue-700 hover:underline text-left block"
                          >
                            {load.loadName}
                          </button>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 font-mono">
                          {load.destinationOrOrigin}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700 font-semibold">
                          {load.engineNo}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {load.outTime}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {load.wagons.length}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleViewAction(load)}
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
