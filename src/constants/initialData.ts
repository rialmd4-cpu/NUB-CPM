import { CoverPageDesignSettings, StudentInfo, TeacherInfo, SavedDraft } from '../types';

export interface SubjectOption {
  code: string;
  title: string;
  department: string;
  program: string;
  defaultExperiments: string[];
}

export const EEE_SUBJECTS: SubjectOption[] = [
  {
    code: 'EEE-112',
    title: 'Electrical Circuits I Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Verification of Ohm\'s Law and Kirchhoff\'s Current & Voltage Laws (KCL & KVL)',
      'Verification of Superposition Theorem and Thevenin\'s Theorem in DC Circuits',
      'Maximum Power Transfer Theorem Verification in Resistive Networks',
      'Study of Mesh and Nodal Analysis in DC Resistive Circuits',
    ],
  },
  {
    code: 'EEE-122',
    title: 'Electrical Circuits II Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Study of R-L-C Series and Parallel Resonant Circuits and Q-Factor',
      'Measurement of Active, Reactive Power and Power Factor in Single-Phase AC Circuits',
      'Two-Wattmeter Method for Three-Phase Balanced and Unbalanced Power Measurement',
      'Determination of Phase Sequence and Neutral Current in 3-Phase 4-Wire System',
    ],
  },
  {
    code: 'EEE-212',
    title: 'Electronic Devices and Circuits I Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Study of P-N Junction Diode V-I Characteristics and Rectifier Circuits',
      'Input and Output Characteristics of BJT in Common Emitter (CE) Configuration',
      'Zener Diode as a Shunt Voltage Regulator and Line/Load Regulation Characteristics',
      'JFET Drain and Transfer Characteristics and Pinch-off Voltage Determination',
    ],
  },
  {
    code: 'EEE-222',
    title: 'Electronic Devices and Circuits II Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Frequency Response Analysis and Gain-Bandwidth Product of CE BJT Amplifier',
      'Inverting, Non-Inverting, and Summing Operational Amplifier (Op-Amp) Circuits',
      'Design of Active Low-Pass and High-Pass Butterworth Filters using Op-Amp',
      'Study of RC Phase Shift and Wien Bridge Sinusoidal Oscillators',
    ],
  },
  {
    code: 'EEE-224',
    title: 'Digital Logic Design Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Truth Table Verification of Basic and Universal Logic Gates (NAND/NOR)',
      'Design and Implementation of Half Adder, Full Adder, and Subtractor Circuits',
      'Design of 4-to-1 Multiplexer and 1-to-4 Demultiplexer using Logic Gates',
      'Implementation of Synchronous and Asynchronous Modulo-10 Decade Counter',
    ],
  },
  {
    code: 'EEE-312',
    title: 'Signals and Linear Systems Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Generation and Transformation of Continuous and Discrete Time Signals in MATLAB',
      'Convolution of Two Discrete-Time Signals and System Response Calculation',
      'Fourier Transform and Spectrum Analysis of Periodic and Aperiodic Signals',
      'Pole-Zero Plot and Stability Analysis of LTI Systems using Z-Transform',
    ],
  },
  {
    code: 'EEE-314',
    title: 'Electrical Machines I Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Open Circuit and Short Circuit Tests on Single Phase Transformer for Efficiency',
      'Determination of Voltage Regulation and Equivalent Circuit of Transformer',
      'Speed Control of DC Shunt Motor by Armature Voltage and Field Flux Methods',
      'Brake Test on DC Series Motor to Determine Mechanical Output and Efficiency',
    ],
  },
  {
    code: 'EEE-322',
    title: 'Electrical Machines II Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Determination of V-Curve and Inverted V-Curve of 3-Phase Synchronous Motor',
      'No-Load and Blocked-Rotor Tests of Three-Phase Squirrel Cage Induction Motor',
      'Synchronization of 3-Phase Alternator with Infinite Bus using Dark Lamp Method',
      'Speed Control and Torque-Slip Characteristics of Three-Phase Induction Motor',
    ],
  },
  {
    code: 'EEE-324',
    title: 'Microprocessor & Microcontroller Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Arithmetic and Logical Data Manipulation using 8086 Assembly Language',
      'Interfacing 16x2 LCD and 4x4 Matrix Keypad with ATmega32 / Arduino',
      'Analog to Digital Conversion (ADC) and Temperature Sensor Interfacing',
      'PWM Generation for DC Motor Speed and Direction Control with H-Bridge',
    ],
  },
  {
    code: 'EEE-412',
    title: 'Communication Engineering Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Generation and Detection of Amplitude Modulation (AM) and Modulation Index',
      'Frequency Modulation (FM) and Demodulation using Phase-Locked Loop (PLL)',
      'Pulse Code Modulation (PCM) and Time Division Multiplexing (TDM) Analysis',
      'Study of Digital Modulation Techniques: ASK, FSK, and BPSK Signals',
    ],
  },
  {
    code: 'EEE-414',
    title: 'Power System Analysis Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Gauss-Seidel and Newton-Raphson Load Flow Analysis of 5-Bus Power System',
      'Symmetrical 3-Phase Fault Analysis on Power Transmission Network',
      'Single Line-to-Ground (SLG) Unsymmetrical Fault Simulation and Sequence Currents',
      'Economic Load Dispatch with Transmission Losses using MATLAB Simulation',
    ],
  },
  {
    code: 'EEE-422',
    title: 'Control Systems Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Time Domain Transient Response Analysis of Second Order Control Systems',
      'Root Locus Technique for Stability Analysis and Gain Margin Determination',
      'Bode Plot and Frequency Response Characteristics of Closed-Loop Systems',
      'Design and Tuning of PID Controller for DC Motor Position Servomechanism',
    ],
  },
  {
    code: 'EEE-424',
    title: 'Digital Signal Processing Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Implementation of Discrete Fourier Transform (DFT) and Fast Fourier Transform (FFT)',
      'Design of Finite Impulse Response (FIR) Filter using Rectangular and Hamming Windows',
      'Design of Infinite Impulse Response (IIR) Chebyshev and Butterworth Filters',
      'Real-Time Audio Signal Filtering and Noise Cancellation in MATLAB',
    ],
  },
  {
    code: 'EEE-434',
    title: 'Power Electronics Laboratory',
    department: 'Department of Electrical & Electronic Engineering',
    program: 'B.Sc. in EEE',
    defaultExperiments: [
      'Characteristics of Silicon Controlled Rectifier (SCR) and Gate Triggering',
      'Single-Phase Half-Wave and Full-Wave Controlled Rectifier with RL Load',
      'DC-to-DC Buck and Boost Converter Design and Output Ripple Analysis',
      'Single-Phase Full-Bridge Inverter using Sinusoidal Pulse Width Modulation (SPWM)',
    ],
  },
];

