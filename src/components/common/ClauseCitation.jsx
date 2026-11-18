import React from 'react';
import { BookOpen } from 'lucide-react';

export default function ClauseCitation({ citation, onClick, className = '' }) {
  if (!citation) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`badge badge-info mono ${className}`}
      style={{
        padding: '0.28rem 0.68rem',
        fontSize: '0.73rem',
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
