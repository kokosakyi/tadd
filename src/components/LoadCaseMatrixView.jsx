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
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.825rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Case ID</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Code Citation</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Load Case Name</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Design Type</th>
              <th style={{ textAlign: 'right', padding: '8px' }}>Radial Ice</th>
              <th style={{ textAlign: 'right', padding: '8px' }}>Wind Press.</th>
              <th style={{ textAlign: 'right', padding: '8px' }}>Temp</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Factors / OCF</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Governing Application</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px', fontWeight: '600', color: '#38bdf8' }}>{c.id}</td>
                <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{c.code}</td>
                <td style={{ padding: '8px', fontWeight: '500', color: 'var(--text-main)' }}>{c.name}</td>
                <td style={{ padding: '8px' }}>
                  <span className="badge" style={{
                    fontSize: '0.7rem',
                    background: c.type.includes('Strength') ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: c.type.includes('Strength') ? '#f43f5e' : '#38bdf8'
                  }}>
                    {c.type}
                  </span>
                </td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{c.iceMm} mm</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{c.windPa} Pa</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{c.tempC} °C</td>
                <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{c.ocf}</td>
                <td style={{ padding: '8px', color: 'var(--text-main)' }}>{c.governingUse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
