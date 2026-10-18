import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Info, Layers } from 'lucide-react';

/**
 * Human-readable column header formatter for camelCase / snake_case keys
 */
export function formatColumnHeader(key) {
  if (!key) return '';
  const HEADER_OVERRIDES = {
    id: 'ID',
    dw: 'D/W Ratio',
    factor: 'Swing Factor',
    commonName: 'Species (Common Name)',
    botanicalName: 'Botanical Name',
    speciesCode: 'Code',
    fibreStress_MPa: 'Fibre Stress (MPa)',
    fibreStress_psi: 'Fibre Stress (psi)',
    fibreStress_cov_percent: 'Fibre Stress COV (%)',
    modulusOfElasticity_MPa: 'MOE (MPa)',
    modulusOfElasticity_ksi: 'MOE (ksi)',
    moe_cov_percent: 'MOE COV (%)',
    dimensionTableMetric: 'Metric Dim. Table',
    dimensionTableImperial: 'Imperial Dim. Table',
    load_N: 'Horizontal Load (N)',
    load_kN: 'Horizontal Load (kN)',
    load_lbf: 'Horizontal Load (lbf)',
    minTopCircumference_cm: 'Min Top Circ. (cm)',
    minTopCircumference_in: 'Min Top Circ. (in)',
    groundlineDistanceFromButt_m: 'Groundline from Butt (m)',
    groundlineDistanceFromButt_ft: 'Groundline from Butt (ft)',
    length_m: 'Pole Length (m)',
    length_ft: 'Pole Length (ft)',
    min_temp: 'Min Temp (°C)',
    wind_50yr: '50-yr Wind (km/h)',
    ice_50yr: '50-yr Ice (mm)',
    wet_snow_50yr: '50-yr Wet Snow (mm)',
    vLgKv: 'V_L-G (kV)',
    clearance_m: 'Clearance (m)',
    clearance_mm: 'Clearance (mm)',
    minClearance_m: 'Min Clearance (m)',
    minClearance_mm: 'Min Clearance (mm)',
    horizontalClearance_m: 'Horizontal Clearance (m)',
    verticalClearance_m: 'Vertical Clearance (m)',
    separation_m: 'Separation (m)',
    separation_mm: 'Separation (mm)',
    minSeparation_m: 'Min Separation (m)',
    minSeparation_mm: 'Min Separation (mm)',
    kFactor: 'K Factor',
    spanMinimums: 'Minimums by Span Length',
    spansUpTo50m: 'Spans ≤ 50 m',
    spansOver50m: 'Spans > 50 m',
    adderPerKvOver22_m: 'Adder > 22 kV (m/kV)',
    ratePerKv: 'Rate per kV',
    z0_m: 'Roughness z₀ (m)',
    kr: 'Terrain Factor Kr'
  };

  if (HEADER_OVERRIDES[key]) return HEADER_OVERRIDES[key];

  return String(key)
    .replace(/_([a-zA-Z0-9]+)/g, ' ($1)')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/\bKv\b/g, 'kV')
    .replace(/\bMm\b/g, 'mm')
    .replace(/\bCm\b/g, 'cm')
    .replace(/\bKn\b/g, 'kN')
    .replace(/\bMpa\b/gi, 'MPa')
    .replace(/\bCov\b/gi, 'COV')
    .replace(/\bAc\b/g, 'AC')
    .replace(/\bDc\b/g, 'DC')
    .replace(/\bMin\b/g, 'Min')
    .replace(/\bMax\b/g, 'Max');
}

/**
 * Formats any cell value (primitive, array, or nested engineering object) into clean text
 * without ever emitting "[object Object]".
 */
