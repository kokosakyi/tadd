import React, { useState } from 'react';
import {
  TreePine,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  Calculator,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { getAllO15Species, getAllO15PoleClasses } from '../data/csa/o15/index.js';
import { calculatePoleLoading } from '../utils/woodPoleLoadingEngine.js';

export default function WoodPoleLoadingCalculator({
  defaultWindPa = 400,
  defaultIceMm = 12.5
}) {
  const allSpecies = getAllO15Species(); // sorted alphabetically per project rules
  const allPoleClasses = getAllO15PoleClasses();

  // Calculation State
  const [speciesCode, setSpeciesCode] = useState('WC'); // Western Red Cedar default
  const [poleLengthM, setPoleLengthM] = useState(13.7); // 45 ft
  const [poleClass, setPoleClass] = useState('3');
  const [grade, setGrade] = useState(2); // Grade 2 standard
  const [windPressurePa, setWindPressurePa] = useState(defaultWindPa);
  const [iceThicknessMm, setIceThicknessMm] = useState(defaultIceMm);
  const [windSpanM, setWindSpanM] = useState(60);
  const [lineAngleDeg, setLineAngleDeg] = useState(0);

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: 1, name: 'Primary 3-Phase Conductor', heightM: 11.5, count: 3, diameterMm: 15.0, tensionN: 7000 },
    { id: 2, name: 'Neutral / Secondary Cable', heightM: 9.8, count: 1, diameterMm: 12.0, tensionN: 4500 },
    { id: 3, name: 'Telecom Bundle (Joint Use)', heightM: 7.5, count: 1, diameterMm: 25.0, tensionN: 3500 }
  ]);

  // Handle adding an attachment
  const handleAddAttachment = () => {
    const newId = attachments.length > 0 ? Math.max(...attachments.map((a) => a.id)) + 1 : 1;
    setAttachments([
      ...attachments,
      {
        id: newId,
        name: `Attachment ${newId}`,
        heightM: Math.max(2, (poleLengthM * 0.7).toFixed(1)),
        count: 1,
        diameterMm: 14.0,
        tensionN: 3000
      }
    ]);
  };

  // Handle removing attachment
  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  // Handle updating attachment field
  const handleUpdateAttachment = (id, field, value) => {
    setAttachments(
      attachments.map((att) => (att.id === id ? { ...att, [field]: value } : att))
    );
  };

  // Run calculation
  const results = calculatePoleLoading({
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Title & Standards Reference */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <TreePine size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                  Wood Pole Loading & Section Modulus Calculator
                </h2>
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                  CSA C22.3 No. 1 + CSA O15-15
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                Groundline bending moment analysis, Overload Capacity Factors (OCFs), and standard pole class rating.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: isPassing ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${isPassing ? '#10b981' : '#ef4444'}`,
              color: isPassing ? '#10b981' : '#ef4444',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem'
            }}>
              {isPassing ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
              {results.utilization.percent}% Utilization ({isPassing ? 'Adequate' : 'Overloaded'})
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Left Column: Pole Parameters & Loading */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator size={18} color="#38bdf8" /> Pole Specifications & Environment
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Wood Species */}
            <div className="form-group">
              <label className="form-label">Wood Species (CSA O15 Table 3)</label>
              <select
                className="form-select"
                value={speciesCode}
                onChange={(e) => setSpeciesCode(e.target.value)}
              >
                {allSpecies.map((s) => (
                  <option key={s.speciesCode} value={s.speciesCode}>
                    {s.commonName} ({s.fibreStressMPa} MPa)
                  </option>
                ))}
              </select>
            </div>

            {/* Current Pole Class */}
            <div className="form-group">
              <label className="form-label">Current Pole Class (CSA O15 Table B.1)</label>
              <select
                className="form-select"
                value={poleClass}
                onChange={(e) => setPoleClass(e.target.value)}
              >
                {allPoleClasses.map((c) => (
                  <option key={c.class} value={c.class}>
                    Class {c.class} ({c.load_kN} kN rating)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Pole Length */}
            <div className="form-group">
              <label className="form-label">Total Pole Length (m)</label>
              <input
                type="number"
                step="0.5"
                min="9"
                max="35"
                className="form-input"
                value={poleLengthM}
                onChange={(e) => setPoleLengthM(Number(e.target.value))}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Embedment: {results.geometry.embedmentM} m | Above: {results.geometry.heightAboveGroundM} m
              </span>
            </div>

            {/* Construction Grade */}
            <div className="form-group">
              <label className="form-label">Construction Grade (CSA No. 1)</label>
              <select
                className="form-select"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
              >
                <option value={1}>Grade 1 (Major crossing / railway, OCF=2.20)</option>
                <option value={2}>Grade 2 (Standard Distribution, OCF=1.65)</option>
                <option value={3}>Grade 3 (Low risk rural, OCF=1.30)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Wind Span */}
            <div className="form-group">
              <label className="form-label">Wind Span (m)</label>
              <input
                type="number"
                step="5"
                min="10"
                max="300"
                className="form-input"
                value={windSpanM}
                onChange={(e) => setWindSpanM(Number(e.target.value))}
              />
            </div>

            {/* Line Angle */}
            <div className="form-group">
              <label className="form-label">Line Deflection Angle (degrees)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="90"
                className="form-input"
                value={lineAngleDeg}
                onChange={(e) => setLineAngleDeg(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Wind Pressure */}
            <div className="form-group">
              <label className="form-label">Design Wind Pressure (Pa)</label>
              <input
                type="number"
                step="25"
                className="form-input"
                value={windPressurePa}
                onChange={(e) => setWindPressurePa(Number(e.target.value))}
              />
            </div>

            {/* Radial Ice */}
            <div className="form-group">
              <label className="form-label">Design Radial Ice (mm)</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={iceThicknessMm}
                onChange={(e) => setIceThicknessMm(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Groundline Stress & Capacity Summary */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="#10b981" /> Capacity & Moment Verification
          </h3>

          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: isPassing ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${isPassing ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Class Selection:</span>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                Current: Class {poleClass} &bull; Required: <strong>Class {results.classification.recommendedClass}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Required Horizontal Load (at 0.61m top):</span>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: '#38bdf8' }}>
                {results.classification.requiredTopLoadKN} kN
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Moment Margin:</span>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: isPassing ? '#10b981' : '#ef4444' }}>
                {results.utilization.marginKNm > 0 ? `+${results.utilization.marginKNm}` : results.utilization.marginKNm} kN&bull;m
              </span>
            </div>
          </div>

          {/* Moment Breakdown Table */}
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', fontSize: '0.825rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ textAlign: 'left', padding: '6px' }}>Component</th>
                  <th style={{ textAlign: 'right', padding: '6px' }}>Unfactored</th>
                  <th style={{ textAlign: 'right', padding: '6px' }}>OCF</th>
                  <th style={{ textAlign: 'right', padding: '6px' }}>Factored</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '6px' }}>Wind on Pole Shaft</td>
                  <td style={{ textAlign: 'right', padding: '6px' }}>{results.moments.unfactoredPoleWindKNm} kN&bull;m</td>
                  <td style={{ textAlign: 'right', padding: '6px' }}>{results.factors.ocfWind}</td>
                  <td style={{ textAlign: 'right', padding: '6px', fontWeight: 600 }}>{results.moments.factoredPoleWindKNm} kN&bull;m</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '6px' }}>Transverse Wind on Wires</td>
                  <td style={{ textAlign: 'right', padding: '6px' }}>{results.moments.unfactoredWireWindKNm} kN&bull;m</td>
                  <td style={{ textAlign: 'right', padding: '6px' }}>{results.factors.ocfWind}</td>
                  <td style={{ textAlign: 'right', padding: '6px', fontWeight: 600 }}>{results.moments.factoredWireWindKNm} kN&bull;m</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '6px' }}>Wire Angle Tension Resultant</td>
                  <td style={{ textAlign: 'right', padding: '6px' }}>{results.moments.unfactoredWireAngleKNm} kN&bull;m</td>
                  <td style={{ textAlign: 'right', padding: '6px' }}>{results.factors.ocfAngle}</td>
                  <td style={{ textAlign: 'right', padding: '6px', fontWeight: 600 }}>{results.moments.factoredWireAngleKNm} kN&bull;m</td>
                </tr>
                <tr style={{ borderTop: '2px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '8px 6px', fontWeight: 'bold' }}>Total Factored Moment (Mf)</td>
                  <td colSpan={2}></td>
                  <td style={{ textAlign: 'right', padding: '8px 6px', fontWeight: 'bold', color: '#38bdf8' }}>
                    {results.moments.totalFactoredMomentKNm} kN&bull;m
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 6px', fontWeight: 'bold' }}>Resisting Moment Capacity (Mr)</td>
                  <td colSpan={2}></td>
                  <td style={{ textAlign: 'right', padding: '8px 6px', fontWeight: 'bold', color: '#10b981' }}>
                    {results.moments.resistingMomentKNm} kN&bull;m
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            * Calculation complies with CSA C22.3 No. 1 Clauses 7.4.2 & 8.3.10 and CSA O15-15 designated fiber stress.
          </div>
        </div>
      </div>

      {/* Attachments & Joint-Use Wire Schedule */}
      <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Pole Attachments & Cable Schedule (Joint Use)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Specify wire heights, outer diameters, count, and tensions for wind and angle moment evaluation.
            </p>
          </div>
          <button
            onClick={handleAddAttachment}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Add Attachment
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Attachment Name</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Height (m)</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Count</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Bare Dia (mm)</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Tension (N)</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Wind Force (N)</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Wind Moment (N&bull;m)</th>
                <th style={{ textAlign: 'center', padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.attachments.map((att) => (
                <tr key={att.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '4px 8px', fontSize: '0.825rem' }}
                      value={att.name}
                      onChange={(e) => handleUpdateAttachment(att.id, 'name', e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      style={{ width: '75px', textAlign: 'right', padding: '4px 6px', fontSize: '0.825rem' }}
                      value={att.heightM}
                      onChange={(e) => handleUpdateAttachment(att.id, 'heightM', Number(e.target.value))}
                    />
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      className="form-input"
                      style={{ width: '55px', textAlign: 'right', padding: '4px 6px', fontSize: '0.825rem' }}
                      value={att.count}
                      onChange={(e) => handleUpdateAttachment(att.id, 'count', Number(e.target.value))}
                    />
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>
                    <input
                      type="number"
                      step="0.5"
                      className="form-input"
                      style={{ width: '70px', textAlign: 'right', padding: '4px 6px', fontSize: '0.825rem' }}
                      value={att.diameterMm}
                      onChange={(e) => handleUpdateAttachment(att.id, 'diameterMm', Number(e.target.value))}
                    />
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>
                    <input
                      type="number"
                      step="500"
                      className="form-input"
                      style={{ width: '85px', textAlign: 'right', padding: '4px 6px', fontSize: '0.825rem' }}
                      value={att.tensionN}
                      onChange={(e) => handleUpdateAttachment(att.id, 'tensionN', Number(e.target.value))}
                    />
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px', color: '#38bdf8' }}>
                    {att.wireWindForceN} N
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px', fontWeight: 600 }}>
                    {att.wireWindMomentNm} N&bull;m
                  </td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>
                    <button
                      onClick={() => handleRemoveAttachment(att.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      title="Remove attachment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
