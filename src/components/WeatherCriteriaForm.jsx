import React from 'react';

const LINE_HEIGHT_OPTIONS = [
  { value: 'distribution', label: 'Distribution (Mean Height ~10m, Kh=1.00)' },
  { value: 'transmission', label: 'Transmission (Mean Height ~30m, Kh=1.15)' }
].sort((a, b) => a.label.localeCompare(b.label));

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
  district,
  setDistrict,
  deterministicMinimums,
  rulingSpan,
  setRulingSpan,
  conductorDiameter,
  setConductorDiameter,
  isTransmission,
  setIsTransmission,
  rtsKn,
  setRtsKn,
  conductorWeightNm,
  setConductorWeightNm
}) {
  const activeStation = stationData || (geoData?.location ? geoData : null);
  const sortedProvinces = [...provinces].sort((a, b) => a.localeCompare(b));
  const sortedDistricts = Object.keys(deterministicMinimums).sort((a, b) => a.localeCompare(b));

  return (
    <div className="glass-panel" style={{ padding: '1.45rem 1.65rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.35rem' }}>
        <div className="module-badge">M1</div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 660, color: 'var(--text-main)' }}>
            Geoclimatic Data Vault (CSA 60826 CA.1)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Select project location to retrieve 50-year baseline weather variables and snowpack thresholds.
          </p>
        </div>
      </div>

      <div className="form-grid">
        {/* Province Selector */}
        <div className="form-group">
          <label>Province / Territory</label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            {sortedProvinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* City Selector */}
        <div className="form-group">
          <label>Weather Station Location</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {[...citiesInProvince]
              .sort((a, b) => a.location.localeCompare(b.location))
              .map((c) => (
                <option key={c.location} value={c.location}>
                  {c.location}
                </option>
              ))}
          </select>
        </div>

        {/* Return Period Selector (Module 2) */}
        <div className="form-group">
          <label>Target Return Period (Years)</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="number"
              className="mono"
              value={returnPeriod}
              onChange={(e) => setReturnPeriod(Number(e.target.value))}
              min="25"
              max="500"
              step="1"
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>years</span>
          </div>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
            Enter value between 25 and 500 to interpolate scaling factors.
          </p>
        </div>

        {/* Loading District (Module 4) */}
        <div className="form-group">
          <label>Deterministic District (CSA Table 30)</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            {sortedDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist} District
              </option>
            ))}
          </select>
        </div>

        {/* Line Height Classification (Module 3) */}
        <div className="form-group">
          <label>Line Height Profile (CSA 60826)</label>
          <select
            value={isTransmission ? 'transmission' : 'distribution'}
            onChange={(e) => setIsTransmission(e.target.value === 'transmission')}
          >
            {LINE_HEIGHT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Conductor Outer Diameter */}
        <div className="form-group">
          <label>Bare Conductor Diameter (mm)</label>
          <input
            type="number"
            className="mono"
            step="0.01"
            value={conductorDiameter}
            onChange={(e) => setConductorDiameter(Number(e.target.value))}
          />
        </div>

        {/* Conductor Rated Tensile Strength (RTS) */}
        <div className="form-group">
          <label>Conductor RTS (kN)</label>
          <input
            type="number"
            className="mono"
            step="0.1"
            value={rtsKn}
            onChange={(e) => setRtsKn(Number(e.target.value))}
          />
        </div>

        {/* Conductor Unit Mass/Weight */}
        <div className="form-group">
          <label>Conductor Unit Weight (N/m)</label>
          <input
            type="number"
            className="mono"
            step="0.1"
            value={conductorWeightNm}
            onChange={(e) => setConductorWeightNm(Number(e.target.value))}
          />
        </div>

        {/* Design Ruling Span */}
        <div className="form-group">
          <label>Design Ruling Span (m)</label>
          <input
            type="number"
            className="mono"
            value={rulingSpan}
            onChange={(e) => setRulingSpan(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Baseline Summary Card for Selected City */}
      {activeStation && (
        <div
          className="glass-inset"
          style={{
            marginTop: '1.35rem',
            padding: '1.15rem 1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontWeight: 650, color: 'var(--accent-cyan)', fontSize: '0.86rem' }}>
              📍 Geoclimatic Baseline Parameters — {activeStation.location} ({activeStation.province || selectedProvince})
            </span>
            <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {activeStation.latitude ? `Lat: ${activeStation.latitude}°N | Long: ${activeStation.longitude}°W | ` : ''}Elev: {activeStation.elevation}m
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.75rem',
              textAlign: 'center'
            }}
          >
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 550 }}>Min January Temp (T_jan)</span>
              <span className="mono" style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '1.3rem', display: 'block', marginTop: '0.22rem' }}>
                {activeStation.min_temp} °C
              </span>
            </div>
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 550 }}>50-Yr Ref Wind (W50)</span>
              <span className="mono" style={{ color: 'var(--status-pass)', fontWeight: 700, fontSize: '1.3rem', display: 'block', marginTop: '0.22rem' }}>
                {activeStation.wind_50yr} km/h
              </span>
            </div>
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 550 }}>50-Yr Ref Ice (t50)</span>
              <span className="mono" style={{ color: 'var(--accent-purple)', fontWeight: 700, fontSize: '1.3rem', display: 'block', marginTop: '0.22rem' }}>
                {activeStation.ice_50yr} mm
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Module 1 Explanation */}
      <details className="module-explainer">
        <summary>Module 1 — Engineering Basis &amp; CSA Reference</summary>
        <div className="explainer-body">
          <p>
            <strong>Module 1: Geoclimatic Data Vault</strong> retrieves baseline climatological parameters from
            <strong> CAN/CSA-C22.3 No. 60826-10 Table CA.1 (Weather Data)</strong>.
          </p>
          <p>Baseline parameters retrieved for each weather station include:</p>
          <ul>
            <li><strong>Elevation (z)</strong> — Altitude above mean sea level in metres.</li>
            <li><strong>Minimum January Temperature (T_jan)</strong> — 1% exclusion limit for January hourly temperatures. Only 1% of January hours statistically fall below this value. This maps directly to the &quot;Everyday Cold&quot; tension case wire temperature in PLS-CADD.</li>
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
