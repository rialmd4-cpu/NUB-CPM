import React from 'react';
import { DocumentType, PresetType } from '../types';
import { Download, FileText, FlaskConical, User, FolderDown } from 'lucide-react';

interface HeaderNavProps {
  documentType: DocumentType;
  onToggleDocumentType: (type: DocumentType) => void;
  currentPreset: PresetType;
  onSelectPreset: (preset: PresetType) => void;
  onPrint?: () => void;
  onExportPDF: () => void;
  onExportPNG?: () => void;
  onOpenDownloadModal?: () => void;
  isExporting: boolean;
  onOpenDeveloperInfo?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  documentType,
  onToggleDocumentType,
  currentPreset,
  onSelectPreset,
  onExportPDF,
  onOpenDownloadModal,
  isExporting,
  onOpenDeveloperInfo,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-1.5 sm:px-3 h-8 sm:h-9 flex items-center justify-between gap-1 sm:gap-2">
        {/* Zone 1: Brand Title & Document Type Switcher */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <div className="w-5 h-5 rounded bg-emerald-800 flex items-center justify-center text-white font-extrabold text-[10px] shadow-2xs shrink-0">
            NU
          </div>
          <span className="text-[11px] sm:text-xs font-black tracking-tight text-stone-900 whitespace-nowrap">
            NUB CPM
          </span>
          <button
            type="button"
            onClick={onOpenDeveloperInfo}
            className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 hover:border-emerald-400 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
            title="About Developer: Md Rial Islam"
          >
            <User className="w-2.5 h-2.5 text-emerald-700" />
            <span>About Dev</span>
          </button>

          {/* Quick Document Type Switcher in Header */}
          <div className="flex p-0.5 bg-stone-100 rounded border border-stone-200">
            <button
              onClick={() => onToggleDocumentType('assignment')}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition-all ${
                documentType === 'assignment'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to Assignment format"
            >
              <FileText className="w-2.5 h-2.5" />
              <span className="hidden xs:inline">Assignment</span>
              <span className="xs:hidden">Assign</span>
            </button>
            <button
              onClick={() => onToggleDocumentType('lab_report')}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition-all ${
                documentType === 'lab_report'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to Lab Report format"
            >
              <FlaskConical className="w-2.5 h-2.5" />
              <span className="hidden xs:inline">Lab Report</span>
              <span className="xs:hidden">Lab</span>
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Presets */}
        <nav className="hidden md:flex items-center gap-0.5 p-0.5 bg-stone-100 rounded shrink-0">
          {[
            { id: 'classic' as PresetType, label: 'Classic' },
            { id: 'modern' as PresetType, label: 'Modern' },
            { id: 'minimal' as PresetType, label: 'Minimal' },
            { id: 'institutional' as PresetType, label: 'Official' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`px-1.5 py-0.5 text-[10px] font-semibold rounded transition-colors whitespace-nowrap ${
                currentPreset === preset.id
                  ? 'bg-white text-emerald-950 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Top Save & Download Actions Only */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Top Save Option */}
          {onOpenDownloadModal && (
            <button
              type="button"
              onClick={onOpenDownloadModal}
              title="Save to device memory folder or offline storage"
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400/80 rounded-md transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <FolderDown className="w-3.5 h-3.5 text-emerald-800" />
              <span>Save</span>
            </button>
          )}

          {/* Top Download Option */}
          <button
            type="button"
            onClick={onExportPDF}
            disabled={isExporting}
            title="Download print-ready A4 PDF document"
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-all shadow-xs disabled:opacity-60 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>{isExporting ? 'Downloading...' : 'Download'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
