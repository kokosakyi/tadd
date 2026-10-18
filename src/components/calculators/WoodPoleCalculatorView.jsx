import React, { useState } from 'react';
import {
  TreePine,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  Sliders,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useUnits } from '../../context/UnitContext';
import {
  calculateWoodPoleStructural,
  getAllO15Species,
  getAllO15PoleClasses
} from '../../core/woodPole/woodPoleEngine';
import TraceViewer from '../common/TraceViewer';

export default function WoodPoleCalculatorView({ onOpenCitation }) {
  const { activeProject } = useProject();
  const { unit, formatDistance, formatMoment } = useUnits();

  // Species list sorted alphabetically by commonName using localeCompare
  const allSpecies = getAllO15Species().sort((a, b) => a.commonName.localeCompare(b.commonName));
  const allPoleClasses = getAllO15PoleClasses();

  // Calculation State
  const [speciesCode, setSpeciesCode] = useState('WC'); // Western Red Cedar default
  const [poleLengthM, setPoleLengthM] = useState(13.7); // 45 ft
  const [poleClass, setPoleClass] = useState('3');
  const [grade, setGrade] = useState(2); // Grade 2 standard
  const [windPressurePa, setWindPressurePa] = useState(400);
  const [iceThicknessMm, setIceThicknessMm] = useState(12.5);
  const [windSpanM, setWindSpanM] = useState(60);
  const [lineAngleDeg, setLineAngleDeg] = useState(0);

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: 1, name: 'Primary 3-Phase Conductor', heightM: 11.5, count: 3, diameterMm: 15.0, tensionN: 7000 },
    { id: 2, name: 'Neutral / Secondary Cable', heightM: 9.8, count: 1, diameterMm: 12.0, tensionN: 4500 },
    { id: 3, name: 'Telecom Bundle (Joint Use)', heightM: 7.5, count: 1, diameterMm: 25.0, tensionN: 3500 }
  ]);

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
        tensionN: 3000
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

  // Run calculation via Core Engine
  const results = calculateWoodPoleStructural({
    speciesCode,
    poleLengthM,
    poleClass,
    grade,
    windPressurePa,
    iceThicknessMm,
    windSpanM,
    lineAngleDeg,
    attachments
  });

  const isPassing = results.utilization.isPassing;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* View Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TreePine size={22} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.015em' }}>
                Wood Pole Loading & Structural Sizing (A6 / M3)
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              Groundline bending moment summation, CSA C22.3 No. 1 Table 31 OCFs, and CSA O15 fiber stress checks.
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
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 440px) 1fr', gap: '1.5rem' }}>
        
        {/* Left: Controls & Attachments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Structure Parameters Card */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem' }}>
              <Sliders size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
                Pole Geometry & Material
              </h3>
            </div>

            {/* Species Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Wood Species (CSA O15 Table 3)
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
                {allSpecies.map((s) => (
                  <option key={s.id || s.speciesCode} value={s.speciesCode}>
                    {s.commonName} (fb = {s.fibreStressMPa} MPa)
                  </option>
                ))}
              </select>
            </div>

            {/* Class, Length, Construction Grade */}
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
                      Class {c.class} ({Number((c.load_N / 1000).toFixed(1))} kN)
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
            </div>

            {/* Wind Span, Line Angle, Weather Loads */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  Wind Span (m)
                </label>
                <input
                  type="number"
                  value={windSpanM}
                  onChange={(e) => setWindSpanM(parseFloat(e.target.value) || 0)}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  Wind Pressure (Pa)
                </label>
                <input
                  type="number"
                  value={windPressurePa}
                  onChange={(e) => setWindPressurePa(parseFloat(e.target.value) || 0)}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  Radial Ice (mm)
                </label>
                <input
                  type="number"
                  value={iceThicknessMm}
                  onChange={(e) => setIceThicknessMm(parseFloat(e.target.value) || 0)}
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
            </div>
          </div>

          {/* Attachments Card */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
                  Attachments & Cables ({attachments.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddAttachment}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem', borderRadius: '8px' }}
              >
                <Plus size={14} /> Add Attachment
              </button>
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
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '600', outline: 'none', width: '70%' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--status-violation)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                      title="Remove attachment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.45rem', fontSize: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Height (m)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={att.heightM}
                        onChange={(e) => handleUpdateAttachment(att.id, 'heightM', parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', padding: '0.35rem 0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Count</span>
                      <input
                        type="number"
                        value={att.count}
                        onChange={(e) => handleUpdateAttachment(att.id, 'count', parseInt(e.target.value, 10) || 1)}
                        style={{ width: '100%', padding: '0.35rem 0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Diam (mm)</span>
                      <input
                        type="number"
                        step="0.5"
                        value={att.diameterMm}
                        onChange={(e) => handleUpdateAttachment(att.id, 'diameterMm', parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', padding: '0.35rem 0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tension (N)</span>
                      <input
                        type="number"
                        step="100"
                        value={att.tensionN}
                        onChange={(e) => handleUpdateAttachment(att.id, 'tensionN', parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', padding: '0.35rem 0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Results Summary & Utilization Gauges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Key Metric Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
            
            {/* Factored Groundline Moment */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Factored Moment (Mf)
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--accent-cyan)', fontVariantNumeric: 'tabular-nums lining-nums', marginTop: '0.25rem' }}>
                {formatMoment(results.moments.totalFactoredMomentKNm)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontVariantNumeric: 'tabular-nums' }}>
                Wind OCF: {results.factors.ocfWind}x
              </div>
            </div>

            {/* Resisting Moment Capacity */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Resisting Capacity (Mr)
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums lining-nums', marginTop: '0.25rem' }}>
                {formatMoment(results.moments.resistingMomentKNm)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontVariantNumeric: 'tabular-nums' }}>
                Groundline S: {results.geometry.sectionModulusM3} m³
              </div>
            </div>

            {/* Utilization Percentage */}
            <div className="glass-panel" style={{ padding: '1.15rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Utilization
              </div>
              <div
                style={{
                  fontSize: '1.65rem',
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
                Current: Class {poleClass}
              </div>
            </div>

          </div>

          {/* Utilization Progress Bar */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Capacity Utilization Ratio</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: '700', color: isPassing ? 'var(--status-pass)' : 'var(--status-violation)' }}>
                {results.utilization.percent}%
              </span>
            </div>
            
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-inset)', borderRadius: '9999px', overflow: 'hidden' }}>
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

            {/* Moment Breakdown Table */}
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: '0.65rem' }}>
                Groundline Moment Breakdown (kN·m)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
                <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', padding: '0.65rem 0.75rem', borderRadius: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Pole Shaft Wind</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', marginTop: '0.2rem' }}>{results.moments.factoredPoleWindKNm} kN·m</div>
                </div>
                <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', padding: '0.65rem 0.75rem', borderRadius: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Conductor Wind</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', marginTop: '0.2rem' }}>{results.moments.factoredWireWindKNm} kN·m</div>
                </div>
                <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', padding: '0.65rem 0.75rem', borderRadius: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Line-Angle Tension</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', marginTop: '0.2rem' }}>{results.moments.factoredWireAngleKNm} kN·m</div>
                </div>
                <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', padding: '0.65rem 0.75rem', borderRadius: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Embedment Depth</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', marginTop: '0.2rem' }}>{results.geometry.embedmentM} m</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom: Live Engineering Audit Trace Card */}
      <TraceViewer trace={results.trace} onOpenCitation={onOpenCitation} />

    </div>
  );
}
