import React from 'react';
import { BookOpen } from 'lucide-react';

export default function ClauseCitation({ citation, onClick, className = '' }) {
  if (!citation) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded border transition-colors ${className}`}
      style={{
        background: 'rgba(56, 189, 248, 0.1)',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        color: 'var(--accent-cyan, #38bdf8)',
        cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap'
      }}
      title={onClick ? `Click to inspect ${citation} in Code Reference Library` : citation}
    >
      <BookOpen size={12} style={{ flexShrink: 0 }} />
      <span>{citation}</span>
    </button>
  );
}
