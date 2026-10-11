import React, { useState } from 'react';
import {
  X,
  Download,
  FolderDown,
  Share2,
  Printer,
  Image as ImageIcon,
  HardDrive,
  Smartphone,
  WifiOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
} from 'lucide-react';
import {
  exportElementToPDF,
  exportElementToPNG,
  saveToDeviceFolder,
  shareDocument,
  printDocument,
  checkFileSystemAccessSupported,
  checkShareSupported,
} from '../utils/exportUtils';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  filenameBase: string;
  elementId?: string;
  onSuccessToast: (msg: string) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  filenameBase,
  elementId = 'a4-cover-page-export',
  onSuccessToast,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const pdfFilename = `${filenameBase}.pdf`;
  const pngFilename = `${filenameBase}.png`;
  const isPickerSupported = checkFileSystemAccessSupported();
  const isShareSupported = checkShareSupported();

  const handleAction = async (
    actionKey: string,
    actionFn: () => Promise<any>,
    successMsg: string
  ) => {
    setLoadingAction(actionKey);
    setStatusMessage(null);
    try {
      const res = await actionFn();
      if (res && res.cancelled) {
        setStatusMessage(null);
      } else if (res && res.success === false) {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Failed to download or save. Please try another method.',
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: successMsg,
        });
        onSuccessToast(successMsg);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try Print as PDF or Share.',
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs no-print animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <FolderDown className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight leading-tight">
                Save &amp; Download Options
              </h2>
              <p className="text-[11px] text-emerald-200">
                Save directly to phone/PC memory, Downloads folder, or Print as PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Alert if any */}
        {statusMessage && (
          <div
            className={`mx-4 mt-3 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-3">
          {/* File Name Banner */}
          <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">Target Filename:</span>
            <span className="font-mono font-bold text-stone-900 truncate max-w-[260px]">
              {pdfFilename}
            </span>
          </div>

          {/* Option 1: Direct Memory Folder Picker (Desktop / Chromium / Android File Picker) */}
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() =>
              handleAction(
                'folderPicker',
                () => saveToDeviceFolder(elementId, pdfFilename, 'pdf'),
                'Successfully saved to your chosen memory folder!'
              )
            }
            className="w-full text-left p-3 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 hover:border-emerald-400 transition-all flex items-start gap-3 group cursor-pointer disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
              {loadingAction === 'folderPicker' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <HardDrive className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-emerald-950">
                <span>1. Choose Memory Folder (Save As...)</span>
                {isPickerSupported && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded font-semibold">
                    Direct Folder Picker
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Pick any exact folder on your phone or PC (Downloads, Documents, or SD Card) to save the file.
              </p>
            </div>
          </button>

          {/* Option 2: Direct A4 PDF Download */}
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() =>
              handleAction(
                'directPdf',
                () => exportElementToPDF(elementId, pdfFilename),
                'PDF file download completed!'
              )
            }
            className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-stone-50 transition-all flex items-start gap-3 group cursor-pointer disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-800 text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
              {loadingAction === 'directPdf' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs sm:text-sm text-stone-900">
                2. Direct PDF Download
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                High-resolution print-ready A4 PDF document saved straight to your browser downloads folder.
              </p>
            </div>
          </button>

          {/* Option 3: Mobile Share / Native Files App (Perfect for Android / iOS) */}
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() =>
              handleAction(
                'share',
                () => shareDocument(elementId, pdfFilename, 'pdf'),
                'File shared and saved to device memory!'
              )
            }
            className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-teal-300 hover:bg-teal-50/40 transition-all flex items-start gap-3 group cursor-pointer disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
              {loadingAction === 'share' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-stone-900">
                <span>3. Save via Phone Storage / Share</span>
                {isShareSupported && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded font-semibold">
                    Mobile Recommended
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Uses Android/iOS native sheet to save directly into "Files by Google", Phone Storage, Drive, or WhatsApp.
              </p>
            </div>
          </button>

          {/* Option 4: High-Res PNG Image */}
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() =>
              handleAction(
                'png',
                () => exportElementToPNG(elementId, pngFilename),
                'High-resolution PNG image saved!'
              )
            }
            className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50/40 transition-all flex items-start gap-3 group cursor-pointer disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
              {loadingAction === 'png' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs sm:text-sm text-stone-900">
                4. High-Resolution PNG Image
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Save as a high-clarity image directly to your Phone Gallery or Pictures directory for easy printing.
              </p>
            </div>
          </button>

          {/* Option 5: Browser Print (Save as PDF) */}
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() => {
              onClose();
              printDocument();
            }}
            className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
              <Printer className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs sm:text-sm text-stone-900">
                5. System Print / "Save as PDF" (100% Offline)
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Opens the native device print preview dialog. Select 'Save as PDF' to save without any browser blocks.
              </p>
            </div>
          </button>

          {/* Offline Information Badge */}
          <div className="p-3 bg-stone-100/90 rounded-xl border border-stone-200 flex items-center gap-2.5 text-[11px] text-stone-700">
            <WifiOff className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-stone-900">Offline &amp; Netlify Ready: </span>
              Operates 100% in your browser client without server dependencies, and works fully offline.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-200 rounded-lg border border-stone-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
