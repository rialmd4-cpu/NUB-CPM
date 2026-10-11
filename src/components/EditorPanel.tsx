import React, { useRef, useState } from 'react';
import {
  CoverPageDesignSettings,
  FontFamily,
  PresetType,
  StudentInfo,
  TeacherInfo,
  SavedDraft,
  BorderStyle,
  PageMargin,
} from '../types';
import {
  COLOR_PALETTES,
  SAMPLE_DRAFTS,
  SECTION_OPTIONS,
  SEMESTER_OPTIONS,
  SEASON_OPTIONS,
  YEAR_OPTIONS,
  SubjectOption,
} from '../constants/initialData';
import {
  BookOpen,
  User,
  GraduationCap,
  Sliders,
  FolderOpen,
  Upload,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  Palette,
  Type,
  Trash2,
  FileCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  FlaskConical,
  Hash,
  Sun,
  Phone,
  Mail,
  MapPin,
  Wrench,
  Cpu,
  HeartPulse,
  FolderDown,
  Download,
  HardDrive,
} from 'lucide-react';

interface EditorPanelProps {
  studentInfo: StudentInfo;
  setStudentInfo: React.Dispatch<React.SetStateAction<StudentInfo>>;
  teacherInfo: TeacherInfo;
  setTeacherInfo: React.Dispatch<React.SetStateAction<TeacherInfo>>;
  settings: CoverPageDesignSettings;
  setSettings: React.Dispatch<React.SetStateAction<CoverPageDesignSettings>>;
  subjects: SubjectOption[];
  onAddSubject: (subject: SubjectOption) => void;
  onDeleteSubject: (code: string) => void;
  onResetSubjects: () => void;
  savedDrafts: SavedDraft[];
  onSaveDraft: (name: string) => void;
  onLoadDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (id: string) => void;
  onResetToDefaults: () => void;
  onOpenSubjectModal: () => void;
  onOpenDeveloperModal?: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  studentInfo,
  setStudentInfo,
  teacherInfo,
  setTeacherInfo,
  settings,
  setSettings,
  subjects,
  onAddSubject,
  onDeleteSubject,
  onResetSubjects,
  savedDrafts,
  onSaveDraft,
  onLoadDraft,
  onDeleteDraft,
  onResetToDefaults,
  onOpenSubjectModal,
  onOpenDeveloperModal,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'teacher' | 'design' | 'drafts' | 'developer'>('info');
  const [draftNameInput, setDraftNameInput] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Collapsible box states for Semester, Section, Season, Year
  const [isSemesterOpen, setIsSemesterOpen] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const isAssignment = settings.documentType === 'assignment';

