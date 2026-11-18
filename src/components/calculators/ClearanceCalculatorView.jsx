import React, { useState, useEffect } from 'react';
import { Sliders, Ruler } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useUnits } from '../../context/UnitContext';
import { calculateVerticalClearance, UTILITY_OVERLAYS } from '../../core/clearance/clearanceEngine';
import { TABLE_2_ROW_OPTIONS } from '../../data/csa/c22_3_no1/table2';
import TraceViewer from '../common/TraceViewer';
import ClearanceVisualizer from '../ClearanceVisualizer';

const SORTED_ROW_OPTIONS = [...TABLE_2_ROW_OPTIONS].sort((a, b) =>
  a.label.localeCompare(b.label)
);

const SORTED_CIRCUIT_OPTIONS = [
  { value: 'communication', label: 'Communication Wire/Cable' },
  { value: 'grounded', label: 'Grounded / Neutral Messenger' },
  { value: 'supply', label: 'Supply Conductor (ac)' }
].sort((a, b) => a.label.localeCompare(b.label));

const SORTED_OVERLAYS = [...UTILITY_OVERLAYS].sort((a, b) =>
  a.label.localeCompare(b.label)
);

export default function ClearanceCalculatorView({ onOpenCitation }) {
  const { activeProject } = useProject();
  const { unit, formatDistance } = useUnits();

  // Inputs State
  const [rowId, setRowId] = useState(
    SORTED_ROW_OPTIONS.find((r) => r.id === 'road_vehicular')?.id || SORTED_ROW_OPTIONS[0]?.id || 'road_vehicular'
  );
  const [operatingVoltageKv, setOperatingVoltageKv] = useState(activeProject?.operatingVoltageKv || 25.0);
  const [circuitKind, setCircuitKind] = useState('supply');
  const [elevationMeters, setElevationMeters] = useState(0);
  const [ownerOverlayId, setOwnerOverlayId] = useState(
    activeProject?.ownerOverlayId || SORTED_OVERLAYS[0]?.id || 'csa_std'
  );
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
    <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* View Header */}
      <div className="glass-panel" style={{ padding: '1.35rem 1.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'var(--accent-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                }}
              >
                <Ruler size={18} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Vertical Clearance Engine &amp; Compliance
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.35rem 0 0' }}>
              Authentic CSA C22.3 No. 1 Table 2 resolution with Clause 5.3.1.1 voltage adders, altitude factors, and owner buffer overlays.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Project:</span>
            <span className="badge badge-info">{activeProject?.name || 'Standard'}</span>
          </div>
        </div>
      </div>

      {/* Main Responsive 2-Column Working Layout */}
      <div className="calc-workspace-grid">
        {/* Left: Parameter Controls */}
        <div className="glass-panel" style={{ padding: '1.45rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Sliders size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '0.96rem', fontWeight: 650, color: 'var(--text-main)', margin: 0 }}>
              Design Parameters &amp; Site Conditions
            </h3>
          </div>

          {/* 1. Crossing Category / Surface Category */}
          <div>
            <label>CSA Table 2 Surface / Crossing Category</label>
            <select value={rowId} onChange={(e) => setRowId(e.target.value)}>
              {SORTED_ROW_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Circuit Voltage & Kind */}
          <div className="grid-2">
            <div>
              <label>Operating Voltage (kV)</label>
              <input
                type="number"
                className="mono"
                step="0.1"
                min="0"
                max="1000"
                value={operatingVoltageKv}
                onChange={(e) => setOperatingVoltageKv(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label>Circuit Classification</label>
              <select value={circuitKind} onChange={(e) => setCircuitKind(e.target.value)}>
                {SORTED_CIRCUIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Site Elevation & Owner Overlay */}
          <div className="grid-2">
            <div>
              <label>Site Elevation (m ASL)</label>
              <input
                type="number"
                className="mono"
                step="50"
                min="0"
                max="5000"
                value={elevationMeters}
                onChange={(e) => setElevationMeters(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label>Owner Overlay (Buffer)</label>
              <select value={ownerOverlayId} onChange={(e) => setOwnerOverlayId(e.target.value)}>
                {SORTED_OVERLAYS.map((ovl) => (
                  <option key={ovl.id} value={ovl.id}>
                    {ovl.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {ownerOverlayId === 'custom' && (
            <div>
              <label>Custom Buffer (m)</label>
              <input
                type="number"
                className="mono"
                step="0.05"
                min="0"
                value={customBufferM}
                onChange={(e) => setCustomBufferM(parseFloat(e.target.value) || 0)}
              />
            </div>
          )}

          {/* 4. Conductor Attachment & Midspan Geometry */}
          <div className="glass-inset" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
              Field Conductor Geometry
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: '0.65rem' }}>
              <div>
                <label style={{ fontSize: '0.73rem' }}>Attachment (m)</label>
                <input
                  type="number"
                  className="mono"
                  step="0.1"
                  value={attachmentHeightM}
                  onChange={(e) => setAttachmentHeightM(parseFloat(e.target.value) || 0)}
                  style={{ padding: '0.5rem 0.65rem', fontSize: '0.84rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.73rem' }}>Midspan Sag (m)</label>
                <input
                  type="number"
                  className="mono"
                  step="0.1"
                  value={midspanSagM}
                  onChange={(e) => setMidspanSagM(parseFloat(e.target.value) || 0)}
                  style={{ padding: '0.5rem 0.65rem', fontSize: '0.84rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.73rem' }}>Obstacle (m)</label>
                <input
                  type="number"
                  className="mono"
                  step="0.1"
                  value={obstacleHeightM}
                  onChange={(e) => setObstacleHeightM(parseFloat(e.target.value) || 0)}
                  style={{ padding: '0.5rem 0.65rem', fontSize: '0.84rem' }}
                />
              </div>
            </div>
          </div>

          {/* 5. Sag Buffer Analysis */}
          <div className="glass-inset" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
              Side-by-Side Sag Conditions
            </h4>
            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.73rem' }}>Thermal Sag Buffer (m)</label>
                <input
                  type="number"
                  className="mono"
                  step="0.05"
                  value={thermalSagBufferM}
                  onChange={(e) => setThermalSagBufferM(parseFloat(e.target.value) || 0)}
                  style={{ padding: '0.5rem 0.65rem', fontSize: '0.84rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.73rem' }}>Ice/Wind Sag Buffer (m)</label>
                <input
                  type="number"
                  className="mono"
                  step="0.05"
                  value={iceWindSagBufferM}
                  onChange={(e) => setIceWindSagBufferM(parseFloat(e.target.value) || 0)}
                  style={{ padding: '0.5rem 0.65rem', fontSize: '0.84rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results Summary & Interactive Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          {/* Key Metric Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: '1rem' }}>
            {/* Required Clearance */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
                Design Required
              </div>
              <div className="mono" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.28rem' }}>
                {formatDistance(result.designRequiredClearanceM)}
              </div>
              <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Base: {result.baseTableClearanceM}m + Buffers: {result.ownerBufferM}m
              </div>
            </div>

            {/* Field Conductor Clearance */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
                Field Clearance
              </div>
              <div className="mono" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.28rem' }}>
                {formatDistance(result.actualClearanceM)}
              </div>
              <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Lowest pt: {result.baseConductorLowestPointM}m
              </div>
            </div>

            {/* Compliance Margin & Status */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
                Compliance Margin
              </div>
              <div
                className="mono"
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  color:
                    result.status === 'PASS'
                      ? 'var(--status-pass)'
                      : result.status === 'MARGINAL'
                        ? 'var(--status-marginal)'
                        : 'var(--status-violation)',
                  marginTop: '0.28rem'
                }}
              >
                {result.clearanceMarginM > 0 ? `+${formatDistance(result.clearanceMarginM)}` : formatDistance(result.clearanceMarginM)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 650, marginTop: '0.35rem' }}>
                <span className={`status-dot ${result.status === 'PASS' ? 'pass' : result.status === 'MARGINAL' ? 'marginal' : 'violation'}`} />
                <span
                  style={{
                    color:
                      result.status === 'PASS'
                        ? 'var(--status-pass)'
                        : result.status === 'MARGINAL'
                          ? 'var(--status-marginal)'
                          : 'var(--status-violation)'
                  }}
                >
                  {result.status === 'PASS' ? 'PASS' : result.status === 'MARGINAL' ? 'MARGINAL (<0.3m)' : 'VIOLATION'}
                </span>
              </div>
            </div>

            {/* Governing Sag Condition */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
                Governing Condition
              </div>
              <div style={{ fontSize: '0.96rem', fontWeight: 650, color: 'var(--text-main)', marginTop: '0.45rem' }}>
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