export const OTHER_SUBJECTS: SubjectOption[] = [
  {
    code: 'CSE-312',
    title: 'Database Management Systems Laboratory',
    department: 'Department of Computer Science & Engineering',
    program: 'B.Sc. in CSE',
    defaultExperiments: [
      'Design & Implementation of Relational Schema with Complex SQL Queries & Triggers',
      'Implementation of B-Tree and Hash Indexing Techniques in PostgreSQL',
      'Database Normalization up to BCNF and PL/SQL Stored Procedures',
    ],
  },
  {
    code: 'CSE-222',
    title: 'Data Structures and Algorithms Laboratory',
    department: 'Department of Computer Science & Engineering',
    program: 'B.Sc. in CSE',
    defaultExperiments: [
      'Implementation of Binary Search Tree, AVL Tree, and Traversal Algorithms',
      'Dijkstra\'s Shortest Path and Kruskal\'s Minimum Spanning Tree Algorithms',
    ],
  },
  {
    code: 'TEX-212',
    title: 'Yarn Manufacturing Laboratory I',
    department: 'Department of Textile Engineering',
    program: 'B.Sc. in Textile Engineering',
    defaultExperiments: [
      'Study of Blowroom Line Machinery and Cleaning Efficiency Calculation',
      'Carding Machine Gearing Diagram and Production Speed Calculation',
    ],
  },
  {
    code: 'PHR-202',
    title: 'Pharmaceutical Microbiology Laboratory',
    department: 'Department of Pharmacy',
    program: 'Bachelor of Pharmacy (B.Pharm)',
    defaultExperiments: [
      'Gram Staining Technique for Bacterial Differentiation and Microscopic Study',
      'Evaluation of Antimicrobial Activity of Antibiotics by Disc Diffusion Method',
    ],
  },
];

