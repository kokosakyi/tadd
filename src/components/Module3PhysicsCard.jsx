import React from 'react';

export default function Module3PhysicsCard({ module3Result, isTransmission, setIsTransmission }) {
  if (!module3Result) return null;

  return (
    <div className="glass-panel card-padding" style={{ marginTop: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="module-badge">M3</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              Reliability-Based Physics Engine (CSA 60826 Cl. 6)
            </h3>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Converts scaled weather baselines into dynamic wind pressure, spatial/height-adjusted ice loads, and C1/C2 joint probability cases.
            </p>
          </div>
        </div>

        {/* Line Type Selector Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--bg-secondary)',
          padding: '0.35rem 0.5rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Line Height Profile:</span>
          <button
            type="button"
            className={`btn ${isTransmission ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsTransmission(true)}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px' }}
          >
            Transmission (30m, K_h=1.15)
          </button>
          <button
            type="button"
            className={`btn ${!isTransmission ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsTransmission(false)}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px' }}
          >
            Distribution (10m, K_h=1.00)
          </button>
        </div>
      </div>

      {/* Primary Physical Parameters Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        
        {/* Wind-Only Dynamic Pressure */}
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
              Wind-Only Pressure (q₀)
            </span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 'bold' }}>
              τ = 1.04
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {module3Result.q0_extreme.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>Pa</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            q₀ = 0.5 × ρ × τ × (W_T / 3.6)² ≈ 0.049 × W_T²
          </div>
        </div>

        {/* Spatial & Height Adjusted Ice */}
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
              Design Ice Thickness (t_design)
            </span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 'bold' }}>
              S_a × K_h = {module3Result.combinedMultiplier.toFixed(2)}×
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {module3Result.t_design.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>mm</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Base t_T ({module3Result.t_T.toFixed(1)}mm) × S_a(1.3) × K_h({module3Result.kh.toFixed(2)})
          </div>
        </div>

        {/* Radial Glaze Ice Unit Weight */}
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
              Glaze Ice Unit Weight (g_R)
            </span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', fontWeight: 'bold' }}>
              δ = 900 kg/m³
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {module3Result.g_R.toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>N/m</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            g_R = 0.0277 × t_design × (t_design + d={module3Result.condDiameterMm}mm)
          </div>
        </div>

      </div>

      {/* Joint-Probability Combination Cases (C1 & C2) */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            CSA 60826 Joint-Probability Coincident Load Combinations (Clause 6.4.1)
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Coincident Air Density Correction τ = 1.10 (-10°C Glaze)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          
          {/* Combination C1 */}
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '10px',
            padding: '1rem',
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid var(--text-muted)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                Combination C1: Heavy Ice + Low Wind
              </span>
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(148, 163, 184, 0.15)', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                Governs Ice Loads
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Coincident Wind Speed (40% W_T):</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{module3Result.wind_C1.toFixed(1)} km/h</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Coincident Wind Pressure (q_0H):</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{module3Result.q0_C1.toFixed(1)} Pa</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Radial Glaze Ice Thickness (100%):</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{module3Result.ice_C1.toFixed(1)} mm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Ice Load Weight (g_R):</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{module3Result.weight_C1.toFixed(2)} N/m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.35rem', borderTop: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Ice-Covered Diameter (D_L):</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{module3Result.d_C1.toFixed(2)} mm</span>
              </div>
            </div>
          </div>

          {/* Combination C2 */}
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '10px',
            padding: '1rem',
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid var(--text-muted)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                Combination C2: Reduced Ice + High Wind
              </span>
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(148, 163, 184, 0.15)', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                Governs Wind-on-Ice
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Coincident Wind Speed (60% W_T):</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{module3Result.wind_C2.toFixed(1)} km/h</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Coincident Wind Pressure (q_0L):</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{module3Result.q0_C2.toFixed(1)} Pa</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Reduced Radial Ice Thickness (t_H):</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{module3Result.ice_C2.toFixed(1)} mm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Reduced Ice Weight (50% g_R):</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{module3Result.weight_C2.toFixed(2)} N/m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.35rem', borderTop: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Ice-Covered Diameter (D_H):</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{module3Result.d_C2.toFixed(2)} mm</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Design Calculation Detail */}
      <details className="calc-detail">
        <summary>Design Calculation — Physics Engine</summary>
        <div className="calc-body">
          <div className="calc-step">
            <div className="calc-label">Extreme Wind-Only Dynamic Pressure (q₀)</div>
            <div className="calc-formula">
              q₀ = 0.5 × ρ × τ × (W_T / 3.6)²
            </div>
            <div className="calc-formula">
              q₀ = 0.5 × 1.225 × 1.04 × ({module3Result.w_T.toFixed(1)} / 3.6)² = <span className="calc-result">{module3Result.q0_extreme.toFixed(2)} Pa</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Spatial & Height Adjusted Design Ice (t_design)</div>
            <div className="calc-formula">
              t_design = t_T × S_a × K_h
            </div>
            <div className="calc-formula">
              t_design = {module3Result.t_T.toFixed(1)} × {module3Result.sa.toFixed(1)} × {module3Result.kh.toFixed(2)} = <span className="calc-result">{module3Result.t_design.toFixed(2)} mm</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">Radial Glaze Ice Unit Weight (g_R)</div>
            <div className="calc-formula">
              g_R = 0.0277 × t_design × (t_design + d)
            </div>
            <div className="calc-formula">
              g_R = 0.0277 × {module3Result.t_design.toFixed(1)} × ({module3Result.t_design.toFixed(1)} + {module3Result.condDiameterMm}) = <span className="calc-result">{module3Result.g_R.toFixed(2)} N/m</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">C1: Heavy Ice + 40% Wind</div>
            <div className="calc-formula">
              V_C1 = 0.4 × {module3Result.w_T.toFixed(1)} = <span className="calc-result">{module3Result.wind_C1.toFixed(2)} km/h</span>
            </div>
            <div className="calc-formula">
              q₀_C1 = 0.5 × 1.225 × 1.10 × ({module3Result.wind_C1.toFixed(1)} / 3.6)² = <span className="calc-result">{module3Result.q0_C1.toFixed(2)} Pa</span>
            </div>
            <div className="calc-formula">
              Ice = 100% t_design = <span className="calc-result">{module3Result.ice_C1.toFixed(1)} mm</span>, Weight = <span className="calc-result">{module3Result.weight_C1.toFixed(2)} N/m</span>
            </div>
          </div>
          <div className="calc-step">
            <div className="calc-label">C2: Reduced Ice + 60% Wind</div>
            <div className="calc-formula">
              V_C2 = 0.6 × {module3Result.w_T.toFixed(1)} = <span className="calc-result">{module3Result.wind_C2.toFixed(2)} km/h</span>
            </div>
            <div className="calc-formula">
              q₀_C2 = 0.5 × 1.225 × 1.10 × ({module3Result.wind_C2.toFixed(1)} / 3.6)² = <span className="calc-result">{module3Result.q0_C2.toFixed(2)} Pa</span>
            </div>
            <div className="calc-formula">
              g_R_C2 = 50% × {module3Result.g_R.toFixed(2)} = <span className="calc-result">{module3Result.weight_C2.toFixed(2)} N/m</span>
            </div>
            <div className="calc-formula">
              Reduced ice t_H (back-calculated from quadratic) = <span className="calc-result">{module3Result.ice_C2.toFixed(2)} mm</span>
            </div>
          </div>
        </div>
      </details>

      {/* Module Explanation */}
      <details className="module-explainer">
        <summary>Module 3 — Engineering Basis & CSA Reference</summary>
        <div className="explainer-body">
          <p>
            <strong>Module 3: Reliability-Based Physics Engine</strong> converts return-period-scaled weather
            values (W_T, t_T) from Module 2 into physical forces: Reference Dynamic Wind Pressure (q₀) and
            Unit Ice Mass/Weight (g_R).
          </p>
          <p><strong>1. Reference Wind Pressure (q₀)</strong> — Per <strong>CSA 60826-10 Clause 6.2.5</strong>:</p>
          <ul>
            <li><code>q₀ = 0.5 × ρ × τ × (W_T/3.6)²</code> [Pa]</li>
            <li>ρ = 1.225 kg/m³ (standard air density at sea level, 15°C)</li>
            <li>τ = 1.04 for Wind-Only cases (cold air density enhancement)</li>
            <li>τ = 1.10 for Combined Wind-on-Ice cases (-10°C glaze conditions)</li>
          </ul>
          <p><strong>2. Design Ice Thickness (t_design)</strong> — Height and spatial adjustments before weight calculation:</p>
          <ul>
            <li><code>t_design = t_T × S_a × K_h</code></li>
            <li>S_a = 1.3 (spatial factor — accounts for line corridor traversing storm paths)</li>
            <li>K_h = 1.15 for transmission (~30m mean height); K_h = 1.00 for distribution (~10m)</li>
          </ul>
          <p><strong>3. Ice Unit Weight (g_R)</strong> — Cylindrical Weight Equation (Clause 6.3.2, Eq. 13):</p>
          <ul>
            <li><code>g_R = 0.0277 × t_design × (t_design + d)</code> [N/m], for glaze density δ = 900 kg/m³</li>
          </ul>
          <p><strong>4. Joint-Probability C1 & C2 Combinations</strong> — Per <strong>Clause 6.4.1</strong>,
            extreme wind and extreme ice are unlikely to peak simultaneously. Two joint-probability cases are used:</p>
          <ul>
            <li><strong>C1 (Heavy Ice + Low Wind):</strong> Full design ice (100% g_R) + coincident wind at 40% W_T</li>
            <li><strong>C2 (Reduced Ice + High Wind):</strong> 50% ice weight + coincident wind at 60% W_T. The reduced ice thickness t_H is back-calculated from the quadratic equation.</li>
          </ul>
        </div>
      </details>
    </div>
  );
}
