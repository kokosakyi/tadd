import React from 'react';

export default function Module4GuardrailCard({ module4Result }) {
  if (!module4Result) return null;

  const districts = [
    { name: 'Severe', ice: '19.0 mm', wind: '400 Pa', temp: '-20°C', desc: 'Coastal / Alpine Icing Belts' },
    { name: 'Heavy', ice: '12.5 mm', wind: '400 Pa', temp: '-20°C', desc: 'Eastern / Central Transmission Corridors' },
    { name: 'Medium A', ice: '6.5 mm', wind: '400 Pa', temp: '-20°C', desc: 'Moderate Icing Regions' },
    { name: 'Medium B', ice: '12.5 mm', wind: '300 Pa', temp: '-20°C', desc: 'Prairie / High Wind Low Temp' }
  ];

  return (
    <div className="glass-panel card-padding" style={{ marginTop: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="module-badge">M4</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              Deterministic Safety Guardrail (CSA C22.3 No. 1-15 Table 30)
            </h3>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Compares statistical reliability calculations against statutory legal minimum load floors.
            </p>
          </div>
        </div>

        {/* Active District Badge */}
        <div style={{
          padding: '0.4rem 0.85rem',
          borderRadius: '8px',
          background: 'rgba(148, 163, 184, 0.15)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-muted)',
          fontWeight: 'bold',
          fontSize: '0.85rem'
        }}>
          Active District: {module4Result.district || 'Heavy'} (Table 30 Floor)
        </div>
      </div>

      {/* Governing Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        
        {/* Wind Pressure Governing Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: module4Result.windGovernedByLegal ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Design Wind Pressure (q_final)
            </span>
            <span style={{
              fontSize: '0.7rem',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 'bold',
              background: module4Result.windGovernedByLegal ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: module4Result.windGovernedByLegal ? '#f87171' : '#34d399'
            }}>
              {module4Result.windGovernedByLegal ? '⚠ Legal Floor Governs' : '✓ Reliability Governs'}
            </span>
          </div>

          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {module4Result.governed_q0.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>Pa</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.35rem', borderTop: '1px dashed var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Module 3 Calculated (q₀):</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{module4Result.q0_extreme.toFixed(1)} Pa</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Table 30 Minimum (q_min):</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{module4Result.minWindPa.toFixed(1)} Pa</span>
            </div>
          </div>
        </div>

        {/* Ice Thickness Governing Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: module4Result.iceGovernedByLegal ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Design Ice Thickness (t_final)
            </span>
            <span style={{
              fontSize: '0.7rem',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 'bold',
              background: module4Result.iceGovernedByLegal ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: module4Result.iceGovernedByLegal ? '#f87171' : '#34d399'
            }}>
              {module4Result.iceGovernedByLegal ? '⚠ Legal Floor Governs' : '✓ Reliability Governs'}
            </span>
          </div>

          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {module4Result.governed_t_design.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>mm</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.35rem', borderTop: '1px dashed var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Module 3 Calculated (t_design):</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{module4Result.t_design.toFixed(1)} mm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Table 30 Minimum (t_min):</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{module4Result.minIceMm.toFixed(1)} mm</span>
            </div>
          </div>
        </div>

      </div>

      {/* CSA Table 30 Reference Table */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            CSA C22.3 No. 1-15 Table 30 Loading Districts Floor Reference
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Statutory Legal Base Floor
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.5rem 0.75rem' }}>District</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Min Radial Ice (t_min)</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Min Wind Pressure (q_min)</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Design Temperature</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Geographic Description</th>
              </tr>
            </thead>
            <tbody>
              {districts.map(d => {
                const isActive = (module4Result.district || 'Heavy').toLowerCase() === d.name.toLowerCase();
                return (
                  <tr
                    key={d.name}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      background: isActive ? 'rgba(148, 163, 184, 0.08)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: 'bold', color: isActive ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                      {d.name} {isActive && '▸'}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600' }}>{d.ice}</td>
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600' }}>{d.wind}</td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>{d.temp}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>{d.desc}</td>
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
            <div className="calc-label">Governing Wind Pressure (q_final)</div>
            <div className="calc-formula">
              q_final = max(q₀_calc, q_min)
            </div>
            <div className="calc-formula">
              q_final = max({module4Result.q0_extreme.toFixed(1)}, {module4Result.minWindPa.toFixed(1)}) = <span className="calc-result">{module4Result.governed_q0.toFixed(1)} Pa</span>
            </div>
            <div className="calc-formula">
              → {module4Result.windGovernedByLegal ? 'Legal Floor Governs (Table 30 minimum exceeds calculated)' : 'Reliability Governs (calculated exceeds Table 30 minimum)'}
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Governing Ice Thickness (t_final)</div>
            <div className="calc-formula">
              t_final = max(t_design, t_min)
            </div>
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
        <summary>Module 4 — Engineering Basis & CSA Reference</summary>
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
