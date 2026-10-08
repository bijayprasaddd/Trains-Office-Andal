import React, { useState } from 'react';
import { X, Printer, Download, Calendar, Filter, FileText } from 'lucide-react';
import { AppDatabase, UserSession } from '../types/railway';
import { IRLogo } from './IRLogo';

interface PrintReportViewProps {
  isOpen: boolean;
  onClose: () => void;
  database: AppDatabase;
  userSession: UserSession;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  isOpen,
  onClose,
  database,
  userSession
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all_summary');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = all months

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (selectedCategory === 'mix_load' || selectedCategory === 'all_summary') {
      csvContent += 'CATEGORY,DATE,TYPE,LOAD_NAME,LOCO_NO,DESTINATION_ORIGIN,WAGON_SR,OWNING_RLY,WAGON_TYPE,WAGON_NO,BPC_NO\n';
      database.mixLoads.forEach((ml) => {
        ml.wagons.forEach((w, idx) => {
          csvContent += `Mix Load,${ml.date},${ml.type},"${ml.loadName}",${ml.engineNo},"${ml.destinationOrOrigin}",${idx + 1},${w.owningRailway},${w.wagonType},${w.wagonNumber},"${ml.bpcNo || ''}"\n`;
        });
      });
    }

    if (selectedCategory === 'cym_unloading' || selectedCategory === 'all_summary') {
      csvContent += '\nCATEGORY,DATE,LINE_NO,TRAFFIC_MEMO_NO,COMM_RELEASE_DATE,DESPATCHED_OUTSIDE,DESTINATION,OWNING_RLY,WAGON_TYPE,WAGON_NO,STATUS\n';
      database.cymUnloadings.forEach((c) => {
        c.wagons.forEach((w) => {
          csvContent += `CYM Unload,${c.date},"${c.lineNo}","${c.trafficMemoNo || ''}",${c.commercialReleaseDate},${c.despatchedOutside ? 'YES' : 'NO'},"${c.outsideDestination || ''}",${w.owningRailway},${w.wagonType},${w.wagonNumber},${c.status}\n`;
        });
      });
    }

    if (selectedCategory === 'transhipment' || selectedCategory === 'all_summary') {
      csvContent += '\nCATEGORY,DATE,COMMODITY,LOCATION,TRAFFIC_MEMO,COMMERCIAL_MEMO,SICK_RLY,SICK_TYPE,SICK_WAGON_NO,FIT_RLY,FIT_TYPE,FIT_WAGON_NO\n';
      database.transhipments.forEach((t) => {
        const maxLen = Math.max(t.loadedWagons.length, t.transhipWagons.length);
        for (let i = 0; i < maxLen; i++) {
          const sw = t.loadedWagons[i] || { owningRailway: '', wagonType: '', wagonNumber: '' };
          const fw = t.transhipWagons[i] || { owningRailway: '', wagonType: '', wagonNumber: '' };
          csvContent += `Transhipment,${t.date},"${t.commodity}","${t.transhipmentLocation || ''}","${t.trafficMemoNo || ''}","${t.commercialMemoNo || ''}",${sw.owningRailway},${sw.wagonType},${sw.wagonNumber},${fw.owningRailway},${fw.wagonType},${fw.wagonNumber}\n`;
        }
      });
    }

    if (selectedCategory === 'pcml_diversion' || selectedCategory === 'all_summary') {
      csvContent += '\nCATEGORY,DATE,ORIGIN_FROM,BOOKED_TO,DIVERTED_TO,DIVT_MEMO,NR_LETTER,OWNING_RLY,WAGON_TYPE,WAGON_NO,REASON\n';
      database.pcmlDiversions.forEach((p) => {
        p.wagons.forEach((w) => {
          csvContent += `PCML Diversion,${p.date},"${p.fromStation}","${p.toStation}","${p.divertedToStation}","${p.trafficDivtRequestMemoNo || ''}","${p.nrCellDivtLetterRef || ''}",${w.owningRailway},${w.wagonType},${w.wagonNumber},"${p.reasonForDiversion}"\n`;
        });
      });
    }

