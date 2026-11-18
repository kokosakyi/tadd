import React, { useState } from 'react';
import {
  TreePine,
  Plus,
  Trash2,
  Sliders,
  Layers,
  AlertTriangle,
  Activity,
  Calculator,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useUnits } from '../../context/UnitContext';
import {
  calculateWoodPoleStructural,
  exportPoleElevationProfileCsv,
  getAllO15Species,
  getAllO15PoleClasses,
  getAllAnsiSpecies
} from '../../core/woodPole/woodPoleEngine';
import TraceViewer from '../common/TraceViewer';
import Latex from '../common/Latex';

export default function WoodPoleCalculatorView({ onOpenCitation }) {
  const { activeProject } = useProject();
  const { formatMoment } = useUnits();

  // Standard & Mode State
  const [standard, setStandard] = useState('CSA'); // 'CSA' | 'ANSI'
  const [loadInputMode, setLoadInputMode] = useState('line_physics'); // 'line_physics' | 'direct_loads'

  // Species lists sorted alphabetically by commonName using localeCompare per project rules
  const csaSpeciesList = getAllO15Species().sort((a, b) => a.commonName.localeCompare(b.commonName));
  const ansiSpeciesList = getAllAnsiSpecies().sort((a, b) => a.commonName.localeCompare(b.commonName));
  const activeSpeciesList = standard === 'ANSI' ? ansiSpeciesList : csaSpeciesList;
  const allPoleClasses = getAllO15PoleClasses().sort((a, b) =>
    String(a.class).localeCompare(String(b.class))
  );

  // Calculation State
  const [speciesCode, setSpeciesCode] = useState('WC');
  const [poleLengthM, setPoleLengthM] = useState(13.7); // 45 ft
  const [poleClass, setPoleClass] = useState('3');
  const [grade, setGrade] = useState(2);
  const [strengthFactorPhi, setStrengthFactorPhi] = useState(0.671);
  const [enablePDelta, setEnablePDelta] = useState(true);
  const [enableHeightAdjustment, setEnableHeightAdjustment] = useState(false);
  const [windPressurePa, setWindPressurePa] = useState(400);
  const [iceThicknessMm, setIceThicknessMm] = useState(12.5);
  const [windSpanM, setWindSpanM] = useState(60);
  const [lineAngleDeg, setLineAngleDeg] = useState(0);

  // Optional custom circumferences (in inches) for exact benchmark or custom pole analysis
  const [customTipCircIn, setCustomTipCircIn] = useState('');
  const [customButtCircIn, setCustomButtCircIn] = useState('');
  const [customEmbedmentFt, setCustomEmbedmentFt] = useState('');

  // Attachments State
  const [attachments, setAttachments] = useState([
    {
      id: 1,
      name: 'Primary 3-Phase Conductor',
      heightM: 11.5,
      count: 3,
      diameterMm: 15.0,
      tensionN: 7000,
      eccentricityM: 0,
      distFromTipFt: 6.0,
      transverseForceLbs: 792,
      verticalForceLbs: 546,
      eccentricityFt: 5.5
    },
    {
      id: 2,
      name: 'Neutral / Secondary Cable',
      heightM: 9.8,
      count: 1,
      diameterMm: 12.0,
      tensionN: 4500,
      eccentricityM: 0,
      distFromTipFt: 11.0,
      transverseForceLbs: 792,
      verticalForceLbs: 546,
      eccentricityFt: -5.5
    },
    {
      id: 3,
      name: 'Telecom Bundle (Joint Use)',
      heightM: 7.5,
      count: 1,
      diameterMm: 25.0,
      tensionN: 3500,
      eccentricityM: 0,
      distFromTipFt: 16.0,
      transverseForceLbs: 792,
      verticalForceLbs: 546,
      eccentricityFt: 5.5
    }
  ]);

  // Switch between CSA and ANSI standards with sensible defaults
  const handleSelectStandard = (nextStd) => {
    setStandard(nextStd);
    if (nextStd === 'ANSI') {
      setEnablePDelta(true);
      setEnableHeightAdjustment(true);
      if (!ansiSpeciesList.some((s) => s.speciesCode === speciesCode)) {
        setSpeciesCode('DF');
      }
    } else {
      setEnableHeightAdjustment(false);
      if (!csaSpeciesList.some((s) => s.speciesCode === speciesCode)) {
        setSpeciesCode('WC');
      }
    }
  };

  // One-click preset for ASCE 141 / ANSI O5.1 Appendix B 75ft H1 Douglas Fir Benchmark
  const handleLoadAsceBenchmark = () => {
    setStandard('ANSI');
    setLoadInputMode('direct_loads');
    setSpeciesCode('DF');
    setPoleClass('H1');
    setPoleLengthM(Number((75 * 0.3048).toFixed(3))); // 22.86 m = 75 ft
    setCustomEmbedmentFt('9.5');
    setCustomTipCircIn('29.0');
    setCustomButtCircIn('55.5');
    setStrengthFactorPhi(0.671);
    setEnablePDelta(true);
    setEnableHeightAdjustment(true);
    setWindPressurePa(Number((19.97 * 47.88026).toFixed(2))); // 19.97 psf = 956.17 Pa
    setAttachments([
      {
        id: 1,
        name: 'OHGW / Shield Wire (Load 1)',
        heightM: 19.66,
        count: 1,
        diameterMm: 10,
        tensionN: 2000,
        distFromTipFt: 1.0,
        transverseForceLbs: 265,
        verticalForceLbs: 137,
        eccentricityFt: 0.5
      },
      {
        id: 2,
        name: 'Top Phase A (Load 2)',
        heightM: 18.14,
        count: 1,
        diameterMm: 20,
        tensionN: 5000,
        distFromTipFt: 6.0,
        transverseForceLbs: 792,
        verticalForceLbs: 546,
        eccentricityFt: 5.5
      },
      {
        id: 3,
        name: 'Middle Phase B (Load 3)',
        heightM: 16.61,
        count: 1,
        diameterMm: 20,
        tensionN: 5000,
        distFromTipFt: 11.0,
        transverseForceLbs: 792,
        verticalForceLbs: 546,
        eccentricityFt: -5.5
      },
      {
        id: 4,
        name: 'Bottom Phase C (Load 4)',
        heightM: 15.09,
        count: 1,
        diameterMm: 20,
        tensionN: 5000,
        distFromTipFt: 16.0,
        transverseForceLbs: 792,
        verticalForceLbs: 546,
        eccentricityFt: 5.5
      }
    ]);
  };

  // Reset to CSA Standard Distribution Pole
  const handleResetCsaDistribution = () => {
    setStandard('CSA');
    setLoadInputMode('line_physics');
    setSpeciesCode('WC');
    setPoleClass('3');
    setPoleLengthM(13.7);
    setCustomEmbedmentFt('');
    setCustomTipCircIn('');
    setCustomButtCircIn('');
    setGrade(2);
    setEnablePDelta(false);
    setEnableHeightAdjustment(false);
    setWindPressurePa(400);
    setIceThicknessMm(12.5);
    setWindSpanM(60);
    setLineAngleDeg(0);
    setAttachments([
      {
        id: 1,
        name: 'Primary 3-Phase Conductor',
        heightM: 11.5,
        count: 3,
        diameterMm: 15.0,
        tensionN: 7000,
        distFromTipFt: 2.0,
        transverseForceLbs: 500,
        verticalForceLbs: 300,
        eccentricityFt: 0
      },
      {
        id: 2,
        name: 'Neutral / Secondary Cable',
        heightM: 9.8,
        count: 1,
        diameterMm: 12.0,
        tensionN: 4500,
        distFromTipFt: 7.5,
        transverseForceLbs: 250,
        verticalForceLbs: 150,
        eccentricityFt: 0
      },
      {
        id: 3,
        name: 'Telecom Bundle (Joint Use)',
        heightM: 7.5,
        count: 1,
        diameterMm: 25.0,
        tensionN: 3500,
        distFromTipFt: 15.0,
        transverseForceLbs: 300,
        verticalForceLbs: 200,
        eccentricityFt: 0
      }
    ]);
  };

  const handleAddAttachment = () => {
    const newId = attachments.length > 0 ? Math.max(...attachments.map((a) => a.id)) + 1 : 1;
    setAttachments([
      ...attachments,
      {
        id: newId,
        name: `Attachment ${newId}`,
        heightM: Math.max(2, Number((poleLengthM * 0.7).toFixed(1))),
        count: 1,
        diameterMm: 14.0,
        tensionN: 3000,
        eccentricityM: 0,
        distFromTipFt: 5.0,
        transverseForceLbs: 400,
        verticalForceLbs: 250,
        eccentricityFt: 2.0
      }
    ]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleUpdateAttachment = (id, field, value) => {
    setAttachments(
      attachments.map((att) => (att.id === id ? { ...att, [field]: value } : att))
    );
  };

  // Run calculation via Unified Core Engine
  const results = calculateWoodPoleStructural({
    standard,
    loadInputMode,
    speciesCode,
    poleLengthM,
    poleLengthFt: customEmbedmentFt ? Number((poleLengthM * 3.28084).toFixed(1)) : undefined,
    embedmentFt: customEmbedmentFt ? parseFloat(customEmbedmentFt) : undefined,
    poleClass,
    tipCircumferenceIn: customTipCircIn ? parseFloat(customTipCircIn) : undefined,
    buttCircumference6ftIn: customButtCircIn ? parseFloat(customButtCircIn) : undefined,
    grade,
    strengthFactorPhi,
    enablePDelta,
    enableHeightAdjustment,
    numSegments: 25,
    windPressurePa,
    iceThicknessMm,
    windSpanM,
    lineAngleDeg,
    attachments
  });

  const isPassing = results.utilization.isPassing;
  const isAnsi = results.standard === 'ANSI';
  const critSeg = results.criticalSection;
  const glSeg = results.groundlineSection;

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* View Header & Standard Switcher */}
      <div className="glass-panel" style={{ padding: '1.35rem 1.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.92), rgba(217, 119, 6, 0.88))',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                }}
              >
                <TreePine size={18} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Wood Pole Loading &amp; Structural Sizing
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.35rem 0 0' }}>
              {isAnsi
                ? 'ANSI O5.1-2017 & ASCE Manual of Practice 141 — Discretized Non-Linear P-Delta, 5% LEL & Height-Adjusted Capacity.'
                : 'CSA C22.3 No. 1 Table 31 OCFs & CSA O15 Fiber Stress — Groundline & Multi-Segment Taper Check.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Standard Toggle Pill */}
            <div className="segmented-pill-bar">
              <button
                type="button"
                className={`segmented-pill-btn ${!isAnsi ? 'active' : ''}`}
                onClick={() => handleSelectStandard('CSA')}
              >
                CSA C22.3 / O15
              </button>
              <button
                type="button"
                className={`segmented-pill-btn ${isAnsi ? 'active' : ''}`}
                onClick={() => handleSelectStandard('ANSI')}
              >
                ANSI O5.1 / ASCE 141
              </button>
            </div>

            <button
              type="button"
              onClick={isAnsi ? handleResetCsaDistribution : handleLoadAsceBenchmark}
              className="btn-secondary"
              style={{ fontSize: '0.76rem', padding: '0.42rem 0.88rem' }}
              title="Switch between CSA 45ft Distribution and ASCE 141 75ft H1 Benchmark"
            >
              <Sparkles size={14} color="var(--accent-cyan)" />
              {isAnsi ? 'Load CSA 45ft Preset' : 'Load ASCE 75ft Benchmark'}
            </button>

            <span className="badge badge-info">
              {activeProject?.name || 'Standard'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Responsive 2-Column Working Layout */}
      <div className="calc-workspace-grid-wide">
        {/* Left: Controls & Attachments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          {/* Structure Parameters Card */}
          <div className="glass-panel" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '0.96rem', fontWeight: 650, color: 'var(--text-main)', margin: 0 }}>
                  Pole Geometry &amp; Material
                </h3>
              </div>
              <span className="badge badge-info">
                {isAnsi ? 'ANSI O5.1' : 'CSA O15'}
              </span>
            </div>

            {/* Species Selector (Alphabetically Sorted) */}
            <div>
              <label>
                Wood Species ({isAnsi ? 'ANSI O5.1 Table 1' : 'CSA O15 Table 3'})
              </label>
              <select
                value={speciesCode}
                onChange={(e) => setSpeciesCode(e.target.value)}
              >
                {activeSpeciesList.map((s) => (
                  <option key={s.id || s.speciesCode} value={s.speciesCode}>
                    {s.commonName} ({isAnsi ? `MOR = ${s.fibreStress_psi} psi` : `fb = ${s.fibreStress_MPa || s.fibreStressMPa} MPa`})
                  </option>
                ))}
              </select>
            </div>

            {/* Class, Length, Grade / Phi */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '0.65rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem' }}>Pole Class</label>
                <select
                  value={poleClass}
                  onChange={(e) => setPoleClass(e.target.value)}
                  style={{ padding: '0.52rem 1.85rem 0.52rem 0.65rem', fontSize: '0.8rem' }}
                >
                  {allPoleClasses.map((c) => (
                    <option key={c.class} value={c.class}>
                      Class {c.class} ({isAnsi ? `${c.load_lbf} lbs` : `${Number((c.load_N / 1000).toFixed(1))} kN`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem' }}>Total Length (m)</label>
                <input
                  type="number"
                  className="mono"
                  step="0.5"
                  min="9"
                  max="35"
                  value={poleLengthM}
                  onChange={(e) => setPoleLengthM(parseFloat(e.target.value) || 12)}
                  style={{ padding: '0.52rem 0.65rem', fontSize: '0.82rem' }}
                />
              </div>

              {!isAnsi ? (
                <div>
                  <label style={{ fontSize: '0.74rem' }}>Construction Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(parseInt(e.target.value, 10))}
                    style={{ padding: '0.52rem 1.85rem 0.52rem 0.65rem', fontSize: '0.8rem' }}
                  >
                    <option value={1}>Grade 1 (OCF 2.2x)</option>
                    <option value={2}>Grade 2 (OCF 1.65x)</option>
                    <option value={3}>Grade 3 (OCF 1.3x)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '0.74rem' }}>LRFD Factor (φ)</label>
                  <input
                    type="number"
                    className="mono"
                    step="0.01"
                    min="0.4"
                    max="1.0"
                    value={strengthFactorPhi}
                    onChange={(e) => setStrengthFactorPhi(parseFloat(e.target.value) || 0.671)}
                    style={{ padding: '0.52rem 0.65rem', fontSize: '0.82rem' }}
                  />
                </div>
              )}
            </div>

            {/* Non-Linear P-Delta & Height Adjustment Toggles */}
            <div className="glass-inset" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.65rem', padding: '0.75rem 0.9rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, cursor: 'pointer', fontSize: '0.76rem', color: 'var(--text-main)' }}>
                <input
                  type="checkbox"
                  checked={enablePDelta}
                  onChange={(e) => setEnablePDelta(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span>Gere-Carter P-Delta (AF={results.buckling.amplificationFactor})</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, cursor: 'pointer', fontSize: '0.76rem', color: 'var(--text-main)' }}>
                <input
                  type="checkbox"
                  checked={enableHeightAdjustment}
                  onChange={(e) => setEnableHeightAdjustment(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span>Height MOR Reduction</span>
              </label>
            </div>

            {/* Environmental & Line Span Inputs */}
            <div className="grid-2" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem' }}>Wind Pressure (Pa)</label>
                <input
                  type="number"
                  className="mono"
                  value={windPressurePa}
                  onChange={(e) => setWindPressurePa(parseFloat(e.target.value) || 0)}
                  style={{ padding: '0.52rem 0.7rem', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem' }}>Radial Ice (mm)</label>
                <input
                  type="number"
                  className="mono"
                  value={iceThicknessMm}
                  onChange={(e) => setIceThicknessMm(parseFloat(e.target.value) || 0)}
                  style={{ padding: '0.52rem 0.7rem', fontSize: '0.84rem' }}
                />
              </div>

              {loadInputMode === 'line_physics' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.75rem' }}>Wind Span (m)</label>
                    <input
                      type="number"
                      className="mono"
                      value={windSpanM}
                      onChange={(e) => setWindSpanM(parseFloat(e.target.value) || 0)}
                      style={{ padding: '0.52rem 0.7rem', fontSize: '0.84rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem' }}>Line Angle (degrees)</label>
                    <input
                      type="number"
                      className="mono"
                      min="0"
                      max="90"
                      value={lineAngleDeg}
                      onChange={(e) => setLineAngleDeg(parseFloat(e.target.value) || 0)}
                      style={{ padding: '0.52rem 0.7rem', fontSize: '0.84rem' }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Attachments Card with Load Mode Switcher */}
          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '0.96rem', fontWeight: 650, color: 'var(--text-main)', margin: 0 }}>
                  Attachments &amp; Cables ({attachments.length})
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <div className="segmented-pill-bar">
                  <button
                    type="button"
                    className={`segmented-pill-btn ${loadInputMode === 'line_physics' ? 'active' : ''}`}
                    onClick={() => setLoadInputMode('line_physics')}
                    style={{ fontSize: '0.72rem', padding: '0.24rem 0.6rem' }}
                  >
                    Line Physics
                  </button>
                  <button
                    type="button"
                    className={`segmented-pill-btn ${loadInputMode === 'direct_loads' ? 'active' : ''}`}
                    onClick={() => setLoadInputMode('direct_loads')}
                    style={{ fontSize: '0.72rem', padding: '0.24rem 0.6rem' }}
                  >
                    Direct 3D Loads
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="btn-secondary"
                  style={{ fontSize: '0.74rem', padding: '0.32rem 0.7rem' }}
                >
                  <Plus size={13} /> Add
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="glass-inset"
                  style={{
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.55rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={att.name}
                      onChange={(e) => handleUpdateAttachment(att.id, 'name', e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                        backdropFilter: 'none',
                        WebkitBackdropFilter: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.86rem',
                        fontWeight: 650,
                        outline: 'none',
                        width: '82%',
                        padding: 0
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      style={{ background: 'none', border: 'none', boxShadow: 'none', color: 'var(--status-violation)', cursor: 'pointer', padding: '0.2rem' }}
                      title="Remove attachment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {loadInputMode === 'line_physics' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.45rem', fontSize: '0.74rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Height (m)</span>
                        <input
                          type="number"
                          className="mono"
                          step="0.1"
                          value={att.heightM}
                          onChange={(e) => handleUpdateAttachment(att.id, 'heightM', parseFloat(e.target.value) || 0)}
                          style={{ padding: '0.38rem 0.48rem', fontSize: '0.76rem', borderRadius: '10px' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Count</span>
                        <input
                          type="number"
                          className="mono"
                          value={att.count}
                          onChange={(e) => handleUpdateAttachment(att.id, 'count', parseInt(e.target.value, 10) || 1)}
                          style={{ padding: '0.38rem 0.48rem', fontSize: '0.76rem', borderRadius: '10px' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Diam (mm)</span>
                        <input
                          type="number"
                          className="mono"
                          step="0.5"
                          value={att.diameterMm}
                          onChange={(e) => handleUpdateAttachment(att.id, 'diameterMm', parseFloat(e.target.value) || 0)}
                          style={{ padding: '0.38rem 0.48rem', fontSize: '0.76rem', borderRadius: '10px' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tension (N)</span>
                        <input
                          type="number"
                          className="mono"
                          step="100"
                          value={att.tensionN}
                          onChange={(e) => handleUpdateAttachment(att.id, 'tensionN', parseFloat(e.target.value) || 0)}
                          style={{ padding: '0.38rem 0.48rem', fontSize: '0.76rem', borderRadius: '10px' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.45rem', fontSize: '0.74rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Dist Tip z (ft)</span>
                        <input
                          type="number"
                          className="mono"
                          step="0.5"
                          value={att.distFromTipFt}
                          onChange={(e) => handleUpdateAttachment(att.id, 'distFromTipFt', parseFloat(e.target.value) || 0)}
                          style={{ padding: '0.38rem 0.48rem', fontSize: '0.76rem', borderRadius: '10px' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Trans T (lbs)</span>
                        <input
                          type="number"
                          className="mono"
                          step="10"
                          value={att.transverseForceLbs}
                          onChange={(e) => handleUpdateAttachment(att.id, 'transverseForceLbs', parseFloat(e.target.value) || 0)}
                          style={{ padding: '0.38rem 0.48rem', fontSize: '0.76rem', borderRadius: '10px' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Vert V (lbs)</span>
                        <input
                          type="number"
                          className="mono"
                          step="10"
                          value={att.verticalForceLbs}
                          onChange={(e) => handleUpdateAttachment(att.id, 'verticalForceLbs', parseFloat(e.target.value) || 0)}
                          style={{ padding: '0.38rem 0.48rem', fontSize: '0.76rem', borderRadius: '10px' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Ecc e (ft)</span>
                        <input
                          type="number"
                          className="mono"
                          step="0.5"
                          value={att.eccentricityFt}
                          onChange={(e) => handleUpdateAttachment(att.id, 'eccentricityFt', parseFloat(e.target.value) || 0)}
                          style={{ padding: '0.38rem 0.48rem', fontSize: '0.76rem', borderRadius: '10px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results Summary, Critical vs Groundline Comparison & Step-by-Step Math */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          {/* Top 4 Key Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
            {/* Factored Groundline Moment */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
                Factored Moment (Mf)
              </div>
              <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.28rem' }}>
                {isAnsi ? `${results.moments.totalFactoredMomentFtLbs.toLocaleString()} ft·lbs` : formatMoment(results.moments.totalFactoredMomentKNm)}
              </div>
              <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {isAnsi
                  ? `AF_PΔ = ${results.buckling.amplificationFactor}× (${results.moments.totalFactoredMomentKNm} kN·m)`
                  : `Wind OCF: ${results.factors.ocfWind}x | AF_PΔ: ${results.buckling.amplificationFactor}x`}
              </div>
            </div>

            {/* Resisting Moment Capacity */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
                Resisting Capacity (Mr)
              </div>
              <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.28rem' }}>
                {isAnsi ? `${results.moments.resistingMomentFtLbs.toLocaleString()} ft·lbs` : formatMoment(results.moments.resistingMomentKNm)}
              </div>
              <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Groundline S: {isAnsi ? `${results.geometry.sectionModulusIn3} in³` : `${results.geometry.sectionModulusM3} m³`}
              </div>
            </div>

            {/* Governing Utilization Percentage */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
                Utilization
              </div>
              <div
                className="mono"
                style={{
                  fontSize: '1.55rem',
                  fontWeight: 700,
                  color: isPassing ? 'var(--status-pass)' : 'var(--status-violation)',
                  marginTop: '0.28rem'
                }}
              >
                {results.utilization.percent}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 650, marginTop: '0.35rem' }}>
                <span className={`status-dot ${isPassing ? 'pass' : 'violation'}`} />
                <span style={{ color: isPassing ? 'var(--status-pass)' : 'var(--status-violation)' }}>
                  {isPassing ? 'PASS (ADEQUATE)' : 'OVERLOADED'}
                </span>
              </div>
            </div>

            {/* Recommended Class */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
                Recommended Class
              </div>
              <div style={{ fontSize: '1.38rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.35rem' }}>
                Class {results.classification.recommendedClass}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Current: Class {poleClass} ({results.geometry.poleLengthFt} ft)
              </div>
            </div>
          </div>

          {/* Critical Section vs Groundline Section Comparison + Elevation Profile Curve */}
          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 650, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  Multi-Segment Stress Profile &amp; Critical Elevation Analysis
                </span>
              </div>
              <span className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: isPassing ? 'var(--status-pass)' : 'var(--status-violation)' }}>
                Max Usage: {results.utilization.criticalPercent}% at H = {critSeg.heightAboveGlFt} ft
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '9px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.05rem' }}>
              <div
                style={{
                  width: `${Math.min(100, results.utilization.percent)}%`,
                  height: '100%',
                  background: isPassing ? 'var(--status-pass)' : 'var(--status-violation)',
                  borderRadius: '9999px',
                  transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>

            {/* Side-by-Side Critical vs Groundline Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
              {/* Critical Section Card */}
              <div
                className="glass-inset"
                style={{
                  padding: '1rem 1.15rem',
                  borderColor: results.utilization.isCriticalAboveGroundline ? 'rgba(56, 189, 248, 0.45)' : undefined
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                    Governing Critical Section
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                    z = {critSeg.distFromTipFt} ft ({critSeg.heightAboveGlFt} ft above GL)
                  </span>
                </div>
                <div className="mono" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.69rem' }}>Diameter / S</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{critSeg.diameterIn}&quot; / {critSeg.sectionModulusIn3} in³</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.69rem' }}>Stress / Cap</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{critSeg.combinedStressPsi} / {critSeg.allowableStressPsi} psi</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.69rem' }}>Usage %</div>
                    <div style={{ fontWeight: 700, color: critSeg.usagePercent <= 100 ? 'var(--status-pass)' : 'var(--status-violation)' }}>
                      {critSeg.usagePercent}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Groundline Section Card */}
              <div className="glass-inset" style={{ padding: '1rem 1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Groundline Section (Base)
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                    z = {glSeg.distFromTipFt} ft (H = 0.0 ft)
                  </span>
                </div>
                <div className="mono" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.69rem' }}>Diameter / S</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{glSeg.diameterIn}&quot; / {glSeg.sectionModulusIn3} in³</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.69rem' }}>Stress / Cap</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{glSeg.combinedStressPsi} / {glSeg.allowableStressPsi} psi</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.69rem' }}>GL Usage %</div>
                    <div style={{ fontWeight: 700, color: results.utilization.groundlinePercent <= 100 ? 'var(--status-pass)' : 'var(--status-violation)' }}>
                      {results.utilization.groundlinePercent}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive SVG Utilization Profile Along Pole Shaft */}
            <div className="glass-inset" style={{ padding: '0.95rem 1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.55rem' }}>
                <span>Shaft Elevation Utilization Curve (Tip z=0 ft → Groundline z={glSeg.distFromTipFt} ft)</span>
                {results.utilization.isCriticalAboveGroundline && (
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertTriangle size={13} /> Peak stress occurs {critSeg.heightAboveGlFt} ft above groundline due to taper &amp; height factor
                  </span>
                )}
              </div>
              <svg viewBox="0 0 600 130" style={{ width: '100%', height: '130px', overflow: 'visible' }}>
                {[0, 25, 50, 75, 100].map((pct) => {
                  const y = 110 - (pct / 110) * 95;
                  return (
                    <g key={pct}>
                      <line x1="40" y1={y} x2="580" y2={y} stroke="var(--border-color)" strokeDasharray={pct === 100 ? '4 2' : '2 3'} strokeWidth="1" />
                      <text x="34" y={y + 3} textAnchor="end" fontSize="9" fill="var(--text-muted)">
                        {pct}%
                      </text>
                    </g>
                  );
                })}
                <polyline
                  fill="none"
                  stroke="var(--accent-cyan)"
                  strokeWidth="2.5"
                  points={results.elevationProfile
                    .map((seg) => {
                      const x = 40 + (seg.distFromTipFt / Math.max(1, glSeg.distFromTipFt)) * 540;
                      const y = 110 - (Math.min(115, seg.usagePercent) / 110) * 95;
                      return `${x.toFixed(1)},${y.toFixed(1)}`;
                    })
                    .join(' ')}
                />
                {(() => {
                  const cx = 40 + (critSeg.distFromTipFt / Math.max(1, glSeg.distFromTipFt)) * 540;
                  const cy = 110 - (Math.min(115, critSeg.usagePercent) / 110) * 95;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r="5" fill="var(--status-violation)" stroke="#fff" strokeWidth="1.5" />
                      <text x={Math.min(535, Math.max(55, cx))} y={Math.max(14, cy - 8)} textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--text-main)">
                        Crit: {critSeg.usagePercent}% (z={critSeg.distFromTipFt}ft)
                      </text>
                    </g>
                  );
                })()}
                <text x="40" y="124" fontSize="9" fill="var(--text-muted)">Tip (z=0)</text>
                <text x="310" y="124" textAnchor="middle" fontSize="9" fill="var(--text-muted)">Mid-Shaft (z={(glSeg.distFromTipFt / 2).toFixed(1)} ft)</text>
                <text x="580" y="124" textAnchor="end" fontSize="9" fill="var(--text-muted)">Groundline (z={glSeg.distFromTipFt} ft)</text>
              </svg>
            </div>

            {/* Moment Breakdown Grid */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.95rem' }}>
              <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650, marginBottom: '0.65rem' }}>
                Groundline Moment &amp; Buckling Breakdown
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))', gap: '0.65rem', fontSize: '0.78rem' }}>
                <div className="glass-inset" style={{ padding: '0.65rem 0.75rem', borderRadius: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.71rem' }}>Pole Shaft Wind</div>
                  <div className="mono" style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '0.18rem' }}>{results.moments.factoredPoleWindKNm} kN·m</div>
                </div>
                <div className="glass-inset" style={{ padding: '0.65rem 0.75rem', borderRadius: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.71rem' }}>Conductor Wind</div>
                  <div className="mono" style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '0.18rem' }}>{results.moments.factoredWireWindKNm} kN·m</div>
                </div>
                <div className="glass-inset" style={{ padding: '0.65rem 0.75rem', borderRadius: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.71rem' }}>Line-Angle Tension</div>
                  <div className="mono" style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '0.18rem' }}>{results.moments.factoredWireAngleKNm} kN·m</div>
                </div>
                <div className="glass-inset" style={{ padding: '0.65rem 0.75rem', borderRadius: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.71rem' }}>Euler Buckling Pcr</div>
                  <div className="mono" style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.18rem' }}>{results.buckling.criticalBucklingLoadLbs.toLocaleString()} lbs</div>
                </div>
                <div className="glass-inset" style={{ padding: '0.65rem 0.75rem', borderRadius: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.71rem' }}>Embedment Depth</div>
                  <div className="mono" style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '0.18rem' }}>{results.geometry.embedmentM} m ({results.geometry.embedmentFt} ft)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Mathematical Derivation & Formula Sheet (MathML + Live Substitutions) */}
          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Calculator size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Step-by-Step Mathematical Derivation &amp; Formula Sheet
              </h3>
            </div>

            <details className="calc-detail">
              <summary>Design Calculation — 6-Stage Structural Derivation ({results.standard} Mode)</summary>
              <div className="calc-body">
                
                {/* Stage 1: Tapered Shaft Geometry */}
                <div className="calc-step">
                  <div className="calc-label">Step 1: Tapered Shaft Discretization &amp; Section Properties</div>

                  {/* General Governing Geometry Equations */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">D_t, D_b, T_taper, S(z)</span>
                      <span className="calc-eq-purpose-label">Theoretical formulation for circular tapered cantilever section modulus</span>
                    </div>
                    <Latex block>
                      {`D_t = \\frac{C_t}{\\pi}, \\quad D_b = \\frac{C_b}{\\pi}, \\quad T_{\\text{taper}} = \\frac{D_b - D_t}{L - 6\\text{ ft}}, \\quad S(z) = \\frac{\\pi [D(z)]^3}{32}`}
                    </Latex>
                  </div>

                  {/* Diameters Evaluation */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">D_t &amp; D_b</span>
                      <span className="calc-eq-purpose-label">Tip &amp; butt diameters converted from circumference (ANSI Table 2 / CSA Table 4)</span>
                    </div>
                    <Latex block>
                      {`D_t = \\frac{${results.geometry.tipCircumferenceIn}}{\\pi} = ${results.geometry.tipDiameterIn}\\text{ in.}, \\quad D_b = \\frac{${results.geometry.buttCircumference6ftIn}}{\\pi} = ${results.geometry.buttDiameter6ftIn}\\text{ in.}`}
                    </Latex>
                  </div>

                  {/* Taper Rate */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">T_taper</span>
                      <span className="calc-eq-purpose-label">Shaft taper rate per foot of pole height</span>
                    </div>
                    <Latex block>
                      {`T_{\\text{taper}} = \\frac{${results.geometry.buttDiameter6ftIn} - ${results.geometry.tipDiameterIn}}{${results.geometry.poleLengthFt} - 6} = ${results.geometry.taperInPerFt}\\text{ in./ft}`}
                    </Latex>
                  </div>

                  {/* Groundline Diameter & Section Modulus */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">D_GL &amp; S_GL</span>
                      <span className="calc-eq-purpose-label">Groundline base diameter &amp; section modulus at embedment transition</span>
                    </div>
                    <Latex block>
                      {`D_{\\text{GL}} = ${results.geometry.tipDiameterIn} + (${results.geometry.taperInPerFt} \\times ${results.geometry.heightAboveGroundFt}) = ${results.geometry.groundlineDiameterIn}\\text{ in.} \\implies S_{\\text{GL}} = \\frac{\\pi (${results.geometry.groundlineDiameterIn})^3}{32} = ${results.geometry.sectionModulusIn3}\\text{ in.}^3 \\;(${results.geometry.sectionModulusM3}\\text{ m}^3)`}
                    </Latex>
                  </div>
                </div>

                {/* Stage 2: Material Capacity Adjustments */}
                <div className="calc-step">
                  <div className="calc-label">Step 2: Material Strength, 5% LEL &amp; Height-Adjustment Factor</div>

                  {/* Material Adjustment Formulation */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">{isAnsi ? 'MOR_5% & k_ht(z)' : 'M_r(z)'}</span>
                      <span className="calc-eq-purpose-label">{isAnsi ? '5th-percentile characteristic strength & ASCE 141 height factor' : 'Factored resisting moment capacity with species reduction'}</span>
                    </div>
                    <Latex block>
                      {isAnsi
                        ? `MOR_{5\\%} = MOR_{50\\%} \\cdot (1 - 1.645 \\cdot COV), \\quad k_{\\text{ht}}(z) = \\max\\left(0.85,\\, 1 - \\alpha \\frac{H(z)}{H_{\\text{GL}}}\\right)`
                        : `M_r(z) = f_b \\cdot S(z) \\cdot k_{\\text{species}} \\cdot k_{\\text{ht}}(z)`}
                    </Latex>
                  </div>

                  {/* Standard Base Fiber Stress */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">{isAnsi ? 'MOR_50% & COV' : 'f_b & k_species'}</span>
                      <span className="calc-eq-purpose-label">{isAnsi ? 'Mean Modulus of Rupture & designated standard variance' : 'Code specified fiber stress & species factor'}</span>
                    </div>
                    <Latex block>
                      {isAnsi
                        ? `MOR_{50\\%} = ${results.species.fiberStressPsi}\\text{ psi} \\;(${results.species.fiberStressMPa}\\text{ MPa}), \\quad COV = ${results.species.covPercent}\\%`
                        : `f_b = ${results.species.fiberStressMPa}\\text{ MPa} \\;(${results.species.fiberStressPsi}\\text{ psi}), \\quad k_{\\text{species}} = ${results.factors.speciesReductionFactor}`}
                    </Latex>
                  </div>

                  {/* Lower Exclusion Limit Evaluation */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">{isAnsi ? 'MOR_5%' : 'f_b (Factored)'}</span>
                      <span className="calc-eq-purpose-label">{isAnsi ? '5% Lower Exclusion Limit fiber stress (LEL)' : 'Base factored allowable bending strength'}</span>
                    </div>
                    <Latex block>
                      {isAnsi
                        ? `MOR_{5\\%} = ${results.species.fiberStressPsi} \\times (1 - 1.645 \\times ${(results.species.covPercent / 100).toFixed(2)}) = ${results.species.mor5PctPsi}\\text{ psi} \\;(${results.species.mor5PctMPa}\\text{ MPa})`
                        : `\\text{Base Factored } f_b = ${results.species.fiberStressMPa} \\times ${results.factors.speciesReductionFactor} = ${(results.species.fiberStressMPa * results.factors.speciesReductionFactor).toFixed(2)}\\text{ MPa}`}
                    </Latex>
                  </div>

                  {/* Critical Section Allowable Stress */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">k_ht &amp; σ_allow</span>
                      <span className="calc-eq-purpose-label">Height factor &amp; final allowable design stress at governing critical elevation</span>
                    </div>
                    <Latex block>
                      {`k_{\\text{ht}}(z_{\\text{crit}} = ${critSeg.distFromTipFt}\\text{ ft}) = ${critSeg.heightAdjFactor} \\implies \\sigma_{\\text{allow}} = ${critSeg.allowableStressPsi}\\text{ psi} \\;(${critSeg.allowableStressMPa}\\text{ MPa})`}
                    </Latex>
                  </div>
                </div>

                {/* Stage 3: Primary Bending Moment Integration */}
                <div className="calc-step">
                  <div className="calc-label">Step 3: Primary Load Integration &amp; Unamplified Bending Moments</div>

                  {/* Primary Moment Integration Equation */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">M_prim(z)</span>
                      <span className="calc-eq-purpose-label">Continuous integration of transverse attachment forces, eccentricities &amp; distributed pole wind</span>
                    </div>
                    <Latex block>
                      {`M_{\\text{prim}}(z) = \\sum_{z_i \\le z} \\left[ T_i (z - z_i) + V_i \\cdot e_i \\right] + \\frac{q_w C_d}{12} \\left( \\frac{D_t z^2}{2} + \\frac{T_{\\text{taper}} z^3}{6} \\right)`}
                    </Latex>
                  </div>

                  {/* Critical Section Moment */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">M_prim(z_crit)</span>
                      <span className="calc-eq-purpose-label">Primary bending moment acting at the governing critical station</span>
                    </div>
                    <Latex block>
                      {`M_{\\text{prim}}(z_{\\text{crit}} = ${critSeg.distFromTipFt}\\text{ ft}) = ${critSeg.primaryMomentFtLbs.toLocaleString()}\\text{ ft}\\cdot\\text{lbs} \\;(${critSeg.primaryMomentKNm}\\text{ kN}\\cdot\\text{m})`}
                    </Latex>
                  </div>

                  {/* Groundline Primary Moment */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">M_prim(z_GL)</span>
                      <span className="calc-eq-purpose-label">Primary bending moment at groundline base before P-Delta amplification</span>
                    </div>
                    <Latex block>
                      {`M_{\\text{prim}}(z_{\\text{GL}} = ${glSeg.distFromTipFt}\\text{ ft}) = ${glSeg.primaryMomentFtLbs.toLocaleString()}\\text{ ft}\\cdot\\text{lbs} \\;(${results.moments.primaryGroundlineMomentKNm}\\text{ kN}\\cdot\\text{m})`}
                    </Latex>
                  </div>
                </div>

                {/* Stage 4: Gere-Carter Buckling & P-Delta */}
                <div className="calc-step">
                  <div className="calc-label">Step 4: Non-Linear Gere-Carter Column Buckling &amp; P-Delta Amplification</div>

                  {/* Effective Section Formulation */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">D_eff, I_eff, P'_cr</span>
                      <span className="calc-eq-purpose-label">Effective geometric diameter, second moment of area &amp; base Euler critical load</span>
                    </div>
                    <Latex block>
                      {`D_{\\text{eff}} = \\sqrt{D_t \\cdot D_{\\text{GL}}}, \\quad I_{\\text{eff}} = \\frac{\\pi D_{\\text{eff}}^4}{64}, \\quad P'_{\\text{cr}} = \\frac{\\pi^2 \\cdot MOE \\cdot I_{\\text{eff}}}{4 H_{\\text{GL}}^2 \\cdot 144}`}
                    </Latex>
                  </div>

                  {/* Gere-Carter Factor & Amplification Formulation */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">P*, P_cr, AF_PΔ</span>
                      <span className="calc-eq-purpose-label">Gere-Carter taper stiffness modifier &amp; non-linear second-order moment amplification</span>
                    </div>
                    <Latex block>
                      {`P^* = \\left(\\frac{D_{\\text{GL}}}{D_t}\\right)^{2.7}, \\quad P_{\\text{cr}} = P'_{\\text{cr}} \\cdot P^*, \\quad AF_{P\\Delta} = \\frac{1}{1 - V_L / P_{\\text{cr}}}`}
                    </Latex>
                  </div>

                  {/* Effective Diameter & Inertia Evaluation */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">D_eff &amp; I_eff</span>
                      <span className="calc-eq-purpose-label">Computed equivalent cylindrical section properties</span>
                    </div>
                    <Latex block>
                      {`D_{\\text{eff}} = \\sqrt{${results.geometry.tipDiameterIn} \\times ${results.geometry.groundlineDiameterIn}} = ${results.buckling.effectiveDiameterIn}\\text{ in.} \\implies I_{\\text{eff}} = \\frac{\\pi (${results.buckling.effectiveDiameterIn})^4}{64} = ${results.buckling.effectiveInertiaIn4}\\text{ in.}^4`}
                    </Latex>
                  </div>

                  {/* Critical Buckling Load */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">P_cr</span>
                      <span className="calc-eq-purpose-label">Gere-Carter adjusted elastic cantilever column stability threshold</span>
                    </div>
                    <Latex block>
                      {`P'_{\\text{cr}} = ${results.buckling.eulerCriticalLoadPrimeLbs.toLocaleString()}\\text{ lbs}, \\quad P^* = (${(results.geometry.groundlineDiameterIn / Math.max(1, results.geometry.tipDiameterIn)).toFixed(3)})^{2.7} = ${results.buckling.taperFactorPStar} \\implies P_{\\text{cr}} = ${results.buckling.criticalBucklingLoadLbs.toLocaleString()}\\text{ lbs} \\;(${results.buckling.criticalBucklingLoadKN}\\text{ kN})`}
                    </Latex>
                  </div>

                  {/* P-Delta Amplification Factor */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">AF_PΔ</span>
                      <span className="calc-eq-purpose-label">Second-order deflection multiplier applied to primary bending moments</span>
                    </div>
                    <Latex block>
                      {`V_L = ${results.buckling.totalGroundlineAxialLoadLbs.toLocaleString()}\\text{ lbs} \\implies AF_{P\\Delta} = \\frac{1}{1 - ${results.buckling.totalGroundlineAxialLoadLbs} / ${results.buckling.criticalBucklingLoadLbs}} = ${results.buckling.amplificationFactor}\\times`}
                    </Latex>
                  </div>
                </div>

                {/* Stage 5 & 6: Combined Stress & Utilization */}
                <div className="calc-step">
                  <div className="calc-label">Step 5 &amp; 6: Combined Stress Interaction &amp; Governing Utilization Check</div>

                  {/* Interaction Formulation */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">{isAnsi ? 'f_a, f_b, U(z)' : 'M_f, M_r, U(z)'}</span>
                      <span className="calc-eq-purpose-label">{isAnsi ? 'Combined axial compression plus amplified bending interaction' : 'Factored moment vs resisting moment ratio'}</span>
                    </div>
                    <Latex block>
                      {isAnsi
                        ? `f_a(z) = \\frac{P(z)}{A(z)}, \\quad f_b(z) = \\frac{M_{\\text{prim}}(z) \\cdot AF_{P\\Delta} \\cdot 12}{S(z)}, \\quad U(z) = \\frac{f_a(z) + f_b(z)}{\\phi \\cdot MOR_{\\text{adj}}(z)} \\times 100\\%`
                        : `M_f(z) = M_{\\text{prim}}(z) \\cdot AF_{P\\Delta}, \\quad M_r(z) = f_b \\cdot S(z) \\cdot k_{\\text{species}}, \\quad U(z) = \\frac{M_f(z)}{M_r(z)} \\times 100\\%`}
                    </Latex>
                  </div>

                  {/* Stresses at Critical Section */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">{isAnsi ? 'f_b(z_crit) & f_a(z_crit)' : 'M_f(z_crit) & M_r(z_crit)'}</span>
                      <span className="calc-eq-purpose-label">Internal forces and stress components evaluated at peak critical elevation</span>
                    </div>
                    <Latex block>
                      {isAnsi
                        ? `\\text{Critical Section }(z=${critSeg.distFromTipFt}\\text{ ft}): \\; f_b = \\frac{${critSeg.amplifiedMomentFtLbs.toLocaleString()} \\times 12}{${critSeg.sectionModulusIn3}} = ${critSeg.bendingStressPsi}\\text{ psi}, \\quad f_a = \\frac{${critSeg.accumAxialLoadLbs}}{${critSeg.areaIn2}} = ${critSeg.axialStressPsi}\\text{ psi}`
                        : `\\text{Critical Section }(z=${critSeg.distFromTipFt}\\text{ ft}): \\; M_f = ${critSeg.amplifiedMomentKNm}\\text{ kN}\\cdot\\text{m}, \\quad M_r = ${critSeg.resistingMomentKNm}\\text{ kN}\\cdot\\text{m}`}
                    </Latex>
                  </div>

                  {/* Critical Section Governing Utilization */}
                  <div className="calc-eq-item" style={{ borderLeftColor: critSeg.usagePercent <= 100 ? 'var(--status-pass)' : 'var(--status-violation)' }}>
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge" style={{ color: critSeg.usagePercent <= 100 ? 'var(--status-pass)' : 'var(--status-violation)', background: critSeg.usagePercent <= 100 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', borderColor: critSeg.usagePercent <= 100 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)' }}>
                        U(z_crit) — GOVERNING
                      </span>
                      <span className="calc-eq-purpose-label">Maximum structural capacity utilization across the entire pole shaft</span>
                    </div>
                    <Latex block>
                      {isAnsi
                        ? `U(z_{\\text{crit}}) = \\frac{${critSeg.bendingStressPsi} + ${critSeg.axialStressPsi}}{${critSeg.allowableStressPsi}} \\times 100\\% = ${critSeg.usagePercent}\\% \\quad \\mathbf{(GOVERNING)}`
                        : `U(z_{\\text{crit}}) = \\frac{${critSeg.amplifiedMomentKNm}}{${critSeg.resistingMomentKNm}} \\times 100\\% = ${critSeg.usagePercent}\\% \\quad \\mathbf{(GOVERNING)}`}
                    </Latex>
                  </div>

                  {/* Groundline Base Section Check */}
                  <div className="calc-eq-item">
                    <div className="calc-eq-meta">
                      <span className="calc-eq-var-badge">U(z_GL)</span>
                      <span className="calc-eq-purpose-label">Groundline base section comparison check</span>
                    </div>
                    <Latex block>
                      {isAnsi
                        ? `\\text{Groundline Section }(z=${glSeg.distFromTipFt}\\text{ ft}): \\; f_b = ${glSeg.bendingStressPsi}\\text{ psi}, \\quad f_a = ${glSeg.axialStressPsi}\\text{ psi} \\implies U(z_{\\text{GL}}) = ${results.utilization.groundlinePercent}\\%`
                        : `\\text{Groundline Section }(z=${glSeg.distFromTipFt}\\text{ ft}): \\; M_f = ${results.moments.totalFactoredMomentKNm}\\text{ kN}\\cdot\\text{m}, \\quad M_r = ${results.moments.resistingMomentKNm}\\text{ kN}\\cdot\\text{m} \\implies U(z_{\\text{GL}}) = ${results.utilization.groundlinePercent}\\%`}
                    </Latex>
                  </div>
                </div>

              </div>
            </details>

            {/* Expandable Full Multi-Segment Elevation Profile Table */}
            <details className="calc-detail" style={{ marginTop: '0.85rem' }}>
              <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Multi-Segment Elevation Profile Table ({results.elevationProfile.length} Discretized Shaft Stations)</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const csv = exportPoleElevationProfileCsv(results.elevationProfile);
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `wood_pole_profile_${results.standard.toLowerCase()}_class_${poleClass}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '0.24rem 0.65rem' }}
                >
                  Export CSV
                </button>
              </summary>
              <div style={{ maxHeight: '360px', overflowY: 'auto', overflowX: 'auto' }}>
                <table className="table-borderless" style={{ width: '100%', fontSize: '0.76rem' }}>
                  <thead>
                    <tr>
                      <th>z from Tip (ft)</th>
                      <th>H above GL (ft)</th>
                      <th>Diam D (in)</th>
                      <th>Modulus S (in³)</th>
                      <th>Axial P (lbs)</th>
                      <th>M_prim (ft·lbs)</th>
                      <th>M_total (ft·lbs)</th>
                      <th>Bending fb (psi)</th>
                      <th>Height Adj</th>
                      <th>Allowable (psi)</th>
                      <th>Usage %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.elevationProfile.map((seg) => {
                      const isCrit = Math.abs(seg.distFromTipFt - critSeg.distFromTipFt) < 0.05 && seg.usagePercent > 0;
                      const isGl = seg.index === results.elevationProfile.length - 1;
                      return (
                        <tr
                          key={seg.index}
                          style={{
                            background: isCrit
                              ? 'rgba(56, 189, 248, 0.14)'
                              : isGl
                              ? 'rgba(16, 185, 129, 0.08)'
                              : undefined,
                            fontWeight: isCrit || isGl ? 700 : 400
                          }}
                        >
                          <td>{seg.distFromTipFt.toFixed(1)}</td>
                          <td>{seg.heightAboveGlFt.toFixed(1)}</td>
                          <td>{seg.diameterIn.toFixed(2)}</td>
                          <td>{seg.sectionModulusIn3.toFixed(1)}</td>
                          <td>{seg.accumAxialLoadLbs.toLocaleString()}</td>
                          <td>{seg.primaryMomentFtLbs.toLocaleString()}</td>
                          <td>{seg.amplifiedMomentFtLbs.toLocaleString()}</td>
                          <td>{seg.bendingStressPsi.toLocaleString()}</td>
                          <td>{seg.heightAdjFactor.toFixed(3)}</td>
                          <td>{seg.allowableStressPsi.toLocaleString()}</td>
                          <td style={{ color: seg.usagePercent > 100 ? 'var(--status-violation)' : isCrit ? 'var(--accent-cyan)' : 'var(--text-main)' }}>
                            {seg.usagePercent.toFixed(2)}% {isCrit ? '(CRIT)' : isGl ? '(GL)' : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>

            {/* Engineering Theory & Code Reference Explainer */}
            <details className="module-explainer" style={{ marginTop: '0.85rem' }}>
              <summary>Engineering Basis — CSA C22.3 No. 1 / CSA O15 vs. ANSI O5.1 / ASCE 141</summary>
              <div className="explainer-body">
                <p>
                  <strong>Why Maximum Pole Stress Often Occurs Above Groundline:</strong> While cantilever bending moment
                  increases monotonically toward the groundline, a round tapered pole&apos;s section modulus grows cubically with
                  diameter (<Latex math="S \propto D^3" />). When the groundline circumference exceeds <Latex math="1.5\times" /> the circumference at
                  the resultant load elevation (<strong>CSA O15 Clause B.1.3</strong>) or when height-dependent fiber stress
                  reductions apply (<strong>ANSI O5.1 Annex A / ASCE MOP 141</strong>), the critical stress zone shifts 15 to 30 ft
                  above the groundline.
                </p>
                <p>
                  <strong>Gere-Carter Non-Linear Buckling (P-Delta):</strong> Tapered wood cantilevers subjected to vertical
                  conductor, ice, and self-weight loads experience secondary lateral deflection moments. Using the Gere-Carter
                  tapered Euler formulation (<Latex math="P^* = (D_{\text{GL}} / D_t)^{2.7}" />), primary bending moments are amplified by{' '}
                  <Latex math="AF_{P\Delta} = \frac{1}{1 - V_L / P_{\text{cr}}}" />.
                </p>
              </div>
            </details>
          </div>

        </div>
      </div>

      {/* Bottom: Live Engineering Audit Trace Card */}
      <TraceViewer trace={results.trace} onOpenCitation={onOpenCitation} />

    </div>
  );
}
