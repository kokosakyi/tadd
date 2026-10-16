import React from 'react';

export default function Module5TensionLimitsCard({
  module5Result,
  hasDampers,
  setHasDampers,
  isBundled,
  setIsBundled
}) {
  if (!module5Result) return null;

  return (
    <div className="glass-panel card-padding" style={{ marginTop: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="module-badge">M5</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              Conductor Tension & Aeolian Vibration Engine (CSA C22.3 Cl. 8.7)
            </h3>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Establishes catenary limits (C = H/w) for aeolian vibration protection and sets RTS percentage safety limits.
            </p>
          </div>
        </div>

        {/* Quick Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Dampers Toggle */}
          <button
            type="button"
            className={`btn ${hasDampers ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setHasDampers(!hasDampers)}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px' }}
          >
            {hasDampers ? 'Vibration Dampers Installed' : 'No Dampers Installed'}
          </button>

          {/* Bundle Toggle */}
          <button
            type="button"
            className={`btn ${isBundled ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsBundled(!isBundled)}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px' }}
          >
            {isBundled ? 'Bundled Phase (2200m Base)' : 'Single Conductor (2000m Base)'}
          </button>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        
        {/* Allowable Catenary Constant */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Allowable Catenary Constant (C_max)
            </span>
            {module5Result.spanReductionApplied ? (
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 'bold' }}>
                Table 33 Reduced (S ≤ {module5Result.rulingSpanM}m)
              </span>
            ) : (
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 'bold' }}>
                Full Base (S &gt; 400m)
              </span>
            )}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {module5Result.maxCatenary.toFixed(0)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>m</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Base Limit: {module5Result.baseCatenary} m | C = H / w
          </div>
        </div>

        {/* Aeolian Initial Tension Limit */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Aeolian Initial Tension (H_vibe)
            </span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 'bold' }}>
              w = {module5Result.conductorWeightNm} N/m
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {module5Result.aeolianTensionLimitKn.toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>kN</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            H_vibe = C_max ({module5Result.maxCatenary}m) × w ({module5Result.conductorWeightNm}N/m)
          </div>
        </div>

        {/* Peak Loaded Tension Limit */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Peak Loaded Limit (60% RTS)
            </span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(148, 163, 184, 0.15)', color: 'var(--text-muted)', fontWeight: 'bold' }}>
              RTS = {module5Result.rtsKn} kN
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {module5Result.maxLoadedTensionKn.toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>kN</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Safety Factor ≥ 1.67 under governing wind/ice
          </div>
        </div>

      </div>

      {/* Cable Tension Criteria Table */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            PLS-CADD Cable Tension Limits (Criteria &gt; Cable Tensions)
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            CSA C22.3 No. 1-15 Tables 33 &amp; 34
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.5rem 0.75rem' }}>Weather Case</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Cable Condition</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Max Tension (% RTS)</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Max Catenary Constant</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Governing Limit Function</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>C1: Heavy Ice + Wind</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>Initial FE</td>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 'bold' }}>
                  60.0% RTS ({module5Result.maxLoadedTensionKn.toFixed(1)} kN)
                </td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>—</td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>Governing Peak Ice Load</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>C2: Red. Ice + Wind</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>Initial FE</td>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 'bold' }}>
                  60.0% RTS ({module5Result.maxLoadedTensionKn.toFixed(1)} kN)
                </td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>—</td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>Governing Wind-on-Ice</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>Extreme Wind Case</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>Initial FE</td>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 'bold' }}>
                  60.0% RTS ({module5Result.maxLoadedTensionKn.toFixed(1)} kN)
                </td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>—</td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>Governing Extreme Wind Load</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>Everyday Cold (Jan)</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>Initial FE</td>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 'bold' }}>
                  20.0% RTS ({module5Result.maxInitialUnloadedTensionKn.toFixed(1)} kN)
                </td>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 'bold' }}>
                  {module5Result.maxCatenary.toFixed(0)} m ({module5Result.aeolianTensionLimitKn.toFixed(1)} kN)
                </td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>Aeolian Vibration Limit (Initial)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>Everyday Cold (Jan)</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>Creep FE</td>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 'bold' }}>
                  15.0% RTS ({module5Result.maxFinalUnloadedTensionKn.toFixed(1)} kN)
                </td>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 'bold' }}>
                  {module5Result.maxCatenary.toFixed(0)} m ({module5Result.aeolianTensionLimitKn.toFixed(1)} kN)
                </td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>Vibration &amp; Creep Limit (Final)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Design Calculation Detail */}
      <details className="calc-detail">
        <summary>Design Calculation — Tension & Catenary Limits</summary>
        <div className="calc-body">
          <div className="calc-step">
            <div className="calc-label">Base Catenary Constant (C_base)</div>
            <div className="calc-formula">
              Dampers: {hasDampers ? 'Installed' : 'Not Installed'} | Configuration: {isBundled ? 'Bundled' : 'Single'}
            </div>
            <div className="calc-formula">
              C_base = <span className="calc-result">{module5Result.baseCatenary} m</span>
              {hasDampers
                ? ` (${isBundled ? 'Bundled with dampers → 2200m' : 'Single with dampers → 2000m'})`
                : ' (No dampers → 1200m)'}
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Table 33 Short-Span Reduction</div>
            <div className="calc-formula">
              Ruling Span S = {module5Result.rulingSpanM} m
              {module5Result.spanReductionApplied
                ? ` → Reduction applied: C_max = ${module5Result.maxCatenary} m`
                : ' → No reduction (S > 400m): C_max = C_base'}
            </div>
            <div className="calc-formula">
              C_max = <span className="calc-result">{module5Result.maxCatenary} m</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Aeolian Vibration Initial Tension (H_vibe)</div>
            <div className="calc-formula">
              H_vibe = C_max × w / 1000 = {module5Result.maxCatenary} × {module5Result.conductorWeightNm} / 1000 = <span className="calc-result">{module5Result.aeolianTensionLimitKn.toFixed(2)} kN</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Peak Loaded Tension (60% RTS)</div>
            <div className="calc-formula">
              60% × RTS = 0.60 × {module5Result.rtsKn} = <span className="calc-result">{module5Result.maxLoadedTensionKn.toFixed(2)} kN</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Initial Unloaded Tension (20% RTS)</div>
            <div className="calc-formula">
              20% × RTS = 0.20 × {module5Result.rtsKn} = <span className="calc-result">{module5Result.maxInitialUnloadedTensionKn.toFixed(2)} kN</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Final Unloaded Tension After Creep (15% RTS)</div>
            <div className="calc-formula">
              15% × RTS = 0.15 × {module5Result.rtsKn} = <span className="calc-result">{module5Result.maxFinalUnloadedTensionKn.toFixed(2)} kN</span>
            </div>
          </div>
        </div>
      </details>

      {/* Module Explanation */}
      <details className="module-explainer">
        <summary>Module 5 — Engineering Basis & CSA Reference</summary>
        <div className="explainer-body">
          <p>
            <strong>Module 5: Conductor Tension & Aeolian Vibration Engine</strong> sets tension limits to
            protect conductors against long-term fatigue failure caused by wind-induced aeolian vibration
            (vortex shedding between 3 to 150 Hz) while respecting structural load limits.
          </p>
          <p><strong>Catenary Constant (C)</strong> — The susceptibility metric for aeolian vibration:</p>
          <ul>
            <li><code>C = H / w</code> [m] — where H is horizontal tension (N) and w is bare conductor unit weight (N/m)</li>
          </ul>
          <p><strong>Rule 1: Unloaded Initial Tension Limit (CSA Clause 8.7.3)</strong></p>
          <ul>
            <li>With Vibration Dampers: C ≤ 2000 m (single) or C ≤ 2200 m (bundled phases)</li>
            <li>Without Vibration Dampers: C ≤ 1000–1400 m (terrain dependent)</li>
          </ul>
          <p><strong>Rule 2: Short-Span Reduction (CSA Table 33)</strong></p>
          <ul>
            <li>For ruling spans under 400 m, maximum allowable C is progressively reduced (e.g., S=250m → C_max=1600m)</li>
          </ul>
          <p><strong>Rule 3: Factored Maximum Loaded Tension</strong></p>
          <ul>
            <li>Under governing design wind/ice loading, tension must not exceed <strong>60% RTS</strong> (safety factor ≥ 1.67)</li>
          </ul>
          <p><strong>Rule 4: Final Unloaded Tension After Creep</strong></p>
          <ul>
            <li>After 10–20 years of metallurgical creep, final unloaded tension at average annual temperature must not exceed <strong>75% RTS</strong></li>
          </ul>
        </div>
      </details>
    </div>
  );
}