    if (selectedCategory === 'sick_repair' || selectedCategory === 'all_summary') {
      csvContent += '\nCATEGORY,DATE,SICK_LINE_TYPE,TYPE_OF_FIT,SUPERVISOR,FIT_MEMO_NO,OWNING_RLY,WAGON_TYPE,WAGON_NO,REMARKS\n';
      database.sickRepairs.forEach((s) => {
        s.wagons.forEach((w) => {
          csvContent += `Sick Repair,${s.date},${s.category},"${s.typeOfFit}","${s.txrSupervisorName || ''}","${s.fitMemoNo || ''}",${w.owningRailway},${w.wagonType},${w.wagonNumber},"${s.remarks || ''}"\n`;
        });
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ANDAL_TRAINS_OFFICE_REPORT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Filter helpers
  const filterByYearMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    if (d.getFullYear() !== selectedYear) return false;
    if (selectedMonth > 0 && d.getMonth() + 1 !== selectedMonth) return false;
    return true;
  };

  const filteredMixLoads = database.mixLoads.filter((m) => filterByYearMonth(m.date));
  const filteredCym = database.cymUnloadings.filter((c) => filterByYearMonth(c.date));
  const filteredTranship = database.transhipments.filter((t) => filterByYearMonth(t.date));
  const filteredPcml = database.pcmlDiversions.filter((p) => filterByYearMonth(p.date));
  const filteredSick = database.sickRepairs.filter((s) => filterByYearMonth(s.date));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-auto overflow-hidden border border-slate-300 flex flex-col max-h-[95vh]">
        {/* Modal Controls Bar (hidden during browser print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900 rounded-md">
              <Printer className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Trains Office Andal Official Report Engine</h3>
              <p className="text-xs text-slate-400">Generate, Print, or Save as PDF with official Railway format</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar (hidden during print) */}
        <div className="no-print p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">Module:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded font-medium text-slate-800"
            >
              <option value="all_summary">Comprehensive Daily Master Register</option>
              <option value="mix_load">1. Mix Load Management</option>
              <option value="cym_unloading">2. CYM Unloading Register</option>
              <option value="transhipment">3. Transhipment Register</option>
              <option value="pcml_diversion">4. PCML Diversion Register</option>
              <option value="sick_repair">5. Sick Line Repair Register</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-slate-800"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>

            <span className="font-semibold text-slate-700 ml-2">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-800"
            >
              <option value={0}>All Months</option>
              {MONTH_NAMES.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-6 sm:p-10 bg-white overflow-y-auto flex-1 font-sans text-slate-900 leading-normal">
          {/* Official IR Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6 relative">
            <div className="flex items-center justify-center gap-4 mb-2">
              <IRLogo size={56} />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950 font-serif">
                  EASTERN RAILWAY · ASANSOL DIVISION
                </h1>
                <h2 className="text-sm font-semibold tracking-wider text-slate-800">
                  TRAINS BRANCH OFFICE · ANDAL MARSHALLING YARD (UDL)
                </h2>
                <p className="text-xs text-slate-600 font-mono">
                  OFFICIAL FREIGHT ROLLING STOCK OPERATIONS REGISTER
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono mt-3 px-2 border-t border-slate-200 pt-2">
              <span>REPORT CADRE: {selectedCategory.toUpperCase()}</span>
              <span>FILTER: {selectedMonth > 0 ? MONTH_NAMES[selectedMonth - 1] : 'Full Year'} {selectedYear}</span>
              <span>PRINTED BY: {userSession.displayName} ({userSession.role})</span>
              <span>DATE: {new Date().toLocaleDateString('en-GB')}</span>
            </div>
          </div>

          {/* 1. Mix Load Section */}
          {(selectedCategory === 'all_summary' || selectedCategory === 'mix_load') && (
            <div className="mb-8">
              <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 mb-2 rounded-xs">
                <span className="font-bold text-xs uppercase tracking-wide">
                  1. MIX LOAD MANAGEMENT (INCOMING &amp; OUTGOING)
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  Total Entries: {filteredMixLoads.length}
                </span>
              </div>

              {filteredMixLoads.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No mix load records found for selected period.</p>
              ) : (
                <div className="space-y-4">
                  {filteredMixLoads.map((ml) => (
                    <div key={ml.id} className="border border-slate-300 rounded p-3 bg-slate-50/50">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2 text-xs">
                        <div>
                          <strong className="text-blue-900 uppercase font-mono">[{ml.type.toUpperCase()}] {ml.loadName}</strong>
                          <span className="text-slate-600 ml-2">· Dest/From: <strong>{ml.destinationOrOrigin}</strong></span>
                        </div>
                        <div className="font-mono text-slate-600 space-x-3">
                          <span>Date: <strong>{ml.date}</strong></span>
                          <span>Loco: <strong>{ml.engineNo}</strong></span>
                          <span>Time: <strong>{ml.outTime}</strong></span>
                          <span>BPC: <strong>{ml.bpcNo || 'Verified'}</strong></span>
                        </div>
                      </div>

                      {/* Wagons Columns */}
                      <table className="w-full text-xs border border-slate-300 bg-white">
                        <thead>
                          <tr className="bg-slate-200 text-slate-800 text-[11px]">
                            <th className="py-1 px-2 border-r border-slate-300 w-12 text-center">Sr.</th>
                            <th className="py-1 px-2 border-r border-slate-300 w-28">Owning Railway</th>
                            <th className="py-1 px-2 border-r border-slate-300 w-28">Wagon Type</th>
                            <th className="py-1 px-2 border-r border-slate-300 w-36">Wagon Number</th>
                            <th className="py-1 px-2 border-r border-slate-300 w-28">Load Status</th>
                            <th className="py-1 px-2">Wagon Destination</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ml.wagons.map((w, idx) => (
                            <tr key={w.id || idx} className="border-t border-slate-200 font-mono text-[11px]">
                              <td className="py-1 px-2 border-r border-slate-200 text-center">{idx + 1}</td>
                              <td className="py-1 px-2 border-r border-slate-200 font-bold">{w.owningRailway}</td>
                              <td className="py-1 px-2 border-r border-slate-200">{w.wagonType}</td>
                              <td className="py-1 px-2 border-r border-slate-200 font-bold">{w.wagonNumber}</td>
                              <td className="py-1 px-2 border-r border-slate-200">{w.loadStatus || 'Loaded'}</td>
                              <td className="py-1 px-2 text-slate-800">{w.destination || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. CYM Unloading Section */}
          {(selectedCategory === 'all_summary' || selectedCategory === 'cym_unloading') && (
            <div className="mb-8">
              <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 mb-2 rounded-xs">
                <span className="font-bold text-xs uppercase tracking-wide">
                  2. CYM UNLOADING REGISTER
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  Total Entries: {filteredCym.length}
                </span>
              </div>

              {filteredCym.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No CYM unloading records found for selected period.</p>
              ) : (
                <table className="w-full text-xs border border-slate-300 bg-white">
                  <thead>
                    <tr className="bg-slate-200 text-slate-800 text-[11px]">
                      <th className="py-1.5 px-2 border-r border-slate-300">Date</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Yard Line</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Wagons (Rly - Type - No)</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Traffic Memo</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Commercial Release</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Outside Despatch</th>
                      <th className="py-1.5 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCym.map((c) => (
                      <tr key={c.id} className="border-t border-slate-200 text-[11px] align-top">
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono whitespace-nowrap">{c.date}</td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-medium">{c.lineNo}</td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono">
                          {c.wagons.map((w, i) => (
                            <div key={i} className="text-slate-900">
                              <strong>{w.owningRailway}</strong> {w.wagonType} {w.wagonNumber}
                            </div>
                          ))}
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono">
                          {c.trafficMemoNo || 'Issued'}
                          <span className="block text-[10px] text-slate-500">Date: {c.trafficMemoIssueDate}</span>
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono">
                          {c.commercialReleaseDate}
                          <span className="block text-[10px] text-slate-500">{c.commercialMemoNo || ''}</span>
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200">
                          {c.despatchedOutside ? (
                            <span className="text-emerald-800 font-medium">To: {c.outsideDestination}</span>
                          ) : (
                            <span className="text-slate-500">Yard Released</span>
                          )}
                        </td>
                        <td className="py-1.5 px-2 font-semibold text-slate-800">{c.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 3. Transhipment Section */}
          {(selectedCategory === 'all_summary' || selectedCategory === 'transhipment') && (
            <div className="mb-8">
              <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 mb-2 rounded-xs">
                <span className="font-bold text-xs uppercase tracking-wide">
                  3. SICK WAGON TRANSHIPMENT REGISTER
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  Total Entries: {filteredTranship.length}
                </span>
              </div>

              {filteredTranship.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No transhipment records found for selected period.</p>
              ) : (
                <table className="w-full text-xs border border-slate-300 bg-white">
                  <thead>
                    <tr className="bg-slate-200 text-slate-800 text-[11px]">
                      <th className="py-1.5 px-2 border-r border-slate-300">Date</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Commodity &amp; Location</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Sick Loaded Wagon (3-Col)</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Fit Tranship Wagon (3-Col)</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Traffic &amp; Commercial Memo</th>
                      <th className="py-1.5 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTranship.map((t) => (
                      <tr key={t.id} className="border-t border-slate-200 text-[11px] align-top">
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono whitespace-nowrap">{t.date}</td>
                        <td className="py-1.5 px-2 border-r border-slate-200">
                          <strong>{t.commodity}</strong>
                          <span className="block text-[10px] text-slate-500">{t.transhipmentLocation}</span>
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono text-red-700">
                          {t.loadedWagons.map((w, i) => (
                            <div key={i}>
                              <strong>{w.owningRailway}</strong> {w.wagonType} {w.wagonNumber}
                            </div>
                          ))}
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono text-emerald-700">
                          {t.transhipWagons.map((w, i) => (
                            <div key={i}>
                              <strong>{w.owningRailway}</strong> {w.wagonType} {w.wagonNumber}
                            </div>
                          ))}
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono text-[10px]">
                          <div>TM: {t.trafficMemoNo || 'Issued'}</div>
                          <div>CM: {t.commercialMemoNo || 'Issued'}</div>
                        </td>
                        <td className="py-1.5 px-2 font-semibold text-slate-800">{t.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 4. PCML Diversion Section */}
          {(selectedCategory === 'all_summary' || selectedCategory === 'pcml_diversion') && (
            <div className="mb-8">
              <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 mb-2 rounded-xs">
                <span className="font-bold text-xs uppercase tracking-wide">
                  4. PCML DIVERSION REGISTER (PIECEMEAL WAGONS)
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  Total Entries: {filteredPcml.length}
                </span>
              </div>

              {filteredPcml.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No PCML diversion records found for selected period.</p>
              ) : (
                <table className="w-full text-xs border border-slate-300 bg-white">
                  <thead>
                    <tr className="bg-slate-200 text-slate-800 text-[11px]">
                      <th className="py-1.5 px-2 border-r border-slate-300">Date of Divt</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Wagon Details</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">From / To</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Diverted To</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Memos &amp; NR Letter</th>
                      <th className="py-1.5 px-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPcml.map((p) => (
                      <tr key={p.id} className="border-t border-slate-200 text-[11px] align-top">
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono whitespace-nowrap">{p.dateOfDiversion}</td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono">
                          {p.wagons.map((w, i) => (
                            <div key={i}>
                              <strong>{w.owningRailway}</strong> {w.wagonType} {w.wagonNumber}
                            </div>
                          ))}
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono">
                          {p.fromStation} &rarr; {p.toStation}
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-bold text-amber-900">
                          {p.divertedToStation}
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono text-[10px]">
                          <div>T-Memo: {p.trafficDivtRequestMemoNo || 'Issued'}</div>
                          <div>NR-Letter: {p.nrCellDivtLetterRef || 'Approved'}</div>
                        </td>
                        <td className="py-1.5 px-2 text-slate-700">{p.reasonForDiversion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 5. Sick Repair Section */}
          {(selectedCategory === 'all_summary' || selectedCategory === 'sick_repair') && (
            <div className="mb-8">
              <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 mb-2 rounded-xs">
                <span className="font-bold text-xs uppercase tracking-wide">
                  5. SICK LINE REPAIR &amp; FITNESS REGISTER
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  Total Entries: {filteredSick.length}
                </span>
              </div>

              {filteredSick.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No sick line records found for selected period.</p>
              ) : (
                <table className="w-full text-xs border border-slate-300 bg-white">
                  <thead>
                    <tr className="bg-slate-200 text-slate-800 text-[11px]">
                      <th className="py-1.5 px-2 border-r border-slate-300">Date Fit</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Depot / Sick Line</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Type of Fit</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">Wagons Fit</th>
                      <th className="py-1.5 px-2 border-r border-slate-300">TXR Supervisor &amp; Memo</th>
                      <th className="py-1.5 px-2">Work Carried Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSick.map((s) => (
                      <tr key={s.id} className="border-t border-slate-200 text-[11px] align-top">
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono whitespace-nowrap">{s.date}</td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-semibold uppercase">
                          {s.category.replace(/_/g, ' ')}
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-bold text-emerald-800">
                          {s.typeOfFit}
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 font-mono">
                          {s.wagons.map((w, i) => (
                            <div key={i}>
                              <strong>{w.owningRailway}</strong> {w.wagonType} {w.wagonNumber}
                            </div>
                          ))}
                        </td>
                        <td className="py-1.5 px-2 border-r border-slate-200 text-[10px]">
                          <div className="font-semibold">{s.txrSupervisorName}</div>
                          <div className="font-mono">Memo: {s.fitMemoNo || 'Certified'}</div>
                        </td>
                        <td className="py-1.5 px-2 text-slate-700">{s.workDone || s.defectNoted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Official Signatures Footer for Printout */}
          <div className="mt-12 pt-8 border-t-2 border-slate-800 grid grid-cols-3 text-center text-xs">
            <div>
              <div className="h-12 flex items-end justify-center pb-1">
                <span className="font-serif italic text-blue-900 font-bold">{userSession.displayName}</span>
              </div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-900">
                SENIOR TRAINS CLERK (SR. TC)
              </div>
              <p className="text-[10px] text-slate-500">Trains Office Andal (UDL)</p>
            </div>

            <div>
              <div className="h-12"></div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-900">
                CHIEF YARD MASTER (CYM)
              </div>
              <p className="text-[10px] text-slate-500">Marshalling Yard Andal</p>
            </div>

            <div>
              <div className="h-12"></div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-900">
                SECTION CONTROLLER (COA / FOIS)
              </div>
              <p className="text-[10px] text-slate-500">Divisional Control Asansol (ASN)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