export function formatTableCellValue(val) {
  if (val === null || val === undefined || val === '') return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'number' || typeof val === 'string') return String(val);

  if (Array.isArray(val)) {
    if (val.length === 0) return '—';
    return val
      .map((item) => {
        if (item === null || item === undefined) return '';
        if (typeof item !== 'object') return String(item);
        // Table 16 spanMinimums: { spanRange, absoluteMinClearance_mm }
        if (item.spanRange && item.absoluteMinClearance_mm !== undefined) {
          return `${item.spanRange}: ${item.absoluteMinClearance_mm} mm`;
        }
        // Table 17 spansUpTo50m: { spanMinM, spanMaxM, separation_mm }
        if (item.spanMinM !== undefined && item.spanMaxM !== undefined && item.separation_mm !== undefined) {
          return `${item.spanMinM}–${item.spanMaxM} m: ${item.separation_mm} mm`;
        }
        return formatTableCellValue(item);
      })
      .filter(Boolean)
      .join(' | ');
  }

  if (typeof val === 'object') {
    // 1. Matrix cell schema: { m, mm, baseM, formula, na, footnotes, val, value, note }
    if (val.na === true) {
      const fn = Array.isArray(val.footnotes) && val.footnotes.length > 0 ? ` [${val.footnotes.join(', ')}]` : '';
      return `N/A${fn}`;
    }
    if (
      val.m !== undefined ||
      val.mm !== undefined ||
      val.baseM !== undefined ||
      val.formula !== undefined ||
      val.val !== undefined
    ) {
      const main =
        val.formula !== undefined && val.m === undefined
          ? val.formula
          : val.m !== undefined
          ? val.m
          : val.mm !== undefined
          ? `${val.mm} mm`
          : val.baseM !== undefined
          ? val.formula
            ? `${val.baseM} (${val.formula})`
            : val.baseM
          : val.val;
      const fn = Array.isArray(val.footnotes) && val.footnotes.length > 0 ? ` [${val.footnotes.join(', ')}]` : '';
      const extraNote = val.note ? ` (${val.note})` : '';
      return `${main}${fn}${extraNote}`;
    }

    // 2. Explicit display string (60826 tables 10, A2, A8, A10, A11)
    if (val.display !== undefined) {
      return String(val.display);
    }

    // 3. Min/Max range object
    if (val.min !== undefined && val.max !== undefined) {
      const rangeStr = val.min === val.max ? `${val.min}` : `${val.min} – ${val.max}`;
      return val.note ? `${rangeStr} (${val.note})` : rangeStr;
    }

    // 4. Normal / Log-Normal statistical parameters (60826 Table 11, Table A5)
    if (val.normal !== undefined || val.logNormal !== undefined) {
      const parts = [];
      if (val.normal !== undefined) parts.push(`Normal: ${val.normal}`);
      if (val.logNormal !== undefined) parts.push(`Log-Normal: ${val.logNormal}`);
      return parts.join(' | ');
    }

    // 5. Gumbel parameters U_mean / sigma_u (60826 Table B3, B4)
    if (val.U_mean !== undefined || val.sigma_u !== undefined) {
      return `U = ${val.U_mean ?? '—'}, σ = ${val.sigma_u ?? '—'}`;
    }

    // 6. Span / Gust parameters alpha / phiS (60826 Table A4)
    if (val.alpha !== undefined || val.phiS !== undefined) {
      return `α = ${val.alpha ?? '—'}, Φ_S = ${val.phiS ?? '—'}`;
    }

    // 7. Combined ice/wind probabilities (60826 Table CB3)
    if ('wind' in val && ('iceWindC1' in val || 'iceWindC2' in val)) {
      return `Wind: ${val.wind ?? '—'} | C1: ${val.iceWindC1 ?? '—'} | C2: ${val.iceWindC2 ?? '—'}`;
    }

    // 8. Generic key-value fallback
    return Object.entries(val)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => `${formatColumnHeader(k)}: ${formatTableCellValue(v)}`)
      .join(' | ');
  }

  return String(val);
}

/**
 * Renders a matrix table given columns and rows (used for C22.3 No. 1 Tables 2-6, 8-10, 13, 14, 18, 21-23)
 */