export const ALL_SUBJECTS = [...EEE_SUBJECTS, ...OTHER_SUBJECTS];

export const SECTION_OPTIONS = ['A', 'B', 'C', 'D', 'E'];

// 12 Semesters as requested by user
export const SEMESTER_OPTIONS = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
  '9th Semester',
  '10th Semester',
  '11th Semester',
  '12th Semester',
];

// Separate Seasons: Spring, Summer, Fall
export const SEASON_OPTIONS = ['Spring', 'Summer', 'Fall'];

// Separate Years: 2026, 2025, 2024, etc.
export const YEAR_OPTIONS = ['2026', '2025', '2024', '2027', '2028'];

// Separate academic sessions/terms as requested by user
export const SESSION_OPTIONS = [
  'Spring 2026',
  'Summer 2026',
  'Fall 2026',
  'Spring 2025',
  'Summer 2025',
  'Fall 2025',
];

// Default is now strictly EEE with MD RIAL ISLAM as requested by the user
export const DEFAULT_STUDENT_INFO: StudentInfo = {
  studentName: 'MD RIAL ISLAM',
  studentId: '44250102262',
  department: 'Department of Electrical & Electronic Engineering',
  program: 'B.Sc. in EEE',
  semester: '4th Semester',
  season: 'Spring',
  year: '2026',
  session: 'Spring 2026',
  section: 'A',
  batch: '54th Batch',
  showBatch: true,
  courseCode: 'EEE-212',
  courseTitle: 'Electronic Devices and Circuits I Laboratory',
  experimentNo: '01',
  experimentTitle: 'Study of P-N Junction Diode V-I Characteristics and Rectifier Circuits',
  submissionDate: 'October 15, 2026',
  experimentDate: 'October 08, 2026',
};

export const DEFAULT_TEACHER_INFO: TeacherInfo = {
  teacherName: 'Engr. Farhana Yesmin',
  designation: 'Assistant Professor',
  department: 'Department of Electrical & Electronic Engineering',
  universityName: 'Northern University Bangladesh',
  campus: 'Permanent Campus, Ashkona, Dhaka-1230',
};

export const DEFAULT_DESIGN_SETTINGS: CoverPageDesignSettings = {
  documentType: 'lab_report',
  preset: 'classic',
  accentColor: '#1E2B7B', // Official NUB Deep Navy Blue to match official circular seal
  fontFamily: 'garamond',
  fontSizeScale: 'normal',
  borderStyle: 'double',
  borderThickness: 3,
  pageMargin: 'normal',
  showLogo: true,
  logoSize: 96,
  logoPosition: 'center',
  showWatermark: true,
  watermarkOpacity: 0.05,
  customLogoUrl: null,
  showGradingTable: false,
  showUniversityMotto: true,
  universityMotto: 'Knowledge for Innovation',
  headerTitle: 'NORTHERN UNIVERSITY BANGLADESH',
  reportTitle: 'LAB REPORT',
  tableStyle: 'side-by-side',
};

export const POPULAR_DEPARTMENTS = [
  'Department of Electrical & Electronic Engineering',
  'Department of Computer Science & Engineering',
  'Department of Textile Engineering',
  'Department of Pharmacy',
  'Department of Business Administration',
  'Department of English',
  'Department of Law',
  'Department of Civil Engineering',
];

