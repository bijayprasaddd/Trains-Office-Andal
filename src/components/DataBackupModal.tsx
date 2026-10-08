import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, CheckCircle2, AlertTriangle, Database } from 'lucide-react';
import { AppDatabase } from '../types/railway';
import { resetToSampleDatabase } from '../services/storage';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: AppDatabase;
  onUpdateDatabase: (db: AppDatabase) => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  database,
  onUpdateDatabase
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(database, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `TRAINS_OFFICE_ANDAL_DATA_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMessage({
        type: 'success',
        text: 'Backup file exported successfully! Keep it safe on your PC.'
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to create backup file.'
      });
    }
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content) as AppDatabase;

        if (
          !Array.isArray(parsed.mixLoads) ||
          !Array.isArray(parsed.cymUnloadings) ||
          !Array.isArray(parsed.transhipments) ||
          !Array.isArray(parsed.pcmlDiversions) ||
          !Array.isArray(parsed.sickRepairs)
        ) {
          throw new Error('Invalid Trains Office database structure');
        }

        onUpdateDatabase(parsed);
        setStatusMessage({
          type: 'success',
          text: `Data successfully restored from ${file.name}!`
        });
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: `Restore failed: ${err.message || 'Invalid JSON file format'}`
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reload sample Andal yard data? Current unsaved modifications will be replaced.')) {
      const reset = resetToSampleDatabase();
      onUpdateDatabase(reset);
      setStatusMessage({
        type: 'success',
        text: 'Sample Andal yard operational records reloaded successfully!'
      });
    }
  };

  const totalWagonsLogged =
    database.mixLoads.reduce((sum, m) => sum + m.wagons.length, 0) +
    database.cymUnloadings.reduce((sum, c) => sum + c.wagons.length, 0) +
    database.transhipments.reduce((sum, t) => sum + t.loadedWagons.length + t.transhipWagons.length, 0) +
    database.pcmlDiversions.reduce((sum, p) => sum + p.wagons.length, 0) +
    database.sickRepairs.reduce((sum, s) => sum + s.wagons.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-300">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-md border border-emerald-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Data Backup &amp; Offline Storage</h3>
              <p className="text-xs text-slate-400">Export, Restore, or Archive Trains Office Andal records</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Database Metrics Grid */}
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
              Current Local Database Status
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded border border-slate-200">
                <p className="text-slate-500 text-[11px]">Mix Loads</p>
                <p className="font-mono font-bold text-slate-900 text-base">{database.mixLoads.length}</p>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <p className="text-slate-500 text-[11px]">CYM Unloadings</p>
                <p className="font-mono font-bold text-slate-900 text-base">{database.cymUnloadings.length}</p>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <p className="text-slate-500 text-[11px]">Transhipments</p>
                <p className="font-mono font-bold text-slate-900 text-base">{database.transhipments.length}</p>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <p className="text-slate-500 text-[11px]">PCML Diversions</p>
                <p className="font-mono font-bold text-slate-900 text-base">{database.pcmlDiversions.length}</p>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <p className="text-slate-500 text-[11px]">Sick Repairs</p>
                <p className="font-mono font-bold text-slate-900 text-base">{database.sickRepairs.length}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded border border-blue-200">
                <p className="text-blue-800 text-[11px] font-semibold">Total Wagons</p>
                <p className="font-mono font-bold text-blue-950 text-base">{totalWagonsLogged}</p>
              </div>
            </div>
          </div>

          {/* Action 1: Download Backup */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-900">1. Download Full Backup (.json)</h4>
              <p className="text-[11px] text-slate-500">
                Saves all loads, wagons, memos, and certificates to your computer.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shrink-0 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export File</span>
            </button>
          </div>

          {/* Action 2: Restore from Backup */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-900">2. Restore from Backup File</h4>
              <p className="text-[11px] text-slate-500">
                Load previously saved .json backup into the applet.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileRestore}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shrink-0"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Select File</span>
            </button>
          </div>

          {/* Action 3: Reset to sample data */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50/60 rounded-lg border border-amber-200">
            <div>
              <h4 className="text-xs font-bold text-amber-900">3. Reload Sample Andal Yard Data</h4>
              <p className="text-[11px] text-amber-800">
                Restores standard test records with BPC, VG, and memos.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sample</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
