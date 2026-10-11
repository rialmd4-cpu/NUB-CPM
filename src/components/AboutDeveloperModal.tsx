import React from 'react';
import {
  X,
  User,
  GraduationCap,
  Wrench,
  Phone,
  Mail,
  MapPin,
  Cpu,
  HeartPulse,
  Award,
  Sparkles,
} from 'lucide-react';

interface AboutDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDeveloperModal: React.FC<AboutDeveloperModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs no-print animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white p-4 sm:p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner text-white font-black text-xl">
              RI
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 mb-0.5">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                ABOUT DEVELOPER
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                Md Rial Islam
              </h2>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Electromedical Engineer | Software Developer
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-stone-800 text-xs">
          {/* Educational Qualification */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              Educational Qualification
            </h3>
            <div className="space-y-2 pl-1">
              <div className="border-l-2 border-emerald-700 pl-2.5 py-0.5">
                <div className="font-bold text-stone-900 text-xs">
                  BSc in Electrical &amp; Electronic Engineering (EEE)
                </div>
                <div className="text-[11px] text-stone-600 font-medium">
                  Northern University Bangladesh
                </div>
              </div>
              <div className="border-l-2 border-teal-600 pl-2.5 py-0.5">
                <div className="font-bold text-stone-900 text-xs">
                  Diploma in Electromedical Engineering Technology
                </div>
                <div className="text-[11px] text-stone-600 font-medium">
                  Brahmanbaria Polytechnic Institute
                </div>
              </div>
            </div>
          </div>

          {/* Professional Expertise */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-emerald-700" />
              Professional Expertise
            </h3>
            <ul className="grid grid-cols-1 gap-1.5 pl-1">
              {[
                'Hematology Analyzer Installation, Service & Maintenance',
                'Biochemistry Analyzer Installation, Service & Maintenance',
                'Automated Biochemistry Analyzer',
                'POCT Medical Equipment',
                'Operation Theatre (OT) Equipment',
                'Laboratory Information System (LIS) Development',
                'Diagnostic Management Software Development',
                'Medical Equipment Troubleshooting & Technical Support',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-stone-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-700" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <a
                href="tel:01909770205"
                className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200 hover:border-emerald-600 transition-colors text-stone-800 font-semibold"
              >
                <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <Phone className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 font-medium">Phone</div>
                  <div>01909770205</div>
                </div>
              </a>

              <a
                href="mailto:rialmd4@gmail.com"
                className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200 hover:border-emerald-600 transition-colors text-stone-800 font-semibold"
              >
                <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <Mail className="w-3 h-3" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] text-stone-400 font-medium">Email</div>
                  <div className="truncate">rialmd4@gmail.com</div>
                </div>
              </a>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200 text-stone-800 font-semibold sm:col-span-2">
                <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <MapPin className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 font-medium">Location</div>
                  <div>Maskanda, Mymensingh, Bangladesh</div>
                </div>
              </div>
            </div>
          </div>

          {/* Software Information */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-800" />
              Software Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-stone-500 font-medium">Software Name:</span>{' '}
                <span className="font-bold text-stone-900">
                  NUB CPM (Northern University Bangladesh Cover Page Maker)
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-medium">Developer:</span>{' '}
                <span className="font-bold text-stone-900">Md Rial Islam</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-stone-500 font-medium">Field:</span>{' '}
                <span className="font-bold text-stone-900">
                  University Cover Page Design &amp; Academic Document Formatting
                </span>
              </div>
              <div className="sm:col-span-2 pt-1 border-t border-emerald-200/60 flex items-center gap-1.5 text-emerald-950 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Mission: Simplifying Academic Cover Page Design</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-center shrink-0">
          <div className="text-[11px] font-bold text-stone-800">
            Designed &amp; Developed by Md Rial Islam
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            © 2026 Md Rial Islam. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