  // Quick field updates
  const updateStudent = <K extends keyof StudentInfo>(field: K, value: StudentInfo[K]) => {
    setStudentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateTeacher = (field: keyof TeacherInfo, value: string) => {
    setTeacherInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateSetting = <K extends keyof CoverPageDesignSettings>(
    field: K,
    value: CoverPageDesignSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  // When season is updated, keep session synced
  const updateSeason = (season: string) => {
    setStudentInfo((prev) => {
      const yr = prev.year || '2026';
      return {
        ...prev,
        season,
        session: `${season} ${yr}`,
      };
    });
  };

  // When year is updated, keep session synced
  const updateYear = (year: string) => {
    setStudentInfo((prev) => {
      const sea = prev.season || 'Spring';
      return {
        ...prev,
        year,
        session: `${sea} ${year}`,
      };
    });
  };

  // Select subject from quick dropdown
  const handleSelectQuickSubject = (subject: SubjectOption) => {
    setStudentInfo((prev) => ({
      ...prev,
      courseCode: subject.code,
      courseTitle: subject.title,
      department: subject.department,
      program: subject.program,
      experimentTitle: subject.defaultExperiments[0] || prev.experimentTitle,
    }));
    setShowSubjectDropdown(false);
  };

  // Logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateSetting('customLogoUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetDate = (daysAhead: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    const formatted = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    updateStudent('submissionDate', formatted);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-2xs overflow-hidden flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-stone-200 bg-stone-50 p-0.5 gap-0.5 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded transition-all whitespace-nowrap ${
            activeTab === 'info'
              ? 'bg-white text-emerald-950 shadow-2xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <BookOpen className="w-3 h-3 text-emerald-700" />
          <span>Course & Student</span>
        </button>

        <button
          onClick={() => setActiveTab('teacher')}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded transition-all whitespace-nowrap ${
            activeTab === 'teacher'
              ? 'bg-white text-emerald-950 shadow-2xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <GraduationCap className="w-3 h-3 text-emerald-700" />
          <span>Submitted To</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded transition-all whitespace-nowrap ${
            activeTab === 'design'
              ? 'bg-white text-emerald-950 shadow-2xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Sliders className="w-3 h-3 text-emerald-700" />
          <span>Presets & Style</span>
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded transition-all whitespace-nowrap ${
            activeTab === 'drafts'
              ? 'bg-white text-emerald-950 shadow-2xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <FolderOpen className="w-3 h-3 text-emerald-700" />
          <span>Drafts & Data</span>
        </button>

        <button
          onClick={() => setActiveTab('developer')}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded transition-all whitespace-nowrap ${
            activeTab === 'developer'
              ? 'bg-emerald-800 text-white shadow-2xs border border-emerald-900'
              : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50'
          }`}
        >
          <User className="w-3 h-3" />
          <span>About Dev</span>
        </button>
      </div>



      {/* Tab Contents */}
      <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3.5">
        {/* ================================================================= */}
        {/* TAB 1: COURSE & STUDENT INFO */}
        {/* ================================================================= */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* 1. DOCUMENT TYPE SELECTOR (Assignment vs Lab Report) */}
            <div className="p-3.5 bg-stone-100/80 border border-stone-300 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wide text-stone-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-800" />
                  Document Type
                </label>
                <span className="text-[11px] font-bold text-emerald-950 bg-emerald-200/80 px-2 py-0.5 rounded">
                  {isAssignment ? 'Assignment Active' : 'Lab Report Active'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateSetting('documentType', 'assignment');
                    updateSetting('reportTitle', 'ASSIGNMENT');
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-black text-xs transition-all ${
                    isAssignment
                      ? 'bg-emerald-800 text-white border-emerald-950 shadow-md ring-2 ring-emerald-600 scale-[1.02]'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50 hover:border-emerald-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Assignment</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateSetting('documentType', 'lab_report');
                    updateSetting('reportTitle', 'LAB REPORT');
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-black text-xs transition-all ${
                    !isAssignment
                      ? 'bg-emerald-800 text-white border-emerald-950 shadow-md ring-2 ring-emerald-600 scale-[1.02]'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50 hover:border-emerald-700'
                  }`}
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Lab Report</span>
                </button>
              </div>
            </div>

            {/* 2. SUBJECT / COURSE SELECTION BOX (Click to Open) */}
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wide text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Select Subject / Course
                </label>
                <button
                  type="button"
                  onClick={onOpenSubjectModal}
                  className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-md border border-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  All Courses & Experiments →
                </button>
              </div>

              {/* Quick Clickable Course Selector Box */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  className="w-full text-left px-3 py-2 bg-white border border-stone-300 rounded-lg flex items-center justify-between text-xs hover:border-emerald-700 transition-colors shadow-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-mono font-bold text-emerald-900 mr-2">
                      {studentInfo.courseCode || 'Select Course'}
                    </span>
                    <span className="font-semibold text-stone-800">
                      {studentInfo.courseTitle || 'Choose Subject...'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                </button>

                {/* Dropdown list of Subjects */}
                {showSubjectDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto p-1 space-y-1 animate-in fade-in">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                      <span>Available Courses ({subjects.length}):</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSubjectDropdown(false);
                          onOpenSubjectModal();
                        }}
                        className="text-emerald-800 hover:underline font-bold"
                      >
                        + Manage / Add
                      </button>
                    </div>
                    {subjects.map((sub) => (
                      <button
                        key={sub.code}
                        type="button"
                        onClick={() => handleSelectQuickSubject(sub)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          studentInfo.courseCode === sub.code
                            ? 'bg-emerald-100/70 text-emerald-950 font-bold'
                            : 'hover:bg-stone-100 text-stone-800'
                        }`}
                      >
                        <div>
                          <span className="font-mono font-bold mr-2 text-emerald-800">
                            {sub.code}
                          </span>
                          <span>{sub.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Course Code & Title Detailed Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={studentInfo.courseCode}
                  onChange={(e) => updateStudent('courseCode', e.target.value)}
                  placeholder="e.g. EEE-212"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  value={studentInfo.courseTitle}
                  onChange={(e) => updateStudent('courseTitle', e.target.value)}
                  placeholder="e.g. Electronic Devices and Circuits I Laboratory"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                />
              </div>
            </div>

            {/* Number and Topic (Assignment No vs Experiment No) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAssignment ? 'Assign. No.' : 'Exp. No.'}
                </label>
                <input
                  type="text"
                  value={studentInfo.experimentNo}
                  onChange={(e) => updateStudent('experimentNo', e.target.value)}
                  placeholder="e.g. 01"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white font-bold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAssignment ? 'Assignment Topic / Title' : 'Experiment / Lab Title'}
                </label>
                <input
                  type="text"
                  value={studentInfo.experimentTitle}
                  onChange={(e) => updateStudent('experimentTitle', e.target.value)}
                  placeholder={
                    isAssignment
                      ? 'e.g. Analysis of BJT Amplifier Configurations'
                      : 'e.g. Study of P-N Junction Diode Characteristics'
                  }
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Submission Date Controls */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  Submission Date
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleSetDate(0)}
                    className="text-[10px] px-2 py-0.5 bg-white border border-stone-300 hover:border-emerald-700 text-stone-700 rounded font-semibold transition-colors"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetDate(1)}
                    className="text-[10px] px-2 py-0.5 bg-white border border-stone-300 hover:border-emerald-700 text-stone-700 rounded font-semibold transition-colors"
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetDate(7)}
                    className="text-[10px] px-2 py-0.5 bg-white border border-stone-300 hover:border-emerald-700 text-stone-700 rounded font-semibold transition-colors"
                  >
                    +7 Days
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={studentInfo.submissionDate}
                onChange={(e) => updateStudent('submissionDate', e.target.value)}
                placeholder="e.g. October 15, 2026"
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-bold text-stone-900"
              />
            </div>

            {/* Student Information Section */}
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                Submitted By (Student Info)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={studentInfo.studentName}
                    onChange={(e) => updateStudent('studentName', e.target.value)}
                    placeholder="e.g. Md. Tanvir Ahmed"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentInfo.studentId}
                    onChange={(e) => updateStudent('studentId', e.target.value)}
                    placeholder="e.g. 21020054"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Department <span className="text-[10px] text-emerald-800 font-bold">(Default on Cover)</span>
                  </label>
                  <input
                    type="text"
                    value={studentInfo.department}
                    onChange={(e) => updateStudent('department', e.target.value)}
                    placeholder="e.g. Department of Electrical & Electronic Engineering"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Program / Degree
                  </label>
                  <input
                    type="text"
                    value={studentInfo.program}
                    onChange={(e) => updateStudent('program', e.target.value)}
                    placeholder="e.g. B.Sc. in EEE"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* CLICK-TO-OPEN SEPARATE COLLAPSIBLE BOXES */}
              {/* 1. SEMESTER (1st to 12th Semester options) */}
              {/* 2. SECTION (A, B, C, D, E options) */}
              {/* 3. SEASON (Spring, Summer, Fall options) */}
              {/* 4. YEAR (Academic Years options) */}
              {/* ----------------------------------------------------------- */}

              {/* 1. SEMESTER COLLAPSIBLE BOX */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setIsSemesterOpen(!isSemesterOpen)}
                  className="w-full p-3 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span className="text-xs font-bold text-stone-900">
                      Semester
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded">
                      {studentInfo.semester || '1st Semester'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-500 text-xs">
                    <span className="text-[10px] hidden sm:inline">
                      {isSemesterOpen ? 'Collapse' : 'Expand'}
                    </span>
                    {isSemesterOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-800" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isSemesterOpen && (
                  <div className="p-3 bg-white border-t border-stone-200 space-y-2.5 animate-in fade-in">
                    <div className="text-[11px] text-stone-500 font-medium">
                      Select Semester:
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                      {SEMESTER_OPTIONS.map((sem, idx) => {
                        const isSelected = studentInfo.semester === sem;
                        return (
                          <button
                            key={sem}
                            type="button"
                            onClick={() => {
                              updateStudent('semester', sem);
                            }}
                            className={`py-1.5 px-1 text-xs font-bold rounded-lg border transition-all text-center ${
                              isSelected
                                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs ring-1 ring-emerald-600 scale-102'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-emerald-700'
                            }`}
                            title={sem}
                          >
                            {idx + 1}
                            <span className="text-[9px] font-normal ml-0.5">
                              {idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      value={studentInfo.semester}
                      onChange={(e) => updateStudent('semester', e.target.value)}
                      placeholder="e.g. 4th Semester"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* 2. SECTION COLLAPSIBLE BOX */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setIsSectionOpen(!isSectionOpen)}
                  className="w-full p-3 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span className="text-xs font-bold text-stone-900">
                      Section
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded">
                      Section {studentInfo.section || 'A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-500 text-xs">
                    <span className="text-[10px] hidden sm:inline">
                      {isSectionOpen ? 'Collapse' : 'Expand'}
                    </span>
                    {isSectionOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-800" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isSectionOpen && (
                  <div className="p-3 bg-white border-t border-stone-200 space-y-2 animate-in fade-in">
                    <div className="text-[11px] text-stone-500 font-medium">
                      Select Section:
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {SECTION_OPTIONS.map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => updateStudent('section', sec)}
                          className={`w-10 h-8 rounded-lg text-xs font-black transition-all flex items-center justify-center ${
                            studentInfo.section === sec
                              ? 'bg-emerald-800 text-white shadow-xs scale-105 ring-2 ring-emerald-600'
                              : 'bg-stone-50 text-stone-700 border border-stone-300 hover:bg-stone-100 hover:border-emerald-700'
                          }`}
                        >
                          {sec}
                        </button>
                      ))}
                      <input
                        type="text"
                        value={studentInfo.section}
                        onChange={(e) => updateStudent('section', e.target.value)}
                        placeholder="Custom Sec"
                        className="w-24 px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. SEASON COLLAPSIBLE BOX */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setIsSeasonOpen(!isSeasonOpen)}
                  className="w-full p-3 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span className="text-xs font-bold text-stone-900">
                      Academic Season / Term
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded">
                      {studentInfo.season || 'Spring'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-500 text-xs">
                    <span className="text-[10px] hidden sm:inline">
                      {isSeasonOpen ? 'Collapse' : 'Expand'}
                    </span>
                    {isSeasonOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-800" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isSeasonOpen && (
                  <div className="p-3 bg-white border-t border-stone-200 space-y-2 animate-in fade-in">
                    <div className="text-[11px] text-stone-500 font-medium">
                      Select Season:
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {SEASON_OPTIONS.map((sea) => {
                        const isSelected = studentInfo.season === sea;
                        return (
                          <button
                            key={sea}
                            type="button"
                            onClick={() => updateSeason(sea)}
                            className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all text-center ${
                              isSelected
                                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs ring-1 ring-emerald-600'
                                : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100 hover:border-emerald-700'
                            }`}
                          >
                            {sea === 'Spring' && '🌸 '}
                            {sea === 'Summer' && '☀️ '}
                            {sea === 'Fall' && '🍂 '}
                            {sea}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. YEAR COLLAPSIBLE BOX */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setIsYearOpen(!isYearOpen)}
                  className="w-full p-3 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span className="text-xs font-bold text-stone-900">
                      Academic Year
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded">
                      {studentInfo.year || '2026'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-500 text-xs">
                    <span className="text-[10px] hidden sm:inline">
                      {isYearOpen ? 'Collapse' : 'Expand'}
                    </span>
                    {isYearOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-800" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isYearOpen && (
                  <div className="p-3 bg-white border-t border-stone-200 space-y-2 animate-in fade-in">
                    <div className="text-[11px] text-stone-500 font-medium">
                      Select or enter year:
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {YEAR_OPTIONS.map((yr) => {
                        const isSelected = studentInfo.year === yr;
                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => updateYear(yr)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                              isSelected
                                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs ring-1 ring-emerald-600'
                                : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100 hover:border-emerald-700'
                            }`}
                          >
                            {yr}
                          </button>
                        );
                      })}
                      <input
                        type="text"
                        value={studentInfo.year || ''}
                        onChange={(e) => updateYear(e.target.value)}
                        placeholder="Custom Year"
                        className="w-24 px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Batch (Optional & Can be toggled off) */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-bold text-stone-800">
                      Batch
                    </label>
                    <span className="text-[10px] text-stone-500 font-medium">
                      (Optional)
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-semibold text-stone-700 hover:text-emerald-900 transition-colors">
                    <span>Show on Page</span>
                    <input
                      type="checkbox"
                      checked={studentInfo.showBatch !== false}
                      onChange={(e) => updateStudent('showBatch', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-800 accent-emerald-800 cursor-pointer"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  disabled={studentInfo.showBatch === false}
                  value={studentInfo.batch || ''}
                  onChange={(e) => updateStudent('batch', e.target.value)}
                  placeholder="e.g. 54th Batch"
                  className={`w-full px-3 py-1.5 text-xs rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-700 ${
                    studentInfo.showBatch === false
                      ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                      : 'bg-white text-stone-900 border border-stone-300 font-medium'
                  }`}
                />
                {studentInfo.showBatch === false && (
                  <p className="text-[10px] text-amber-700 font-medium">
                    Batch is turned off and will not appear on the cover page.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: INSTRUCTOR & TEACHER INFO (SUBMITTED TO) */}
        {/* ================================================================= */}
        {activeTab === 'teacher' && (
          <div className="space-y-4">
            <div className="border-b border-stone-200 pb-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                Instructor Details (Submitted To)
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Appears in the "SUBMITTED TO" section on the cover page.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Teacher / Instructor Full Name
                </label>
                <input
                  type="text"
                  value={teacherInfo.teacherName}
                  onChange={(e) => updateTeacher('teacherName', e.target.value)}
                  placeholder="e.g. Engr. Farhana Yesmin"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={teacherInfo.designation}
                  onChange={(e) => updateTeacher('designation', e.target.value)}
                  placeholder="e.g. Assistant Professor"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['Lecturer', 'Senior Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor'].map(
                    (desig) => (
                      <button
                        key={desig}
                        type="button"
                        onClick={() => updateTeacher('designation', desig)}
                        className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                      >
                        {desig}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={teacherInfo.department}
                  onChange={(e) => updateTeacher('department', e.target.value)}
                  placeholder="e.g. Department of Electrical & Electronic Engineering"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  University Name
                </label>
                <input
                  type="text"
                  value={teacherInfo.universityName}
                  onChange={(e) => updateTeacher('universityName', e.target.value)}
                  placeholder="e.g. Northern University Bangladesh"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Campus Location
                </label>
                <input
                  type="text"
                  value={teacherInfo.campus || ''}
                  onChange={(e) => updateTeacher('campus', e.target.value)}
                  placeholder="e.g. Permanent Campus, Ashkona, Dhaka"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: DESIGN PRESETS & CUSTOMIZATION */}
        {/* ================================================================= */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            {/* Presets */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                Select Design Preset
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'classic' as PresetType,
                    name: 'Classic Academic',
                    desc: 'Double framed border, serif fonts, formal NUB circular seal.',
                  },
                  {
                    id: 'modern' as PresetType,
                    name: 'Modern University',
                    desc: 'Navy/Emerald top header ribbon, modern badges, clean cards.',
                  },
                  {
                    id: 'minimal' as PresetType,
                    name: 'Minimal Professional',
                    desc: 'Clean hairline dividers, high editorial whitespace.',
                  },
                  {
                    id: 'institutional' as PresetType,
                    name: 'Official Institutional',
                    desc: 'Formal university layout with optional grading rubric.',
                  },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => updateSetting('preset', preset.id)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      settings.preset === preset.id
                        ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <div className="font-bold text-xs text-stone-900">{preset.name}</div>
                    <div className="text-[11px] text-stone-500 mt-1 leading-snug">
                      {preset.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Official NUB Logo Upload / Reset */}
            <div className="border-t border-stone-200 pt-4 space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-800 flex items-center justify-between">
                <span>Official NUB Seal & Logo</span>
                <span className="text-[11px] font-normal text-stone-500">
                  {settings.customLogoUrl ? 'Custom Image' : 'Official Circular Seal'}
                </span>
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-300 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Custom Logo
                </button>

                {settings.customLogoUrl && (
                  <button
                    type="button"
                    onClick={() => updateSetting('customLogoUrl', null)}
                    className="text-xs text-rose-700 hover:underline font-semibold"
                  >
                    Reset to Official Seal
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                    <span>Logo Size</span>
                    <span className="font-mono text-[11px]">{settings.logoSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    step="4"
                    value={settings.logoSize}
                    onChange={(e) => updateSetting('logoSize', Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                    <span>Watermark Opacity</span>
                    <span className="font-mono text-[11px]">
                      {settings.showWatermark ? `${Math.round(settings.watermarkOpacity * 100)}%` : 'Off'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.15"
                    step="0.01"
                    value={settings.showWatermark ? settings.watermarkOpacity : 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val === 0) {
                        updateSetting('showWatermark', false);
                      } else {
                        updateSetting('showWatermark', true);
                        updateSetting('watermarkOpacity', val);
                      }
                    }}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div className="border-t border-stone-200 pt-4 space-y-2.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-700" />
                University Accent Color
              </label>

              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.hex}
                    type="button"
                    onClick={() => updateSetting('accentColor', palette.hex)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all ${
                      settings.accentColor.toLowerCase() === palette.hex.toLowerCase()
                        ? 'border-stone-900 bg-stone-100 font-bold shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: palette.hex }}
                    />
                    <span className="text-[11px]">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Controls */}
            <div className="border-t border-stone-200 pt-4 space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-emerald-700" />
                Typography & Font Family
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'garamond' as FontFamily, name: 'EB Garamond', label: 'Academic Book' },
                  { id: 'serif' as FontFamily, name: 'Lora / Times', label: 'Classic Formal' },
                  { id: 'sans' as FontFamily, name: 'Plus Jakarta', label: 'Modern Clean' },
                  { id: 'cinzel' as FontFamily, name: 'Cinzel Classic', label: 'Institutional' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateSetting('fontFamily', f.id)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      settings.fontFamily === f.id
                        ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900">{f.name}</div>
                    <div className="text-[10px] text-stone-500">{f.label}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Font Scale
                  </label>
                  <select
                    value={settings.fontSizeScale}
                    onChange={(e) =>
                      updateSetting(
                        'fontSizeScale',
                        e.target.value as 'compact' | 'normal' | 'large'
                      )
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="compact">Compact (Dense)</option>
                    <option value="normal">Standard Academic</option>
                    <option value="large">Large / Bold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Page Margin
                  </label>
                  <select
                    value={settings.pageMargin}
                    onChange={(e) =>
                      updateSetting('pageMargin', e.target.value as PageMargin)
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="compact">Compact (14mm)</option>
                    <option value="normal">Standard A4 (18mm)</option>
                    <option value="generous">Generous (24mm)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Borders */}
            <div className="border-t border-stone-200 pt-4 space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-800">
                Border Style & Thickness
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'double' as BorderStyle, name: 'Double Line' },
                  { id: 'single' as BorderStyle, name: 'Single Solid' },
                  { id: 'ornate' as BorderStyle, name: 'Ornate Corners' },
                  { id: 'hairline' as BorderStyle, name: 'Hairline Thin' },
                  { id: 'none' as BorderStyle, name: 'Borderless' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => updateSetting('borderStyle', b.id)}
                    className={`py-1.5 px-2 text-center text-xs rounded-md border font-medium transition-all ${
                      settings.borderStyle === b.id
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              {settings.borderStyle !== 'none' && (
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                    <span>Border Thickness</span>
                    <span className="font-mono text-[11px]">{settings.borderThickness}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={settings.borderThickness}
                    onChange={(e) => updateSetting('borderThickness', Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Optional Modules */}
            <div className="border-t border-stone-200 pt-4 space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer p-2 rounded-lg hover:bg-stone-50">
                <input
                  type="checkbox"
                  checked={settings.showGradingTable}
                  onChange={(e) => updateSetting('showGradingTable', e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700"
                />
                <div>
                  <div className="font-bold">Teacher Grading & Evaluation Rubric</div>
                  <div className="text-[11px] text-stone-500">
                    Includes marks table & teacher's signature line.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer p-2 rounded-lg hover:bg-stone-50">
                <input
                  type="checkbox"
                  checked={settings.showUniversityMotto}
                  onChange={(e) => updateSetting('showUniversityMotto', e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700"
                />
                <div>
                  <div className="font-bold">Official Motto: "Knowledge for Innovation"</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: DRAFTS & LOCAL STORAGE */}
        {/* ================================================================= */}
        {activeTab === 'drafts' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-800">
                Save Current Report Cover as Draft
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draftNameInput}
                  onChange={(e) => setDraftNameInput(e.target.value)}
                  placeholder="e.g. EEE-212 Electronics Lab Report 1"
                  className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (draftNameInput.trim()) {
                      onSaveDraft(draftNameInput.trim());
                      setDraftNameInput('');
                    } else {
                      onSaveDraft(
                        `${studentInfo.courseCode || 'EEE'} - ${isAssignment ? 'Assign' : 'Exp'} ${studentInfo.experimentNo || '1'}`
                      );
                    }
                  }}
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
                >
                  Save Draft
                </button>
              </div>
            </div>

            {/* Saved User Drafts List */}
            <div className="border-t border-stone-200 pt-4 space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                Your Saved Drafts ({savedDrafts.length})
              </h4>

              {savedDrafts.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-stone-200 rounded-lg text-stone-500 text-xs">
                  No saved drafts yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {savedDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between hover:bg-stone-100 transition-colors"
                    >
                      <div className="overflow-hidden pr-2">
                        <div className="font-bold text-xs text-stone-900 truncate">
                          {draft.name}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {draft.studentInfo.courseCode} · Sec {draft.studentInfo.section} ·{' '}
                          {draft.settings.preset.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onLoadDraft(draft)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-white border border-stone-300 hover:border-emerald-700 text-stone-800 rounded transition-colors"
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteDraft(draft.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Sample Presets */}
            <div className="border-t border-stone-200 pt-4 space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                Northern University EEE Sample Templates
              </h4>
              <div className="space-y-2">
                {SAMPLE_DRAFTS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => onLoadDraft(sample)}
                    className="w-full text-left p-2.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900">{sample.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {sample.studentInfo.courseCode} · Section {sample.studentInfo.section}
                      </div>
                    </div>
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Form */}
            <div className="border-t border-stone-200 pt-4">
              <button
                type="button"
                onClick={onResetToDefaults}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Fields to EEE Defaults
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: ABOUT DEVELOPER */}
        {/* ================================================================= */}
        {activeTab === 'developer' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Developer Banner */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-white font-black text-lg shadow-inner">
                    RI
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-300">
                      ABOUT DEVELOPER
                    </div>
                    <h3 className="text-base font-black text-white">Md Rial Islam</h3>
                    <p className="text-[11px] text-emerald-100 font-medium">
                      Electromedical Engineer | Software Developer
                    </p>
                  </div>
                </div>
                {onOpenDeveloperModal && (
                  <button
                    type="button"
                    onClick={onOpenDeveloperModal}
                    className="px-2.5 py-1 text-[10px] font-bold bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30"
                  >
                    View Modal
                  </button>
                )}
              </div>
            </div>

            {/* Educational Qualification */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                Educational Qualification
              </h4>
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
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-700" />
                Professional Expertise
              </h4>
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
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-700" />
                Contact Information
              </h4>
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
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-800" />
                Software Information
              </h4>
              <div className="grid grid-cols-1 gap-1.5 text-[11px]">
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
                <div>
                  <span className="text-stone-500 font-medium">Field:</span>{' '}
                  <span className="font-bold text-stone-900">
                    University Cover Page Design &amp; Academic Document Formatting
                  </span>
                </div>
                <div className="pt-1 border-t border-emerald-200/60 flex items-center gap-1.5 text-emerald-950 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Mission: Simplifying Academic Cover Page Design</span>
                </div>
              </div>
            </div>

            {/* Developer Footer Credits */}
            <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-center">
              <div className="text-[11px] font-bold text-stone-800">
                Designed &amp; Developed by Md Rial Islam
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                © 2026 Md Rial Islam. All Rights Reserved.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
