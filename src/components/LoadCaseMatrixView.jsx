import React, { useState } from 'react';
import { Layers, Download, Printer, Filter, CheckCircle2 } from 'lucide-react';
import { generateUnifiedLoadCaseMatrix, exportLoadCasesToCsv } from '../utils/loadCaseMatrixEngine.js';

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

  const filteredCases = filterType === 'ALL'
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
    <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Layers size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 600 }}>
              CSA Unified Load Case Matrix (MVP A4)
            </h3>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Deterministic (No. 1) & Reliability-Based (No. 60826) load case envelope with traceable citations.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="STRENGTH">Structural Strength Only</option>
              <option value="CLEARANCE">Clearance Only</option>
              <option value="TENSION">Tension / Uplift Only</option>
            </select>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <Download size={15} /> Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <Printer size={15} /> Print Summary
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <table className="table-borderless" style={{ width: '100%', fontSize: '0.825rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>Case ID</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>Code Citation</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>Load Case Name</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>Design Type</th>
              <th style={{ textAlign: 'right', padding: '10px 12px' }}>Radial Ice</th>
              <th style={{ textAlign: 'right', padding: '10px 12px' }}>Wind Press.</th>
              <th style={{ textAlign: 'right', padding: '10px 12px' }}>Temp</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>Factors / OCF</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>Governing Application</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--accent-cyan)', fontVariantNumeric: 'tabular-nums' }}>{c.id}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{c.code}</td>
                <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--text-main)' }}>{c.name}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    background: c.type.includes('Strength') ? 'rgba(244, 63, 94, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                    color: c.type.includes('Strength') ? 'var(--status-violation)' : 'var(--accent-cyan)'
                  }}>
                    {c.type}
                  </span>
                </td>
                <td style={{ textAlign: 'right', padding: '10px 12px', fontVariantNumeric: 'tabular-nums' }}>{c.iceMm} mm</td>
                <td style={{ textAlign: 'right', padding: '10px 12px', fontVariantNumeric: 'tabular-nums' }}>{c.windPa} Pa</td>
                <td style={{ textAlign: 'right', padding: '10px 12px', fontVariantNumeric: 'tabular-nums' }}>{c.tempC} °C</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{c.ocf}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-main)' }}>{c.governingUse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
