import React, { useState } from 'react';
import { convertMetersToUnit, formatValue, M_TO_FT } from '../utils/clearanceCalculator';
import { Eye, CheckCircle2, AlertTriangle, XCircle, Maximize2, Layers } from 'lucide-react';

export default function ClearanceVisualizer({ calculationResult, categoryObj, unit }) {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showCatCurve, setShowCatCurve] = useState(true);

  const {
    attachmentHeightMeters,
    midspanSagMeters,
    obstacleHeightMeters,
    totalRequiredClearanceM,
    actualClearanceM,
    clearanceMarginM,
    conductorLowestPointM,
    status
  } = calculationResult;

  // SVG Canvas scaling dimensions
  const svgWidth = 720;
  const svgHeight = 440;
  const groundY = 370; // Pixel Y for ground baseline
  
  // Calculate scale factor: 1 meter = X pixels
  const maxH = Math.max(attachmentHeightMeters + 2, totalRequiredClearanceM + 4, 15);
  const scaleY = 320 / maxH; // Scale meters to pixel height

  const poleLeftX = 80;
  const poleRightX = 640;
  const midspanX = (poleLeftX + poleRightX) / 2;

  const attY = groundY - (attachmentHeightMeters * scaleY);
  const lowestY = groundY - (conductorLowestPointM * scaleY);
  const obstacleY = groundY - (obstacleHeightMeters * scaleY);
  const requiredClearanceY = obstacleY - (totalRequiredClearanceM * scaleY);

  // Status color definitions
  const statusColor = status === 'PASS' ? '#10b981' : status === 'WARNING' ? '#f59e0b' : '#f43f5e';

  // Render obstacle graphics based on category type
  const renderObstacleGraphic = () => {
    const catId = categoryObj ? categoryObj.id : 'road_truck';
    
    if (catId === 'road_truck' || catId === 'driveway_car') {
      return (
        <g>
          {/* Road / Asphalt */}
          <rect x={poleLeftX + 40} y={groundY - 10} width={poleRightX - poleLeftX - 80} height={10} fill="#334155" />
          <line x1={midspanX - 100} y1={groundY - 5} x2={midspanX + 100} y2={groundY - 5} stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 8" />
          
          {/* Vehicle Icon / Graphic */}
          {catId === 'road_truck' ? (
            <g transform={`translate(${midspanX - 45}, ${groundY - 55})`}>
              <rect x="0" y="15" width="60" height="30" fill="#475569" rx="3" />
              <rect x="60" y="25" width="25" height="20" fill="#0284c7" rx="3" />
              <circle cx="15" cy="45" r="7" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="48" cy="45" r="7" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="72" cy="45" r="7" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
              <text x="30" y="32" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">TRUCK</text>
            </g>
          ) : (
            <g transform={`translate(${midspanX - 30}, ${groundY - 35})`}>
              <path d="M 0 15 L 10 5 L 45 5 L 55 15 L 60 15 L 60 25 L 0 25 Z" fill="#38bdf8" />
              <circle cx="12" cy="25" r="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="48" cy="25" r="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
            </g>
          )}
        </g>
      );
    }

    if (catId === 'railway') {
      return (
        <g>
          {/* Railway Ballast Bed */}
          <polygon points={`${poleLeftX + 50},${groundY} ${poleLeftX + 70},${groundY - 14} ${poleRightX - 70},${groundY - 14} ${poleRightX - 50},${groundY}`} fill="#475569" />
          {/* Ties & Rails */}
          <line x1={poleLeftX + 70} y1={groundY - 14} x2={poleRightX - 70} y2={groundY - 14} stroke="#1e293b" strokeWidth="4" />
          <rect x={midspanX - 50} y={groundY - 18} width="100" height="4" fill="#94a3b8" />
          <text x={midspanX} y={groundY - 22} fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">TOP OF RAIL</text>
        </g>
      );
    }

    if (catId === 'waterway') {
      return (
        <g>
          {/* Water Surface */}
          <rect x={poleLeftX + 30} y={groundY - 12} width={poleRightX - poleLeftX - 60} height={12} fill="url(#waterGradient)" opacity="0.8" />
          {/* Sailboat Graphic */}
          <g transform={`translate(${midspanX - 20}, ${groundY - 60})`}>
            <path d="M 0 45 L 40 45 L 32 55 L 8 55 Z" fill="#b91c1c" />
            <line x1="20" y1="45" x2="20" y2="5" stroke="#f8fafc" strokeWidth="3" />
            <polygon points="20,10 38,40 20,40" fill="#f8fafc" opacity="0.9" />
          </g>
        </g>
      );
    }

    if (catId.includes('building')) {
      const bWidth = 140;
      const bHeight = obstacleHeightMeters > 0 ? obstacleHeightMeters * scaleY : 70;
      const bX = midspanX - bWidth / 2;
      const bY = groundY - bHeight;
      return (
        <g>
          {/* Building Structure */}
          <rect x={bX} y={bY} width={bWidth} height={bHeight} fill="#334155" stroke="#64748b" strokeWidth="2" rx="2" />
          {/* Roof Line */}
          <line x1={bX - 5} y1={bY} x2={bX + bWidth + 5} y2={bY} stroke="#f59e0b" strokeWidth="3" />
          {/* Windows */}
          <rect x={bX + 20} y={bY + 20} width="25" height="30" fill="#38bdf8" opacity="0.6" />
          <rect x={bX + 95} y={bY + 20} width="25" height="30" fill="#38bdf8" opacity="0.6" />
          <text x={midspanX} y={bY - 8} fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">STRUCTURE / ROOF</text>
        </g>
      );
    }

    if (catId === 'line_crossing' || catId === 'joint_telecom') {
      return (
        <g>
          {/* Lower Pole & Wire Crossing */}
          <line x1={midspanX} y1={groundY} x2={midspanX} y2={obstacleY} stroke="#64748b" strokeWidth="4" />
          <circle cx={midspanX} cy={obstacleY} r="5" fill="#f59e0b" />
          <line x1={midspanX - 60} y1={obstacleY} x2={midspanX + 60} y2={obstacleY} stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 4" />
          <text x={midspanX + 15} y={obstacleY - 8} fill="#f59e0b" fontSize="11" fontWeight="bold">CROSSING LINE</text>
        </g>
      );
    }

    return null;
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Eye size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' }}>
            Dynamic 2D Clearance Profile Visualizer
          </h2>
        </div>

        {/* Status Badge */}
        <div className={`badge badge-${status.toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
          {status === 'PASS' && <CheckCircle2 size={16} />}
          {status === 'WARNING' && <AlertTriangle size={16} />}
          {status === 'FAIL' && <XCircle size={16} />}
          <span>CSA CLEARANCE: {status}</span>
        </div>
      </div>

      {/* Layer Toggles */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button
          className="btn-secondary"
          onClick={() => setShowEnvelope(!showEnvelope)}
          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderColor: showEnvelope ? 'var(--accent-cyan)' : 'var(--border-color)' }}
        >
          <Layers size={14} /> Envelope Zone
        </button>
        <button
          className="btn-secondary"
          onClick={() => setShowDimensions(!showDimensions)}
          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderColor: showDimensions ? 'var(--accent-cyan)' : 'var(--border-color)' }}
        >
          <Maximize2 size={14} /> Dimensions
        </button>
        <button
          className="btn-secondary"
          onClick={() => setShowCatCurve(!showCatCurve)}
          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderColor: showCatCurve ? 'var(--accent-cyan)' : 'var(--border-color)' }}
        >
          Sag Curve
        </button>
      </div>

      {/* SVG Canvas Container */}
      <div style={{
        flex: 1,
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '360px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%' }}>
          <defs>
            {/* Water Gradient */}
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
            </linearGradient>
            
            {/* Safety Envelope Hatching Pattern */}
            <pattern id="envelopePattern" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke={statusColor} strokeWidth="2" opacity="0.3" />
            </pattern>
          </defs>

          {/* Grid Lines */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1="0" y1={i * 45} x2={svgWidth} y2={i * 45} stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
          ))}

          {/* Ground Baseline */}
          <line x1="0" y1={groundY} x2={svgWidth} y2={groundY} stroke="#64748b" strokeWidth="3" />
          <rect x="0" y={groundY} width={svgWidth} height={svgHeight - groundY} fill="#0f172a" />

          {/* Category Specific Obstacle Graphic */}
          {renderObstacleGraphic()}

          {/* Left Pole Structure */}
          <g>
            {/* Wooden Pole */}
            <rect x={poleLeftX - 6} y={attY - 20} width="12" height={groundY - (attY - 20)} fill="#78350f" stroke="#451a03" strokeWidth="1.5" rx="2" />
            {/* Crossarm */}
            <rect x={poleLeftX - 30} y={attY} width="60" height="6" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            {/* Insulators */}
            <rect x={poleLeftX - 25} y={attY - 12} width="4" height="12" fill="#e2e8f0" />
            <rect x={poleLeftX + 21} y={attY - 12} width="4" height="12" fill="#e2e8f0" />
            <rect x={poleLeftX - 2} y={attY - 14} width="4" height="14" fill="#e2e8f0" />
            {/* Guy Wire */}
            <line x1={poleLeftX - 6} y1={attY + 10} x2={poleLeftX - 45} y2={groundY} stroke="#94a3b8" strokeWidth="1.5" />
          </g>

          {/* Right Pole Structure */}
          <g>
            <rect x={poleRightX - 6} y={attY - 20} width="12" height={groundY - (attY - 20)} fill="#78350f" stroke="#451a03" strokeWidth="1.5" rx="2" />
            <rect x={poleRightX - 30} y={attY} width="60" height="6" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            <rect x={poleRightX - 25} y={attY - 12} width="4" height="12" fill="#e2e8f0" />
            <rect x={poleRightX + 21} y={attY - 12} width="4" height="12" fill="#e2e8f0" />
            <rect x={poleRightX - 2} y={attY - 14} width="4" height="14" fill="#e2e8f0" />
            <line x1={poleRightX + 6} y1={attY + 10} x2={poleRightX + 45} y2={groundY} stroke="#94a3b8" strokeWidth="1.5" />
          </g>

          {/* Conductor Catenary Curve Path */}
          {showCatCurve && (
            <path
              d={`M ${poleLeftX} ${attY} Q ${midspanX} ${lowestY + (midspanSagMeters * scaleY * 0.8)} ${poleRightX} ${attY}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
            />
          )}

          {/* Dynamic Clearance Safety Envelope */}
          {showEnvelope && (
            <g>
              {/* Required Clearance Limit Line */}
              <line x1={poleLeftX + 20} y1={requiredClearanceY} x2={poleRightX - 20} y2={requiredClearanceY} stroke={statusColor} strokeWidth="2" strokeDasharray="6 4" />
              {/* Envelope Fill Zone */}
              <rect x={poleLeftX + 80} y={requiredClearanceY} width={poleRightX - poleLeftX - 160} height={obstacleY - requiredClearanceY} fill="url(#envelopePattern)" opacity="0.4" />
            </g>
          )}

          {/* Dimension Lines & Text Callouts */}
          {showDimensions && (
            <g>
              {/* 1. Attachment Height Dimension (Left Pole) */}
              <line x1={poleLeftX - 25} y1={attY} x2={poleLeftX - 25} y2={groundY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
              <text x={poleLeftX - 30} y={(attY + groundY) / 2} fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="bold">
                H_att: {convertMetersToUnit(attachmentHeightMeters, unit)}
              </text>

              {/* 2. Midspan Sag Dimension */}
              <line x1={midspanX + 80} y1={attY} x2={midspanX + 80} y2={lowestY} stroke="#f59e0b" strokeWidth="1.5" />
              <polygon points={`${midspanX + 80},${attY} ${midspanX + 77},${attY + 6} ${midspanX + 83},${attY + 6}`} fill="#f59e0b" />
              <polygon points={`${midspanX + 80},${lowestY} ${midspanX + 77},${lowestY - 6} ${midspanX + 83},${lowestY - 6}`} fill="#f59e0b" />
              <text x={midspanX + 88} y={(attY + lowestY) / 2} fill="#f59e0b" fontSize="10" fontWeight="bold">
                Sag: {convertMetersToUnit(midspanSagMeters, unit)}
              </text>

              {/* 3. Actual Clearance Dimension Arrow (Center) */}
              <line x1={midspanX} y1={lowestY} x2={midspanX} y2={obstacleY} stroke={statusColor} strokeWidth="2.5" />
              <polygon points={`${midspanX},${lowestY} ${midspanX - 5},${lowestY + 8} ${midspanX + 5},${lowestY + 8}`} fill={statusColor} />
              <polygon points={`${midspanX},${obstacleY} ${midspanX - 5},${obstacleY - 8} ${midspanX + 5},${obstacleY - 8}`} fill={statusColor} />
              
              {/* Callout Label Box */}
              <rect x={midspanX + 10} y={(lowestY + obstacleY) / 2 - 14} width="160" height="28" fill="#0f172a" stroke={statusColor} strokeWidth="1.5" rx="6" />
              <text x={midspanX + 18} y={(lowestY + obstacleY) / 2 + 3} fill="#f8fafc" fontSize="11" fontWeight="bold">
                Actual: {convertMetersToUnit(actualClearanceM, unit)}
              </text>

              {/* 4. Required CSA Limit Callout (Right Side) */}
              <line x1={poleRightX + 25} y1={requiredClearanceY} x2={poleRightX + 25} y2={obstacleY} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x={poleRightX + 30} y={(requiredClearanceY + obstacleY) / 2} fill="#38bdf8" fontSize="10" fontWeight="bold">
                Req: {convertMetersToUnit(totalRequiredClearanceM, unit)}
              </text>
            </g>
          )}
        </svg>

      </div>

      {/* Canvas Summary Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', background: 'var(--bg-secondary)', padding: '0.65rem 0.9rem', borderRadius: '8px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Net Clearance Margin: <strong style={{ color: statusColor, fontSize: '0.95rem' }}>{convertMetersToUnit(clearanceMarginM, unit)}</strong>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Lowest Conductor Point: <strong>{convertMetersToUnit(conductorLowestPointM, unit)}</strong> above ground
        </div>
      </div>

    </div>
  );
}
