import React, { useState } from 'react';
import {
  Plus, Search, Calendar, FileText, Eye, Edit2, Trash2,
  Wrench, CheckCircle2, ShieldCheck, ArrowRight, CornerDownRight
} from 'lucide-react';
import { SickRepairEntry, SickRepairCategory, WagonEntry, FileAttachment } from '../../types/railway';
import { WagonInputTable } from '../WagonInputTable';
import { AttachmentUploader } from '../AttachmentUploader';

interface SickRepairProps {
  entries: SickRepairEntry[];
  onSaveEntry: (entry: SickRepairEntry) => void;
  onDeleteEntry: (id: string) => void;
  onViewFile: (file: FileAttachment, title: string) => void;
  highlightedRecordId?: string | null;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const FIT_TYPES = [
  'Full Fit',
  'Empty Fit',
  'Loaded Fit',
  'Wheel Turning Fit',
  'Brake Beam Fit',
  'CBC Coupler Fit',
  'Spring & Suspension Fit',
  'Temporary Fit',
  'ROH Overhaul Fit'
];

export const SickRepair: React.FC<SickRepairProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onViewFile,
  highlightedRecordId
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'form' | 'details'>('dashboard');
  const [selectedEntry, setSelectedEntry] = useState<SickRepairEntry | null>(() => {
    if (highlightedRecordId) {
      return entries.find((e) => e.id === highlightedRecordId) || null;
    }
    return null;
  });

  // The 3 Mandatory Sub-categories: a) DOWN SICK LINE  b) UP SICK LINE  c) BOXN DEPOT
  const [activeCategory, setActiveCategory] = useState<SickRepairCategory>('down_sick_line');

