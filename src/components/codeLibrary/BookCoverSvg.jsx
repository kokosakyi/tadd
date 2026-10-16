import React from 'react';

/**
 * High-fidelity vector SVG Book Covers for CSA Engineering Standards
 * Designed with rich gradients, technical grid motifs, gold/silver foil badges,
 * and standard-specific engineering iconography.
 */

export function BookCoverSvg({ standardId, width = '100%', height = '100%', style = {}, className = '' }) {
  if (standardId === 'c22_3_no1') {
    return (
      <svg
        viewBox="0 0 320 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width, height, display: 'block', borderRadius: 'inherit', ...style }}
      >
        <defs>
          {/* Cover gradient */}
          <linearGradient id="c22_bg" x1="0" y1="0" x2="320" y2="440" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a2540" />
            <stop offset="45%" stopColor="#0c1b33" />
            <stop offset="100%" stopColor="#050e1f" />
          </linearGradient>

          {/* Spine glow / 3D fold reflection */}
          <linearGradient id="c22_spine" x1="0" y1="0" x2="28" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
          </linearGradient>

          {/* Accent foil gradient */}
          <linearGradient id="c22_cyan_foil" x1="0" y1="0" x2="300" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Gold seal gradient */}
          <linearGradient id="c22_gold" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Subtle grid pattern */}
          <pattern id="c22_grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.08" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="320" height="440" rx="8" fill="url(#c22_bg)" />
        <rect width="320" height="440" rx="8" fill="url(#c22_grid)" />

        {/* Outer decorative border */}
        <rect x="18" y="18" width="284" height="404" rx="5" fill="none" stroke="url(#c22_cyan_foil)" strokeWidth="1.2" strokeOpacity="0.4" />
        <rect x="22" y="22" width="276" height="396" rx="4" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />

        {/* Corner technical tick accents */}
        <path d="M 18 36 L 18 18 L 36 18" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M 302 36 L 302 18 L 284 18" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M 18 404 L 18 422 L 36 422" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M 302 404 L 302 422 L 284 422" stroke="#38bdf8" strokeWidth="2.5" />

        {/* Top Header Label */}
        <g transform="translate(38, 42)">
          {/* CSA Logo Pill */}
          <rect x="0" y="0" width="58" height="22" rx="4" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1" />
          <text x="29" y="15" fill="#f0f9ff" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="900" letterSpacing="1.5" textAnchor="middle">
            CSA
          </text>
          <text x="68" y="14" fill="#94a3b8" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="1">
            CANADIAN ELECTRICAL CODE, PART III
          </text>
        </g>

        {/* Standard Identifier */}
        <text x="38" y="96" fill="#38bdf8" fontSize="21" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800" letterSpacing="0.5">
          CSA C22.3 No. 1
        </text>

        {/* Edition Pill */}
        <g transform="translate(38, 108)">
          <rect x="0" y="0" width="92" height="20" rx="10" fill="url(#c22_cyan_foil)" />
          <text x="46" y="14" fill="#041324" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="800" textAnchor="middle">
            EDITION 2020
          </text>
        </g>

        {/* Book Title */}
        <text x="38" y="158" fill="#f8fafc" fontSize="22" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800">
          Overhead Systems
        </text>
        <text x="38" y="180" fill="#94a3b8" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="500">
          Clearances, Loadings & Structural Safety
        </text>

        {/* Thin separator line */}
        <line x1="38" y1="194" x2="282" y2="194" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="1" />

        {/* Engineering Schematic Motif in center */}
        <g transform="translate(160, 268)">
          {/* Outer glow ring */}
          <circle cx="0" cy="0" r="54" fill="none" stroke="#38bdf8" strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="46" fill="#0f2744" fillOpacity="0.5" stroke="url(#c22_cyan_foil)" strokeWidth="1.5" />

          {/* Utility Pole & Conductor Catenary Silhouette */}
          {/* Ground line */}
          <line x1="-40" y1="36" x2="40" y2="36" stroke="#64748b" strokeWidth="1.5" />
          {/* Ground dashes */}
          <line x1="-30" y1="39" x2="-22" y2="44" stroke="#475569" strokeWidth="1" />
          <line x1="-15" y1="39" x2="-7" y2="44" stroke="#475569" strokeWidth="1" />
          <line x1="0" y1="39" x2="8" y2="44" stroke="#475569" strokeWidth="1" />
          <line x1="15" y1="39" x2="23" y2="44" stroke="#475569" strokeWidth="1" />

          {/* Wood Pole */}
          <path d="M -4 36 L -2.5 -32 L 2.5 -32 L 4 36 Z" fill="#94a3b8" opacity="0.9" />
          {/* Crossarm */}
          <rect x="-24" y="-24" width="48" height="3.5" rx="1" fill="#cbd5e1" />
          <rect x="-18" y="-14" width="36" height="3" rx="1" fill="#cbd5e1" opacity="0.8" />

          {/* Insulators */}
          <circle cx="-20" cy="-20" r="2.5" fill="#38bdf8" />
          <circle cx="20" cy="-20" r="2.5" fill="#38bdf8" />
          <circle cx="0" cy="-33" r="2.5" fill="#38bdf8" />

          {/* Sagging conductors */}
          <path d="M -38 -26 Q -20 -18 0 -31" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.75" />
          <path d="M 0 -31 Q 20 -18 38 -26" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.75" />
          
          {/* Clearance vector arrow */}
          <line x1="28" y1="-12" x2="28" y2="34" stroke="#eab308" strokeWidth="1.2" strokeDasharray="2 2" />
          <polygon points="28,-14 26,-9 30,-9" fill="#eab308" />
          <polygon points="28,36 26,31 30,31" fill="#eab308" />
        </g>

        {/* Feature Badges Bottom */}
        <g transform="translate(38, 345)">
          <rect x="0" y="0" width="116" height="44" rx="6" fill="#08182b" stroke="#1e3a5f" strokeWidth="1" />
          <text x="12" y="19" fill="#38bdf8" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="800">500</text>
          <text x="12" y="33" fill="#94a3b8" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="600">CLAUSES DIGITIZED</text>

          <rect x="128" y="0" width="116" height="44" rx="6" fill="#08182b" stroke="#1e3a5f" strokeWidth="1" />
          <text x="140" y="19" fill="#10b981" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="800">31</text>
          <text x="140" y="33" fill="#94a3b8" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="600">ENGINEERING TABLES</text>
        </g>

        {/* Bottom standard watermark */}
        <text x="160" y="412" fill="#64748b" fontSize="8" fontFamily="system-ui, sans-serif" fontWeight="600" letterSpacing="1.2" textAnchor="middle">
          OVERHEAD POWER & COMMUNICATION LINES
        </text>

        {/* Left Book Spine 3D Shadow Overlay */}
        <rect x="0" y="0" width="16" height="440" rx="4" fill="url(#c22_spine)" />
        <line x1="16" y1="0" x2="16" y2="440" stroke="#000000" strokeWidth="0.75" strokeOpacity="0.5" />
      </svg>
    );
  }

  if (standardId === 'c22_3_60826') {
    return (
      <svg
        viewBox="0 0 320 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width, height, display: 'block', borderRadius: 'inherit', ...style }}
      >
        <defs>
          {/* Rich Violet/Indigo gradient */}
          <linearGradient id="c60826_bg" x1="0" y1="0" x2="320" y2="440" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e1138" />
            <stop offset="45%" stopColor="#140c28" />
            <stop offset="100%" stopColor="#090514" />
          </linearGradient>

          <linearGradient id="c60826_spine" x1="0" y1="0" x2="28" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="c60826_violet_foil" x1="0" y1="0" x2="300" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>

          <pattern id="c60826_grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.08" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="320" height="440" rx="8" fill="url(#c60826_bg)" />
        <rect width="320" height="440" rx="8" fill="url(#c60826_grid)" />

        {/* Border */}
        <rect x="18" y="18" width="284" height="404" rx="5" fill="none" stroke="url(#c60826_violet_foil)" strokeWidth="1.2" strokeOpacity="0.45" />
        <rect x="22" y="22" width="276" height="396" rx="4" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />

        {/* Corner Accents */}
        <path d="M 18 36 L 18 18 L 36 18" stroke="#c084fc" strokeWidth="2.5" />
        <path d="M 302 36 L 302 18 L 284 18" stroke="#c084fc" strokeWidth="2.5" />
        <path d="M 18 404 L 18 422 L 36 422" stroke="#c084fc" strokeWidth="2.5" />
        <path d="M 302 404 L 302 422 L 284 422" stroke="#c084fc" strokeWidth="2.5" />

        {/* Top Header Label */}
        <g transform="translate(38, 42)">
          <rect x="0" y="0" width="58" height="22" rx="4" fill="#7c3aed" fillOpacity="0.35" stroke="#c084fc" strokeWidth="1" />
          <text x="29" y="15" fill="#faf5ff" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="900" letterSpacing="1.5" textAnchor="middle">
            CSA
          </text>
          <text x="68" y="14" fill="#c4b5fd" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="1">
            CAN/CSA-C22.3 NO. 60826:10
          </text>
        </g>

        {/* Standard Identifier */}
        <text x="38" y="96" fill="#c084fc" fontSize="21" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800" letterSpacing="0.5">
          CSA C22.3 No. 60826
        </text>

        {/* Edition Pill */}
        <g transform="translate(38, 108)">
          <rect x="0" y="0" width="132" height="20" rx="10" fill="url(#c60826_violet_foil)" />
          <text x="66" y="14" fill="#140428" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" textAnchor="middle">
            EDITION 2010 (R2020)
          </text>
        </g>

        {/* Book Title */}
        <text x="38" y="154" fill="#f8fafc" fontSize="21" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800">
          Transmission Line
        </text>
        <text x="38" y="176" fill="#f8fafc" fontSize="21" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800">
          Design Criteria
        </text>
        <text x="38" y="194" fill="#c4b5fd" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="500">
          Climatic Loadings & Reliability Limit States
        </text>

        {/* Separator */}
        <line x1="38" y1="206" x2="282" y2="206" stroke="#c084fc" strokeOpacity="0.35" strokeWidth="1" />

        {/* Center Transmission Lattice Tower Motif */}
        <g transform="translate(160, 274)">
          <circle cx="0" cy="0" r="54" fill="none" stroke="#c084fc" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="46" fill="#24143e" fillOpacity="0.6" stroke="url(#c60826_violet_foil)" strokeWidth="1.5" />

          {/* Steel Lattice Transmission Tower */}
          <line x1="-36" y1="36" x2="36" y2="36" stroke="#64748b" strokeWidth="1.5" />
          
          {/* Tower main legs */}
          <line x1="-18" y1="36" x2="-6" y2="-12" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="18" y1="36" x2="6" y2="-12" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="-6" y1="-12" x2="-4" y2="-34" stroke="#e2e8f0" strokeWidth="1.4" />
          <line x1="6" y1="-12" x2="4" y2="-34" stroke="#e2e8f0" strokeWidth="1.4" />
          <line x1="-4" y1="-34" x2="0" y2="-38" stroke="#e2e8f0" strokeWidth="1.2" />
          <line x1="4" y1="-34" x2="0" y2="-38" stroke="#e2e8f0" strokeWidth="1.2" />

          {/* Tower Cross Bracing */}
          <line x1="-16" y1="30" x2="13" y2="18" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.7" />
          <line x1="16" y1="30" x2="-13" y2="18" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.7" />
          <line x1="-13" y1="18" x2="9" y2="4" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.7" />
          <line x1="13" y1="18" x2="-9" y2="4" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.7" />
          <line x1="-9" y1="4" x2="6" y2="-12" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.7" />
          <line x1="9" y1="4" x2="-6" y2="-12" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.7" />

          {/* Crossarms */}
          <line x1="-30" y1="-12" x2="30" y2="-12" stroke="#e2e8f0" strokeWidth="2" />
          <line x1="-22" y1="-24" x2="22" y2="-24" stroke="#e2e8f0" strokeWidth="1.8" />
          <line x1="-14" y1="-34" x2="14" y2="-34" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* Wind gusts & ice icon accents */}
          <path d="M -36 -2 Q -30 -6 -24 -2 Q -18 2 -12 -2" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          <path d="M 12 12 Q 18 8 24 12 Q 30 16 36 12" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
        </g>

        {/* Feature Badges Bottom */}
        <g transform="translate(38, 345)">
          <rect x="0" y="0" width="116" height="44" rx="6" fill="#1b0e33" stroke="#3b1d6e" strokeWidth="1" />
          <text x="12" y="19" fill="#c084fc" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="800">206</text>
          <text x="12" y="33" fill="#a78bfa" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="600">CLAUSES DIGITIZED</text>

          <rect x="128" y="0" width="116" height="44" rx="6" fill="#1b0e33" stroke="#3b1d6e" strokeWidth="1" />
          <text x="140" y="19" fill="#38bdf8" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="800">47</text>
          <text x="140" y="33" fill="#a78bfa" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="600">TABLES & ANNEXES</text>
        </g>

        {/* Bottom standard watermark */}
        <text x="160" y="412" fill="#8b5cf6" fontSize="8" fontFamily="system-ui, sans-serif" fontWeight="600" letterSpacing="1.2" textAnchor="middle">
          CANADIAN NATIONAL DEVIATIONS CA & CB
        </text>

        {/* Left Book Spine 3D Shadow Overlay */}
        <rect x="0" y="0" width="16" height="440" rx="4" fill="url(#c60826_spine)" />
        <line x1="16" y1="0" x2="16" y2="440" stroke="#000000" strokeWidth="0.75" strokeOpacity="0.5" />
      </svg>
    );
  }

  if (standardId === 'pls_cadd_lessons') {
    return (
      <svg
        viewBox="0 0 320 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width, height, display: 'block', borderRadius: 'inherit', ...style }}
      >
        <defs>
          {/* Deep Obsidian / Twilight Amber Gradient */}
          <linearGradient id="pls_bg" x1="0" y1="0" x2="320" y2="440" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e1808" />
            <stop offset="45%" stopColor="#141005" />
            <stop offset="100%" stopColor="#080602" />
          </linearGradient>

          <linearGradient id="pls_spine" x1="0" y1="0" x2="28" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="pls_gold_foil" x1="0" y1="0" x2="300" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="pls_cyan_sheen" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <pattern id="pls_grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.09" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="320" height="440" rx="8" fill="url(#pls_bg)" />
        <rect width="320" height="440" rx="8" fill="url(#pls_grid)" />

        {/* Outer Gold Foil Border */}
        <rect x="18" y="18" width="284" height="404" rx="5" fill="none" stroke="url(#pls_gold_foil)" strokeWidth="1.3" strokeOpacity="0.6" />
        <rect x="22" y="22" width="276" height="396" rx="4" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.12" />

        {/* Corner Technical Accents */}
        <path d="M 18 36 L 18 18 L 36 18" stroke="#f59e0b" strokeWidth="2.5" />
        <path d="M 302 36 L 302 18 L 284 18" stroke="#f59e0b" strokeWidth="2.5" />
        <path d="M 18 404 L 18 422 L 36 422" stroke="#f59e0b" strokeWidth="2.5" />
        <path d="M 302 404 L 302 422 L 284 422" stroke="#f59e0b" strokeWidth="2.5" />

        {/* Top Header Label */}
        <g transform="translate(38, 42)">
          <rect x="0" y="0" width="70" height="22" rx="4" fill="#b45309" fillOpacity="0.35" stroke="#f59e0b" strokeWidth="1" />
          <text x="35" y="15" fill="#fef3c7" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="900" letterSpacing="1.2" textAnchor="middle">
            PLS-CADD
          </text>
          <text x="80" y="14" fill="#fde68a" fontSize="8" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="0.8">
            PRACTITIONER ENGINEERING GUIDE
          </text>
        </g>

        {/* Standard Identifier */}
        <text x="38" y="96" fill="#f59e0b" fontSize="21" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800" letterSpacing="0.5">
          PLS CADD
        </text>

        {/* Edition Pill */}
        <g transform="translate(38, 108)">
          <rect x="0" y="0" width="138" height="20" rx="10" fill="url(#pls_gold_foil)" />
          <text x="69" y="14" fill="#1c1002" fontSize="9.5" fontFamily="system-ui, sans-serif" fontWeight="900" textAnchor="middle">
            LESSONS LEARNED (2026)
          </text>
        </g>

        {/* Book Title */}
        <text x="38" y="154" fill="#f8fafc" fontSize="21" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800">
          Lessons Learned
        </text>
        <text x="38" y="176" fill="#f8fafc" fontSize="21" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800">
          Field & Office Dialogue
        </text>
        <text x="38" y="194" fill="#fde68a" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="500">
          Junior & Senior Engineer Q&A on Line Design
        </text>

        {/* Separator */}
        <line x1="38" y1="206" x2="282" y2="206" stroke="#f59e0b" strokeOpacity="0.35" strokeWidth="1" />

        {/* Center Engineering Schematic & Dual Avatar Motif */}
        <g transform="translate(160, 274)">
          <circle cx="0" cy="0" r="54" fill="none" stroke="#f59e0b" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="46" fill="#2d1c05" fillOpacity="0.75" stroke="url(#pls_gold_foil)" strokeWidth="1.5" />

          {/* Conductor Catenary Silhouette */}
          <path d="M -42 -14 Q 0 28 42 -14" fill="none" stroke="#38bdf8" strokeWidth="1.6" opacity="0.8" />
          <path d="M -42 -22 Q 0 16 42 -22" fill="none" stroke="#f59e0b" strokeWidth="1.4" opacity="0.9" />

          {/* Center Dialogue Mini Avatars Badge */}
          {/* Junior Engineer (Left: Cyan hard hat profile) */}
          <g transform="translate(-16, -6)">
            <circle cx="0" cy="0" r="14" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.2" />
            <path d="M -6 -4 C -6 -10, -3 -12, 0 -12 C 3 -12, 6 -10, 6 -4 Z" fill="#eab308" />
            <circle cx="0" cy="0" r="5" fill="#fed7aa" />
            <path d="M -7 11 C -7 6, -3 4, 0 4 C 3 4, 7 6, 7 11 Z" fill="#ea580c" />
            <text x="0" y="13" fill="#38bdf8" fontSize="6" fontWeight="900" textAnchor="middle">JR</text>
          </g>

          {/* Senior Engineer (Right: White hard hat profile) */}
          <g transform="translate(16, -6)">
            <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.2" />
            <path d="M -6 -4 C -6 -10, -3 -12, 0 -12 C 3 -12, 6 -10, 6 -4 Z" fill="#ffffff" />
            <circle cx="0" cy="0" r="5" fill="#fba363" />
            <path d="M -2 0 Q 0 3 2 0" stroke="#475569" strokeWidth="0.8" fill="none" />
            <path d="M -7 11 C -7 6, -3 4, 0 4 C 3 4, 7 6, 7 11 Z" fill="#0369a1" />
            <text x="0" y="13" fill="#f59e0b" fontSize="6" fontWeight="900" textAnchor="middle">SR</text>
          </g>

          {/* Conversational Sparkle Icon in Center */}
          <circle cx="0" cy="-6" r="3.5" fill="#f59e0b" />
          <path d="M 0 -12 L 0 0 M -6 -6 L 6 -6" stroke="#fef08a" strokeWidth="0.8" />
        </g>

        {/* Feature Badges Bottom */}
        <g transform="translate(38, 345)">
          <rect x="0" y="0" width="116" height="44" rx="6" fill="#1f1606" stroke="#4d3309" strokeWidth="1" />
          <text x="12" y="19" fill="#f59e0b" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="800">14</text>
          <text x="12" y="33" fill="#fde68a" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="600">TECHNICAL LESSONS</text>

          <rect x="128" y="0" width="116" height="44" rx="6" fill="#1f1606" stroke="#4d3309" strokeWidth="1" />
          <text x="140" y="19" fill="#38bdf8" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="800">Q&A</text>
          <text x="140" y="33" fill="#fde68a" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="600">ENGINEER DIALOGUE</text>
        </g>

        {/* Bottom Standard Watermark */}
        <text x="160" y="412" fill="#ca8a04" fontSize="8" fontFamily="system-ui, sans-serif" fontWeight="600" letterSpacing="1.2" textAnchor="middle">
          NON-LINEAR FEA, AUTOSAG & CSA C22.3 ALIGNED
        </text>

        {/* Left Book Spine 3D Shadow Overlay */}
        <rect x="0" y="0" width="16" height="440" rx="4" fill="url(#pls_spine)" />
        <line x1="16" y1="0" x2="16" y2="440" stroke="#000000" strokeWidth="0.75" strokeOpacity="0.5" />
      </svg>
    );
  }

  // CSA O15: Wood Utility Poles
  return (
    <svg
      viewBox="0 0 320 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width, height, display: 'block', borderRadius: 'inherit', ...style }}
    >
      <defs>
        {/* Emerald / Forest Wood Green gradient */}
        <linearGradient id="o15_bg" x1="0" y1="0" x2="320" y2="440" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#062e20" />
          <stop offset="45%" stopColor="#041f16" />
          <stop offset="100%" stopColor="#020f0a" />
        </linearGradient>

        <linearGradient id="o15_spine" x1="0" y1="0" x2="28" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="25%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>

        <linearGradient id="o15_emerald_foil" x1="0" y1="0" x2="300" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <pattern id="o15_grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.08" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="320" height="440" rx="8" fill="url(#o15_bg)" />
      <rect width="320" height="440" rx="8" fill="url(#o15_grid)" />

      {/* Border */}
      <rect x="18" y="18" width="284" height="404" rx="5" fill="none" stroke="url(#o15_emerald_foil)" strokeWidth="1.2" strokeOpacity="0.45" />
      <rect x="22" y="22" width="276" height="396" rx="4" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />

      {/* Corner Accents */}
      <path d="M 18 36 L 18 18 L 36 18" stroke="#34d399" strokeWidth="2.5" />
      <path d="M 302 36 L 302 18 L 284 18" stroke="#34d399" strokeWidth="2.5" />
      <path d="M 18 404 L 18 422 L 36 422" stroke="#34d399" strokeWidth="2.5" />
      <path d="M 302 404 L 302 422 L 284 422" stroke="#34d399" strokeWidth="2.5" />

      {/* Top Header Label */}
      <g transform="translate(38, 42)">
        <rect x="0" y="0" width="58" height="22" rx="4" fill="#059669" fillOpacity="0.35" stroke="#34d399" strokeWidth="1" />
        <text x="29" y="15" fill="#ecfdf5" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="900" letterSpacing="1.5" textAnchor="middle">
          CSA
        </text>
        <text x="68" y="14" fill="#a7f3d0" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="1">
          WOOD PRODUCTS & UTILITY STRUCTURES
        </text>
      </g>

      {/* Standard Identifier */}
      <text x="38" y="96" fill="#34d399" fontSize="21" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800" letterSpacing="0.5">
        CSA O15
      </text>

      {/* Edition Pill */}
      <g transform="translate(38, 108)">
        <rect x="0" y="0" width="132" height="20" rx="10" fill="url(#o15_emerald_foil)" />
        <text x="66" y="14" fill="#022114" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" textAnchor="middle">
          EDITION 2015 (R2020)
        </text>
      </g>

      {/* Book Title */}
      <text x="38" y="154" fill="#f8fafc" fontSize="21" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800">
        Wood Utility Poles
      </text>
      <text x="38" y="176" fill="#f8fafc" fontSize="21" fontFamily="'Outfit', system-ui, sans-serif" fontWeight="800">
        & Reinforcing Stubs
      </text>
      <text x="38" y="194" fill="#a7f3d0" fontSize="10.5" fontFamily="system-ui, sans-serif" fontWeight="500">
        Species, Fiber Stresses & Classes H6 to 8
      </text>

      {/* Separator */}
      <line x1="38" y1="206" x2="282" y2="206" stroke="#34d399" strokeOpacity="0.35" strokeWidth="1" />

      {/* Center Wood Grain & Tree Cross-Section Motif */}
      <g transform="translate(160, 274)">
        <circle cx="0" cy="0" r="54" fill="none" stroke="#34d399" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="0" cy="0" r="46" fill="#083824" fillOpacity="0.6" stroke="url(#o15_emerald_foil)" strokeWidth="1.5" />

        {/* Annual Growth Rings (Timber Cross-Section) */}
        <circle cx="0" cy="0" r="38" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.4" />
        <circle cx="0" cy="0" r="28" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.5" />
        <circle cx="0" cy="0" r="18" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.6" />
        <circle cx="0" cy="0" r="9" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.7" />
        <circle cx="0" cy="0" r="3" fill="#34d399" opacity="0.9" />

        {/* Wood check / natural radial ray fissures */}
        <line x1="3" y1="0" x2="34" y2="0" stroke="#041f16" strokeWidth="1.5" />
        <line x1="-3" y1="-3" x2="-26" y2="-26" stroke="#041f16" strokeWidth="1.2" />
        <line x1="2" y1="3" x2="18" y2="28" stroke="#041f16" strokeWidth="1.2" />

        {/* Tree evergreen outline badge */}
        <g transform="translate(24, -24) scale(0.65)">
          <path d="M 0 -18 L 12 0 L 6 0 L 16 16 L -16 16 L -6 0 L -12 0 Z" fill="#10b981" opacity="0.85" />
          <rect x="-3" y="16" width="6" height="6" fill="#059669" />
        </g>
      </g>

      {/* Feature Badges Bottom */}
      <g transform="translate(38, 345)">
        <rect x="0" y="0" width="116" height="44" rx="6" fill="#08281a" stroke="#125737" strokeWidth="1" />
        <text x="12" y="19" fill="#34d399" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="800">86</text>
        <text x="12" y="33" fill="#6ee7b7" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="600">CLAUSES DIGITIZED</text>

        <rect x="128" y="0" width="116" height="44" rx="6" fill="#08281a" stroke="#125737" strokeWidth="1" />
        <text x="140" y="19" fill="#f59e0b" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="800">5</text>
        <text x="140" y="33" fill="#6ee7b7" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="600">SPECIES & STRESS TBLS</text>
      </g>

      {/* Bottom standard watermark */}
      <text x="160" y="412" fill="#059669" fontSize="8" fontFamily="system-ui, sans-serif" fontWeight="600" letterSpacing="1.2" textAnchor="middle">
        WESTERN RED CEDAR, DOUGLAS FIR & LODGEPOLE PINE
      </text>

      {/* Left Book Spine 3D Shadow Overlay */}
      <rect x="0" y="0" width="16" height="440" rx="4" fill="url(#o15_spine)" />
      <line x1="16" y1="0" x2="16" y2="440" stroke="#000000" strokeWidth="0.75" strokeOpacity="0.5" />
    </svg>
  );
}

export default BookCoverSvg;
