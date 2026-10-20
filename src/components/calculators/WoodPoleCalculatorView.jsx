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
  const allPoleClasses = getAllO15PoleClasses();

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
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TreePine size={22} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.015em' }}>
                Wood Pole Loading & Structural Sizing (A6 / M3)
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
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
              style={{ fontSize: '0.75rem', padding: '0.38rem 0.75rem', borderRadius: '9999px' }}
              title="Switch between CSA 45ft Distribution and ASCE 141 75ft H1 Benchmark"
            >
              <Sparkles size={14} color="var(--accent-cyan)" />
              {isAnsi ? 'Load CSA 45ft Preset' : 'Load ASCE 75ft Benchmark'}
            </button>

            <span className="badge badge-info" style={{ fontSize: '0.75rem', borderRadius: '8px', padding: '0.25rem 0.6rem' }}>
              {activeProject?.name || 'Standard'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Working Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 450px) 1fr', gap: '1.5rem' }}>
        
        {/* Left: Controls & Attachments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Structure Parameters Card */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
                  Pole Geometry & Material
                </h3>
              </div>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                {isAnsi ? 'ANSI O5.1' : 'CSA O15'}
              </span>
            </div>

            {/* Species Selector (Alphabetically Sorted) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Wood Species ({isAnsi ? 'ANSI O5.1 Table 1' : 'CSA O15 Table 3'})
              </label>
              <select
                value={speciesCode}
                onChange={(e) => setSpeciesCode(e.target.value)}
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
                {activeSpeciesList.map((s) => (
                  <option key={s.id || s.speciesCode} value={s.speciesCode}>
                    {s.commonName} ({isAnsi ? `MOR = ${s.fibreStress_psi} psi` : `fb = ${s.fibreStress_MPa || s.fibreStressMPa} MPa`})
                  </option>
                ))}
              </select>
            </div>

            {/* Class, Length, Grade / Phi */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  Pole Class
                </label>
                <select
                  value={poleClass}
                  onChange={(e) => setPoleClass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 'var(--radius-input, 10px)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-inset)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                >
                  {allPoleClasses.map((c) => (
                    <option key={c.class} value={c.class}>
                      Class {c.class} ({isAnsi ? `${c.load_lbf} lbs` : `${Number((c.load_N / 1000).toFixed(1))} kN`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  Total Length (m)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="9"
                  max="35"
                  value={poleLengthM}
                  onChange={(e) => setPoleLengthM(parseFloat(e.target.value) || 12)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 'var(--radius-input, 10px)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-inset)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    fontVariantNumeric: 'tabular-nums',
                    outline: 'none'
                  }}
                />
              </div>

              {!isAnsi ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    Construction Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(parseInt(e.target.value, 10))}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.6rem',
                      borderRadius: 'var(--radius-input, 10px)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-inset)',
                      color: 'var(--text-main)',
                      fontSize: '0.8rem',
                      outline: 'none'
                    }}
                  >
                    <option value={1}>Grade 1 (OCF 2.2x)</option>
                    <option value={2}>Grade 2 (OCF 1.65x)</option>
                    <option value={3}>Grade 3 (OCF 1.3x)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    LRFD Factor (φ)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.4"
                    max="1.0"
                    value={strengthFactorPhi}
                    onChange={(e) => setStrengthFactorPhi(parseFloat(e.target.value) || 0.671)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.6rem',
                      borderRadius: 'var(--radius-input, 10px)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-inset)',
                      color: 'var(--text-main)',
                      fontSize: '0.8rem',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Non-Linear P-Delta & Height Adjustment Toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', padding: '0.65rem', background: 'var(--bg-inset)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0, cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                <input
                  type="checkbox"
                  checked={enablePDelta}
                  onChange={(e) => setEnablePDelta(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--accent-cyan)' }}
                />
                <span>Gere-Carter P-Delta (AF={results.buckling.amplificationFactor})</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0, cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                <input
                  type="checkbox"
                  checked={enableHeightAdjustment}
                  onChange={(e) => setEnableHeightAdjustment(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--accent-cyan)' }}
                />
                <span>Height MOR Reduction</span>
              </label>
            </div>

            {/* Environmental & Line Span Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  Wind Pressure (Pa)
                </label>
                <input
                  type="number"
                  value={windPressurePa}
                  onChange={(e) => setWindPressurePa(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  Radial Ice (mm)
                </label>
                <input
                  type="number"
                  value={iceThicknessMm}
                  onChange={(e) => setIceThicknessMm(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', fontSize: '0.8rem' }}
                />
              </div>

              {loadInputMode === 'line_physics' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                      Wind Span (m)
                    </label>
                    <input
                      type="number"
                      value={windSpanM}
                      onChange={(e) => setWindSpanM(parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '0.5rem 0.6rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                      Line Angle (degrees)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={lineAngleDeg}
                      onChange={(e) => setLineAngleDeg(parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '0.5rem 0.6rem', fontSize: '0.8rem' }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Attachments Card with Load Mode Switcher */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
                  Attachments & Cables ({attachments.length})
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div className="segmented-pill-bar">
                  <button
                    type="button"
                    className={`segmented-pill-btn ${loadInputMode === 'line_physics' ? 'active' : ''}`}
                    onClick={() => setLoadInputMode('line_physics')}
                    style={{ fontSize: '0.7rem', padding: '0.22rem 0.55rem' }}
                  >
                    Line Physics
                  </button>
                  <button
                    type="button"
                    className={`segmented-pill-btn ${loadInputMode === 'direct_loads' ? 'active' : ''}`}
                    onClick={() => setLoadInputMode('direct_loads')}
                    style={{ fontSize: '0.7rem', padding: '0.22rem 0.55rem' }}
                  >
                    Direct 3D Loads
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '0.3rem 0.55rem', borderRadius: '8px' }}
                >
                  <Plus size={13} /> Add
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {attachments.map((att) => (
                <div
                  key={att.id}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: 'var(--bg-inset)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <input
                      type="text"
                      value={att.name}
                      onChange={(e) => handleUpdateAttachment(att.id, 'name', e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '600', outline: 'none', width: '75%', padding: 0 }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--status-violation)', cursor: 'pointer', padding: '0.2rem' }}
                      title="Remove attachment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {loadInputMode === 'line_physics' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.45rem', fontSize: '0.75rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Height (m)</span>
                        <input
                          type="number"
                          step="0.1"
                          value={att.heightM}
                          onChange={(e) => handleUpdateAttachment(att.id, 'heightM', parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', padding: '0.35rem 0.45rem', fontSize: '0.75rem' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Count</span>
                        <input
                          type="number"
                          value={att.count}
                          onChange={(e) => handleUpdateAttachment(att.id, 'count', parseInt(e.target.value, 10) || 1)}
                          style={{ width: '100%', padding: '0.35rem 0.45rem', fontSize: '0.75rem' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Diam (mm)</span>
                        <input
                          type="number"
                          step="0.5"
                          value={att.diameterMm}
                          onChange={(e) => handleUpdateAttachment(att.id, 'diameterMm', parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', padding: '0.35rem 0.45rem', fontSize: '0.75rem' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tension (N)</span>
                        <input
                          type="number"
                          step="100"
                          value={att.tensionN}
                          onChange={(e) => handleUpdateAttachment(att.id, 'tensionN', parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', padding: '0.35rem 0.45rem', fontSize: '0.75rem' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.45rem', fontSize: '0.75rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Dist Tip z (ft)</span>
                        <input
                          type="number"
                          step="0.5"
                          value={att.distFromTipFt}
                          onChange={(e) => handleUpdateAttachment(att.id, 'distFromTipFt', parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', padding: '0.35rem 0.45rem', fontSize: '0.75rem' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Trans T (lbs)</span>
                        <input
                          type="number"
                          step="10"
                          value={att.transverseForceLbs}
                          onChange={(e) => handleUpdateAttachment(att.id, 'transverseForceLbs', parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', padding: '0.35rem 0.45rem', fontSize: '0.75rem' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Vert V (lbs)</span>
                        <input
                          type="number"
                          step="10"
                          value={att.verticalForceLbs}
                          onChange={(e) => handleUpdateAttachment(att.id, 'verticalForceLbs', parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', padding: '0.35rem 0.45rem', fontSize: '0.75rem' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Ecc e (ft)</span>
                        <input
                          type="number"
                          step="0.5"
                          value={att.eccentricityFt}
                          onChange={(e) => handleUpdateAttachment(att.id, 'eccentricityFt', parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', padding: '0.35rem 0.45rem', fontSize: '0.75rem' }}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Top 4 Key Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
            
            {/* Factored Groundline Moment */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Factored Moment (Mf)
              </div>
              <div style={{ fontSize: '1.55rem', fontWeight: '700', color: 'var(--accent-cyan)', fontVariantNumeric: 'tabular-nums lining-nums', marginTop: '0.25rem' }}>
                {isAnsi ? `${results.moments.totalFactoredMomentFtLbs.toLocaleString()} ft·lbs` : formatMoment(results.moments.totalFactoredMomentKNm)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontVariantNumeric: 'tabular-nums' }}>
                {isAnsi
                  ? `AF_PΔ = ${results.buckling.amplificationFactor}× (${results.moments.totalFactoredMomentKNm} kN·m)`
                  : `Wind OCF: ${results.factors.ocfWind}x | AF_PΔ: ${results.buckling.amplificationFactor}x`}
              </div>
            </div>

            {/* Resisting Moment Capacity */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Resisting Capacity (Mr)
              </div>
              <div style={{ fontSize: '1.55rem', fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums lining-nums', marginTop: '0.25rem' }}>
                {isAnsi ? `${results.moments.resistingMomentFtLbs.toLocaleString()} ft·lbs` : formatMoment(results.moments.resistingMomentKNm)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontVariantNumeric: 'tabular-nums' }}>
                Groundline S: {isAnsi ? `${results.geometry.sectionModulusIn3} in³` : `${results.geometry.sectionModulusM3} m³`}
              </div>
            </div>

            {/* Governing Utilization Percentage */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Utilization
              </div>
              <div
                style={{
                  fontSize: '1.55rem',
                  fontWeight: '700',
                  color: isPassing ? 'var(--status-pass)' : 'var(--status-violation)',
                  fontVariantNumeric: 'tabular-nums lining-nums',
                  marginTop: '0.25rem'
                }}
              >
                {results.utilization.percent}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '600', marginTop: '0.35rem' }}>
                <span className={`status-dot ${isPassing ? 'pass' : 'violation'}`} />
                <span style={{ color: isPassing ? 'var(--status-pass)' : 'var(--status-violation)' }}>
                  {isPassing ? 'PASS (ADEQUATE)' : 'OVERLOADED'}
                </span>
              </div>
            </div>

            {/* Recommended Class */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Recommended Class
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--accent-cyan)', marginTop: '0.35rem' }}>
                Class {results.classification.recommendedClass}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Current: Class {poleClass} ({results.geometry.poleLengthFt} ft)
              </div>
            </div>

          </div>

          {/* Critical Section vs Groundline Section Comparison + Elevation Profile Curve */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="var(--accent-cyan)" />
                <span style={{ fontWeight: '600', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  Multi-Segment Stress Profile & Critical Elevation Analysis
                </span>
              </div>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: '700', fontSize: '0.85rem', color: isPassing ? 'var(--status-pass)' : 'var(--status-violation)' }}>
                Max Usage: {results.utilization.criticalPercent}% at H = {critSeg.heightAboveGlFt} ft
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-inset)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div
                style={{
                  width: `${Math.min(100, results.utilization.percent)}%`,
                  height: '100%',
                  background: isPassing ? 'var(--status-pass)' : 'var(--status-violation)',
                  borderRadius: '9999px',
                  transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>

            {/* Side-by-Side Critical vs Groundline Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
              {/* Critical Section Card */}
              <div style={{
                background: 'var(--bg-inset)',
                padding: '0.95rem 1.1rem',
                borderRadius: '12px',
                border: results.utilization.isCriticalAboveGroundline ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                    Governing Critical Section
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                    z = {critSeg.distFromTipFt} ft ({critSeg.heightAboveGlFt} ft above GL)
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.78rem', fontVariantNumeric: 'tabular-nums' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Diameter / S</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{critSeg.diameterIn}&quot; / {critSeg.sectionModulusIn3} in³</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Stress / Cap</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{critSeg.combinedStressPsi} / {critSeg.allowableStressPsi} psi</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Usage %</div>
                    <div style={{ fontWeight: 700, color: critSeg.usagePercent <= 100 ? 'var(--status-pass)' : 'var(--status-violation)' }}>
                      {critSeg.usagePercent}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Groundline Section Card */}
              <div style={{
                background: 'var(--bg-inset)',
                padding: '0.95rem 1.1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Groundline Section (Base)
                  </span>
                  <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(148,163,184,0.15)', color: 'var(--text-muted)' }}>
                    z = {glSeg.distFromTipFt} ft (H = 0.0 ft)
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.78rem', fontVariantNumeric: 'tabular-nums' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Diameter / S</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{glSeg.diameterIn}&quot; / {glSeg.sectionModulusIn3} in³</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Stress / Cap</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{glSeg.combinedStressPsi} / {glSeg.allowableStressPsi} psi</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>GL Usage %</div>
                    <div style={{ fontWeight: 700, color: results.utilization.groundlinePercent <= 100 ? 'var(--status-pass)' : 'var(--status-violation)' }}>
                      {results.utilization.groundlinePercent}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive SVG Utilization Profile Along Pole Shaft */}
            <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.85rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span>Shaft Elevation Utilization Curve (Tip z=0 ft → Groundline z={glSeg.distFromTipFt} ft)</span>
                {results.utilization.isCriticalAboveGroundline && (
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertTriangle size={13} /> Peak stress occurs {critSeg.heightAboveGlFt} ft above groundline due to taper &amp; height factor
                  </span>
                )}
              </div>
              <svg viewBox="0 0 600 130" style={{ width: '100%', height: '130px', overflow: 'visible' }}>
                {/* Grid lines */}
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
                {/* Usage Polyline */}
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
                {/* Critical Point Marker */}
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
                {/* X-axis labels */}
                <text x="40" y="124" fontSize="9" fill="var(--text-muted)">Tip (z=0)</text>
                <text x="310" y="124" textAnchor="middle" fontSize="9" fill="var(--text-muted)">Mid-Shaft (z={(glSeg.distFromTipFt / 2).toFixed(1)} ft)</text>
                <text x="580" y="124" textAnchor="end" fontSize="9" fill="var(--text-muted)">Groundline (z={glSeg.distFromTipFt} ft)</text>
              </svg>
            </div>

            {/* Moment Breakdown Grid */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.9rem' }}>
              <h4 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: '0.6rem' }}>
                Groundline Moment &amp; Buckling Breakdown
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))', gap: '0.65rem', fontSize: '0.78rem' }}>
                <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', padding: '0.6rem 0.7rem', borderRadius: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Pole Shaft Wind</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', marginTop: '0.15rem' }}>{results.moments.factoredPoleWindKNm} kN·m</div>
                </div>
                <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', padding: '0.6rem 0.7rem', borderRadius: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Conductor Wind</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', marginTop: '0.15rem' }}>{results.moments.factoredWireWindKNm} kN·m</div>
                </div>
                <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', padding: '0.6rem 0.7rem', borderRadius: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Line-Angle Tension</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', marginTop: '0.15rem' }}>{results.moments.factoredWireAngleKNm} kN·m</div>
                </div>
                <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', padding: '0.6rem 0.7rem', borderRadius: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Euler Buckling Pcr</div>
                  <div style={{ fontWeight: '700', color: 'var(--accent-cyan)', fontVariantNumeric: 'tabular-nums', marginTop: '0.15rem' }}>{results.buckling.criticalBucklingLoadLbs.toLocaleString()} lbs</div>
                </div>
                <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', padding: '0.6rem 0.7rem', borderRadius: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Embedment Depth</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', marginTop: '0.15rem' }}>{results.geometry.embedmentM} m ({results.geometry.embedmentFt} ft)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Mathematical Derivation & Formula Sheet (MathML + Live Substitutions) */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Calculator size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Step-by-Step Mathematical Derivation &amp; Formula Sheet
              </h3>
            </div>

            <details className="calc-detail" open>
              <summary>Design Calculation — 6-Stage Structural Derivation ({results.standard} Mode)</summary>
              <div className="calc-body">
                
                {/* Stage 1: Tapered Shaft Geometry */}
                <div className="calc-step">
                  <div className="calc-label">Step 1: Tapered Shaft Discretization &amp; Section Properties</div>
                  <div className="calc-formula" style={{ margin: '0.35rem 0', color: 'var(--text-main)' }}>
                    <math display="inline">
                      <msub><mi>D</mi><mi>t</mi></msub><mo>=</mo><mfrac><msub><mi>C</mi><mi>t</mi></msub><mi>π</mi></mfrac><mspace width="1em"/>
                      <msub><mi>D</mi><mi>b</mi></msub><mo>=</mo><mfrac><msub><mi>C</mi><mi>b</mi></msub><mi>π</mi></mfrac><mspace width="1em"/>
                      <msub><mi>T</mi><mtext>taper</mtext></msub><mo>=</mo><mfrac><mrow><msub><mi>D</mi><mi>b</mi></msub><mo>−</mo><msub><mi>D</mi><mi>t</mi></msub></mrow><mrow><mi>L</mi><mo>−</mo><mn>6</mn></mrow></mfrac><mspace width="1em"/>
                      <mi>S</mi><mo>(</mo><mi>z</mi><mo>)</mo><mo>=</mo><mfrac><mrow><mi>π</mi><mo>⋅</mo><mi>D</mi><msup><mrow><mo>(</mo><mi>z</mi><mo>)</mo></mrow><mn>3</mn></msup></mrow><mn>32</mn></mfrac>
                    </math>
                  </div>
                  <div className="calc-formula">
                    D_t = {results.geometry.tipCircumferenceIn} / π = <span className="calc-result">{results.geometry.tipDiameterIn} in.</span> | D_b (at 6ft from butt) = {results.geometry.buttCircumference6ftIn} / π = <span className="calc-result">{results.geometry.buttDiameter6ftIn} in.</span>
                  </div>
                  <div className="calc-formula">
                    T_taper = ({results.geometry.buttDiameter6ftIn} − {results.geometry.tipDiameterIn}) / ({results.geometry.poleLengthFt} − 6) = <span className="calc-result">{results.geometry.taperInPerFt} in./ft</span>
                  </div>
                  <div className="calc-formula">
                    D_GL (at z = {results.geometry.heightAboveGroundFt} ft) = {results.geometry.tipDiameterIn} + {results.geometry.taperInPerFt} × {results.geometry.heightAboveGroundFt} = <span className="calc-result">{results.geometry.groundlineDiameterIn} in.</span> → S_GL = <span className="calc-result">{results.geometry.sectionModulusIn3} in³ ({results.geometry.sectionModulusM3} m³)</span>
                  </div>
                </div>

                {/* Stage 2: Material Capacity Adjustments */}
                <div className="calc-step">
                  <div className="calc-label">Step 2: Material Strength, 5% LEL &amp; Height-Adjustment Factor</div>
                  <div className="calc-formula" style={{ margin: '0.35rem 0', color: 'var(--text-main)' }}>
                    <math display="inline">
                      <msub><mi>MOR</mi><mrow><mn>5</mn><mo>%</mo></mrow></msub><mo>=</mo><msub><mi>MOR</mi><mrow><mn>50</mn><mo>%</mo></mrow></msub><mo>⋅</mo><mrow><mo>(</mo><mn>1</mn><mo>−</mo><mn>1.645</mn><mo>⋅</mo><mi>COV</mi><mo>)</mo></mrow><mspace width="1.2em"/>
                      <msub><mi>k</mi><mtext>ht</mtext></msub><mo>(</mo><mi>z</mi><mo>)</mo><mo>=</mo><mo>max</mo><mrow><mo>(</mo><mn>0.85</mn><mo>,</mo><mspace width="0.3em"/><mn>1</mn><mo>−</mo><mi>α</mi><mo>⋅</mo><mfrac><mi>H</mi><msub><mi>H</mi><mi>GL</mi></msub></mfrac><mo>)</mo></mrow>
                    </math>
                  </div>
                  <div className="calc-formula">
                    Species: {results.species.commonName} ({results.species.code}) | Mean Fiber Stress = <span className="calc-result">{results.species.fiberStressPsi} psi ({results.species.fiberStressMPa} MPa)</span> | COV = {results.species.covPercent}%
                  </div>
                  <div className="calc-formula">
                    5% LEL Strength: MOR_5% = {results.species.fiberStressPsi} × (1 − 1.645 × {(results.species.covPercent / 100).toFixed(2)}) = <span className="calc-result">{results.species.mor5PctPsi} psi ({results.species.mor5PctMPa} MPa)</span>
                  </div>
                  <div className="calc-formula">
                    Critical Elevation Height Factor (at H = {critSeg.heightAboveGlFt} ft): k_ht = <span className="calc-result">{critSeg.heightAdjFactor}</span> → Allowable Stress = <span className="calc-result">{critSeg.allowableStressPsi} psi ({critSeg.allowableStressMPa} MPa)</span>
                  </div>
                </div>

                {/* Stage 3: Primary Bending Moment Integration */}
                <div className="calc-step">
                  <div className="calc-label">Step 3: Primary Load Integration &amp; Unamplified Bending Moments</div>
                  <div className="calc-formula" style={{ margin: '0.35rem 0', color: 'var(--text-main)' }}>
                    <math display="inline">
                      <msub><mi>M</mi><mtext>prim</mtext></msub><mo>(</mo><mi>z</mi><mo>)</mo><mo>=</mo>
                      <munder><mo>∑</mo><mrow><msub><mi>z</mi><mi>i</mi></msub><mo>≤</mo><mi>z</mi></mrow></munder><mrow><mo>[</mo><msub><mi>T</mi><mi>i</mi></msub><mo>⋅</mo><mo>(</mo><mi>z</mi><mo>−</mo><msub><mi>z</mi><mi>i</mi></msub><mo>)</mo><mo>+</mo><msub><mi>V</mi><mi>i</mi></msub><mo>⋅</mo><msub><mi>e</mi><mi>i</mi></msub><mo>]</mo></mrow>
                      <mo>+</mo><mfrac><mrow><msub><mi>q</mi><mi>w</mi></msub><mo>⋅</mo><msub><mi>C</mi><mi>d</mi></msub></mrow><mn>12</mn></mfrac><mrow><mo>(</mo><mfrac><mrow><msub><mi>D</mi><mi>t</mi></msub><msup><mi>z</mi><mn>2</mn></msup></mrow><mn>2</mn></mfrac><mo>+</mo><mfrac><mrow><msub><mi>T</mi><mtext>taper</mtext></msub><msup><mi>z</mi><mn>3</mn></msup></mrow><mn>6</mn></mfrac><mo>)</mo></mrow>
                    </math>
                  </div>
                  <div className="calc-formula">
                    At Critical Elevation (z = {critSeg.distFromTipFt} ft): M_prim = <span className="calc-result">{critSeg.primaryMomentFtLbs.toLocaleString()} ft·lbs ({critSeg.primaryMomentKNm} kN·m)</span>
                  </div>
                  <div className="calc-formula">
                    At Groundline (z = {glSeg.distFromTipFt} ft): M_prim = <span className="calc-result">{glSeg.primaryMomentFtLbs.toLocaleString()} ft·lbs ({results.moments.primaryGroundlineMomentKNm} kN·m)</span>
                  </div>
                </div>

                {/* Stage 4: Gere-Carter Buckling & P-Delta */}
                <div className="calc-step">
                  <div className="calc-label">Step 4: Non-Linear Gere-Carter Column Buckling &amp; P-Delta Amplification</div>
                  <div className="calc-formula" style={{ margin: '0.35rem 0', color: 'var(--text-main)' }}>
                    <math display="inline">
                      <msub><mi>D</mi><mtext>eff</mtext></msub><mo>=</mo><msqrt><mrow><msub><mi>D</mi><mi>t</mi></msub><mo>⋅</mo><msub><mi>D</mi><mi>GL</mi></msub></mrow></msqrt><mspace width="1em"/>
                      <msubsup><mi>P</mi><mtext>cr</mtext><mo>′</mo></msubsup><mo>=</mo><mfrac><mrow><msup><mi>π</mi><mn>2</mn></msup><mo>⋅</mo><mi>MOE</mi><mo>⋅</mo><msub><mi>I</mi><mtext>eff</mtext></msub></mrow><mrow><mn>4</mn><mo>⋅</mo><msubsup><mi>H</mi><mi>GL</mi><mn>2</mn></msubsup><mo>⋅</mo><mn>144</mn></mrow></mfrac><mspace width="1em"/>
                      <msup><mi>P</mi><mo>*</mo></msup><mo>=</mo><msup><mrow><mo>(</mo><mfrac><msub><mi>D</mi><mi>GL</mi></msub><msub><mi>D</mi><mi>t</mi></msub></mfrac><mo>)</mo></mrow><mn>2.7</mn></msup><mspace width="1em"/>
                      <msub><mi>AF</mi><mrow><mi>P</mi><mi>Δ</mi></mrow></msub><mo>=</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>−</mo><msub><mi>V</mi><mi>L</mi></msub><mo>/</mo><msub><mi>P</mi><mtext>cr</mtext></msub></mrow></mfrac>
                    </math>
                  </div>
                  <div className="calc-formula">
                    D_eff = √({results.geometry.tipDiameterIn} × {results.geometry.groundlineDiameterIn}) = <span className="calc-result">{results.buckling.effectiveDiameterIn} in.</span> → I_eff = π × ({results.buckling.effectiveDiameterIn})⁴ / 64 = <span className="calc-result">{results.buckling.effectiveInertiaIn4} in⁴</span>
                  </div>
                  <div className="calc-formula">
                    P&apos;_cr = {results.buckling.eulerCriticalLoadPrimeLbs.toLocaleString()} lbs × P*({results.buckling.taperFactorPStar}) → P_cr = <span className="calc-result">{results.buckling.criticalBucklingLoadLbs.toLocaleString()} lbs ({results.buckling.criticalBucklingLoadKN} kN)</span>
                  </div>
                  <div className="calc-formula">
                    Total Axial Load V_L = {results.buckling.totalGroundlineAxialLoadLbs.toLocaleString()} lbs → AF_PΔ = 1 / (1 − {results.buckling.totalGroundlineAxialLoadLbs} / {results.buckling.criticalBucklingLoadLbs}) = <span className="calc-result">{results.buckling.amplificationFactor}×</span>
                  </div>
                </div>

                {/* Stage 5 & 6: Combined Stress & Utilization */}
                <div className="calc-step">
                  <div className="calc-label">Step 5 &amp; 6: Combined Stress Interaction &amp; Governing Utilization Check</div>
                  <div className="calc-formula" style={{ margin: '0.35rem 0', color: 'var(--text-main)' }}>
                    <math display="inline">
                      <msub><mi>f</mi><mi>a</mi></msub><mo>(</mo><mi>z</mi><mo>)</mo><mo>=</mo><mfrac><mrow><mi>P</mi><mo>(</mo><mi>z</mi><mo>)</mo></mrow><mrow><mi>A</mi><mo>(</mo><mi>z</mi><mo>)</mo></mrow></mfrac><mspace width="1em"/>
                      <msub><mi>f</mi><mi>b</mi></msub><mo>(</mo><mi>z</mi><mo>)</mo><mo>=</mo><mfrac><mrow><msub><mi>M</mi><mtext>prim</mtext></msub><mo>(</mo><mi>z</mi><mo>)</mo><mo>⋅</mo><msub><mi>AF</mi><mrow><mi>P</mi><mi>Δ</mi></mrow></msub><mo>⋅</mo><mn>12</mn></mrow><mrow><mi>S</mi><mo>(</mo><mi>z</mi><mo>)</mo></mrow></mfrac><mspace width="1em"/>
                      <mi>U</mi><mo>(</mo><mi>z</mi><mo>)</mo><mo>=</mo><mfrac><mrow><msub><mi>f</mi><mi>a</mi></msub><mo>(</mo><mi>z</mi><mo>)</mo><mo>+</mo><msub><mi>f</mi><mi>b</mi></msub><mo>(</mo><mi>z</mi><mo>)</mo></mrow><mrow><mi>ϕ</mi><mo>⋅</mo><msub><mi>MOR</mi><mtext>adj</mtext></msub><mo>(</mo><mi>z</mi><mo>)</mo></mrow></mfrac><mo>×</mo><mn>100</mn><mo>%</mo>
                    </math>
                  </div>
                  <div className="calc-formula">
                    Critical Section (z = {critSeg.distFromTipFt} ft, H = {critSeg.heightAboveGlFt} ft): f_b = {critSeg.bendingStressPsi} psi + f_a = {critSeg.axialStressPsi} psi → Usage = ({critSeg.bendingStressPsi} + {critSeg.axialStressPsi}) / {critSeg.allowableStressPsi} = <span className="calc-result">{critSeg.usagePercent}%</span>
                  </div>
                  <div className="calc-formula">
                    Groundline Section (z = {glSeg.distFromTipFt} ft, H = 0.0 ft): f_b = {glSeg.bendingStressPsi} psi + f_a = {glSeg.axialStressPsi} psi → Usage = <span className="calc-result">{results.utilization.groundlinePercent}%</span>
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
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: '6px' }}
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
                  diameter (<code>S ∝ D³</code>). When the groundline circumference exceeds <code>1.5×</code> the circumference at
                  the resultant load elevation (<strong>CSA O15 Clause B.1.3</strong>) or when height-dependent fiber stress
                  reductions apply (<strong>ANSI O5.1 Annex A / ASCE MOP 141</strong>), the critical stress zone shifts 15 to 30 ft
                  above the groundline.
                </p>
                <p>
                  <strong>Gere-Carter Non-Linear Buckling (P-Delta):</strong> Tapered wood cantilevers subjected to vertical
                  conductor, ice, and self-weight loads experience secondary lateral deflection moments. Using the Gere-Carter
                  tapered Euler formulation (<code>P* = (D_GL / D_t)^2.7</code>), primary bending moments are amplified by
                  <code>AF_PΔ = 1 / (1 − V_L / P_cr)</code>.
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
