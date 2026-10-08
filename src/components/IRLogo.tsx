import React from 'react';

interface IRLogoProps {
  className?: string;
  size?: number;
}

export const IRLogo: React.FC<IRLogoProps> = ({ className = 'w-10 h-10', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Indian Railways Crest"
    >
      {/* Outer Golden Border */}
      <circle cx="50" cy="50" r="48" fill="#0B2F52" stroke="#E5A93C" strokeWidth="3" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#FDE68A" strokeWidth="1" strokeDasharray="3 1.5" />

      {/* Decorative Outer Beaded Track Ring */}
      <circle cx="50" cy="50" r="39" fill="#0E3860" stroke="#E5A93C" strokeWidth="1.5" />

      {/* Center White / Cream Disc */}
      <circle cx="50" cy="50" r="28" fill="#F8FAFC" stroke="#0B2F52" strokeWidth="2" />

      {/* 16-Spoke Chakra Wheel */}
      <circle cx="50" cy="50" r="26" fill="none" stroke="#1E3A8A" strokeWidth="1" />
      <circle cx="50" cy="50" r="5" fill="#1E3A8A" />

      {/* Spokes */}
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={50 + 24 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 24 * Math.sin((angle * Math.PI) / 180)}
          stroke="#1E3A8A"
          strokeWidth="0.9"
        />
      ))}

      {/* Stylized Steam Locomotive Center Silhouette */}
      <path
        d="M39 53 L39 46 Q39 44 42 44 L45 44 L45 40 Q45 39 46 39 L49 39 L49 44 L56 44 L56 38 L59 38 L59 44 L61 44 Q63 44 63 46 L63 53 Z"
        fill="#B91C1C"
        stroke="#7F1D1D"
        strokeWidth="0.5"
      />
      {/* Cowcatcher / Pilot */}
      <path d="M37 54 L65 54 L63 56 L39 56 Z" fill="#D97706" />

      {/* Running Wheels */}
      <circle cx="43" cy="54" r="3.2" fill="#1E293B" stroke="#FDE68A" strokeWidth="0.6" />
      <circle cx="50" cy="54" r="3.2" fill="#1E293B" stroke="#FDE68A" strokeWidth="0.6" />
      <circle cx="57" cy="54" r="3.2" fill="#1E293B" stroke="#FDE68A" strokeWidth="0.6" />

      {/* Ashoka Star / Emblem Top Symbol */}
      <polygon points="50,15 52,20 57,20 53,23 55,28 50,25 45,28 47,23 43,20 48,20" fill="#FDE68A" />

      {/* Star Left & Right */}
      <polygon points="17,50 19,53 23,53 20,55 21,59 17,57 13,59 14,55 11,53 15,53" fill="#FDE68A" transform="scale(0.8) translate(6, 12)" />
      <polygon points="83,50 85,53 89,53 86,55 87,59 83,57 79,59 80,55 77,53 81,53" fill="#FDE68A" transform="scale(0.8) translate(20, 12)" />

      {/* Arc Text: INDIAN RAILWAYS (Top Arc) */}
      <path id="text-top-arc" d="M 20,50 A 30,30 0 0,1 80,50" fill="none" />
      <text fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="5.2" fontWeight="700" fill="#FDE68A" letterSpacing="0.8">
        <textPath href="#text-top-arc" startOffset="50%" textAnchor="middle">
          INDIAN RAILWAYS
        </textPath>
      </text>

      {/* Arc Text: भारतीय रेल (Bottom Arc) */}
      <path id="text-bottom-arc" d="M 80,50 A 30,30 0 0,1 20,50" fill="none" />
      <text fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="5.5" fontWeight="700" fill="#FDE68A" letterSpacing="1">
        <textPath href="#text-bottom-arc" startOffset="50%" textAnchor="middle">
          भारतीय रेल
        </textPath>
      </text>
    </svg>
  );
};