  // Filters
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [formId, setFormId] = useState<string>('');
  const [formCategory, setFormCategory] = useState<SickRepairCategory>('down_sick_line');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formTypeOfFit, setFormTypeOfFit] = useState<string>('Full Fit');
  const [formFitMemoNo, setFormFitMemoNo] = useState<string>('');
  const [formFitAttachment, setFormFitAttachment] = useState<FileAttachment | undefined>(undefined);
  const [formSupervisor, setFormSupervisor] = useState<string>('SSE / C&W / Andal');
  const [formBayOrLine, setFormBayOrLine] = useState<string>('Sick Line Track 02');
  const [formDefect, setFormDefect] = useState<string>('');
  const [formWorkDone, setFormWorkDone] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'Under Repair' | 'Fit Certified' | 'Despatched to Yard'>('Fit Certified');
  const [formWagons, setFormWagons] = useState<WagonEntry[]>([
    { id: 'rw-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '' }
  ]);
  const [formRemarks, setFormRemarks] = useState<string>('');

  const handleOpenNew = () => {
    setFormId('');
    setFormCategory(activeCategory);
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormTypeOfFit('Full Fit');
    setFormFitMemoNo('');
    setFormFitAttachment(undefined);
    setFormSupervisor('SSE / C&W / Andal');
    setFormBayOrLine(activeCategory === 'boxn_depot' ? 'BOXN ROH Depot Bay 01' : 'Track Line 02');
    setFormDefect('');
    setFormWorkDone('');
    setFormStatus('Fit Certified');
    setFormWagons([
      { id: 'rw-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '' }
    ]);
    setFormRemarks('');
    setViewMode('form');
  };

  const handleOpenEdit = (entry: SickRepairEntry) => {
    setFormId(entry.id);
    setFormCategory(entry.category);
    setFormDate(entry.date);
    setFormTypeOfFit(entry.typeOfFit);
    setFormFitMemoNo(entry.fitMemoNo || '');
    setFormFitAttachment(entry.fitMemoAttachment);
    setFormSupervisor(entry.txrSupervisorName || '');
    setFormBayOrLine(entry.lineNoOrBay || '');
    setFormDefect(entry.defectNoted || '');
    setFormWorkDone(entry.workDone || '');
    setFormStatus(entry.status);
    setFormWagons([...entry.wagons]);
    setFormRemarks(entry.remarks || '');
    setViewMode('form');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(formDate);
    const validWagons = formWagons.filter((w) => w.wagonNumber.trim() !== '');

    const newEntry: SickRepairEntry = {
      id: formId || 'sr-' + Date.now(),
      category: formCategory,
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      date: formDate,
      typeOfFit: formTypeOfFit,
      fitMemoNo: formFitMemoNo.trim() || undefined,
      fitMemoAttachment: formFitAttachment,
      txrSupervisorName: formSupervisor.trim() || undefined,
      lineNoOrBay: formBayOrLine.trim() || undefined,
      defectNoted: formDefect.trim() || undefined,
      workDone: formWorkDone.trim() || undefined,
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
    if (item.category !== activeCategory) return false;
    if (item.year !== selectedYear) return false;
    if (item.month !== selectedMonth) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFit = item.typeOfFit.toLowerCase().includes(q);
      const matchSuper = (item.txrSupervisorName || '').toLowerCase().includes(q);
      const matchWagon = item.wagons.some(
        (w) =>
          w.wagonNumber.toLowerCase().includes(q) ||
          w.owningRailway.toLowerCase().includes(q)
      );
      if (!matchFit && !matchSuper && !matchWagon) return false;
    }
    return true;
  });

  const getCategoryTitle = (cat: SickRepairCategory) => {
    switch (cat) {
      case 'down_sick_line':
        return 'a) DOWN SICK LINE';
      case 'up_sick_line':
        return 'b) UP SICK LINE';
      case 'boxn_depot':
        return 'c) BOXN DEPOT';
    }
  };

  return (
    <div className="space-y-6">
      {/* Subcategory Tab Selector as mandated: a) DOWN SICK LINE, b) UP SICK LINE, c) BOXN DEPOT */}
      <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-900 rounded-lg text-amber-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">SICK REPAIR SECTION · C&amp;W ANDAL</h3>
            <p className="text-[11px] text-slate-400">Select Sick Line or Depot Category:</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveCategory('down_sick_line')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeCategory === 'down_sick_line'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            a) DOWN SICK LINE
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('up_sick_line')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeCategory === 'up_sick_line'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            b) UP SICK LINE
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('boxn_depot')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeCategory === 'boxn_depot'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            c) BOXN DEPOT
          </button>
        </div>
      </div>

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
                &larr; Back to Dashboard
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono">
                    {getCategoryTitle(selectedEntry.category)}
                  </span>
                  <h2 className="text-lg font-bold text-white font-mono">
                    Fit Type: [{selectedEntry.typeOfFit}]
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fit Date: {selectedEntry.date} · Line/Bay: {selectedEntry.lineNoOrBay}
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
                <span className="text-slate-500 text-[11px] block">Date Fit Certified</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedEntry.date}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Type of Fit</span>
                <span className="font-bold text-sm text-emerald-800">{selectedEntry.typeOfFit}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">C&amp;W Supervisor / TXR</span>
                <span className="font-bold text-sm text-slate-900">{selectedEntry.txrSupervisorName}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Status</span>
                <span className="font-bold text-sm text-blue-900">{selectedEntry.status}</span>
              </div>
            </div>

            {/* Repair / Defect summary */}
            {(selectedEntry.defectNoted || selectedEntry.workDone) && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                {selectedEntry.defectNoted && (
                  <div>
                    <strong className="text-slate-800">Defect Noted on Sick Wagon:</strong>
                    <p className="text-slate-700 mt-0.5">{selectedEntry.defectNoted}</p>
                  </div>
                )}
                {selectedEntry.workDone && (
                  <div>
                    <strong className="text-slate-800">Repair Work Done &amp; Testing:</strong>
                    <p className="text-slate-700 mt-0.5">{selectedEntry.workDone}</p>
                  </div>
                )}
              </div>
            )}

            {/* Fit Memo Document Preview */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Official Fit Memo / Certificate</h4>
                <p className="text-[11px] text-slate-600 font-mono">
                  Ref: {selectedEntry.fitMemoNo || 'Fitness Certificate'} · Certified by C&amp;W
                </p>
              </div>
              {selectedEntry.fitMemoAttachment ? (
                <button
                  type="button"
                  onClick={() => onViewFile(selectedEntry.fitMemoAttachment!, 'Sick Line Fit Memo')}
                  className="px-3 py-1.5 text-xs font-bold bg-blue-900 text-white rounded-lg flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Fit Memo</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">No memo file</span>
              )}
            </div>

            {/* Wagons Fit (3 Columns) */}
            <div>
              <WagonInputTable
                wagons={selectedEntry.wagons}
                onChange={() => {}}
                readOnly={true}
                title={`Wagons Repaired & Fit Certified (${selectedEntry.wagons.length} Wagons)`}
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
                {formId ? 'Edit Sick Repair Record' : `Log Wagons Fit in ${getCategoryTitle(formCategory)}`}
              </h2>
              <p className="text-xs text-slate-400">
                Rolling Stock Fitness Certification · Trains Office Andal
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
                  1. Sick Repair Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="down_sick_line">a) DOWN SICK LINE</option>
                  <option value="up_sick_line">b) UP SICK LINE</option>
                  <option value="boxn_depot">c) BOXN DEPOT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Date (Kis Date Me Wagons Fit Hue) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  required
                />
              </div>

              {/* Mandated: fir ek coulm type of fit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Type of Fit (Column: Type of Fit) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="fit-types-list"
                    value={formTypeOfFit}
                    onChange={(e) => setFormTypeOfFit(e.target.value)}
                    placeholder="e.g. Full Fit, Empty Fit, Loaded Fit"
                    className="w-full text-xs font-bold uppercase px-3 py-2 border border-blue-400 bg-blue-50/40 rounded-lg outline-none text-blue-900"
                    required
                  />
                  <datalist id="fit-types-list">
                    {FIT_TYPES.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Wagon Entry 3-Column Table */}
            <div>
              <WagonInputTable
                wagons={formWagons}
                onChange={setFormWagons}
                title="Wagon Entry (3 Columns: Owning Railway, Wagon Type, Wagon Number)"
                badge="Wagons Declared Fit on this Date"
              />
            </div>

            {/* Supervisors & Memos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">
                  Examination &amp; Bay Details
                </span>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    TXR / C&amp;W Supervisor Name
                  </label>
                  <input
                    type="text"
                    value={formSupervisor}
                    onChange={(e) => setFormSupervisor(e.target.value)}
                    placeholder="e.g. SSE / C&W / UDL"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Sick Line Track / Bay Number
                  </label>
                  <input
                    type="text"
                    value={formBayOrLine}
                    onChange={(e) => setFormBayOrLine(e.target.value)}
                    placeholder="e.g. Down Sick Line Track 3"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Defect Noted &amp; Repair Work
                  </label>
                  <input
                    type="text"
                    value={formWorkDone}
                    onChange={(e) => setFormWorkDone(e.target.value)}
                    placeholder="e.g. Brake beam replaced, wheel profile machined, single car test OK"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">
                  Fit Memo Certificate Upload
                </span>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Fit Memo Ref Number
                  </label>
                  <input
                    type="text"
                    value={formFitMemoNo}
                    onChange={(e) => setFormFitMemoNo(e.target.value)}
                    placeholder="e.g. FIT/DSL/UDL/2026/661"
                    className="w-full text-xs font-mono uppercase px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <AttachmentUploader
                  label="Fit Memo Certificate (Pic / PDF Upload)"
                  sublabel="Official C&W Rolling Stock fitness memo"
                  attachment={formFitAttachment}
                  onAttach={setFormFitAttachment}
                  onView={(f) => onViewFile(f, 'Fit Memo Certificate')}
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
                Save Fit Repair Record
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ----------------- 3. DASHBOARD VIEW ----------------- */}
      {viewMode === 'dashboard' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-mono">
                {getCategoryTitle(activeCategory)} · Fitness Dashboard
              </h2>
              <p className="text-xs text-slate-500">
                Date-wise tracking: kis date me kitne wagon fit hue with 3-column wagon ledger &amp; type of fit
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Year:</span>
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-semibold text-slate-800 text-xs"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>

              <span className="font-semibold text-slate-700 ml-2">Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 text-xs"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={i + 1} value={i + 1}>
                    {name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleOpenNew}
                className="ml-2 flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Log Wagons Fit</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Wagon No, Type of Fit, or Supervisor in this category..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 font-medium"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {MONTH_NAMES[selectedMonth - 1]} {selectedYear} · {getCategoryTitle(activeCategory)}
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                {filteredEntries.length} Fit Certifications
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-4 w-28">Date Fit</th>
                    <th className="py-2.5 px-4">Wagons Fit (3-Col)</th>
                    <th className="py-2.5 px-3">Total Fit Count</th>
                    <th className="py-2.5 px-3">Type of Fit</th>
                    <th className="py-2.5 px-3">TXR Supervisor</th>
                    <th className="py-2.5 px-3">Fit Memo Ref</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 bg-slate-50/50">
                        <Wrench className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">
                          No fit records logged for {getCategoryTitle(activeCategory)} in {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {item.wagons.map((w, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-bold text-blue-900">{w.owningRailway}</span>
                              <span className="text-slate-600">{w.wagonType}</span>
                              <span className="font-bold text-slate-900">{w.wagonNumber}</span>
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">
                          {item.wagons.length} Wagons Fit
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-800 font-mono">
                          {item.typeOfFit}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {item.txrSupervisorName || 'TXR Incharge'}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          {item.fitMemoNo || 'Issued'}
                          {item.fitMemoAttachment && (
                            <span className="ml-1 text-[10px] text-blue-700 font-bold">[Doc]</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEntry(item);
                                setViewMode('details');
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Delete this fit repair record?')) {
                                  onDeleteEntry(item.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
