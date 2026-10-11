export type PresetType = 'classic' | 'modern' | 'minimal' | 'institutional';

export type DocumentType = 'lab_report' | 'assignment';

export type FontFamily = 'serif' | 'sans' | 'garamond' | 'cinzel' | 'merriweather';

export type BorderStyle = 'double' | 'single' | 'ornate' | 'hairline' | 'none';

export type PageMargin = 'compact' | 'normal' | 'generous';

export type LogoPosition = 'center' | 'left' | 'banner';

export interface StudentInfo {
  studentName: string;
  studentId: string;
  department: string;
  program: string;
  semester: string;
  year?: string; // e.g. "2026"
  season?: 'Spring' | 'Summer' | 'Fall' | string; // e.g. "Spring"
  session?: string; // e.g. "Spring 2026"
  section: string; // e.g. "A"
  batch?: string;
  showBatch?: boolean; // Whether to display Batch on cover page
  group?: string;
  courseCode: string;
  courseTitle: string;
  experimentNo: string;
  experimentTitle: string;
  submissionDate: string;
  experimentDate?: string;
}

export interface TeacherInfo {
  teacherName: string;
  designation: string;
  department: string;
  universityName: string;
  campus?: string;
}

export interface CoverPageDesignSettings {
  documentType: DocumentType; // 'lab_report' | 'assignment'
  preset: PresetType;
  accentColor: string;
  fontFamily: FontFamily;
  fontSizeScale: 'compact' | 'normal' | 'large';
  borderStyle: BorderStyle;
  borderThickness: number; // 1 to 6 px
  pageMargin: PageMargin;
  showLogo: boolean;
  logoSize: number; // in px (60 - 160)
  logoPosition: LogoPosition;
  showWatermark: boolean;
  watermarkOpacity: number; // 0.02 - 0.15
  customLogoUrl: string | null;
  showGradingTable: boolean;
  showUniversityMotto: boolean;
  universityMotto: string;
  headerTitle: string; // e.g. "NORTHERN UNIVERSITY BANGLADESH"
  reportTitle: string; // e.g. "LAB REPORT" or "ASSIGNMENT"
  tableStyle: 'side-by-side' | 'stacked' | 'table-grid';
}

export interface SavedDraft {
  id: string;
  name: string;
  updatedAt: string;
  studentInfo: StudentInfo;
  teacherInfo: TeacherInfo;
  settings: CoverPageDesignSettings;
}
