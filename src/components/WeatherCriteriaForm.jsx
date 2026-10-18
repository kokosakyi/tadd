import React from 'react';

export default function Module1GeoDBForm({
  provinces,
  selectedProvince,
  setSelectedProvince,
  citiesInProvince,
  selectedCity,
  setSelectedCity,
  stationData,
  geoData,
  returnPeriod,
  setReturnPeriod,
  returnPeriodFactors,
  district,
  setDistrict,
  deterministicMinimums,
  rulingSpan,
  setRulingSpan,
  conductorDiameter,
  setConductorDiameter,
  hasDampers,
  setHasDampers,
  isTransmission,
  setIsTransmission,
  rtsKn,
  setRtsKn,
  conductorWeightNm,
  setConductorWeightNm,
  isBundled,
  setIsBundled
}) {
  const activeStation = stationData || (geoData?.location ? geoData : null);

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div className="badge badge-info" style={{ fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>M1</div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Geoclimatic Data Vault (CSA 60826 CA.1)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Select project location to retrieve 50-year baseline weather variables and snowpack thresholds.
          </p>
        </div>
      </div>

      <div className="form-grid">
        {/* Province Selector */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Province / Territory</label>
          <select
            className="form-select"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            {provinces.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>

        {/* City Selector */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Weather Station Location</label>
          <select
            className="form-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {[...citiesInProvince]
              .sort((a, b) => a.location.localeCompare(b.location))
              .map(c => (
                <option key={c.location} value={c.location}>{c.location}</option>
              ))}
          </select>
        </div>

        {/* Return Period Selector (Module 2) */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Target Return Period (Years)</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="number"
              className="form-input"
              value={returnPeriod}
              onChange={(e) => setReturnPeriod(Number(e.target.value))}
              min="25"
              max="500"
              step="1"
              style={{ flex: 1, fontVariantNumeric: 'tabular-nums' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>years</span>
          </div>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Enter value between 25 and 500 to interpolate scaling factors.
          </p>
        </div>

        {/* Loading District (Module 4) */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Deterministic District (CSA Table 30)</label>
          <select
            className="form-select"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            {Object.keys(deterministicMinimums).map(dist => (
              <option key={dist} value={dist}>{dist} District</option>
            ))}
          </select>
        </div>

        {/* Line Height Classification (Module 3) */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Line Height Profile (CSA 60826)</label>
          <select
            className="form-select"
            value={isTransmission ? 'transmission' : 'distribution'}
            onChange={(e) => setIsTransmission(e.target.value === 'transmission')}
          >
            <option value="transmission">Transmission (Mean Height ~30m, Kh=1.15)</option>
            <option value="distribution">Distribution (Mean Height ~10m, Kh=1.00)</option>
          </select>
        </div>

        {/* Conductor Outer Diameter */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Bare Conductor Diameter (mm)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            value={conductorDiameter}
            onChange={(e) => setConductorDiameter(Number(e.target.value))}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          />
        </div>

        {/* Conductor Rated Tensile Strength (RTS) */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Conductor RTS (kN)</label>
          <input
            type="number"
            step="0.1"
            className="form-input"
            value={rtsKn}
            onChange={(e) => setRtsKn(Number(e.target.value))}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          />
        </div>

        {/* Conductor Unit Mass/Weight */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Conductor Unit Weight (N/m)</label>
          <input
            type="number"
            step="0.1"
            className="form-input"
            value={conductorWeightNm}
            onChange={(e) => setConductorWeightNm(Number(e.target.value))}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          />
        </div>

        {/* Design Ruling Span */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Design Ruling Span (m)</label>
          <input
            type="number"
            className="form-input"
            value={rulingSpan}
            onChange={(e) => setRulingSpan(Number(e.target.value))}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          />
        </div>
      </div>

      {/* Baseline Summary Card for Selected City */}
      {activeStation && (
        <div style={{
          marginTop: '1.25rem',
          padding: '1.15rem',
          borderRadius: '12px',
          background: 'var(--bg-inset)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
              📍 Geoclimatic Baseline Parameters — {activeStation.location} ({activeStation.province || selectedProvince})
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              {activeStation.latitude ? `Lat: ${activeStation.latitude}°N | Long: ${activeStation.longitude}°W | ` : ''}Elev: {activeStation.elevation}m
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            textAlign: 'center'
          }}>
            <div className="stat-card" style={{ background: 'var(--bg-card)', borderRadius: '10px', padding: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min January Temp (T_jan)</span>
              <span className="stat-value" style={{ color: '#60a5fa', fontWeight: 700, fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums', display: 'block', marginTop: '0.2rem' }}>{activeStation.min_temp} °C</span>
            </div>
            <div className="stat-card" style={{ background: 'var(--bg-card)', borderRadius: '10px', padding: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>50-Yr Ref Wind (W50)</span>
              <span className="stat-value" style={{ color: 'var(--status-pass)', fontWeight: 700, fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums', display: 'block', marginTop: '0.2rem' }}>{activeStation.wind_50yr} km/h</span>
            </div>
            <div className="stat-card" style={{ background: 'var(--bg-card)', borderRadius: '10px', padding: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>50-Yr Ref Ice (t50)</span>
              <span className="stat-value" style={{ color: '#c084fc', fontWeight: 700, fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums', display: 'block', marginTop: '0.2rem' }}>{activeStation.ice_50yr} mm</span>
            </div>
          </div>
        </div>
      )}

      {/* Module 1 Explanation */}
      <details className="module-explainer">
        <summary>Module 1 — Engineering Basis & CSA Reference</summary>
        <div className="explainer-body">
          <p>
            <strong>Module 1: Geoclimatic Data Vault</strong> retrieves baseline climatological parameters from
            <strong> CAN/CSA-C22.3 No. 60826-10 Table CA.1 (Weather Data)</strong>.
          </p>
          <p>Baseline parameters retrieved for each weather station include:</p>
          <ul>
            <li><strong>Elevation (z)</strong> — Altitude above mean sea level in metres.</li>
            <li><strong>Minimum January Temperature (T_jan)</strong> — 1% exclusion limit for January hourly temperatures. Only 1% of January hours statistically fall below this value. This maps directly to the "Everyday Cold" tension case wire temperature in PLS-CADD.</li>
            <li><strong>Reference Wind Speed (W50)</strong> — 10-minute average wind speed with a 50-year return period at 10 m height in open terrain.</li>
            <li><strong>Reference Ice Thickness (t50)</strong> — Equivalent radial glaze ice thickness (δ = 900 kg/m³) on a standard 25 mm cylinder at 10 m height with a 50-year return period, derived via the Chaîné accretion model.</li>
          </ul>
          <p>
            <strong>Ground Snow Pack Check (CSA C22.3 No. 1-15 Clause 5.3.1.1):</strong> If the mean annual maximum
            snow depth from Table D.1 exceeds <code>0.5 m</code>, the site is flagged as a Heavy Snow Area.
            Electrical ground clearances must be increased to account for reduced ground-to-wire clearance
            caused by snowpack accumulation.
          </p>
        </div>
      </details>
    </div>
  );
}
