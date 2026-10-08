import React, { useState } from 'react';
import { Plus, Trash2, Clipboard, Info } from 'lucide-react';
import { WagonEntry } from '../types/railway';

interface WagonInputTableProps {
  wagons: WagonEntry[];
  onChange: (wagons: WagonEntry[]) => void;
  title?: string;
  badge?: string;
  readOnly?: boolean;
}

const COMMON_RAILWAYS = ['ER', 'SER', 'ECR', 'SECR', 'NR', 'NCR', 'WR', 'CR', 'SR', 'SCR', 'WCR', 'NFR', 'NWR', 'SWR', 'ECoR'];
const COMMON_TYPES = ['BOXNHL', 'BCNHL', 'BOBRN', 'BOXN', 'BRN', 'BTPN', 'BOBRNHS', 'BFNS', 'BRNA', 'BOY'];

export const WagonInputTable: React.FC<WagonInputTableProps> = ({
  wagons,
  onChange,
  title = 'Wagon Roster Entry',
  badge,
  readOnly = false
}) => {
  const [bulkText, setBulkText] = useState('');
  const [showBulkPaste, setShowBulkPaste] = useState(false);

  const handleAddRow = () => {
    const newWagon: WagonEntry = {
      id: 'w_' + Math.random().toString(36).substring(2, 9),
      owningRailway: wagons.length > 0 ? wagons[wagons.length - 1].owningRailway : 'ER',
      wagonType: wagons.length > 0 ? wagons[wagons.length - 1].wagonType : 'BOXNHL',
      wagonNumber: '',
      loadStatus: 'Loaded',
      destination: ''
    };
    onChange([...wagons, newWagon]);
  };

  const handleUpdate = (index: number, field: keyof WagonEntry, value: string) => {
    const updated = [...wagons];
    updated[index] = {
      ...updated[index],
      [field]: field === 'wagonNumber' ? value.replace(/\s+/g, '') : value
    };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = wagons.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleApplyBulkPaste = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split('\n');
    const newItems: WagonEntry[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      // Split by tab, comma, or whitespace
      const parts = line.split(/[\t, ]+/).filter(Boolean);
      if (parts.length >= 5) {
        const status = parts[3].toLowerCase().startsWith('e') ? 'Empty' : 'Loaded';
        newItems.push({
          id: 'w_' + Math.random().toString(36).substring(2, 9),
          owningRailway: parts[0].toUpperCase(),
          wagonType: parts[1].toUpperCase(),
          wagonNumber: parts[2],
          loadStatus: status,
          destination: parts.slice(4).join(' ').toUpperCase()
        });
      } else if (parts.length === 4) {
        const status = parts[3].toLowerCase().startsWith('e') ? 'Empty' : 'Loaded';
        newItems.push({
          id: 'w_' + Math.random().toString(36).substring(2, 9),
          owningRailway: parts[0].toUpperCase(),
          wagonType: parts[1].toUpperCase(),
          wagonNumber: parts[2],
          loadStatus: status,
          destination: ''
        });
      } else if (parts.length === 3) {
        newItems.push({
          id: 'w_' + Math.random().toString(36).substring(2, 9),
          owningRailway: parts[0].toUpperCase(),
          wagonType: parts[1].toUpperCase(),
          wagonNumber: parts[2],
          loadStatus: 'Loaded',
          destination: ''
        });
      } else if (parts.length === 1 && /^\d+$/.test(parts[0])) {
        // Just wagon number
        newItems.push({
          id: 'w_' + Math.random().toString(36).substring(2, 9),
          owningRailway: 'ER',
          wagonType: 'BOXNHL',
          wagonNumber: parts[0],
          loadStatus: 'Loaded',
          destination: ''
        });
      } else if (parts.length === 2) {
        newItems.push({
          id: 'w_' + Math.random().toString(36).substring(2, 9),
          owningRailway: parts[0].toUpperCase(),
          wagonType: 'BOXNHL',
          wagonNumber: parts[1],
          loadStatus: 'Loaded',
          destination: ''
        });
      }
    }

    if (newItems.length > 0) {
      onChange([...wagons, ...newItems]);
      setBulkText('');
      setShowBulkPaste(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs tracking-wide text-slate-800 uppercase">{title}</span>
          {badge && (
            <span className="text-[11px] font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
              {badge}
            </span>
          )}
          <span className="text-xs text-slate-500 font-mono">
            ({wagons.length} {wagons.length === 1 ? 'Wagon' : 'Wagons'})
          </span>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBulkPaste(!showBulkPaste)}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 rounded border border-slate-200 transition-colors cursor-pointer"
            >
              <Clipboard className="w-3.5 h-3.5 text-slate-500" />
              <span>Bulk Paste</span>
            </button>
            <button
              type="button"
              onClick={handleAddRow}
              className="text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 flex items-center gap-1 px-3 py-1 rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Wagon</span>
            </button>
          </div>
        )}
      </div>

      {/* Bulk paste drawer */}
      {showBulkPaste && !readOnly && (
        <div className="p-3 bg-amber-50/70 border-b border-amber-200 text-xs">
          <div className="flex items-center gap-1.5 text-amber-900 font-medium mb-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Paste Wagon List (Format: Railway [space/tab] Type [space/tab] WagonNumber [space/tab] Loaded/Empty [space/tab] Destination(optional))</span>
          </div>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={`ER BOXNHL 22071839201 Loaded BPC\nSER BCNHL 21122045981 Empty ASN\nECR BOBRN 24031958210 Loaded`}
            rows={3}
            className="w-full text-xs font-mono p-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowBulkPaste(false)}
              className="px-2.5 py-1 text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyBulkPaste}
              className="px-3 py-1 bg-amber-600 text-white rounded font-medium hover:bg-amber-700 cursor-pointer"
            >
              Append Wagons
            </button>
          </div>
        </div>
      )}

      {/* Wagon Table: Owning Railway | Wagon Type | Wagon Number | Load Status | Destination (Optional) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-2 px-3 w-12 text-center">#</th>
              <th className="py-2 px-3 w-36">
                1. Owning Railway
                <span className="text-red-500 ml-0.5">*</span>
              </th>
              <th className="py-2 px-3 w-36">
                2. Wagon Type
                <span className="text-red-500 ml-0.5">*</span>
              </th>
              <th className="py-2 px-3">
                3. Wagon Number
                <span className="text-red-500 ml-0.5">*</span>
              </th>
              <th className="py-2 px-3 w-32">
                4. Load Status
                <span className="text-red-500 ml-0.5">*</span>
              </th>
              <th className="py-2 px-3 w-40">
                5. Destination
                <span className="text-slate-400 font-normal ml-1">(Optional)</span>
              </th>
              {!readOnly && <th className="py-2 px-3 w-16 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {wagons.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 6 : 7} className="py-6 text-center text-slate-400 bg-slate-50/50">
                  No wagons added yet. Click &quot;Add Wagon&quot; or use &quot;Bulk Paste&quot; above.
                </td>
              </tr>
            ) : (
              wagons.map((wagon, idx) => (
                <tr key={wagon.id || idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-1.5 px-3 text-center font-mono text-slate-500">
                    {String(idx + 1).padStart(2, '0')}
                  </td>

                  {/* 1. Owning Railway */}
                  <td className="py-1.5 px-3">
                    {readOnly ? (
                      <span className="font-semibold text-slate-900 font-mono">{wagon.owningRailway}</span>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          list={`rly-options-${idx}`}
                          value={wagon.owningRailway}
                          onChange={(e) => handleUpdate(idx, 'owningRailway', e.target.value.toUpperCase())}
                          placeholder="e.g. ER"
                          className="w-full font-mono font-semibold uppercase px-2.5 py-1 rounded border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none text-xs bg-white text-slate-900"
                        />
                        <datalist id={`rly-options-${idx}`}>
                          {COMMON_RAILWAYS.map((r) => (
                            <option key={r} value={r} />
                          ))}
                        </datalist>
                      </div>
                    )}
                  </td>

                  {/* 2. Wagon Type */}
                  <td className="py-1.5 px-3">
                    {readOnly ? (
                      <span className="text-slate-800 font-mono">{wagon.wagonType}</span>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          list={`type-options-${idx}`}
                          value={wagon.wagonType}
                          onChange={(e) => handleUpdate(idx, 'wagonType', e.target.value.toUpperCase())}
                          placeholder="e.g. BOXNHL"
                          className="w-full font-mono uppercase px-2.5 py-1 rounded border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none text-xs bg-white text-slate-900"
                        />
                        <datalist id={`type-options-${idx}`}>
                          {COMMON_TYPES.map((t) => (
                            <option key={t} value={t} />
                          ))}
                        </datalist>
                      </div>
                    )}
                  </td>

                  {/* 3. Wagon Number */}
                  <td className="py-1.5 px-3">
                    {readOnly ? (
                      <span className="font-mono text-slate-900 font-medium tracking-wider">{wagon.wagonNumber}</span>
                    ) : (
                      <input
                        type="text"
                        value={wagon.wagonNumber}
                        onChange={(e) => handleUpdate(idx, 'wagonNumber', e.target.value)}
                        placeholder="e.g. 22071839201"
                        maxLength={16}
                        className="w-full font-mono px-2.5 py-1 rounded border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none text-xs bg-white text-slate-900 tracking-wider"
                      />
                    )}
                  </td>

                  {/* 4. Load Status: Loaded or Empty */}
                  <td className="py-1.5 px-3">
                    {readOnly ? (
                      <span
                        className={`inline-block font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                          wagon.loadStatus === 'Empty'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {wagon.loadStatus || 'Loaded'}
                      </span>
                    ) : (
                      <select
                        value={wagon.loadStatus || 'Loaded'}
                        onChange={(e) => handleUpdate(idx, 'loadStatus', e.target.value)}
                        className={`w-full font-semibold px-2 py-1 rounded border border-slate-300 focus:border-blue-700 outline-none text-xs ${
                          wagon.loadStatus === 'Empty' ? 'bg-slate-50 text-slate-700' : 'bg-emerald-50 text-emerald-900 font-bold'
                        }`}
                      >
                        <option value="Loaded">Loaded</option>
                        <option value="Empty">Empty</option>
                      </select>
                    )}
                  </td>

                  {/* 5. Destination (Non-mandatory / Optional) */}
                  <td className="py-1.5 px-3">
                    {readOnly ? (
                      <span className="font-mono text-slate-800 font-medium">
                        {wagon.destination ? wagon.destination : <span className="text-slate-400 italic text-[11px]">—</span>}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={wagon.destination || ''}
                        onChange={(e) => handleUpdate(idx, 'destination', e.target.value.toUpperCase())}
                        placeholder="e.g. BPC, ASN, DHN"
                        className="w-full font-mono uppercase px-2.5 py-1 rounded border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none text-xs bg-white text-slate-900"
                      />
                    )}
                  </td>

                  {/* Remove row */}
                  {!readOnly && (
                    <td className="py-1.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        title="Remove Wagon Row"
                        className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
