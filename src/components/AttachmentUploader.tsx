import React, { useRef } from 'react';
import { Upload, FileText, Eye, Trash2, CheckCircle2 } from 'lucide-react';
import { FileAttachment } from '../types/railway';

interface AttachmentUploaderProps {
  label: string;
  sublabel?: string;
  attachment?: FileAttachment;
  onAttach: (file: FileAttachment | undefined) => void;
  onView: (file: FileAttachment) => void;
  required?: boolean;
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  label,
  sublabel = 'Photo or PDF upload',
  attachment,
  onAttach,
  onView,
  required = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const reader = new FileReader();

    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newAttachment: FileAttachment = {
        name: file.name,
        type: isPdf ? 'pdf' : 'image',
        url: url,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        size: `${Math.round(file.size / 1024)} KB`
      };
      onAttach(newAttachment);
    };

    reader.readAsDataURL(file);
    // Reset file input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </span>
          <span className="text-[11px] text-slate-500 block">{sublabel}</span>
        </div>

        {attachment && (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Uploaded
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      {attachment ? (
        <div className="mt-2 p-2 bg-white rounded border border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <div className="p-1.5 bg-blue-50 text-blue-800 rounded">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate text-left">
              <p className="text-xs font-medium text-slate-800 truncate">{attachment.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {attachment.size || ''} · {attachment.type.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onView(attachment)}
              className="px-2.5 py-1 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </button>
            <button
              type="button"
              onClick={() => onAttach(undefined)}
              title="Remove File"
              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-blue-700 bg-white hover:bg-blue-50/40 rounded flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-blue-900 transition-colors"
        >
          <Upload className="w-4 h-4 text-slate-400" />
          <span>Upload File (Photo / PDF)</span>
        </button>
      )}
    </div>
  );
};
