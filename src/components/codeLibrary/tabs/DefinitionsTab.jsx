import React from 'react';
import HighlightMatches from '../HighlightMatches';

export default function DefinitionsTab({
  definitions = [],
  highlightRegex = null
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
      {definitions.map((def) => (
        <div 
          key={def.id} 
          className="glass-panel" 
          style={{ 
            padding: '1.25rem', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>
                <HighlightMatches text={def.term} regex={highlightRegex} />
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                {def.type === 'abbreviation' ? 'Abbreviation' : 'Definition'}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.85rem' }}>
              <HighlightMatches text={def.definition} regex={highlightRegex} />
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{def.standardName}</span>
            <span>Clause {def.clauseNumber}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
