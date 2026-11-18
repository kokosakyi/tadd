import React from 'react';
import Latex from './common/Latex';

export default function Module4GuardrailCard({ module4Result: propResult, governedResults }) {
  const module4Result = propResult || governedResults;
  if (!module4Result) return null;

  const districts = [
    { name: 'Severe', ice: '19.0 mm', wind: '400 Pa', temp: '-20°C', desc: 'Coastal / Alpine Icing Belts' },
    { name: 'Heavy', ice: '12.5 mm', wind: '400 Pa', temp: '-20°C', desc: 'Eastern / Central Transmission Corridors' },
    { name: 'Medium A', ice: '6.5 mm', wind: '400 Pa', temp: '-20°C', desc: 'Moderate Icing Regions' },
    { name: 'Medium B', ice: '12.5 mm', wind: '300 Pa', temp: '-20°C', desc: 'Prairie / High Wind Low Temp' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.45rem 1.65rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="module-badge">M4</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 660, color: 'var(--text-main)' }}>
              Deterministic Safety Guardrail (CSA C22.3 No. 1-15 Table 30)
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Compares statistical reliability calculations against statutory legal minimum load floors.
            </p>
          </div>
        </div>

        {/* Active District Badge */}
        <span className="badge badge-neutral" style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}>
          Active District: {module4Result.district || 'Heavy'} (Table 30 Floor)
        </span>
      </div>

      {/* Governing Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Wind Pressure Governing Card */}
        <div
          className="glass-inset"
          style={{
            padding: '1.15rem 1.25rem',
            borderColor: module4Result.windGovernedByLegal ? 'rgba(251, 191, 36, 0.42)' : undefined,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
              Design Wind Pressure (q_final)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 650 }}>
              <span className={`status-dot ${module4Result.windGovernedByLegal ? 'marginal' : 'pass'}`} />
              <span style={{ color: module4Result.windGovernedByLegal ? 'var(--status-marginal)' : 'var(--status-pass)' }}>
                {module4Result.windGovernedByLegal ? 'Legal Floor Governs' : 'Reliability Governs'}
              </span>
            </div>
          </div>

          <div className="mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            {module4Result.governed_q0.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}>Pa</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem', fontSize: '0.76rem', color: 'var(--text-muted)', paddingTop: '0.45rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Module 3 Calculated (q₀):</span>
              <span className="mono" style={{ color: 'var(--text-main)', fontWeight: 650 }}>{module4Result.q0_extreme.toFixed(1)} Pa</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Table 30 Minimum (q_min):</span>
              <span className="mono" style={{ color: 'var(--text-main)', fontWeight: 650 }}>{module4Result.minWindPa.toFixed(1)} Pa</span>
            </div>
          </div>
        </div>

        {/* Ice Thickness Governing Card */}
        <div
          className="glass-inset"
          style={{
            padding: '1.15rem 1.25rem',
            borderColor: module4Result.iceGovernedByLegal ? 'rgba(251, 191, 36, 0.42)' : undefined,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 650 }}>
              Design Ice Thickness (t_final)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 650 }}>
              <span className={`status-dot ${module4Result.iceGovernedByLegal ? 'marginal' : 'pass'}`} />
              <span style={{ color: module4Result.iceGovernedByLegal ? 'var(--status-marginal)' : 'var(--status-pass)' }}>
                {module4Result.iceGovernedByLegal ? 'Legal Floor Governs' : 'Reliability Governs'}
              </span>
            </div>
          </div>

          <div className="mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            {module4Result.governed_t_design.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}>mm</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem', fontSize: '0.76rem', color: 'var(--text-muted)', paddingTop: '0.45rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Module 3 Calculated (t_design):</span>
              <span className="mono" style={{ color: 'var(--text-main)', fontWeight: 650 }}>{module4Result.t_design.toFixed(1)} mm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Table 30 Minimum (t_min):</span>
              <span className="mono" style={{ color: 'var(--text-main)', fontWeight: 650 }}>{module4Result.minIceMm.toFixed(1)} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSA Table 30 Reference Table */}
      <div className="glass-inset" style={{ padding: '1.15rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 650 }}>
            CSA C22.3 No. 1-15 Table 30 Loading Districts Floor Reference
          </h4>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Statutory Legal Base Floor
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-borderless" style={{ width: '100%', fontSize: '0.825rem', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>District</th>
                <th>Min Radial Ice (t_min)</th>
                <th>Min Wind Pressure (q_min)</th>
                <th>Design Temperature</th>
                <th>Geographic Description</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((d) => {
                const isActive = (module4Result.district || 'Heavy').toLowerCase() === d.name.toLowerCase();
                return (
                  <tr
                    key={d.name}
                    style={{
                      background: isActive ? 'var(--bg-hover-row)' : undefined
                    }}
                  >
                    <td style={{ fontWeight: 650, color: isActive ? 'var(--accent-cyan)' : 'var(--text-main)' }}>
                      {d.name} {isActive && '▸'}
                    </td>
                    <td className="mono">{d.ice}</td>
                    <td className="mono">{d.wind}</td>
                    <td className="mono">{d.temp}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{d.desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Design Calculation Detail */}
      <details className="calc-detail">
        <summary>Design Calculation — Deterministic Guardrail Comparison</summary>
        <div className="calc-body">
          <div className="calc-step">
            <div className="calc-label">Governing Wind Pressure (<Latex math="q_{\text{final}}" />)</div>
            <div className="calc-formula">q_final = max(q₀_calc, q_min)</div>
            <div className="calc-formula">
              q_final = max({module4Result.q0_extreme.toFixed(1)}, {module4Result.minWindPa.toFixed(1)}) = <span className="calc-result">{module4Result.governed_q0.toFixed(1)} Pa</span>
            </div>
            <div className="calc-formula">
              → {module4Result.windGovernedByLegal ? 'Legal Floor Governs (Table 30 minimum exceeds calculated)' : 'Reliability Governs (calculated exceeds Table 30 minimum)'}
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Governing Ice Thickness (<Latex math="t_{\text{final}}" />)</div>
            <div className="calc-formula">t_final = max(t_design, t_min)</div>
            <div className="calc-formula">
              t_final = max({module4Result.t_design.toFixed(1)}, {module4Result.minIceMm.toFixed(1)}) = <span className="calc-result">{module4Result.governed_t_design.toFixed(1)} mm</span>
            </div>
            <div className="calc-formula">
              → {module4Result.iceGovernedByLegal ? 'Legal Floor Governs (Table 30 minimum exceeds calculated)' : 'Reliability Governs (calculated exceeds Table 30 minimum)'}
            </div>
          </div>
        </div>
      </details>

      {/* Module Explanation */}
      <details className="module-explainer">
        <summary>Module 4 — Engineering Basis &amp; CSA Reference</summary>
        <div className="explainer-body">
          <p>
            <strong>Module 4: Deterministic Safety Guardrail</strong> compares the statistical reliability-based
            outputs of Module 3 against legislated deterministic minimums from
            <strong> CSA C22.3 No. 1-15 Table 30</strong>.
          </p>
          <p>
            The governing (higher) value must always be used. This ensures that even in locations where
            statistical analysis yields lower loads, the legal minimum load floors are always respected.
          </p>
          <p><strong>Governing Decision Logic:</strong></p>
          <ul>
            <li><code>t_final = max(t_design, t_min)</code> — Design ice is the larger of calculated and Table 30 minimum</li>
            <li><code>q_final = max(q₀, q_min)</code> — Design wind is the larger of calculated and Table 30 minimum</li>
          </ul>
          <p>
            <strong>Table 30 Loading Districts</strong> define statutory minimum radial ice thickness, wind pressure,
            and design temperature for each Canadian loading zone. The districts are:
          </p>
          <ul>
            <li><strong>Severe</strong> (19.0 mm ice, 400 Pa wind) — Coastal/alpine icing belts</li>
            <li><strong>Heavy</strong> (12.5 mm ice, 400 Pa wind) — Eastern/central transmission corridors</li>
            <li><strong>Medium A</strong> (6.5 mm ice, 400 Pa wind) — Moderate icing regions</li>
            <li><strong>Medium B</strong> (12.5 mm ice, 300 Pa wind) — Prairie/high wind low temperature</li>
          </ul>
          <p>
            When reliability-based calculations (Module 3) produce values <em>below</em> the Table 30 floor,
            the legal minimum overrides and governs the design. This is common for wind pressure in moderate
            wind regions.
          </p>
        </div>
      </details>
    </div>
  );
}