export const POPULAR_PROGRAMS = [
  'B.Sc. in EEE',
  'B.Sc. in CSE',
  'B.Sc. in Textile Engineering',
  'Bachelor of Pharmacy (B.Pharm)',
  'Bachelor of Business Administration (BBA)',
  'B.A. (Hons.) in English',
  'LL.B. (Hons.)',
  'B.Sc. in Civil Engineering',
];

export const COLOR_PALETTES = [
  { name: 'NUB Navy Seal', hex: '#1E2B7B' },
  { name: 'NUB Emerald Green', hex: '#008751' },
  { name: 'Academic Dark Navy', hex: '#0F172A' },
  { name: 'Royal Crimson', hex: '#881337' },
  { name: 'Classic Charcoal', hex: '#1C1917' },
  { name: 'Imperial Bronze', hex: '#78350F' },
];

export const SAMPLE_DRAFTS: SavedDraft[] = [
  {
    id: 'sample-eee-devices',
    name: 'EEE-212: Electronics Devices Lab 1',
    updatedAt: '2026-10-08T10:00:00Z',
    studentInfo: DEFAULT_STUDENT_INFO,
    teacherInfo: DEFAULT_TEACHER_INFO,
    settings: DEFAULT_DESIGN_SETTINGS,
  },
  {
    id: 'sample-eee-circuits',
    name: 'EEE-112: Electrical Circuits Lab',
    updatedAt: '2026-10-07T14:30:00Z',
    studentInfo: {
      studentName: 'Nusrat Jahan Mim',
      studentId: '22010142',
      department: 'Department of Electrical & Electronic Engineering',
      program: 'B.Sc. in EEE',
      semester: '2nd Semester',
      section: 'B',
      batch: '56th Batch',
      courseCode: 'EEE-112',
      courseTitle: 'Electrical Circuits I Laboratory',
      experimentNo: '02',
      experimentTitle: 'Verification of Superposition Theorem and Thevenin\'s Theorem in DC Circuits',
      submissionDate: 'October 18, 2026',
      experimentDate: 'October 11, 2026',
    },
    teacherInfo: {
      teacherName: 'Dr. Md. Nasir Uddin',
      designation: 'Associate Professor & Head',
      department: 'Department of Electrical & Electronic Engineering',
      universityName: 'Northern University Bangladesh',
      campus: 'Ashkona, Dhaka-1230',
    },
    settings: {
      ...DEFAULT_DESIGN_SETTINGS,
      preset: 'modern',
      accentColor: '#1E2B7B',
      fontFamily: 'sans',
      borderStyle: 'single',
    },
  },
  {
    id: 'sample-eee-machines',
    name: 'EEE-314: Electrical Machines Lab',
    updatedAt: '2026-10-06T09:15:00Z',
    studentInfo: {
      studentName: 'Sabbir Rahman Shuvo',
      studentId: '20030019',
      department: 'Department of Electrical & Electronic Engineering',
      program: 'B.Sc. in EEE',
      semester: '6th Semester',
      section: 'C',
      batch: '52nd Batch',
      courseCode: 'EEE-314',
      courseTitle: 'Electrical Machines I Laboratory',
      experimentNo: '03',
      experimentTitle: 'Open Circuit and Short Circuit Tests on Single Phase Transformer',
      submissionDate: 'October 20, 2026',
      experimentDate: 'October 14, 2026',
    },
    teacherInfo: {
      teacherName: 'Prof. Dr. M. A. Rashid',
      designation: 'Professor & Dean',
      department: 'Department of Electrical & Electronic Engineering',
      universityName: 'Northern University Bangladesh',
      campus: 'Permanent Campus, Ashkona, Dhaka',
    },
    settings: {
      ...DEFAULT_DESIGN_SETTINGS,
      preset: 'institutional',
      accentColor: '#008751',
      fontFamily: 'serif',
      showGradingTable: true,
      borderStyle: 'ornate',
    },
  },
];
