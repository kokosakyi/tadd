import React from 'react';

export default function Module2RPScalingCard({ module2Result, w50, t50 }) {
  if (!module2Result) return null;

  return (
    <div className="glass-panel card-padding" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div className="module-badge">M2</div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
            Return Period Climatic Scaling (CSA 60826 CA.2)
          </h3>
          <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Interpolates and applies reliability scaling factors for the chosen {module2Result.returnPeriod}-year return period.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>

        {/* Wind Scaling */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Wind Scaling Factor (Tw)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {module2Result.Tw.toFixed(3)}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Scaled Wind (W_T): <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{module2Result.w_T.toFixed(1)} km/h</span>
          </div>
        </div>

        {/* Ice Scaling */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Ice Scaling Factor (Ti)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {module2Result.Ti.toFixed(3)}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Scaled Ice (t_T): <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{module2Result.t_T.toFixed(1)} mm</span>
          </div>
        </div>

      </div>

      {/* Design Calculation Detail */}
      <details className="calc-detail">
        <summary>Design Calculation — Return Period Scaling</summary>
        <div className="calc-body">
          <div className="calc-step">
            <div className="calc-label">Wind Scaling Factor (Tw)</div>
            <div className="calc-formula">
              Tw = Table CA.2 interpolation for T = {module2Result.returnPeriod} yr → <span className="calc-result">{module2Result.Tw.toFixed(4)}</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Ice Scaling Factor (Ti)</div>
            <div className="calc-formula">
              Ti = Table CA.2 interpolation for T = {module2Result.returnPeriod} yr → <span className="calc-result">{module2Result.Ti.toFixed(4)}</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Scaled Design Wind Speed (W_T)</div>
            <div className="calc-formula">
              W_T = W50 × Tw = {w50} × {module2Result.Tw.toFixed(3)} = <span className="calc-result">{module2Result.w_T.toFixed(2)} km/h</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Scaled Design Ice Thickness (t_T)</div>
            <div className="calc-formula">
              t_T = t50 × Ti = {t50} × {module2Result.Ti.toFixed(3)} = <span className="calc-result">{module2Result.t_T.toFixed(2)} mm</span>
            </div>
          </div>
        </div>
      </details>

      {/* Module Explanation */}
      <details className="module-explainer">
        <summary>Module 2 — Engineering Basis & CSA Reference</summary>
        <div className="explainer-body">
          <p>
            <strong>Module 2: Return Period Climatic Scaling</strong> adjusts baseline 50-year wind and ice values
            to the line's target design reliability using factors from <strong>CAN/CSA-C22.3 No. 60826-10
            Table CA.2</strong>.
          </p>
          <p>
            The 50-year baselines (W50, t50) represent a 2% annual probability of exceedance. For lines of
            differing structural importance, Reliability-Based Design (RBD) scales these baselines using target
            return periods (T) between 25 and 500 years.
          </p>
          <p><strong>Scaling Equations:</strong></p>
          <ul>
            <li><code>W_T = W50 × Tw</code> — Scaled wind speed for target return period</li>
            <li><code>t_T = t50 × Ti</code> — Scaled ice thickness for target return period</li>
          </ul>
          <p>
            For intermediate return periods not listed in Table CA.2, direct linear interpolation between
            adjacent tabulated points is performed per CSA 60826-10 Clause 5.2.1. The scaling follows
            Gumbel distribution factors.
          </p>
          <p><strong>Code-Mandated Table CA.2 Reference Points:</strong></p>
          <ul>
            <li>T = 25 yr (Lighter/Temporary): Tw = 0.93, Ti = 0.85</li>
            <li>T = 50 yr (Baseline/Standard): Tw = 1.00, Ti = 1.00</li>
            <li>T = 100 yr (High Reliability): Tw = 1.05, Ti = 1.12</li>
            <li>T = 150 yr (Very High Reliability): Tw = 1.10, Ti = 1.20</li>
            <li>T = 500 yr (Critical Infrastructure): Tw = 1.22, Ti = 1.42</li>
          </ul>
        </div>
      </details>
    </div>
  );
}
