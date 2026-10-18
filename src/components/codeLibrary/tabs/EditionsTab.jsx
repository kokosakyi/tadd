import React from 'react';

export default function EditionsTab({ standards = [] }) {
  const activeStandards = standards.filter(s => s.id !== 'all');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
      {activeStandards.map((ed) => (
        <div key={ed.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.15rem' }}>
              {ed.code}
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
              {ed.status}
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.5rem' }}>
            {ed.title} (Edition: {ed.edition})
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
            {ed.id === 'c22_3_no1' && 'Covers overhead electric supply and communication facilities, vertical and horizontal clearances, crossing profiles, deterministic weather loadings (Heavy/Medium/Light), and structural strength capacity factors.'}
            {ed.id === 'c22_3_60826' && 'Establishes reliability-based limit states design for transmission lines (50–500 yr return periods), dynamic wind pressure, radial ice accretion, combined wind & ice, security, and Canadian National Annexes CA & CB.'}
            {ed.id === 'csa_o15' && 'Covers commercial wood pole species in Canada and North America (Western Red Cedar, Douglas Fir, Lodgepole Pine, Jack Pine, etc.), fiber stress, knot limitations, pole classes H6 to 8, and reinforcing stubs.'}
            {ed.id === 'pls_cadd_lessons' && 'Technical field guide and senior/junior engineering dialogue covering P&P drafting, AutoSag, Non-Linear FEA, guy mechanics, and CSA compliance.'}
          </p>
          
          <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
            <div style={{ flex: '1', textAlign: 'center', background: 'var(--bg-inset)', padding: '0.5rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{ed.clauseCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Digitized Clauses</div>
            </div>
            <div style={{ flex: '1', textAlign: 'center', background: 'var(--bg-inset)', padding: '0.5rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>{ed.tableCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Digitized Tables</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
