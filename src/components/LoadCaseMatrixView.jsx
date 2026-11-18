import React, { useState } from 'react';
import { Layers, Download, Printer, Filter } from 'lucide-react';
import { generateUnifiedLoadCaseMatrix, exportLoadCasesToCsv } from '../utils/loadCaseMatrixEngine.js';

const FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'CLEARANCE', label: 'Clearance Only' },
  { value: 'STRENGTH', label: 'Structural Strength Only' },
  { value: 'TENSION', label: 'Tension / Uplift Only' }
].sort((a, b) => a.label.localeCompare(b.label));

export default function LoadCaseMatrixView({
  district = 'Heavy',
  deterministicWindPa = 400,
  deterministicIceMm = 12.5,
  minJanTempC = -20,
  maxConductorTempC = 100,
  r_T_wind_kmh = 105,
  r_T_ice_mm = 32,
  returnPeriod = 150,
  grade = 2
}) {
  const [filterType, setFilterType] = useState('ALL');

  const loadCases = generateUnifiedLoadCaseMatrix({
    district,
    deterministicWindPa,
    deterministicIceMm,
    minJanTempC,
    maxConductorTempC,
    r_T_wind_kmh,
    r_T_ice_mm,
    returnPeriod,
    grade
  });

  const filteredCases =
    filterType === 'ALL'
      ? loadCases
      : loadCases.filter((c) => c.type.toUpperCase().includes(filterType));

  const handleDownloadCsv = () => {
    const csvContent = exportLoadCasesToCsv(loadCases);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CSA_Load_Cases_${district}_${returnPeriod}yr.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-panel" style={{ padding: '1.45rem 1.65rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '13px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.92), rgba(99, 102, 241, 0.88))',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            <Layers size={19} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.08rem', color: 'var(--text-main)', fontWeight: 660 }}>
              CSA Unified Load Case Matrix (MVP A4)
            </h3>
            <p style={{ margin: '0.18rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Deterministic (No. 1) &amp; Reliability-Based (No. 60826) load case envelope with traceable citations.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              style={{ width: 'auto', padding: '0.45rem 2.1rem 0.45rem 0.75rem', fontSize: '0.8rem', borderRadius: '9999px' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button type="button" onClick={handleDownloadCsv} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}>
            <Download size={15} /> Export CSV
          </button>

          <button type="button" onClick={handlePrint} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}>
            <Printer size={15} /> Print Summary
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-inset" style={{ overflowX: 'auto' }}>
        <table className="table-borderless" style={{ width: '100%', fontSize: '0.83rem' }}>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Code Citation</th>
              <th>Load Case Name</th>
              <th>Design Type</th>
              <th style={{ textAlign: 'right' }}>Radial Ice</th>
              <th style={{ textAlign: 'right' }}>Wind Press.</th>
              <th style={{ textAlign: 'right' }}>Temp</th>
              <th>Factors / OCF</th>
              <th>Governing Application</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c) => (
              <tr key={c.id}>
                <td className="mono" style={{ fontWeight: 650, color: 'var(--accent-cyan)' }}>
                  {c.id}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{c.code}</td>
                <td style={{ fontWeight: 550, color: 'var(--text-main)' }}>{c.name}</td>
                <td>
                  <span className={`badge ${c.type.includes('Strength') ? 'badge-fail' : 'badge-info'}`}>
                    {c.type}
                  </span>
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {c.iceMm} mm
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {c.windPa} Pa
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {c.tempC} °C
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{c.ocf}</td>
                <td style={{ color: 'var(--text-main)' }}>{c.governingUse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