function MatrixSubTable({ columns, rows, compact = false, sectionTitle = null }) {
  const hasCrossingClass = rows.some((r) => r.crossingClass !== undefined);
  const hasVoltageRange = rows.some((r) => r.voltageRange !== undefined && r.label !== r.voltageRange);
  const hasRuleOrAdder = rows.some((r) => r.adderFormula || r.adderPerKvOver22_m !== undefined);

  const cellPad = compact ? '0.45rem 0.6rem' : '0.6rem 0.8rem';
  const fontSize = compact ? '0.74rem' : '0.8rem';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {sectionTitle && (
        <div style={{ fontSize: compact ? '0.8rem' : '0.88rem', fontWeight: '700', color: 'var(--accent-cyan)', padding: '0.25rem 0' }}>
          {sectionTitle}
        </div>
      )}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card, 16px)', background: 'var(--bg-card)' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize }}>
          <thead>
            <tr style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-color)' }}>
              {hasCrossingClass && (
                <th style={{ padding: cellPad, textAlign: 'center', color: 'var(--accent-blue)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  Class
                </th>
              )}
              {hasVoltageRange && (
                <th style={{ padding: cellPad, textAlign: 'left', color: 'var(--accent-blue)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  Voltage Range
                </th>
              )}
              <th style={{ padding: cellPad, textAlign: 'left', color: 'var(--accent-blue)', fontWeight: '600', borderBottom: '1px solid var(--border-color)', minWidth: '180px' }}>
                Classification / Conductor or Location
              </th>
              {columns.map((col, idx) => {
                const colLabel = typeof col === 'object' ? (col.label || col.name || col.title || col.id) : String(col);
                const colSub = typeof col === 'object' ? (col.voltageClass || col.description || col.adderFormula || (col.ratePerKvOver150 ? `+${col.ratePerKvOver150} m/kV >150kV` : null)) : null;
                const colFn = typeof col === 'object' && Array.isArray(col.footnotes) && col.footnotes.length > 0 ? ` [${col.footnotes.join(', ')}]` : '';

                return (
                  <th key={idx} style={{ padding: cellPad, textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                    <div>{colLabel}{colFn}</div>
                    {colSub && colSub !== colLabel && (
                      <div style={{ fontSize: '0.68rem', fontWeight: '400', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                        {colSub}
                      </div>
                    )}
                  </th>
                );
              })}
              {hasRuleOrAdder && (
                <th style={{ padding: cellPad, textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  Voltage Adder / Formula
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => {
              const rowLabel =
                row.label ||
                row.location ||
                row.title ||
                row.item ||
                row.lowerType ||
                row.typeOfPlant ||
                row.lowerVoltageClass ||
                row.equipmentType ||
                row.between ||
                row.surfaceType ||
                row.type ||
                (row.lowerVlgKv !== undefined ? `${row.lowerVlgKv} kV` : `Row ${rIdx + 1}`);

              const rowFn = Array.isArray(row.footnotes) && row.footnotes.length > 0 ? ` [${row.footnotes.join(', ')}]` : '';
              const isKeyRow = Boolean(row.isHeader || row.isSection || row.bold);

              const cellContainer =
                row.cells ||
                row.separations ||
                row.clearances ||
                row.clearances_m ||
                row.clearances_mm ||
                row.separations_m ||
                row;

              const cellValues = columns.map((col, cIdx) => {
                if (Array.isArray(cellContainer)) {
                  return cellContainer[cIdx];
                }
                const colKey = typeof col === 'object' ? (col.id ?? col.key ?? col.label) : col;
                if (cellContainer[colKey] !== undefined) return cellContainer[colKey];
                if (cellContainer[`${colKey}_m`] !== undefined) return cellContainer[`${colKey}_m`];
                if (cellContainer[`${colKey}_mm`] !== undefined) return cellContainer[`${colKey}_mm`];
                if (row[colKey] !== undefined) return row[colKey];
                return undefined;
              });

              return (
                <tr
                  key={rIdx}
                  style={{
                    background: isKeyRow ? 'rgba(10, 132, 255, 0.08)' : rIdx % 2 === 0 ? 'transparent' : 'var(--bg-zebra)',
                    transition: 'background 0.12s ease'
                  }}
                >
                  {hasCrossingClass && (
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--accent-blue)', borderBottom: '1px solid var(--border-subtle)', fontVariantNumeric: 'tabular-nums' }}>
                      {row.crossingClass || '—'}
                    </td>
                  )}
                  {hasVoltageRange && (
                    <td style={{ padding: cellPad, color: 'var(--text-muted)', fontWeight: '500', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                      {row.voltageRange || '—'}
                    </td>
                  )}
                  <td style={{ padding: cellPad, color: isKeyRow ? 'var(--accent-blue)' : 'var(--text-main)', fontWeight: isKeyRow ? '600' : '400', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      {rowLabel}
                      {rowFn && <span style={{ color: 'var(--accent-blue)', fontSize: '0.72rem', fontWeight: '600' }}>{rowFn}</span>}
                    </div>
                    {row.description && row.description !== rowLabel && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{row.description}</div>
                    )}
                    {row.rule && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{row.rule}</div>
                    )}
                    {row.notes && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{row.notes}</div>
                    )}
                  </td>
                  {cellValues.map((rawCell, cIdx) => {
                    const formatted = formatTableCellValue(rawCell);
                    const isMuted = formatted === '—' || formatted.startsWith('N/A');
                    return (
                      <td
                        key={cIdx}
                        style={{
                          padding: cellPad,
                          textAlign: 'center',
                          color: isMuted ? 'var(--text-dim)' : 'var(--text-main)',
                          fontWeight: isMuted ? '400' : '500',
                          borderBottom: '1px solid var(--border-subtle)',
                          fontVariantNumeric: 'tabular-nums lining-nums'
                        }}
                      >
                        {formatted}
                      </td>
                    );
                  })}
                  {hasRuleOrAdder && (
                    <td style={{ padding: cellPad, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.74rem', borderBottom: '1px solid var(--border-subtle)', fontVariantNumeric: 'tabular-nums' }}>
                      {row.adderFormula || (row.adderPerKvOver22_m !== undefined ? `+${row.adderPerKvOver22_m} m/kV` : '—')}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Renders an array of object rows with automatic column discovery, smart search, and optional pagination
 */
function ObjectArrayTable({ rows, compact = false, sectionTitle = null }) {
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const pageSize = 50;

  // Discover all columns across rows
  const columns = useMemo(() => {
    if (!Array.isArray(rows) || rows.length === 0) return [];
    const keySet = new Set();
    rows.forEach((r) => {
      if (r && typeof r === 'object') {
        Object.keys(r).forEach((k) => keySet.add(k));
      }
    });
    const allKeys = Array.from(keySet);

    // Determine if human-readable label columns exist so we can hide redundant internal numeric bounds
    const hasHumanVoltage = allKeys.some((k) => ['voltageClass', 'voltageRange', 'label', 'condition'].includes(k));
    const hasHumanSpan = allKeys.some((k) => ['spanCondition', 'sagCondition', 'temperatureCondition'].includes(k));
    const hasHumanEquip = allKeys.includes('equipmentType');

    const redundantKeys = new Set();
    if (hasHumanVoltage) {
      ['vMinKv', 'vMaxKv', 'vSumMinKv', 'vSumMaxKv'].forEach((k) => redundantKeys.add(k));
    }
    if (hasHumanSpan) {
      ['minSpanM', 'maxSpanM', 'spanMinM', 'spanMaxM', 'sagMinMm', 'sagMaxMm', 'tempC'].forEach((k) => redundantKeys.add(k));
    }
    if (hasHumanEquip) {
      redundantKeys.add('equipmentKey');
    }
    // Hide internal slug `id` if there are human-readable descriptive columns and id looks like a snake_case slug
    if (allKeys.includes('id') && allKeys.length > 2) {
      const firstId = String(rows[0]?.id || '');
      if (firstId.includes('_') || ['row', 'cat', 'item'].some((p) => firstId.startsWith(p))) {
        redundantKeys.add('id');
      }
    }

    return allKeys.filter((k) => !redundantKeys.has(k));
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (!filterText.trim()) return rows;
    const q = filterText.trim().toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => formatTableCellValue(row[col]).toLowerCase().includes(q))
    );
  }, [rows, columns, filterText]);

  const isLargeTable = rows.length > 25;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const displayedRows = isLargeTable && !showAll
    ? filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredRows;

  const cellPad = compact ? '0.45rem 0.6rem' : '0.6rem 0.8rem';
  const fontSize = compact ? '0.74rem' : '0.8rem';

  if (!Array.isArray(rows) || rows.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {sectionTitle && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: compact ? '0.8rem' : '0.9rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
          <Layers size={14} />
          <span>{sectionTitle}</span>
        </div>
      )}

      {/* Search & Pagination Toolbar for Large Tables (e.g., 682 Weather Stations in Table CA.1) */}
      {isLargeTable && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem',
          padding: '0.55rem 0.75rem',
          background: 'var(--bg-inset)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-input, 10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => { setFilterText(e.target.value); setPage(1); }}
              placeholder={`Filter ${rows.length} rows (e.g., province, station, class)...`}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.78rem',
                width: '100%',
                outline: 'none',
                padding: 0
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>
              Showing <strong>{displayedRows.length}</strong> of <strong>{filteredRows.length}</strong> rows
            </span>

            {!showAll && totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="btn-secondary"
                  style={{ padding: '0.2rem 0.45rem', fontSize: '0.72rem' }}
                >
                  <ChevronLeft size={13} />
                </button>
                <span style={{ padding: '0 0.3rem' }}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="btn-secondary"
                  style={{ padding: '0.2rem 0.45rem', fontSize: '0.72rem' }}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowAll((s) => !s)}
              className="btn-secondary"
              style={{ padding: '0.22rem 0.55rem', fontSize: '0.72rem', color: 'var(--accent-blue)' }}
            >
              {showAll ? 'Paginate (50/page)' : `Show All (${filteredRows.length})`}
            </button>
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card, 16px)', background: 'var(--bg-card)' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize }}>
          <thead>
            <tr style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-color)' }}>
              {columns.map((col, idx) => (
                <th
                  key={col}
                  style={{
                    padding: cellPad,
                    textAlign: idx === 0 ? 'left' : 'center',
                    color: idx === 0 ? 'var(--accent-blue)' : 'var(--text-muted)',
                    fontWeight: '600',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  {formatColumnHeader(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                style={{
                  background: rIdx % 2 === 0 ? 'transparent' : 'var(--bg-zebra)',
                  transition: 'background 0.12s ease'
                }}
              >
                {columns.map((col, cIdx) => {
                  const formatted = formatTableCellValue(row[col]);
                  const isFirst = cIdx === 0;
                  const isMuted = formatted === '—' || formatted.startsWith('N/A');
                  return (
                    <td
                      key={col}
                      style={{
                        padding: cellPad,
                        textAlign: isFirst ? 'left' : 'center',
                        color: isFirst ? 'var(--text-main)' : isMuted ? 'var(--text-dim)' : 'var(--text-main)',
                        fontWeight: isFirst ? '500' : '400',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontVariantNumeric: 'tabular-nums lining-nums'
                      }}
                    >
                      {formatted}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Universal renderer for all 83 digitized CSA tables across C22.3 No. 1, C22.3 No. 60826, and CSA O15.
 */
export default function UniversalTableRenderer({ table, compact = false }) {
  if (!table) return null;

  const details = table.details || {};
  const rows = details.rows;
  const columns = details.columns;
  const meta = details.meta || {};

  const cellPad = compact ? '0.45rem 0.6rem' : '0.6rem 0.8rem';
  const fontSize = compact ? '0.74rem' : '0.8rem';

  // Consolidate notes and footnotes without duplication
  const rawNotes = table.notes || meta.notes;
  const rawFootnotes = table.footnotes || meta.footnotes || details.footnotes;
  const showSeparateFootnotes =
    rawFootnotes &&
    typeof rawFootnotes === 'object' &&
    rawFootnotes !== rawNotes &&
    JSON.stringify(rawFootnotes) !== JSON.stringify(rawNotes);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '0.85rem' : '1.15rem' }}>
      {/* Engineering Evaluation Conditions / Datum Banner */}
      {(meta.evaluatedAt || meta.datum || meta.voltageAdders) && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          padding: '0.65rem 0.9rem',
          borderRadius: '8px',
          background: 'rgba(56, 189, 248, 0.07)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          fontSize: compact ? '0.73rem' : '0.79rem',
          color: 'var(--text-secondary)'
        }}>
          {meta.evaluatedAt && (
            <div>
              <strong style={{ color: 'var(--accent-cyan)' }}>Evaluated Condition: </strong>
              {meta.evaluatedAt}
            </div>
          )}
          {meta.datum && (
            <div>
              <strong style={{ color: 'var(--accent-cyan)' }}>Reference Datum: </strong>
              {meta.datum}
            </div>
          )}
          {meta.voltageAdders && (
            <div>
              <strong style={{ color: 'var(--accent-cyan)' }}>Voltage Adders: </strong>
              {formatTableCellValue(meta.voltageAdders)}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* CASE 1: CSA C22.3 No. 1 Table 31 (Overload & Strength Factors)      */}
      {/* =================================================================== */}
      {table.key === 'table31' && Array.isArray(rows) ? (
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card, 16px)', background: 'var(--bg-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize }}>
            <thead>
              <tr style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-color)' }}>
                <th rowSpan={2} style={{ padding: cellPad, textAlign: 'left', color: 'var(--accent-blue)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  Load Type / Condition
                </th>
                <th rowSpan={2} style={{ padding: cellPad, textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  Category
                </th>
                <th colSpan={3} style={{ padding: cellPad, textAlign: 'center', color: 'var(--status-pass)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  Grade 1 Construction
                </th>
                <th colSpan={3} style={{ padding: cellPad, textAlign: 'center', color: 'var(--accent-cyan)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  Grade 2 Construction
                </th>
                <th colSpan={3} style={{ padding: cellPad, textAlign: 'center', color: 'var(--status-marginal)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  Grade 3 Construction
                </th>
                <th rowSpan={2} style={{ padding: cellPad, textAlign: 'left', color: 'var(--text-dim)', fontWeight: '500', borderBottom: '1px solid var(--border-color)' }}>
                  Notes
                </th>
              </tr>
              <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', fontSize: '0.72rem' }}>
                <th style={{ padding: '0.35rem 0.5rem', textAlign: 'center', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)' }}>COV ≤ 10%</th>
                <th style={{ padding: '0.35rem 0.5rem', textAlign: 'center', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)' }}>10–15%</th>
                <th style={{ padding: '0.35rem 0.5rem', textAlign: 'center', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)' }}>COV ≥ 15%</th>
                <th style={{ padding: '0.35rem 0.5rem', textAlign: 'center', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)' }}>COV ≤ 10%</th>
                <th style={{ padding: '0.35rem 0.5rem', textAlign: 'center', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)' }}>10–15%</th>
                <th style={{ padding: '0.35rem 0.5rem', textAlign: 'center', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)' }}>COV ≥ 15%</th>
                <th style={{ padding: '0.35rem 0.5rem', textAlign: 'center', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)' }}>COV ≤ 10%</th>
                <th style={{ padding: '0.35rem 0.5rem', textAlign: 'center', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)' }}>10–15%</th>
                <th style={{ padding: '0.35rem 0.5rem', textAlign: 'center', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)' }}>COV ≥ 15%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const g1 = row.grades?.find((g) => g.grade === 1) || {};
                const g2 = row.grades?.find((g) => g.grade === 2) || {};
                const g3 = row.grades?.find((g) => g.grade === 3) || {};
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-zebra)' }}>
                    <td style={{ padding: cellPad, fontWeight: '500', color: 'var(--text-main)' }}>
                      <div>{row.loadType || row.description}</div>
                      {row.description && row.loadType && row.description !== row.loadType && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '400' }}>{row.description}</div>
                      )}
                    </td>
                    <td style={{ padding: cellPad, textAlign: 'center', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {row.category || '—'}
                    </td>
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--status-pass)', fontVariantNumeric: 'tabular-nums' }}>{g1.cov_le_10 ?? row.grade1 ?? '—'}</td>
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--status-pass)', fontVariantNumeric: 'tabular-nums' }}>{g1.cov_10_to_15 ?? row.grade1 ?? '—'}</td>
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--status-pass)', fontVariantNumeric: 'tabular-nums' }}>{g1.cov_ge_15 ?? row.grade1 ?? '—'}</td>
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--accent-blue)', fontVariantNumeric: 'tabular-nums' }}>{g2.cov_le_10 ?? row.grade2 ?? '—'}</td>
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--accent-blue)', fontVariantNumeric: 'tabular-nums' }}>{g2.cov_10_to_15 ?? row.grade2 ?? '—'}</td>
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--accent-blue)', fontVariantNumeric: 'tabular-nums' }}>{g2.cov_ge_15 ?? row.grade2 ?? '—'}</td>
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--status-marginal)', fontVariantNumeric: 'tabular-nums' }}>{g3.cov_le_10 ?? row.grade3 ?? '—'}</td>
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--status-marginal)', fontVariantNumeric: 'tabular-nums' }}>{g3.cov_10_to_15 ?? row.grade3 ?? '—'}</td>
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--status-marginal)', fontVariantNumeric: 'tabular-nums' }}>{g3.cov_ge_15 ?? row.grade3 ?? '—'}</td>
                    <td style={{ padding: cellPad, fontSize: '0.73rem', color: 'var(--text-dim)' }}>{row.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : /* =================================================================== */
      /* CASE 2: CSA C22.3 No. 1 Table 1 (Conductor Swing Curve Factors)     */
      /* =================================================================== */
      table.key === 'table1' && rows && rows.non_sheltered ? (
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card, 16px)', background: 'var(--bg-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize }}>
            <thead>
              <tr style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: cellPad, textAlign: 'center', color: 'var(--accent-blue)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  D/W Ratio (mm / N/m)
                </th>
                <th style={{ padding: cellPad, textAlign: 'center', color: 'var(--text-main)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  Swing Factor — Non-Sheltered Line
                </th>
                <th style={{ padding: cellPad, textAlign: 'center', color: 'var(--text-main)', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  Swing Factor — Partially Sheltered Line
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.non_sheltered.map((nsRow, idx) => {
                const psRow = rows.partially_sheltered?.find((r) => r.dw === nsRow.dw) || rows.partially_sheltered?.[idx];
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-zebra)' }}>
                    <td style={{ padding: cellPad, textAlign: 'center', fontWeight: '600', color: 'var(--accent-blue)', fontVariantNumeric: 'tabular-nums' }}>
                      {nsRow.dw}
                    </td>
                    <td style={{ padding: cellPad, textAlign: 'center', color: 'var(--text-main)', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>
                      {nsRow.factor}
                    </td>
                    <td style={{ padding: cellPad, textAlign: 'center', color: 'var(--text-main)', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>
                      {psRow ? psRow.factor : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : /* =================================================================== */
      /* CASE 3: Matrix Tables with `columns` and `rows` (Tables 2-6, 8-10, 13, 14, 18, 21-23) */
      /* =================================================================== */
      columns && Array.isArray(rows) ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <MatrixSubTable
            columns={columns}
            rows={rows}
            compact={compact}
            sectionTitle={details.dcColumns && details.dcRows ? 'Part A — AC Upper Conductors Crossing Over Lower Conductors' : null}
          />
          {details.dcColumns && Array.isArray(details.dcRows) && (
            <MatrixSubTable
              columns={details.dcColumns}
              rows={details.dcRows}
              compact={compact}
              sectionTitle="Part B — DC Upper Conductors Crossing Over Lower Conductors"
            />
          )}
        </div>
      ) : /* =================================================================== */
      /* CASE 4: Multi-Section Object Tables (e.g., O15 Table 1 & 2 metric/imperial, 60826 Table C.2) */
      /* =================================================================== */
      rows && typeof rows === 'object' && !Array.isArray(rows) ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {Object.entries(rows)
            .filter(([, val]) => Array.isArray(val) && val.length > 0)
            .map(([sectionKey, sectionRows]) => (
              <ObjectArrayTable
                key={sectionKey}
                rows={sectionRows}
                compact={compact}
                sectionTitle={formatColumnHeader(sectionKey)}
              />
            ))}
        </div>
      ) : /* =================================================================== */
      /* CASE 5: Standard Array of Object Rows (All 46 60826 tables, O15 Table 3/B1/C1, remaining No. 1 tables) */
      /* =================================================================== */
      Array.isArray(rows) ? (
        <ObjectArrayTable rows={rows} compact={compact} />
      ) : null}

      {/* Footnotes Block (if separate from general notes) */}
      {showSeparateFootnotes && (
        <div style={{ background: 'rgba(6, 182, 212, 0.04)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            Table Footnotes:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: compact ? '0.74rem' : '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {Object.entries(rawFootnotes).map(([k, val]) => (
              <li key={k} style={{ marginBottom: '0.2rem' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>[{k}]</strong> {formatTableCellValue(val)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* General Notes Block */}
      {rawNotes && (
        <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            <Info size={13} />
            <span>Notes to {table.number}:</span>
          </div>
          {Array.isArray(rawNotes) ? (
            <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: compact ? '0.74rem' : '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {rawNotes.map((note, idx) => (
                <li key={idx} style={{ marginBottom: '0.2rem' }}>{formatTableCellValue(note)}</li>
              ))}
            </ul>
          ) : typeof rawNotes === 'object' ? (
            <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: compact ? '0.74rem' : '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {Object.entries(rawNotes).map(([k, val]) => (
                <li key={k} style={{ marginBottom: '0.2rem' }}>
                  <strong>({k})</strong> {formatTableCellValue(val)}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, fontSize: compact ? '0.74rem' : '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {String(rawNotes)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
