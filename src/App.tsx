import React, { useEffect, useState } from 'react';
import {
  CoverPageDesignSettings,
  DocumentType,
  PresetType,
  StudentInfo,
  TeacherInfo,
  SavedDraft,
} from './types';
import {
  ALL_SUBJECTS,
  DEFAULT_DESIGN_SETTINGS,
  DEFAULT_STUDENT_INFO,
  DEFAULT_TEACHER_INFO,
  SAMPLE_DRAFTS,
  SECTION_OPTIONS,
  SEMESTER_OPTIONS,
  SESSION_OPTIONS,
  SubjectOption,
} from './constants/initialData';
import { HeaderNav } from './components/HeaderNav';
import { EditorPanel } from './components/EditorPanel';
import { A4CoverPage } from './components/A4CoverPage';
import { SubjectPickerModal } from './components/SubjectPickerModal';
import { AboutDeveloperModal } from './components/AboutDeveloperModal';
import { DownloadModal } from './components/DownloadModal';
import {
  exportElementToPDF,
  exportElementToPNG,
  printDocument,
} from './utils/exportUtils';
import {
  Printer,
  CheckCircle2,
  Eye,
  Edit3,
  BookOpen,
  X,
  Hash,
  GraduationCap,
  Download,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const STORAGE_KEYS = {
  STUDENT: 'nub_cover_student_info_eee_v4',
  TEACHER: 'nub_cover_teacher_info_eee_v4',
  SETTINGS: 'nub_cover_design_settings_eee_v4',
  DRAFTS: 'nub_cover_saved_drafts_eee_v4',
  SUBJECTS: 'nub_cover_subjects_list_v4',
};

// Exact pixel dimensions for A4 portrait at standard 96 DPI (210mm x 297mm)
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

// Dynamic responsive calculation to make the entire A4 preview fit the screen at once and center perfectly
const calculateFitScale = () => {
  if (typeof window === 'undefined') return 0.45;
  const w = window.innerWidth;
  const h = window.innerHeight;

  // On mobile (< 1024px): header (~36px), mobile tab (~32px), preview toolbar (~32px), container margins (~16px)
  // On desktop: header (~36px), preview toolbar (~32px)
  const isMobile = w < 1024;
  const topOffsets = isMobile ? 116 : 84;
  const availableH = Math.max(200, h - topOffsets);
  const scaleByHeight = availableH / A4_HEIGHT_PX;

  let scaleByWidth: number;
  if (w < 380) {
    // Ultra compact phones (iPhone SE, Galaxy Fold outer screen: 320-375px)
    scaleByWidth = (w - 16) / A4_WIDTH_PX;
  } else if (w < 480) {
    // Standard phones (380-480px)
    scaleByWidth = (w - 24) / A4_WIDTH_PX;
  } else if (w < 768) {
    // Large phones / Phablets
    scaleByWidth = (w - 32) / A4_WIDTH_PX;
  } else if (w < 1024) {
    // Tablets
    scaleByWidth = (w - 48) / A4_WIDTH_PX;
  } else {
    // Desktop: preview area is right column (~7/12th of container max 1280px)
    const containerW = Math.min(w - 32, 1280);
    const previewColW = (containerW * 7) / 12 - 32;
    scaleByWidth = previewColW / A4_WIDTH_PX;
  }

  // To ensure the full A4 sheet fits inside both width and height and is centered without horizontal scroll
  const fitScale = Math.min(scaleByWidth, scaleByHeight) * 0.98;

  return Math.max(0.20, Math.min(1.0, Number(fitScale.toFixed(3))));
};

export default function App() {
  // Load state from localStorage or fall back to defaults (Default EEE: MD RIAL ISLAM)
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed.studentName ||
          parsed.studentName === 'Md. Tanvir Ahmed' ||
          parsed.studentId === '21020054'
        ) {
          return DEFAULT_STUDENT_INFO;
        }
        return parsed;
      }
      return DEFAULT_STUDENT_INFO;
    } catch {
      return DEFAULT_STUDENT_INFO;
    }
  });

  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHER);
      return saved ? JSON.parse(saved) : DEFAULT_TEACHER_INFO;
    } catch {
      return DEFAULT_TEACHER_INFO;
    }
  });

  const [settings, setSettings] = useState<CoverPageDesignSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_DESIGN_SETTINGS;
    } catch {
      return DEFAULT_DESIGN_SETTINGS;
    }
  });

  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRAFTS);
      return saved ? JSON.parse(saved) : SAMPLE_DRAFTS;
    } catch {
      return SAMPLE_DRAFTS;
    }
  });

  // Subjects state with custom add & delete support
  const [subjects, setSubjects] = useState<SubjectOption[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : ALL_SUBJECTS;
    } catch {
      return ALL_SUBJECTS;
    }
  });

  // UI state: Fit screen scale by default to eliminate manual zooming hassle
  const [scale, setScale] = useState<number>(calculateFitScale);
  const [isFitScreenMode, setIsFitScreenMode] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Modals for interactive table clicking & saving
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState<boolean>(false);
  const [isSectionPickerOpen, setIsSectionPickerOpen] = useState<boolean>(false);
  const [isSemesterPickerOpen, setIsSemesterPickerOpen] = useState<boolean>(false);
  const [isAboutDeveloperOpen, setIsAboutDeveloperOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  // Auto-fit screen scale on window resize & orientation change
  useEffect(() => {
    const handleResize = () => {
      if (isFitScreenMode) {
        setScale(calculateFitScale());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFitScreenMode]);

  // When switching to Preview on mobile/tablet, ensure preview fits screen immediately
  useEffect(() => {
    if (mobileTab === 'preview' && isFitScreenMode) {
      setScale(calculateFitScale());
    }
  }, [mobileTab, isFitScreenMode]);

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(studentInfo));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [studentInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(teacherInfo));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [teacherInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(savedDrafts));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [savedDrafts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [subjects]);

  // Toast notification helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Draft handlers
  const handleSaveDraft = (name: string) => {
    const newDraft: SavedDraft = {
      id: `draft-${Date.now()}`,
      name,
      updatedAt: new Date().toISOString(),
      studentInfo,
      teacherInfo,
      settings,
    };
    setSavedDrafts((prev) => [newDraft, ...prev]);
    showToast(`Draft "${name}" saved successfully`);
  };

  const handleLoadDraft = (draft: SavedDraft) => {
    setStudentInfo(draft.studentInfo);
    setTeacherInfo(draft.teacherInfo);
    setSettings(draft.settings);
    showToast(`Loaded "${draft.name}"`);
  };

  const handleDeleteDraft = (id: string) => {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== id));
    showToast('Draft deleted');
  };

  const handleResetToDefaults = () => {
    setStudentInfo(DEFAULT_STUDENT_INFO);
    setTeacherInfo(DEFAULT_TEACHER_INFO);
    setSettings(DEFAULT_DESIGN_SETTINGS);
    showToast('Reset to EEE defaults (MD RIAL ISLAM)');
  };

  const handleSelectPreset = (preset: PresetType) => {
    setSettings((prev) => ({ ...prev, preset }));
    showToast(`Switched to ${preset.charAt(0).toUpperCase() + preset.slice(1)} preset`);
  };

  // Subject Handlers (Add, Delete, Reset, Select)
  const handleSelectSubjectFromModal = (subject: SubjectOption, experimentTitle?: string) => {
    setStudentInfo((prev) => ({
      ...prev,
      courseCode: subject.code,
      courseTitle: subject.title,
      department: subject.department,
      program: subject.program,
      experimentTitle: experimentTitle || subject.defaultExperiments[0] || prev.experimentTitle,
    }));
    setIsSubjectModalOpen(false);
    showToast(`Selected ${subject.code}: ${subject.title}`);
  };

  const handleAddSubject = (newSubject: SubjectOption) => {
    setSubjects((prev) => [newSubject, ...prev]);
    setStudentInfo((prev) => ({
      ...prev,
      courseCode: newSubject.code,
      courseTitle: newSubject.title,
      department: newSubject.department,
      program: newSubject.program,
      experimentTitle: newSubject.defaultExperiments[0] || prev.experimentTitle,
    }));
    showToast(`Added "${newSubject.code}: ${newSubject.title}"`);
  };

  const handleDeleteSubject = (code: string) => {
    setSubjects((prev) => prev.filter((s) => s.code !== code));
    showToast(`Subject ${code} removed`);
  };

  const handleResetSubjects = () => {
    setSubjects(ALL_SUBJECTS);
    showToast('Subjects reset to official Northern University list');
  };

  // Section & Semester Quick Selection
  const handleSelectSection = (sec: string) => {
    setStudentInfo((prev) => ({ ...prev, section: sec }));
    setIsSectionPickerOpen(false);
    showToast(`Section set to ${sec}`);
  };

  const handleSelectSemester = (sem: string) => {
    setStudentInfo((prev) => ({ ...prev, semester: sem }));
    setIsSemesterPickerOpen(false);
    showToast(`Semester set to ${sem}`);
  };

  const handleToggleDocumentType = (type: DocumentType) => {
    setSettings((prev) => ({
      ...prev,
      documentType: type,
      reportTitle: type === 'assignment' ? 'ASSIGNMENT' : 'LAB REPORT',
    }));
    showToast(`Switched to ${type === 'assignment' ? 'Assignment' : 'Lab Report'} mode`);
  };

  // Export handlers
  const getDocumentFilenameBase = () => {
    const isAssign = settings.documentType === 'assignment';
    const typeLabel = isAssign ? 'Assignment' : 'Lab_Report';
    const course = studentInfo.courseCode ? studentInfo.courseCode.replace(/[^a-zA-Z0-9]/g, '_') : 'EEE';
    const no = studentInfo.experimentNo ? `${isAssign ? 'No' : 'Exp'}${studentInfo.experimentNo}` : '1';
    const sec = studentInfo.section ? `_Sec${studentInfo.section}` : '';
    const id = studentInfo.studentId ? `_${studentInfo.studentId}` : '';
    return `NUB_${typeLabel}_${course}_${no}${sec}${id}`;
  };

  const getDocumentFilename = (ext: string) => {
    return `${getDocumentFilenameBase()}.${ext}`;
  };

  const handlePrint = () => {
    printDocument();
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    showToast('Generating high-resolution A4 PDF...');
    const filename = getDocumentFilename('pdf');
    const res = await exportElementToPDF('a4-cover-page-export', filename);
    setIsExporting(false);
    if (res.cancelled) return;
    if (res.success) {
      if (res.method === 'picker') {
        showToast('PDF saved to your selected memory folder!');
      } else if (res.method === 'share') {
        showToast('PDF shared and saved successfully!');
      } else {
        showToast('PDF download completed!');
      }
    } else {
      showToast('Download interrupted. Try the Save Options menu.');
      setIsDownloadModalOpen(true);
    }
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    showToast('Rendering high-resolution image...');
    const filename = getDocumentFilename('png');
    const res = await exportElementToPNG('a4-cover-page-export', filename);
    setIsExporting(false);
    if (res.cancelled) return;
    if (res.success) {
      if (res.method === 'picker') {
        showToast('PNG image saved to your selected folder!');
      } else if (res.method === 'share') {
        showToast('PNG image shared and saved successfully!');
      } else {
        showToast('PNG image saved successfully!');
      }
    } else {
      showToast('Error saving PNG. Try the Save Options menu.');
      setIsDownloadModalOpen(true);
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    setIsFitScreenMode(false);
    setScale((z) => Math.min(1.3, Number((z + 0.05).toFixed(2))));
  };

  const handleZoomOut = () => {
    setIsFitScreenMode(false);
    setScale((z) => Math.max(0.25, Number((z - 0.05).toFixed(2))));
  };

  const handleResetFit = () => {
    setIsFitScreenMode(true);
    const fit = calculateFitScale();
    setScale(fit);
    showToast(`Fitted to screen (${Math.round(fit * 100)}%)`);
  };

  // Toggle between Fit-to-Screen (auto-scale) and 100% full scale
  const toggleFitScreen = () => {
    if (isFitScreenMode) {
      setIsFitScreenMode(false);
      setScale(1.0);
      showToast('Switched to 100% full scale');
    } else {
      handleResetFit();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <HeaderNav
        documentType={settings.documentType}
        onToggleDocumentType={handleToggleDocumentType}
        currentPreset={settings.preset}
        onSelectPreset={handleSelectPreset}
        onPrint={handlePrint}
        onExportPDF={handleExportPDF}
        onExportPNG={handleExportPNG}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        isExporting={isExporting}
        onOpenDeveloperInfo={() => setIsAboutDeveloperOpen(true)}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden bg-white border-b border-stone-200 px-2 py-0.5 flex items-center justify-between no-print sticky top-8 sm:top-9 z-30">
        <div className="flex p-0.5 bg-stone-100 rounded-md w-full">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-0.5 text-[11px] font-bold rounded flex items-center justify-center gap-1 transition-colors ${
              mobileTab === 'editor'
                ? 'bg-white text-emerald-900 shadow-2xs'
                : 'text-stone-600'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Form</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-0.5 text-[11px] font-bold rounded flex items-center justify-center gap-1 transition-colors ${
              mobileTab === 'preview'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Live A4 Preview</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-1 sm:px-2 pt-0.5 pb-1 md:pt-1 md:pb-2 grid grid-cols-1 lg:grid-cols-12 gap-1.5 sm:gap-2.5 items-start no-print">
        {/* Left Column: Form Controls */}
        <div
          className={`lg:col-span-5 h-[calc(100vh-3rem)] sticky top-9 flex flex-col ${
            mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <EditorPanel
            studentInfo={studentInfo}
            setStudentInfo={setStudentInfo}
            teacherInfo={teacherInfo}
            setTeacherInfo={setTeacherInfo}
            settings={settings}
            setSettings={setSettings}
            subjects={subjects}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
            onResetSubjects={handleResetSubjects}
            savedDrafts={savedDrafts}
            onSaveDraft={handleSaveDraft}
            onLoadDraft={handleLoadDraft}
            onDeleteDraft={handleDeleteDraft}
            onResetToDefaults={handleResetToDefaults}
            onOpenSubjectModal={() => setIsSubjectModalOpen(true)}
            onOpenDeveloperModal={() => setIsAboutDeveloperOpen(true)}
          />
        </div>

        {/* Right Column: Live A4 Preview & Screen Fit Container */}
        <div
          className={`lg:col-span-7 flex flex-col items-center w-full ${
            mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preview Controls Bar: Slim Single-Line Toolbar */}
          <div className="w-full bg-white border border-stone-200 rounded px-1.5 sm:px-2 py-0.5 flex items-center justify-between gap-1 shadow-2xs mb-0.5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-black text-stone-800 tracking-wider uppercase">
                Preview
              </span>
            </div>

            {/* Quick Interactive Section Bar */}
            <div className="flex items-center gap-0.5 bg-stone-100 p-0.5 rounded shrink-0">
              <span className="text-[9px] font-bold text-stone-500 px-0.5">Sec:</span>
              {SECTION_OPTIONS.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleSelectSection(sec)}
                  className={`w-4 h-4 rounded text-[10px] font-black transition-all flex items-center justify-center ${
                    studentInfo.section === sec
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                  title={`Set Section to ${sec}`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* Quick Mobile Preset Selector */}
            <div className="flex md:hidden items-center gap-0.5 bg-stone-100 p-0.5 rounded shrink-0">
              <span className="text-[9px] font-bold text-stone-500 px-0.5">Style:</span>
              {(['classic', 'modern', 'minimal', 'institutional'] as PresetType[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`px-1 py-0.5 text-[9px] font-bold rounded capitalize transition-all ${
                    settings.preset === p
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {p === 'institutional' ? 'Off' : p.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Quick Semester & Session Selectors */}
            <div className="hidden xl:flex items-center gap-1 bg-stone-100 p-0.5 rounded shrink-0">
              <span className="text-[10px] font-bold text-stone-600 px-0.5">Sem:</span>
              <select
                value={studentInfo.semester}
                onChange={(e) => {
                  setStudentInfo((prev) => ({ ...prev, semester: e.target.value }));
                  showToast(`Semester set to ${e.target.value}`);
                }}
                className="text-[10px] bg-white border border-stone-200 rounded px-1 py-0 font-bold text-stone-800"
              >
                {SEMESTER_OPTIONS.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>

              <span className="text-[10px] font-bold text-stone-600 px-0.5 ml-0.5">Session:</span>
              <select
                value={studentInfo.session || 'Spring 2026'}
                onChange={(e) => {
                  setStudentInfo((prev) => ({ ...prev, session: e.target.value }));
                  showToast(`Session set to ${e.target.value}`);
                }}
                className="text-[10px] bg-white border border-stone-200 rounded px-1 py-0 font-bold text-stone-800"
              >
                {SESSION_OPTIONS.map((sess) => (
                  <option key={sess} value={sess}>{sess}</option>
                ))}
              </select>
            </div>

            {/* Zoom Controls & Fit Screen Button */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsSubjectModalOpen(true)}
                className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded transition-colors"
                title="Manage Courses & Subjects"
              >
                <BookOpen className="w-2.5 h-2.5 text-emerald-700" />
                <span>Subjects</span>
              </button>

              <div className="flex items-center bg-stone-100 rounded border border-stone-200 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="w-4 h-4 flex items-center justify-center rounded text-stone-700 hover:text-stone-900 hover:bg-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-2.5 h-2.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetFit}
                  className="px-1 py-0 text-[9px] font-bold text-stone-700 hover:text-stone-900 hover:bg-white rounded transition-colors"
                  title="Reset to Fit Screen"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="w-4 h-4 flex items-center justify-center rounded text-stone-700 hover:text-stone-900 hover:bg-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-2.5 h-2.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={toggleFitScreen}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded transition-all border ${
                  isFitScreenMode
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                    : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                }`}
                title="Fit cover page to screen"
              >
                {isFitScreenMode ? (
                  <Minimize2 className="w-2.5 h-2.5" />
                ) : (
                  <Maximize2 className="w-2.5 h-2.5" />
                )}
                <span>Fit</span>
              </button>
            </div>
          </div>

          {/* Scaled A4 Preview Sheet Container: Scales directly from center on Zoom In / Zoom Out */}
          <div className="w-full flex-1 flex flex-col items-center justify-start pt-2 pb-6 px-1 overflow-x-auto overflow-y-visible">
            <div
              className="relative mx-auto transition-all duration-150 flex items-center justify-center shrink-0"
              style={{
                width: `${Math.round(A4_WIDTH_PX * scale)}px`,
                height: `${Math.round(A4_HEIGHT_PX * scale)}px`,
              }}
            >
              <div
                className="transition-transform duration-150 shadow-2xl"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                  width: `${A4_WIDTH_PX}px`,
                  height: `${A4_HEIGHT_PX}px`,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: `-${A4_HEIGHT_PX / 2}px`,
                  marginLeft: `-${A4_WIDTH_PX / 2}px`,
                }}
              >
                <A4CoverPage
                  studentInfo={studentInfo}
                  teacherInfo={teacherInfo}
                  settings={settings}
                  id="a4-cover-page-preview"
                  isInteractivePreview={true}
                  className="mx-0"
                  onOpenSubjectPicker={() => setIsSubjectModalOpen(true)}
                  onOpenSectionPicker={() => setIsSectionPickerOpen(true)}
                  onOpenSemesterPicker={() => setIsSemesterPickerOpen(true)}
                  onToggleDocumentType={() =>
                    handleToggleDocumentType(
                      settings.documentType === 'assignment' ? 'lab_report' : 'assignment'
                    )
                  }
                  onSelectSection={handleSelectSection}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 1. SUBJECT SELECTION & MANAGEMENT MODAL */}
      <SubjectPickerModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        subjects={subjects}
        onSelectSubject={handleSelectSubjectFromModal}
        onAddSubject={handleAddSubject}
        onDeleteSubject={handleDeleteSubject}
        onResetSubjects={handleResetSubjects}
        currentCourseCode={studentInfo.courseCode}
      />

      {/* 2. ABOUT DEVELOPER MODAL */}
      <AboutDeveloperModal
        isOpen={isAboutDeveloperOpen}
        onClose={() => setIsAboutDeveloperOpen(false)}
      />

      {/* 3. DOWNLOAD & OFFLINE MEMORY SAVE MODAL */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        filenameBase={getDocumentFilenameBase()}
        elementId="a4-cover-page-export"
        onSuccessToast={showToast}
      />

      {/* 2. QUICK SECTION PICKER MODAL */}
      {isSectionPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900">
                    Select Section
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Choose section
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSectionPickerOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {SECTION_OPTIONS.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleSelectSection(sec)}
                  className={`h-12 rounded-xl text-base font-black transition-all flex flex-col items-center justify-center ${
                    studentInfo.section === sec
                      ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-600 scale-105'
                      : 'bg-stone-50 text-stone-800 border border-stone-300 hover:bg-emerald-50 hover:border-emerald-700'
                  }`}
                >
                  <span>{sec}</span>
                </button>
              ))}
            </div>

            {/* Custom Section Input */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Custom Section:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. F or 54A"
                  value={studentInfo.section}
                  onChange={(e) => setStudentInfo((prev) => ({ ...prev, section: e.target.value }))}
                  className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg font-bold"
                />
                <button
                  type="button"
                  onClick={() => setIsSectionPickerOpen(false)}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. QUICK SEMESTER PICKER MODAL */}
      {isSemesterPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900">
                    Select Semester
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Select your active semester
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSemesterPickerOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SEMESTER_OPTIONS.map((sem, idx) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => handleSelectSemester(sem)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center border ${
                    studentInfo.semester === sem
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600 scale-102'
                      : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-emerald-50 hover:border-emerald-700'
                  }`}
                >
                  <div className="font-mono text-sm font-black">{idx + 1}</div>
                  <div className="text-[10px] mt-0.5 opacity-90">{sem}</div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSemesterPickerOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Unscaled Container for High-DPI PDF & PNG Export */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '210mm',
          height: '297mm',
          zIndex: -9999,
          opacity: 0.001,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <A4CoverPage
          studentInfo={studentInfo}
          teacherInfo={teacherInfo}
          settings={settings}
          id="a4-cover-page-export"
        />
      </div>

      {/* Dedicated Clean Container for Native Browser A4 Printing */}
      <div className="print-only hidden" aria-hidden="true">
        <A4CoverPage
          studentInfo={studentInfo}
          teacherInfo={teacherInfo}
          settings={settings}
          id="a4-cover-page-native-print"
        />
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-xl animate-fade-in border border-stone-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
