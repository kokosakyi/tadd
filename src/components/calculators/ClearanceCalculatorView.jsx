import React, { useState, useEffect } from 'react';
import { Sliders, Shield, Zap, MapPin, Layers, AlertCircle, CheckCircle2, AlertTriangle, XCircle, Ruler } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useUnits } from '../../context/UnitContext';
import { calculateVerticalClearance, UTILITY_OVERLAYS } from '../../core/clearance/clearanceEngine';
import { TABLE_2_ROW_OPTIONS } from '../../data/csa/c22_3_no1/table2';
import TraceViewer from '../common/TraceViewer';
import ClearanceVisualizer from '../ClearanceVisualizer';

export default function ClearanceCalculatorView({ onOpenCitation }) {
  const { activeProject } = useProject();
  const { unit, formatDistance } = useUnits();

  // Inputs State
  const [rowId, setRowId] = useState(TABLE_2_ROW_OPTIONS[0]?.id || 'road_vehicular');
  const [operatingVoltageKv, setOperatingVoltageKv] = useState(activeProject?.operatingVoltageKv || 25.0);
  const [circuitKind, setCircuitKind] = useState('supply');
  const [elevationMeters, setElevationMeters] = useState(0);
  const [ownerOverlayId, setOwnerOverlayId] = useState(activeProject?.ownerOverlayId || 'csa_std');
  const [customBufferM, setCustomBufferM] = useState(activeProject?.customBufferM || 0.3);
  const [attachmentHeightM, setAttachmentHeightM] = useState(12.0);
  const [midspanSagM, setMidspanSagM] = useState(2.5);
  const [obstacleHeightM, setObstacleHeightM] = useState(0.0);
  const [thermalSagBufferM, setThermalSagBufferM] = useState(0.3);
  const [iceWindSagBufferM, setIceWindSagBufferM] = useState(0.5);

  // Sync with active project updates
  useEffect(() => {
    if (activeProject) {
      if (activeProject.operatingVoltageKv) setOperatingVoltageKv(activeProject.operatingVoltageKv);
      if (activeProject.ownerOverlayId) setOwnerOverlayId(activeProject.ownerOverlayId);
      if (activeProject.customBufferM !== undefined) setCustomBufferM(activeProject.customBufferM);
    }
  }, [activeProject]);

  // Execute Clearance Engine
  const { result, trace } = calculateVerticalClearance({
    rowId,
    operatingVoltageKv,
    circuitKind,
    elevationMeters,
    ownerOverlayId,
    customBufferM,
    attachmentHeightM,
    midspanSagM,
    obstacleHeightM,
    thermalSagBufferM,
    iceWindSagBufferM
  });

  // Category mapping for visualizer
  const visualizerCategoryObj = {
    id: rowId.includes('rail') ? 'railway' : rowId.includes('pedestrian') ? 'pedestrian_only' : 'road_truck',
    name: result.row?.label || 'Feature'
  };

  const visualizerCalculationResult = {
    attachmentHeightMeters: result.attachmentHeightM,
    midspanSagMeters: result.midspanSagM,
    obstacleHeightMeters: result.obstacleHeightM,
    totalRequiredClearanceM: result.designRequiredClearanceM,
    actualClearanceM: result.actualClearanceM,
    clearanceMarginM: result.clearanceMarginM,
    conductorLowestPointM: result.baseConductorLowestPointM,
    status: result.status === 'PASS' ? 'PASS' : result.status === 'MARGINAL' ? 'WARNING' : 'FAIL'
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* View Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Ruler size={22} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.015em' }}>
                Vertical Clearance Engine & Compliance (A2 / M3)
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              Authentic CSA C22.3 No. 1 Table 2 resolution with Clause 5.3.1.1 voltage adders, altitude factors, and owner buffer overlays.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Project:</span>
            <span className="badge badge-info" style={{ fontSize: '0.75rem', borderRadius: '8px', padding: '0.25rem 0.6rem' }}>
              {activeProject?.name || 'Standard'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Working Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.5rem' }}>
        
        {/* Left: Parameter Controls */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem' }}>
            <Sliders size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
              Design Parameters & Site Conditions
            </h3>
          </div>

          {/* 1. Crossing Category / Surface Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
              CSA Table 2 Surface / Crossing Category
            </label>
            <select
              value={rowId}
              onChange={(e) => setRowId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-input, 10px)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-inset)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              {TABLE_2_ROW_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Circuit Voltage & Kind */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Operating Voltage (kV)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1000"
                value={operatingVoltageKv}
                onChange={(e) => setOperatingVoltageKv(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-input, 10px)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-inset)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontVariantNumeric: 'tabular-nums',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Circuit Classification
              </label>
              <select
                value={circuitKind}
                onChange={(e) => setCircuitKind(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-input, 10px)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-inset)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="supply">Supply Conductor (ac)</option>
                <option value="communication">Communication Wire/Cable</option>
                <option value="grounded">Grounded / Neutral Messenger</option>
              </select>
            </div>
          </div>

          {/* 3. Owner Overlay & Safety Buffer */}
          <div style={{ display: 'grid', gridTemplateColumns: ownerOverlayId === 'custom' ? '1fr 1fr' : '1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Owner Overlay (Buffer)
              </label>
              <select
                value={ownerOverlayId}
                onChange={(e) => setOwnerOverlayId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-input, 10px)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-inset)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                {UTILITY_OVERLAYS.map((ovl) => (
                  <option key={ovl.id} value={ovl.id}>{ovl.label}</option>
                ))}
              </select>
            </div>

            {ownerOverlayId === 'custom' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                  Custom Buffer (m)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={customBufferM}
                  onChange={(e) => setCustomBufferM(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-input, 10px)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-inset)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontVariantNumeric: 'tabular-nums',
                    outline: 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* 4. Conductor Attachment & Midspan Geometry */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Field Conductor Geometry
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Attachment (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={attachmentHeightM}
                  onChange={(e) => setAttachmentHeightM(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 'var(--radius-input, 10px)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-inset)',
                    color: 'var(--text-main)',
                    fontSize: '0.825rem',
                    fontVariantNumeric: 'tabular-nums',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Midspan Sag (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={midspanSagM}
                  onChange={(e) => setMidspanSagM(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 'var(--radius-input, 10px)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-inset)',
                    color: 'var(--text-main)',
                    fontSize: '0.825rem',
                    fontVariantNumeric: 'tabular-nums',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Obstacle (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={obstacleHeightM}
                  onChange={(e) => setObstacleHeightM(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 'var(--radius-input, 10px)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-inset)',
                    color: 'var(--text-main)',
                    fontSize: '0.825rem',
                    fontVariantNumeric: 'tabular-nums',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* 5. Sag Buffer Analysis */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Side-by-Side Sag Conditions
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Thermal Sag Buffer (m)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={thermalSagBufferM}
                  onChange={(e) => setThermalSagBufferM(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 'var(--radius-input, 10px)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-inset)',
                    color: 'var(--text-main)',
                    fontSize: '0.825rem',
                    fontVariantNumeric: 'tabular-nums',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Ice/Wind Sag Buffer (m)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={iceWindSagBufferM}
                  onChange={(e) => setIceWindSagBufferM(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 'var(--radius-input, 10px)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-inset)',
                    color: 'var(--text-main)',
                    fontSize: '0.825rem',
                    fontVariantNumeric: 'tabular-nums',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right: Results Summary & Interactive Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Key Metric Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            
            {/* Required Clearance */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Design Required
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--accent-cyan)', fontVariantNumeric: 'tabular-nums lining-nums', marginTop: '0.25rem' }}>
                {formatDistance(result.designRequiredClearanceM)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontVariantNumeric: 'tabular-nums' }}>
                Base: {result.baseTableClearanceM}m + Buffers: {result.ownerBufferM}m
              </div>
            </div>

            {/* Field Conductor Clearance */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Field Clearance
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums lining-nums', marginTop: '0.25rem' }}>
                {formatDistance(result.actualClearanceM)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontVariantNumeric: 'tabular-nums' }}>
                Lowest pt: {result.baseConductorLowestPointM}m
              </div>
            </div>

            {/* Compliance Margin & Status */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Compliance Margin
              </div>
              <div
                style={{
                  fontSize: '1.65rem',
                  fontWeight: '700',
                  color: result.status === 'PASS' ? 'var(--status-pass)' : result.status === 'MARGINAL' ? 'var(--status-marginal)' : 'var(--status-violation)',
                  fontVariantNumeric: 'tabular-nums lining-nums',
                  marginTop: '0.25rem'
                }}
              >
                {result.clearanceMarginM > 0 ? `+${formatDistance(result.clearanceMarginM)}` : formatDistance(result.clearanceMarginM)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '600', marginTop: '0.35rem' }}>
                <span className={`status-dot ${result.status === 'PASS' ? 'pass' : result.status === 'MARGINAL' ? 'marginal' : 'violation'}`} />
                <span style={{ color: result.status === 'PASS' ? 'var(--status-pass)' : result.status === 'MARGINAL' ? 'var(--status-marginal)' : 'var(--status-violation)' }}>
                  {result.status === 'PASS' ? 'PASS' : result.status === 'MARGINAL' ? 'MARGINAL (<0.3m)' : 'VIOLATION'}
                </span>
              </div>
            </div>

            {/* Governing Sag Condition */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Governing Condition
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '0.45rem' }}>
                {result.governingSagCondition}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {result.isIceGoverning ? 'Ice/wind sag governs' : 'Max thermal sag governs'}
              </div>
            </div>

          </div>

          {/* Interactive SVG Visualizer */}
          <ClearanceVisualizer
            calculationResult={visualizerCalculationResult}
            categoryObj={visualizerCategoryObj}
            unit={unit}
          />

        </div>
      </div>

      {/* Bottom: Live Engineering Audit Trace Card */}
      <TraceViewer trace={trace} onOpenCitation={onOpenCitation} />

    </div>
  );
}
