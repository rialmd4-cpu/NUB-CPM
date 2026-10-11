import React from 'react';
import { CoverPageDesignSettings, StudentInfo, TeacherInfo } from '../types';
import { NUBLogo, NUBWatermark } from './NUBLogo';

interface A4CoverPageProps {
  studentInfo: StudentInfo;
  teacherInfo: TeacherInfo;
  settings: CoverPageDesignSettings;
  scale?: number;
  id?: string;
  isInteractivePreview?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onOpenSubjectPicker?: () => void;
  onSelectSection?: (section: string) => void;
  onOpenSectionPicker?: () => void;
  onOpenSemesterPicker?: () => void;
  onOpenDatePicker?: () => void;
  onToggleDocumentType?: () => void;
}

export const A4CoverPage: React.FC<A4CoverPageProps> = ({
  studentInfo,
  teacherInfo,
  settings,
  scale = 1,
  id = 'a4-cover-page-print',
  isInteractivePreview = false,
  className = '',
  style = {},
  onOpenSubjectPicker,
  onSelectSection,
  onOpenSectionPicker,
  onOpenSemesterPicker,
  onOpenDatePicker,
  onToggleDocumentType,
}) => {
  // Safe string getter to avoid undefined/null
  const safe = (val?: string | null) => (val && val.trim() ? val.trim() : '');

  // Batch visibility: optional and can be toggled on/off or hidden if blank
  const isBatchVisible = studentInfo.showBatch !== false && Boolean(safe(studentInfo.batch));

  // Font family class resolver
  const getFontFamilyStyle = () => {
    switch (settings.fontFamily) {
      case 'cinzel':
        return { fontFamily: "'Cinzel', serif" };
      case 'garamond':
        return { fontFamily: "'EB Garamond', serif" };
      case 'merriweather':
        return { fontFamily: "'Merriweather', serif" };
      case 'sans':
        return { fontFamily: "'Plus Jakarta Sans', sans-serif" };
      case 'serif':
      default:
        return { fontFamily: "'Lora', 'Times New Roman', serif" };
    }
  };

  // Padding based on page margin setting
  const getPaddingClass = () => {
    switch (settings.pageMargin) {
      case 'compact':
        return 'p-[14mm]';
      case 'generous':
        return 'p-[24mm]';
      case 'normal':
      default:
        return 'p-[18mm]';
    }
  };

  // Font scaling styles
  const getScaleClasses = () => {
    switch (settings.fontSizeScale) {
      case 'compact':
        return {
          title: 'text-2xl',
          univ: 'text-xl',
          h2: 'text-base',
          body: 'text-[13px]',
          label: 'text-[11px]',
        };
      case 'large':
        return {
          title: 'text-4xl',
          univ: 'text-2xl',
          h2: 'text-lg',
          body: 'text-[15px]',
          label: 'text-[13px]',
        };
      case 'normal':
      default:
        return {
          title: 'text-3xl',
          univ: 'text-[22px]',
          h2: 'text-[17px]',
          body: 'text-[14px]',
          label: 'text-[12px]',
        };
    }
  };

  const scaleClasses = getScaleClasses();

  const isAssignment = settings.documentType === 'assignment';
  const defaultTitle = isAssignment ? 'ASSIGNMENT' : 'LAB REPORT';
  const displayReportTitle = safe(settings.reportTitle) || defaultTitle;
  const expNoLabel = isAssignment ? 'Assignment No.' : 'Experiment No.';
  const expTitleLabel = isAssignment ? 'Assignment Topic' : 'Experiment Title';
  
  const getSessionString = () => {
    if (studentInfo.session && studentInfo.session.trim()) {
      return studentInfo.session.trim();
    }
    const parts = [safe(studentInfo.season), safe(studentInfo.year)].filter(Boolean);
    return parts.join(' ');
  };

  // Helper for border container styling
  const renderBorderContainer = (children: React.ReactNode) => {
    const { borderStyle, borderThickness, accentColor } = settings;

    if (borderStyle === 'none') {
      return (
        <div className={`h-full w-full flex flex-col justify-between relative z-10 ${getPaddingClass()}`}>
          {children}
        </div>
      );
    }

    if (borderStyle === 'double') {
      return (
        <div
          className="h-full w-full p-[3mm]"
          style={{
            border: `${borderThickness + 2}px solid ${accentColor}`,
          }}
        >
          <div
            className={`h-full w-full flex flex-col justify-between relative z-10 ${getPaddingClass()}`}
            style={{
              border: `1px solid ${accentColor}`,
            }}
          >
            {children}
          </div>
        </div>
      );
    }

    if (borderStyle === 'ornate') {
      return (
        <div
          className="h-full w-full relative p-[4mm]"
          style={{
            border: `${borderThickness}px solid ${accentColor}`,
          }}
        >
          <div
            className="absolute -top-[5px] -left-[5px] w-[14px] h-[14px]"
            style={{ backgroundColor: accentColor }}
          />
          <div
            className="absolute -top-[5px] -right-[5px] w-[14px] h-[14px]"
            style={{ backgroundColor: accentColor }}
          />
          <div
            className="absolute -bottom-[5px] -left-[5px] w-[14px] h-[14px]"
            style={{ backgroundColor: accentColor }}
          />
          <div
            className="absolute -bottom-[5px] -right-[5px] w-[14px] h-[14px]"
            style={{ backgroundColor: accentColor }}
          />
          <div
            className={`h-full w-full flex flex-col justify-between relative z-10 ${getPaddingClass()}`}
            style={{
              border: `1px dashed ${accentColor}88`,
            }}
          >
            {children}
          </div>
        </div>
      );
    }

    if (borderStyle === 'hairline') {
      return (
        <div
          className={`h-full w-full flex flex-col justify-between relative z-10 ${getPaddingClass()}`}
          style={{
            border: `1px solid ${accentColor}40`,
          }}
        >
          {children}
        </div>
      );
    }

    // Single border
    return (
      <div
        className={`h-full w-full flex flex-col justify-between relative z-10 ${getPaddingClass()}`}
        style={{
          border: `${borderThickness}px solid ${accentColor}`,
        }}
      >
        {children}
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // PRESET 1: CLASSIC ACADEMIC
  // --------------------------------------------------------------------------
  const renderClassicPreset = () => {
    return renderBorderContainer(
      <>
        {/* Top Header */}
        <div className="flex flex-col items-center text-center space-y-1.5">
          {settings.showLogo && (
            <div className="mb-1">
              <NUBLogo
                size={settings.logoSize}
                customUrl={settings.customLogoUrl}
                accentColor={settings.accentColor}
              />
            </div>
          )}

          <div>
            <h1
              className={`${scaleClasses.univ} font-extrabold tracking-wider uppercase`}
              style={{ color: settings.accentColor }}
            >
              {safe(settings.headerTitle) || 'NORTHERN UNIVERSITY BANGLADESH'}
            </h1>
            {settings.showUniversityMotto && (
              <p className="text-[12px] italic tracking-wide text-stone-600 mt-0.5">
                "{safe(settings.universityMotto) || 'Knowledge for Innovation'}"
              </p>
            )}
            <p className="text-[13px] font-bold text-stone-800 tracking-wide uppercase mt-1">
              {safe(studentInfo.department) || 'Department of Electrical & Electronic Engineering'}
            </p>
          </div>
        </div>

        {/* Center: Report Title & Experiment Details */}
        <div className="my-auto py-3 flex flex-col items-center text-center">
          {/* Prominent LAB REPORT Banner */}
          <div
            onClick={isInteractivePreview ? onToggleDocumentType : undefined}
            title={isInteractivePreview ? 'Click to toggle (Assignment ⇄ Lab Report)' : undefined}
            className={`w-full max-w-[420px] py-2 px-6 my-2 text-center transition-all ${
              isInteractivePreview
                ? 'cursor-pointer hover:opacity-90 hover:scale-[1.01] group relative'
                : ''
            }`}
            style={{
              borderTop: `2px solid ${settings.accentColor}`,
              borderBottom: `2px solid ${settings.accentColor}`,
            }}
          >
            {isInteractivePreview && (
              <span className="absolute -top-2.5 right-2 text-[9px] bg-emerald-800 text-white font-bold px-1.5 py-0.2 rounded opacity-0 group-hover:opacity-100 transition-opacity no-print">
                Toggle Type
              </span>
            )}
            <h2
              className={`${scaleClasses.title} font-extrabold tracking-widest uppercase`}
              style={{ color: settings.accentColor }}
            >
              {displayReportTitle}
            </h2>
          </div>

          {/* Course & Experiment Information Block with Interactive Hints */}
          <div
            onClick={isInteractivePreview ? onOpenSubjectPicker : undefined}
            title={isInteractivePreview ? 'Click to select Subject / Course' : undefined}
            className={`w-full mt-3 max-w-[530px] bg-stone-50/80 p-4 border border-stone-200 rounded-sm transition-all ${
              isInteractivePreview
                ? 'cursor-pointer hover:border-emerald-700 hover:shadow-xs group relative'
                : ''
            }`}
          >
            {isInteractivePreview && (
              <span className="absolute top-2 right-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity no-print">
                Click to change Subject
              </span>
            )}
            <div className="space-y-2 text-stone-900 text-left text-[13px]">
              <div className="grid grid-cols-[135px_16px_1fr] items-baseline">
                <span className="font-bold text-stone-700 uppercase text-[12px] tracking-wide">
                  Course Code
                </span>
                <span className="font-bold text-stone-500">:</span>
                <span className="font-bold text-stone-900 tracking-wider font-mono">
                  {safe(studentInfo.courseCode) || '—'}
                </span>
              </div>

              <div className="grid grid-cols-[135px_16px_1fr] items-baseline">
                <span className="font-bold text-stone-700 uppercase text-[12px] tracking-wide">
                  Course Title
                </span>
                <span className="font-bold text-stone-500">:</span>
                <span className="font-semibold text-stone-900">
                  {safe(studentInfo.courseTitle) || '—'}
                </span>
              </div>

              <div className="grid grid-cols-[135px_16px_1fr] items-baseline">
                <span className="font-bold text-stone-700 uppercase text-[12px] tracking-wide">
                  {expNoLabel}
                </span>
                <span className="font-bold text-stone-500">:</span>
                <span className="font-normal text-stone-900">
                  {safe(studentInfo.experimentNo) || '—'}
                </span>
              </div>

              <div className="grid grid-cols-[135px_16px_1fr] items-baseline">
                <span className="font-bold text-stone-700 uppercase text-[12px] tracking-wide">
                  {expTitleLabel}
                </span>
                <span className="font-bold text-stone-500">:</span>
                <span className="font-normal text-stone-900 leading-snug">
                  {safe(studentInfo.experimentTitle) || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Submitted To & Submitted By */}
        <div className="mt-auto space-y-3.5">
          <div className="grid grid-cols-2 gap-4">
            {/* SUBMITTED TO */}
            <div
              className="p-3.5 bg-stone-50/70 rounded-sm border"
              style={{ borderColor: `${settings.accentColor}50` }}
            >
              <div
                className="pb-1.5 mb-2 font-bold uppercase tracking-wider text-[12px] border-b flex items-center justify-between"
                style={{
                  color: settings.accentColor,
                  borderColor: `${settings.accentColor}40`,
                }}
              >
                <span>Submitted To</span>
              </div>
              <div className="space-y-1 text-[13px] text-stone-800 leading-tight">
                <div className="font-bold text-stone-900 text-[14px]">
                  {safe(teacherInfo.teacherName) || 'Faculty Member'}
                </div>
                <div className="text-stone-700 font-medium">
                  {safe(teacherInfo.designation) || 'Assistant Professor'}
                </div>
                <div className="text-stone-600">
                  {safe(teacherInfo.department) || safe(studentInfo.department)}
                </div>
                <div className="text-stone-900 font-semibold pt-0.5">
                  {safe(teacherInfo.universityName) || 'Northern University Bangladesh'}
                </div>
              </div>
            </div>

            {/* SUBMITTED BY */}
            <div
              className="p-3.5 bg-stone-50/70 rounded-sm border"
              style={{ borderColor: `${settings.accentColor}50` }}
            >
              <div
                className="pb-1.5 mb-2 font-bold uppercase tracking-wider text-[12px] border-b flex items-center justify-between"
                style={{
                  color: settings.accentColor,
                  borderColor: `${settings.accentColor}40`,
                }}
              >
                <span>Submitted By</span>
              </div>
              <div className="space-y-1 text-[13px] text-stone-800 leading-tight">
                <div className="font-bold text-stone-900 text-[14px]">
                  {safe(studentInfo.studentName) || 'Student Name'}
                </div>
                <div className="text-stone-700">
                  <span className="font-bold">Student ID:</span>{' '}
                  <span className="font-mono font-bold text-stone-900">
                    {safe(studentInfo.studentId) || '—'}
                  </span>
                </div>
                <div className="text-stone-700">
                  <span className="font-bold">Department:</span>{' '}
                  {safe(studentInfo.department) || safe(studentInfo.program) || 'Department of Electrical & Electronic Engineering'}
                </div>
                <div
                  onClick={isInteractivePreview ? onOpenSemesterPicker : undefined}
                  title={isInteractivePreview ? 'Click to select Semester' : undefined}
                  className={`text-stone-700 flex items-center gap-1.5 ${
                    isInteractivePreview
                      ? 'cursor-pointer hover:bg-emerald-100/70 p-0.5 rounded transition-colors group'
                      : ''
                  }`}
                >
                  <span className="font-bold">Semester:</span>{' '}
                  <span className="font-bold text-stone-900 bg-stone-200/80 px-1.5 py-0.2 rounded border border-stone-300">
                    {safe(studentInfo.semester) || '—'}
                  </span>
                  {studentInfo.session && (
                    <span className="text-stone-900 font-bold">({safe(studentInfo.session)})</span>
                  )}
                </div>
                <div className="text-stone-700 flex items-center gap-3 whitespace-nowrap">
                  <div
                    onClick={isInteractivePreview ? onOpenSectionPicker : undefined}
                    title={isInteractivePreview ? 'Click to select Section' : undefined}
                    className={`inline-flex items-center gap-1.5 ${
                      isInteractivePreview
                        ? 'cursor-pointer hover:bg-emerald-100/70 p-0.5 rounded transition-colors group'
                        : ''
                    }`}
                  >
                    <span className="font-bold">Section:</span>{' '}
                    <span className="font-black text-stone-950 bg-stone-200/90 px-1.5 py-0.2 rounded border border-stone-300">
                      {safe(studentInfo.section) || 'A'}
                    </span>
                  </div>
                  {isBatchVisible && (
                    <div className="inline-flex items-center gap-1 text-stone-700">
                      <span className="font-bold">Batch:</span>{' '}
                      <span className="font-semibold text-stone-900">{safe(studentInfo.batch)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Centered Bottom Submission Date */}
          <div className="pt-2.5 border-t border-stone-200 flex flex-col items-center justify-center text-center text-[13px] text-stone-800">
            <div
              onClick={isInteractivePreview ? onOpenDatePicker : undefined}
              title={isInteractivePreview ? 'Click to set Submission Date' : undefined}
              className={isInteractivePreview ? 'cursor-pointer hover:text-emerald-800' : ''}
            >
              <span className="font-bold uppercase tracking-wider text-stone-700">Date of Submission: </span>
              <span className="font-extrabold text-stone-950 underline decoration-stone-400 underline-offset-4">
                {safe(studentInfo.submissionDate) || '—'}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  // --------------------------------------------------------------------------
  // PRESET 2: MODERN UNIVERSITY
  // --------------------------------------------------------------------------
  const renderModernPreset = () => {
    return renderBorderContainer(
      <>
        {/* Modern Top Header with Brand Strip */}
        <div>
          <div
            className="flex items-center justify-between p-3.5 rounded-md text-white mb-3"
            style={{ backgroundColor: settings.accentColor }}
          >
            <div className="flex items-center gap-3">
              {settings.showLogo && (
                <div className="bg-white p-1 rounded-sm shadow-xs shrink-0">
                  <NUBLogo
                    size={Math.min(settings.logoSize, 64)}
                    customUrl={settings.customLogoUrl}
                  />
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold tracking-wider uppercase">
                  {safe(settings.headerTitle) || 'NORTHERN UNIVERSITY BANGLADESH'}
                </h1>
                <p className="text-[12px] text-white/80 tracking-wide font-medium">
                  {safe(studentInfo.department) || 'Department of Electrical & Electronic Engineering'}
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-[10px] tracking-widest uppercase text-white/70">Motto</div>
              <div className="text-xs italic font-medium">
                {safe(settings.universityMotto) || 'Knowledge for Innovation'}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Hero Lab Report Banner & Details */}
        <div className="my-auto py-2">
          <div
            onClick={isInteractivePreview ? onToggleDocumentType : undefined}
            title={isInteractivePreview ? 'Click to toggle (Assignment ⇄ Lab Report)' : undefined}
            className={`text-center mb-5 ${isInteractivePreview ? 'cursor-pointer hover:opacity-90' : ''}`}
          >
            <span
              className="inline-block px-3 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full mb-1.5"
              style={{
                backgroundColor: `${settings.accentColor}18`,
                color: settings.accentColor,
              }}
            >
              {isAssignment ? 'Course Assignment' : 'Academic Lab Report'}
            </span>
            <h2
              className="text-3xl font-extrabold uppercase tracking-tight text-stone-900"
              style={{ color: settings.accentColor }}
            >
              {displayReportTitle}
            </h2>
          </div>

          {/* Modern Experiment Card */}
          <div
            onClick={isInteractivePreview ? onOpenSubjectPicker : undefined}
            className={`rounded-lg border border-stone-200 overflow-hidden shadow-xs bg-white transition-all ${
              isInteractivePreview ? 'cursor-pointer hover:border-emerald-700' : ''
            }`}
          >
            <div
              className="px-4 py-2 flex items-center justify-between text-white text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: settings.accentColor }}
            >
              <span>{isAssignment ? 'Assignment Details' : 'Course & Experiment Information'}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-normal">
                {isAssignment ? 'No.' : 'Exp No.'} {safe(studentInfo.experimentNo) || '01'}
              </span>
            </div>

            <div className="p-4 space-y-2.5">
              <div>
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Course Code
                </div>
                <div className="text-[14px] font-mono font-bold text-stone-900">
                  {safe(studentInfo.courseCode) || '—'}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Course Title
                </div>
                <div className="text-[14px] font-semibold text-stone-900">
                  {safe(studentInfo.courseTitle) || '—'}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  {expTitleLabel}
                </div>
                <div className="text-[14px] font-normal text-stone-800 leading-snug">
                  {safe(studentInfo.experimentTitle) || '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Modern Side-by-Side Cards */}
        <div className="mt-auto space-y-3.5">
          <div className="grid grid-cols-2 gap-4">
            {/* SUBMITTED TO CARD */}
            <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
              <div
                className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                style={{ color: settings.accentColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: settings.accentColor }} />
                Submitted To
              </div>
              <div className="space-y-1 text-[13px]">
                <div className="font-bold text-stone-900 text-[14px]">
                  {safe(teacherInfo.teacherName) || 'Instructor Name'}
                </div>
                <div className="text-stone-700 font-medium">
                  {safe(teacherInfo.designation) || 'Designation'}
                </div>
                <div className="text-stone-600 text-xs">
                  {safe(teacherInfo.department) || safe(studentInfo.department)}
                </div>
                <div className="text-stone-900 font-medium pt-0.5 text-xs">
                  {safe(teacherInfo.universityName) || 'Northern University Bangladesh'}
                </div>
              </div>
            </div>

            {/* SUBMITTED BY CARD */}
            <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
              <div
                className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                style={{ color: settings.accentColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: settings.accentColor }} />
                Submitted By
              </div>
              <div className="space-y-1 text-[13px]">
                <div className="font-bold text-stone-900 text-[14px]">
                  {safe(studentInfo.studentName) || 'Student Name'}
                </div>
                <div className="text-stone-800">
                  <span className="text-stone-600 font-bold text-xs">ID:</span>{' '}
                  <span className="font-mono font-bold text-stone-900">
                    {safe(studentInfo.studentId) || '—'}
                  </span>
                </div>
                <div className="text-stone-700 text-xs">
                  <span className="text-stone-600 font-bold">Dept:</span> {safe(studentInfo.department) || safe(studentInfo.program) || 'Department of Electrical & Electronic Engineering'}
                </div>
                <div
                  onClick={isInteractivePreview ? onOpenSemesterPicker : undefined}
                  title={isInteractivePreview ? 'Click to select Semester' : undefined}
                  className={`text-stone-700 text-xs ${
                    isInteractivePreview
                      ? 'cursor-pointer hover:bg-emerald-100/70 p-0.5 rounded transition-colors group'
                      : ''
                  }`}
                >
                  <span className="text-stone-600 font-bold">Sem:</span>{' '}
                  <span className="font-bold text-stone-900 bg-stone-200/60 px-1 rounded">
                    {safe(studentInfo.semester) || '—'}
                  </span>
                  {studentInfo.session && (
                    <span className="text-stone-900 font-bold ml-1">({safe(studentInfo.session)})</span>
                  )}
                </div>
                <div className="text-stone-700 text-xs flex items-center gap-3 whitespace-nowrap">
                  <div
                    onClick={isInteractivePreview ? onOpenSectionPicker : undefined}
                    title={isInteractivePreview ? 'Click to select Section' : undefined}
                    className={`inline-flex items-center gap-1 ${
                      isInteractivePreview
                        ? 'cursor-pointer hover:bg-emerald-100/70 p-0.5 rounded transition-colors group'
                        : ''
                    }`}
                  >
                    <span className="text-stone-600 font-bold">Sec:</span>
                    <span className="font-black text-stone-950 bg-stone-200/80 px-1.5 py-0.5 rounded border border-stone-300">
                      {safe(studentInfo.section) || 'A'}
                    </span>
                  </div>
                  {isBatchVisible && (
                    <div className="inline-flex items-center gap-1 text-stone-700">
                      <span className="text-stone-600 font-bold">Batch:</span>
                      <span className="font-semibold text-stone-900">{safe(studentInfo.batch)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modern Footer Strip - Centered */}
          <div className="p-2.5 bg-stone-100 rounded-md flex flex-col items-center justify-center text-center text-xs text-stone-800 font-medium">
            <div
              onClick={isInteractivePreview ? onOpenDatePicker : undefined}
              title={isInteractivePreview ? 'Click to set Submission Date' : undefined}
              className={isInteractivePreview ? 'cursor-pointer hover:text-emerald-800' : ''}
            >
              <span className="text-stone-700 font-bold uppercase tracking-wide">Date of Submission: </span>
              <span className="font-extrabold text-stone-900 underline decoration-stone-400 underline-offset-2">
                {safe(studentInfo.submissionDate) || '—'}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  // --------------------------------------------------------------------------
  // PRESET 3: MINIMAL PROFESSIONAL
  // --------------------------------------------------------------------------
  const renderMinimalPreset = () => {
    return renderBorderContainer(
      <>
        {/* Minimal Header */}
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 uppercase">
                {safe(settings.headerTitle) || 'NORTHERN UNIVERSITY BANGLADESH'}
              </h1>
              <p className="text-xs text-stone-600 uppercase tracking-wider font-semibold mt-1">
                {safe(studentInfo.department) || 'Department of Electrical & Electronic Engineering'}
              </p>
            </div>
            {settings.showLogo && (
              <NUBLogo
                size={Math.min(settings.logoSize, 64)}
                customUrl={settings.customLogoUrl}
              />
            )}
          </div>
        </div>

        {/* Center Title and Experiment Details */}
        <div className="my-auto py-5">
          <div
            onClick={isInteractivePreview ? onToggleDocumentType : undefined}
            title={isInteractivePreview ? 'Click to toggle (Assignment ⇄ Lab Report)' : undefined}
            className={`mb-6 ${isInteractivePreview ? 'cursor-pointer hover:opacity-90' : ''}`}
          >
            <div className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-1">
              Document / {isAssignment ? 'Assignment' : 'Lab Report'}
            </div>
            <h2
              className="text-4xl font-light tracking-wide uppercase text-stone-900 border-l-4 pl-4"
              style={{ borderColor: settings.accentColor }}
            >
              {displayReportTitle}
            </h2>
          </div>

          <div className="space-y-3.5">
            <div
              onClick={isInteractivePreview ? onOpenSubjectPicker : undefined}
              title={isInteractivePreview ? 'Click to select Subject / Course' : undefined}
              className={`border-t border-stone-200 pt-2.5 ${isInteractivePreview ? 'cursor-pointer hover:bg-stone-50 p-1 rounded' : ''}`}
            >
              <div className="text-xs uppercase tracking-wider text-stone-400 font-mono">
                Course Code
              </div>
              <div className="text-base font-bold font-mono text-stone-900 mt-0.5">
                {safe(studentInfo.courseCode) || '—'}
              </div>
            </div>

            <div className="border-t border-stone-200 pt-2.5">
              <div className="text-xs uppercase tracking-wider text-stone-400 font-mono">
                Course Title
              </div>
              <div className="text-base font-semibold text-stone-900 mt-0.5">
                {safe(studentInfo.courseTitle) || '—'}
              </div>
            </div>

            <div className="border-t border-stone-200 pt-2.5">
              <div className="text-xs uppercase tracking-wider text-stone-400 font-mono">
                {expNoLabel}
              </div>
              <div className="text-base font-normal text-stone-800 mt-0.5">
                {safe(studentInfo.experimentNo) || '01'}
              </div>
            </div>

            <div className="border-t border-stone-200 pt-2.5">
              <div className="text-xs uppercase tracking-wider text-stone-400 font-mono">
                {expTitleLabel}
              </div>
              <div className="text-base font-normal text-stone-800 mt-0.5">
                {safe(studentInfo.experimentTitle) || '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Side-by-Side Minimal Table */}
        <div className="mt-auto border-t-2 border-stone-900 pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-8">
            {/* SUBMITTED TO */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-2">
                Submitted To
              </div>
              <div className="space-y-0.5 text-sm">
                <div className="font-bold text-stone-900">
                  {safe(teacherInfo.teacherName) || 'Faculty Name'}
                </div>
                <div className="text-stone-600 text-xs">{safe(teacherInfo.designation)}</div>
                <div className="text-stone-500 text-xs">{safe(teacherInfo.department)}</div>
                <div className="text-stone-800 text-xs font-medium">
                  {safe(teacherInfo.universityName)}
                </div>
              </div>
            </div>

            {/* SUBMITTED BY */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-2">
                Submitted By
              </div>
              <div className="space-y-1 text-sm">
                <div className="font-bold text-stone-900">
                  {safe(studentInfo.studentName) || 'Student Name'}
                </div>
                <div className="text-stone-700 text-xs font-mono">
                  ID: {safe(studentInfo.studentId) || '—'}
                </div>
                <div className="text-stone-700 text-xs">
                  <span className="font-medium text-stone-500">Department:</span>{' '}
                  {safe(studentInfo.department) || safe(studentInfo.program) || 'Department of Electrical & Electronic Engineering'}
                </div>
                <div
                  onClick={isInteractivePreview ? onOpenSemesterPicker : undefined}
                  title={isInteractivePreview ? 'Click to select Semester' : undefined}
                  className={`text-stone-700 text-xs font-medium ${isInteractivePreview ? 'cursor-pointer hover:bg-emerald-100/70 p-0.5 rounded' : ''}`}
                >
                  <span className="font-medium text-stone-500">Semester:</span>{' '}
                  <span className="font-bold text-stone-900 bg-stone-200/60 px-1 rounded">
                    {safe(studentInfo.semester) || '1st Semester'}
                  </span>
                  {studentInfo.session && ` (${safe(studentInfo.session)})`}
                </div>
                <div className="text-stone-700 text-xs flex items-center gap-3 whitespace-nowrap">
                  <div
                    onClick={isInteractivePreview ? onOpenSectionPicker : undefined}
                    title={isInteractivePreview ? 'Click to select Section' : undefined}
                    className={`inline-flex items-center gap-1 ${isInteractivePreview ? 'cursor-pointer hover:bg-emerald-100/70 p-0.5 rounded' : ''}`}
                  >
                    <span className="font-medium text-stone-500">Sec:</span>
                    <span className="font-black text-stone-950 bg-stone-200/80 px-1 py-0.2 rounded">
                      {safe(studentInfo.section) || 'A'}
                    </span>
                  </div>
                  {isBatchVisible && (
                    <div className="inline-flex items-center gap-1 text-stone-700">
                      <span className="font-medium text-stone-500">Batch:</span>
                      <span className="font-semibold text-stone-900">{safe(studentInfo.batch)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Centered Minimal Bottom Submission Date */}
          <div className="pt-3 border-t border-stone-100 flex flex-col items-center justify-center text-center text-xs text-stone-700">
            <div
              onClick={isInteractivePreview ? onOpenDatePicker : undefined}
              className={isInteractivePreview ? 'cursor-pointer hover:underline text-stone-900' : ''}
            >
              <span className="font-bold text-stone-700 uppercase tracking-wide">Date of Submission: </span>
              <span className="text-stone-900 font-bold underline decoration-stone-300 underline-offset-2">
                {safe(studentInfo.submissionDate)}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  // --------------------------------------------------------------------------
  // PRESET 4: OFFICIAL INSTITUTIONAL
  // --------------------------------------------------------------------------
  const renderInstitutionalPreset = () => {
    return renderBorderContainer(
      <>
        {/* Institutional Formal Header */}
        <div className="text-center space-y-1 pb-3 border-b-2 border-stone-800">
          {settings.showLogo && (
            <div className="flex justify-center mb-1">
              <NUBLogo
                size={settings.logoSize}
                customUrl={settings.customLogoUrl}
              />
            </div>
          )}
          <h1
            className="text-2xl font-extrabold uppercase tracking-widest"
            style={{ color: settings.accentColor }}
          >
            {safe(settings.headerTitle) || 'NORTHERN UNIVERSITY BANGLADESH'}
          </h1>
          <p className="text-xs font-bold uppercase tracking-wider text-stone-800">
            {safe(studentInfo.department) || 'Department of Electrical & Electronic Engineering'}
          </p>
          {settings.showUniversityMotto && (
            <p className="text-[11px] italic text-stone-500">
              "{safe(settings.universityMotto) || 'Knowledge for Innovation'}"
            </p>
          )}
        </div>

        {/* LAB REPORT / ASSIGNMENT BOX */}
        <div className="my-auto py-2">
          <div
            onClick={isInteractivePreview ? onToggleDocumentType : undefined}
            title={isInteractivePreview ? 'Click to toggle (Assignment ⇄ Lab Report)' : undefined}
            className={`text-center my-2.5 ${isInteractivePreview ? 'cursor-pointer hover:opacity-90' : ''}`}
          >
            <div
              className="inline-block px-8 py-1.5 border-2 font-black text-2xl uppercase tracking-widest"
              style={{
                borderColor: settings.accentColor,
                color: settings.accentColor,
                backgroundColor: `${settings.accentColor}08`,
              }}
            >
              {displayReportTitle}
            </div>
          </div>

          {/* Official Course / Experiment Table */}
          <div
            onClick={isInteractivePreview ? onOpenSubjectPicker : undefined}
            title={isInteractivePreview ? 'Click to select Subject / Course' : undefined}
            className={`w-full border border-stone-400 text-xs my-2.5 ${isInteractivePreview ? 'cursor-pointer hover:border-emerald-700' : ''}`}
          >
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-stone-300">
                  <td className="w-40 p-2 font-bold bg-stone-100 uppercase text-stone-800 border-r border-stone-300">
                    Course Code
                  </td>
                  <td className="p-2 font-bold font-mono text-stone-900">
                    {safe(studentInfo.courseCode) || '—'}
                  </td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="w-40 p-2 font-bold bg-stone-100 uppercase text-stone-800 border-r border-stone-300">
                    Course Title
                  </td>
                  <td className="p-2 font-semibold text-stone-900">
                    {safe(studentInfo.courseTitle) || '—'}
                  </td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="w-40 p-2 font-bold bg-stone-100 uppercase text-stone-800 border-r border-stone-300">
                    {expNoLabel}
                  </td>
                  <td className="p-2 font-normal text-stone-900">
                    {safe(studentInfo.experimentNo) || '—'}
                  </td>
                </tr>
                <tr>
                  <td className="w-40 p-2 font-bold bg-stone-100 uppercase text-stone-800 border-r border-stone-300">
                    {expTitleLabel}
                  </td>
                  <td className="p-2 font-normal text-stone-900 leading-snug">
                    {safe(studentInfo.experimentTitle) || '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section with Dual Table & Optional Teacher Grading Rubric */}
        <div className="mt-auto space-y-2.5">
          {/* Dual Submission Tables */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* SUBMITTED TO */}
            <div className="border border-stone-400">
              <div
                className="p-1.5 font-bold uppercase tracking-wider text-white text-center text-[11px]"
                style={{ backgroundColor: settings.accentColor }}
              >
                Submitted To
              </div>
              <div className="p-2.5 space-y-1">
                <div className="font-bold text-stone-900 text-sm">
                  {safe(teacherInfo.teacherName) || 'Instructor Name'}
                </div>
                <div className="text-stone-700">{safe(teacherInfo.designation)}</div>
                <div className="text-stone-600">{safe(teacherInfo.department)}</div>
                <div className="text-stone-900 font-semibold text-[11px]">
                  {safe(teacherInfo.universityName)}
                </div>
              </div>
            </div>

            {/* SUBMITTED BY */}
            <div className="border border-stone-400">
              <div
                className="p-1.5 font-bold uppercase tracking-wider text-white text-center text-[11px]"
                style={{ backgroundColor: settings.accentColor }}
              >
                Submitted By
              </div>
              <div className="p-2.5 space-y-1">
                <div className="font-bold text-stone-900 text-sm">
                  {safe(studentInfo.studentName) || 'Student Name'}
                </div>
                <div>
                  <span className="font-bold text-stone-700">Student ID:</span>{' '}
                  <span className="font-bold font-mono text-stone-900">
                    {safe(studentInfo.studentId) || '—'}
                  </span>
                </div>
                <div className="text-stone-700">
                  <span className="font-bold text-stone-700">Department:</span>{' '}
                  {safe(studentInfo.department) || safe(studentInfo.program) || 'Department of Electrical & Electronic Engineering'}
                </div>
                <div
                  onClick={isInteractivePreview ? onOpenSemesterPicker : undefined}
                  title={isInteractivePreview ? 'Click to select Semester' : undefined}
                  className={`text-stone-700 ${isInteractivePreview ? 'cursor-pointer hover:bg-emerald-100/70 p-0.5 rounded' : ''}`}
                >
                  <span className="font-bold text-stone-700">Semester:</span>{' '}
                  <span className="font-bold text-stone-900 bg-stone-200/60 px-1 rounded">
                    {safe(studentInfo.semester) || '1st Semester'}
                  </span>
                  {studentInfo.session && <span className="ml-1 text-stone-800">({safe(studentInfo.session)})</span>}
                </div>
                <div className="text-stone-700 flex items-center gap-3 whitespace-nowrap">
                  <div
                    onClick={isInteractivePreview ? onOpenSectionPicker : undefined}
                    title={isInteractivePreview ? 'Click to select Section' : undefined}
                    className={`inline-flex items-center gap-1 ${
                      isInteractivePreview ? 'cursor-pointer hover:bg-emerald-100/70 p-0.5 rounded' : ''
                    }`}
                  >
                    <span className="font-bold text-stone-700">Section:</span>{' '}
                    <span className="font-black text-stone-950 bg-stone-200/80 px-1.5 py-0.2 rounded border border-stone-300">
                      {safe(studentInfo.section) || 'A'}
                    </span>
                  </div>

                  {isBatchVisible && (
                    <div className="inline-flex items-center gap-1 text-stone-700">
                      <span className="font-bold text-stone-700">Batch:</span>{' '}
                      <span className="text-stone-900 font-semibold">{safe(studentInfo.batch)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Evaluation / Grading Table for Lab Instructors */}
          {settings.showGradingTable && (
            <div className="border border-stone-400 text-[11px] mt-1.5">
              <div className="bg-stone-100 p-1 font-bold uppercase text-stone-700 text-center border-b border-stone-300">
                Evaluation & Assessment (For Teacher's Use Only)
              </div>
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-300 text-[10px] font-bold text-stone-600">
                    <th className="p-1 border-r border-stone-300">Lab Performance</th>
                    <th className="p-1 border-r border-stone-300">Report Quality</th>
                    <th className="p-1 border-r border-stone-300">Viva Voce</th>
                    <th className="p-1 border-r border-stone-300">Total Marks</th>
                    <th className="p-1">Signature & Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="h-9">
                    <td className="border-r border-stone-300 p-1 font-mono text-stone-400">/ 10</td>
                    <td className="border-r border-stone-300 p-1 font-mono text-stone-400">/ 05</td>
                    <td className="border-r border-stone-300 p-1 font-mono text-stone-400">/ 05</td>
                    <td className="border-r border-stone-300 p-1 font-mono text-stone-400 font-bold">/ 20</td>
                    <td className="p-1 text-stone-400 text-[9px] italic">Signature & Date</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Footer Line - Centered */}
          <div className="pt-2 flex flex-col items-center justify-center text-center text-xs text-stone-800 border-t border-stone-300 font-medium">
            <div
              onClick={isInteractivePreview ? onOpenDatePicker : undefined}
              title={isInteractivePreview ? 'Click to set Submission Date' : undefined}
              className={isInteractivePreview ? 'cursor-pointer hover:text-emerald-800' : ''}
            >
              <span className="font-bold text-stone-700 uppercase tracking-wide">Date of Submission: </span>
              <span className="font-extrabold text-stone-950 underline decoration-stone-400 underline-offset-2">
                {safe(studentInfo.submissionDate)}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render appropriate preset
  const renderContent = () => {
    switch (settings.preset) {
      case 'modern':
        return renderModernPreset();
      case 'minimal':
        return renderMinimalPreset();
      case 'institutional':
        return renderInstitutionalPreset();
      case 'classic':
      default:
        return renderClassicPreset();
    }
  };

  return (
    <div
      id={id}
      className={`a4-page-root bg-white text-stone-900 relative shadow-2xl transition-all duration-150 overflow-hidden select-text ${className}`}
      style={{
        ...getFontFamilyStyle(),
        width: '794px',
        height: '1123px',
        minWidth: '794px',
        minHeight: '1123px',
        maxWidth: '794px',
        maxHeight: '1123px',
        boxSizing: 'border-box',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: '0 0',
        ...style,
      }}
    >
      {/* Background Watermark (optional) */}
      {settings.showWatermark && (
        <NUBWatermark
          opacity={settings.watermarkOpacity}
          customUrl={settings.customLogoUrl}
        />
      )}

      {/* Main Page Layout */}
      {renderContent()}
    </div>
  );
};
