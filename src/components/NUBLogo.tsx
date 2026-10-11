import React from 'react';

interface NUBLogoProps {
  size?: number;
  customUrl?: string | null;
  className?: string;
  accentColor?: string;
}

export const NUBLogo: React.FC<NUBLogoProps> = ({
  size = 96,
  customUrl,
  className = '',
}) => {
  if (customUrl) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src={customUrl}
          alt="Northern University Bangladesh Logo"
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  // Exact vector reproduction of the official Northern University Bangladesh circular seal
  // Matches uploaded official NUB logo:
  // - Navy outer text: "NORTHERN UNIVERSITY"
  // - Red side dots
  // - Green bottom text: "BANGLADESH"
  // - Cyan inner ring
  // - Center iconic tri-flame / feather motif in deep navy, royal blue, and lavender
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label="Northern University Bangladesh Official Emblem"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs select-none"
      >
        {/* Outer White Background */}
        <circle cx="100" cy="100" r="98" fill="#FFFFFF" />

        {/* Outermost Navy Border */}
        <circle
          cx="100"
          cy="100"
          r="96"
          fill="none"
          stroke="#1E2B7B"
          strokeWidth="3.5"
        />

        {/* Outer Circular Ring text track */}
        <defs>
          {/* Top text path for NORTHERN UNIVERSITY */}
          <path
            id="nubTextPathTop"
            d="M 22 100 A 78 78 0 0 1 178 100"
            fill="none"
          />
          {/* Bottom text path for BANGLADESH */}
          <path
            id="nubTextPathBottom"
            d="M 174 100 A 74 74 0 0 1 26 100"
            fill="none"
          />
        </defs>

        {/* Top Arc Text: NORTHERN UNIVERSITY in deep navy */}
        <text
          fill="#1E2B7B"
          fontSize="15"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1.2"
        >
          <textPath
            href="#nubTextPathTop"
            startOffset="50%"
            textAnchor="middle"
          >
            NORTHERN UNIVERSITY
          </textPath>
        </text>

        {/* Left and Right Red Circular Separator Dots */}
        <circle cx="24" cy="102" r="5.5" fill="#DC2626" />
        <circle cx="176" cy="102" r="5.5" fill="#DC2626" />

        {/* Bottom Arc Text: BANGLADESH in vivid Bangladesh Green */}
        <text
          fill="#008751"
          fontSize="14.5"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2.5"
        >
          <textPath
            href="#nubTextPathBottom"
            startOffset="50%"
            textAnchor="middle"
          >
            BANGLADESH
          </textPath>
        </text>

        {/* Inner Cyan / Sky Blue Ring */}
        <circle
          cx="100"
          cy="100"
          r="62"
          fill="#FFFFFF"
          stroke="#0EA5E9"
          strokeWidth="2"
        />

        {/* Official Northern University Bangladesh Tri-flame / Feather Motif */}
        {/* Main Left Petal: Deep Navy Blue (#1E2B7B) */}
        <path
          d="M 98 52
             C 96 66, 88 84, 80 102
             C 72 120, 74 136, 82 147
             C 86 153, 93 156, 96 156
             C 89 152, 85 142, 86 130
             C 88 116, 96 98, 102 82
             C 106 72, 104 60, 98 52 Z"
          fill="#1E2B7B"
        />

        {/* Center Petal: Royal Blue (#3B82F6 / #2563EB) */}
        <path
          d="M 107 92
             C 104 104, 98 118, 93 130
             C 90 138, 92 146, 97 151
             C 93 148, 92 140, 94 132
             C 97 122, 105 108, 109 98
             C 110 95, 109 93, 107 92 Z"
          fill="#2563EB"
        />

        {/* Right Petal: Soft Lavender / Periwinkle (#818CF8) */}
        <path
          d="M 115 116
             C 112 125, 108 135, 104 142
             C 102 147, 104 150, 107 151
             C 104 149, 103 144, 105 138
             C 108 130, 113 122, 116 117
             C 116 116, 115 115, 115 116 Z"
          fill="#818CF8"
        />
      </svg>
    </div>
  );
};

export const NUBWatermark: React.FC<{
  opacity?: number;
  customUrl?: string | null;
  accentColor?: string;
}> = ({ opacity = 0.04, customUrl }) => {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
      style={{ opacity }}
    >
      <div className="w-[360px] h-[360px] transform -rotate-6">
        <NUBLogo size={360} customUrl={customUrl} />
      </div>
    </div>
  );
};
