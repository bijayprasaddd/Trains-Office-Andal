import React, { useState } from 'react';
import { X, Search, Train, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { AppDatabase } from '../types/railway';
import { searchWagonAcrossSystem, WagonTraceResult } from '../services/storage';

interface UniversalWagonSearchProps {
  isOpen: boolean;
  onClose: () => void;
  database: AppDatabase;
  onSelectResult: (category: string, recordId: string) => void;
}

export const UniversalWagonSearch: React.FC<UniversalWagonSearchProps> = ({
  isOpen,
  onClose,
  database,
  onSelectResult
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const results: WagonTraceResult[] = searchWagonAcrossSystem(searchTerm, database);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-300 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-900/60 rounded-md border border-blue-700/50 text-amber-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Universal Wagon Trace &amp; History</h3>
              <p className="text-xs text-slate-400">Search any Wagon Number or Owning Railway across all 5 Andal Yard Modules</p>
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

        {/* Search Input bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Wagon Number (e.g. 22071839201, 22120938471) or Railway (e.g. ER, SER)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 font-mono"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick sample chips */}
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <span>Try quick test wagon numbers:</span>
            {['22071839201', '22120938471', '22041988301', '22031977218'].map((wNo) => (
              <button
                key={wNo}
                type="button"
                onClick={() => setSearchTerm(wNo)}
                className="font-mono text-[11px] bg-slate-200/70 hover:bg-slate-300 text-slate-800 px-2 py-0.5 rounded transition-colors"
              >
                {wNo}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
          {searchTerm.trim() === '' ? (
            <div className="py-12 text-center text-slate-400">
              <Train className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">Type a wagon number to trace its history</p>
              <p className="text-xs text-slate-400 mt-1">Tracks appearances in Mix Loads, CYM Unloading, Transhipment, PCML Diversion, and Sick Lines</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-semibold text-slate-700">No matching wagon found for &quot;{searchTerm}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">Verify wagon digits or check if wagon was logged under another module.</p>
            </div>
          ) : (
            results.map((res, idx) => (
              <div
                key={idx}
                className="py-3 px-2 hover:bg-slate-50 rounded-lg flex items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {res.owningRailway} · {res.wagonType} · {res.wagonNumber}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                      {res.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Date: {res.date}</span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">{res.detailTitle}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>{res.subDetails}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectResult(res.categoryId, res.recordId);
                    onClose();
                  }}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  <span>Open Entry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Found <strong>{results.length}</strong> matching operational records</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
