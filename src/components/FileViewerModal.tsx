import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { FileAttachment } from '../types/railway';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment?: FileAttachment | null;
  title?: string;
  docSubtitle?: string;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  onClose,
  attachment,
  title = 'Document Viewer',
  docSubtitle = 'Trains Branch Office Andal (UDL)'
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  if (!isOpen || !attachment) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${attachment.name}</title>
          <style>
            body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; background: #fff; font-family: sans-serif; }
            img { max-width: 100%; height: auto; }
            .print-header { text-align: center; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <div style="width: 100%;">
            <div class="print-header">
              <h2 style="margin:0; font-size:16px;">EASTERN RAILWAY - TRAINS OFFICE ANDAL (UDL)</h2>
              <p style="margin:4px 0; font-size:12px; color:#555;">Document: ${attachment.name}</p>
            </div>
            <img src="${attachment.url}" onload="window.print(); window.close();" />
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = attachment.url;
    a.download = attachment.name || 'railway_document.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden border border-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-900/60 rounded-md border border-blue-700/50 text-blue-200">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base tracking-tight text-white">{title}</h3>
                <span className="text-xs bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-800">
                  {attachment.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">{docSubtitle} · Uploaded: {attachment.uploadedAt}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 mr-2">
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-2 text-slate-300">{zoom}%</span>
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                title="Rotate 90°"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors ml-1"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              title="Print Document"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              title="Download File"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Canvas */}
        <div className="flex-1 bg-slate-200 p-6 overflow-auto flex items-center justify-center min-h-[500px]">
          <div
            className="transition-transform duration-150 origin-center shadow-lg bg-white p-2 rounded"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`
            }}
          >
            {attachment.type === 'pdf' && !attachment.url.startsWith('data:image/') ? (
              <object
                data={attachment.url}
                type="application/pdf"
                className="w-[620px] h-[780px] rounded border border-slate-300"
              >
                <div className="p-8 text-center bg-slate-50">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-700">PDF Document Ready</p>
                  <a
                    href={attachment.url}
                    download={attachment.name}
                    className="inline-block mt-3 px-4 py-2 bg-blue-900 text-white text-xs rounded-md"
                  >
                    Open PDF File
                  </a>
                </div>
              </object>
            ) : (
              <img
                src={attachment.url}
                alt={attachment.name}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] object-contain rounded border border-slate-200"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official Trains Branch Record · Verified by Trains Branch Office Andal</span>
          </div>
          <div className="font-mono text-slate-500">
            {attachment.size ? `Size: ${attachment.size} · ` : ''}Format: {attachment.type.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
