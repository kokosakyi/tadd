import React from 'react';

/**
 * High-fidelity vector SVG head icons for:
 * - Alex Rivera, E.I.T. (Junior Transmission & Distribution Design Engineer)
 * - Dan Miller, P.Eng. (Senior Principal T&D Engineer & Line Design Practice Lead)
 */
export default function EngineerAvatar({ speaker = 'junior', size = 48, className = '', style = {} }) {
  const isSenior = speaker === 'senior' || speaker === 'dan';

  if (isSenior) {
    // Dan Miller, P.Eng. — Senior Principal T&D Engineer
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ borderRadius: '50%', flexShrink: 0, ...style }}
        aria-label="Dan Miller, P.Eng. Avatar"
      >
        <defs>
          <linearGradient id="dan_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="dan_helmet" x1="20" y1="10" x2="80" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="dan_skin" x1="35" y1="35" x2="65" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fba363" />
          </linearGradient>
          <linearGradient id="dan_beard" x1="40" y1="60" x2="60" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="dan_vest" x1="20" y1="75" x2="80" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>
          <filter id="dan_shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Background circle badge with gold rim */}
        <circle cx="50" cy="50" r="48" fill="url(#dan_bg)" stroke="#f59e0b" strokeWidth="2.5" />

        {/* Body / Navy Work Shirt with High-Vis Trim */}
        <path d="M 20 100 C 20 82, 32 75, 50 75 C 68 75, 80 82, 80 100 Z" fill="url(#dan_vest)" />
        {/* High-Vis Reflective Yoke */}
        <path d="M 28 85 L 36 76 L 42 82 L 32 94 Z" fill="#f59e0b" opacity="0.9" />
        <path d="M 72 85 L 64 76 L 58 82 L 68 94 Z" fill="#f59e0b" opacity="0.9" />
        <path d="M 45 76 L 50 82 L 55 76 L 50 74 Z" fill="#38bdf8" />

        {/* Neck */}
        <rect x="44" y="66" width="12" height="12" rx="2" fill="url(#dan_skin)" />

        {/* Head / Face */}
        <circle cx="50" cy="52" r="18" fill="url(#dan_skin)" filter="url(#dan_shadow)" />

        {/* Beard & Moustache (Seasoned Mentor) */}
        <path
          d="M 37 56 C 37 68, 43 76, 50 76 C 57 76, 63 68, 63 56 C 59 62, 41 62, 37 56 Z"
          fill="url(#dan_beard)"
        />
        {/* Moustache */}
        <path
          d="M 42 58 Q 50 56 58 58 Q 50 63 42 58 Z"
          fill="#475569"
        />

        {/* Glasses (Professional Executive Frame) */}
        <rect x="37" y="46" width="11" height="8" rx="2" fill="#0f172a" fillOpacity="0.3" stroke="#e2e8f0" strokeWidth="1.2" />
        <rect x="52" y="46" width="11" height="8" rx="2" fill="#0f172a" fillOpacity="0.3" stroke="#e2e8f0" strokeWidth="1.2" />
        <line x1="48" y1="50" x2="52" y2="50" stroke="#e2e8f0" strokeWidth="1.2" />
        {/* Eyebrows */}
        <path d="M 37 44 Q 42 42 47 43" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 53 43 Q 58 42 63 44" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />

        {/* Eyes behind lenses */}
        <circle cx="42.5" cy="50" r="1.6" fill="#0f172a" />
        <circle cx="57.5" cy="50" r="1.6" fill="#0f172a" />
        <circle cx="43" cy="49.5" r="0.5" fill="#ffffff" />
        <circle cx="58" cy="49.5" r="0.5" fill="#ffffff" />

        {/* White Supervisor Hard Hat */}
        {/* Helmet Dome */}
        <path
          d="M 28 39 C 28 20, 36 12, 50 12 C 64 12, 72 20, 72 39 C 66 38, 34 38, 28 39 Z"
          fill="url(#dan_helmet)"
          filter="url(#dan_shadow)"
        />
        {/* Helmet Rim */}
        <path
          d="M 24 38 C 24 36, 32 35, 50 35 C 68 35, 76 36, 76 38 C 76 41, 68 41, 50 41 C 32 41, 24 41, 24 38 Z"
          fill="#cbd5e1"
          stroke="#94a3b8"
          strokeWidth="0.8"
        />
        {/* Helmet Ridge Crest */}
        <path d="M 47 12 C 47 12, 48 28, 48 35 L 52 35 C 52 28, 53 12, 53 12 Z" fill="#f8fafc" />
        {/* P.Eng. Gold Shield Crest on Hardhat */}
        <path d="M 47 24 L 53 24 L 53 28 L 50 30 L 47 28 Z" fill="#f59e0b" stroke="#ca8a04" strokeWidth="0.5" />
      </svg>
    );
  }

  // Alex Rivera, E.I.T. — Junior Transmission & Distribution Design Engineer
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ borderRadius: '50%', flexShrink: 0, ...style }}
      aria-label="Alex Rivera, E.I.T. Avatar"
    >
      <defs>
        <linearGradient id="alex_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="alex_helmet" x1="25" y1="10" x2="75" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="alex_skin" x1="35" y1="35" x2="65" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <linearGradient id="alex_vest" x1="20" y1="75" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <filter id="alex_shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Background circle badge with cyan rim */}
      <circle cx="50" cy="50" r="48" fill="url(#alex_bg)" stroke="#38bdf8" strokeWidth="2.5" />

      {/* High-Vis Safety Vest & Work Shirt */}
      <path d="M 20 100 C 20 80, 32 74, 50 74 C 68 74, 80 80, 80 100 Z" fill="url(#alex_vest)" />
      {/* Reflective Stripes */}
      <path d="M 30 84 L 38 75 L 43 82 L 35 95 Z" fill="#f1f5f9" opacity="0.95" />
      <path d="M 70 84 L 62 75 L 57 82 L 65 95 Z" fill="#f1f5f9" opacity="0.95" />
      <path d="M 45 74 L 50 81 L 55 74 Z" fill="#0284c7" />

      {/* Neck */}
      <rect x="44" y="65" width="12" height="12" rx="2" fill="url(#alex_skin)" />

      {/* Head / Face */}
      <circle cx="50" cy="52" r="17" fill="url(#alex_skin)" filter="url(#alex_shadow)" />

      {/* Dark Hair Tufts at sides */}
      <path d="M 32 46 C 30 52, 33 56, 35 56 C 35 50, 34 46, 32 46 Z" fill="#1e293b" />
      <path d="M 68 46 C 70 52, 67 56, 65 56 C 65 50, 66 46, 68 46 Z" fill="#1e293b" />

      {/* Cheerful, inquisitive smile */}
      <path d="M 45 61 Q 50 65 55 61" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Modern Slim Safety Glasses with Cyan Sheen */}
      <rect x="36" y="47" width="12" height="7.5" rx="2" fill="#38bdf8" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1.2" />
      <rect x="52" y="47" width="12" height="7.5" rx="2" fill="#38bdf8" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1.2" />
      <line x1="48" y1="50.5" x2="52" y2="50.5" stroke="#0284c7" strokeWidth="1.2" />

      {/* Alert, Curious Eyes */}
      <circle cx="42" cy="50.5" r="1.7" fill="#0f172a" />
      <circle cx="58" cy="50.5" r="1.7" fill="#0f172a" />
      <circle cx="42.6" cy="49.8" r="0.6" fill="#ffffff" />
      <circle cx="58.6" cy="49.8" r="0.6" fill="#ffffff" />

      {/* Eyebrows (Curious & Inquisitive) */}
      <path d="M 37 44 Q 42 41 47 43" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 53 43 Q 58 41 63 44" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />

      {/* Yellow Safety Hard Hat */}
      {/* Helmet Dome */}
      <path
        d="M 28 39 C 28 19, 36 12, 50 12 C 64 12, 72 19, 72 39 C 66 38, 34 38, 28 39 Z"
        fill="url(#alex_helmet)"
        filter="url(#alex_shadow)"
      />
      {/* Helmet Brim */}
      <path
        d="M 23 38 C 23 35.5, 32 34.5, 50 34.5 C 68 34.5, 77 35.5, 77 38 C 77 40.5, 68 40.5, 50 40.5 C 32 40.5, 23 40.5, 23 38 Z"
        fill="#eab308"
        stroke="#ca8a04"
        strokeWidth="0.8"
      />
      {/* Helmet Top Ridge */}
      <path d="M 47.5 12 C 47.5 12, 48 26, 48 34.5 L 52 34.5 C 52 26, 52.5 12, 52.5 12 Z" fill="#fef08a" />
      {/* E.I.T. Green Ribbon / Shield Emblem */}
      <circle cx="50" cy="27" r="3.2" fill="#10b981" stroke="#059669" strokeWidth="0.6" />
      <text x="50" y="29.2" fill="#ffffff" fontSize="4" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">E</text>
    </svg>
  );
}
