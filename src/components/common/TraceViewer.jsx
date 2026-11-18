import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import ClauseCitation from './ClauseCitation';

export default function TraceViewer({ trace, onOpenCitation }) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!trace) return null;

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Failed to copy trace:', e);
    }
  };

  const getOpBadge = (op) => {
    switch (op) {
      case 'lookup':
        return <span className="badge badge-info">LOOKUP</span>;
      case 'adder':
        return <span className="badge badge-warning">ADDER</span>;
      case 'multiplier':
        return (
          <span
            className="badge"
            style={{
              background: 'rgba(168, 85, 247, 0.16)',
              color: 'var(--accent-purple)',
              border: '1px solid rgba(168, 85, 247, 0.35)'
            }}
          >
            FACTOR
          </span>
        );
      case 'overlay':
        return (
          <span
            className="badge"
            style={{
              background: 'rgba(244, 114, 182, 0.16)',
              color: 'var(--accent-rose)',
              border: '1px solid rgba(244, 114, 182, 0.35)'
            }}
          >
            OVERLAY
          </span>
        );
      case 'formula':
        return <span className="badge badge-pass">FORMULA</span>;
      default:
        return <span className="badge badge-neutral">CALC</span>;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        marginTop: '0.5rem',
        overflow: 'hidden'
      }}
    >
      {/* Trace Card Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem',
          padding: '0.95rem 1.35rem',
          background: 'var(--bg-inset)',
          cursor: 'pointer',
          borderBottom: isOpen ? '1px solid var(--border-subtle)' : 'none',
          outline: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <ShieldCheck size={18} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 650, fontSize: '0.95rem', color: 'var(--text-main)' }}>
            Engineering Audit Trace
          </span>
          <span className="badge badge-info">{trace.snapshotVersion}</span>
          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {trace.calcId}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="btn-secondary"
            style={{ padding: '0.3rem 0.72rem', fontSize: '0.75rem' }}
            title="Copy audit trace JSON"
          >
            {copied ? <Check size={14} color="var(--status-pass)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'JSON'}</span>
          </button>
          {isOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Trace Content */}
      {isOpen && (
        <div style={{ padding: '1.35rem' }}>
          {/* Step-by-Step Mathematical Trace */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 650,
                marginBottom: '0.65rem'
              }}
            >
              Execution Sequence &amp; Derivation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {trace.steps?.map((step, idx) => (
                <div
                  key={idx}
                  className="glass-inset"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: '14px',
                    fontSize: '0.83rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                      #{idx + 1}
                    </span>
                    {getOpBadge(step.op)}
                    <span style={{ fontWeight: 540, color: 'var(--text-main)' }}>
                      {step.description}
                    </span>
                    {step.ref && (
                      <span className="mono" style={{ color: 'var(--accent-cyan)', fontSize: '0.74rem' }}>
                        [{step.ref}]
                      </span>
                    )}
                  </div>
                  <div className="mono" style={{ fontWeight: 650, color: 'var(--text-main)' }}>
                    {typeof step.value === 'object' ? JSON.stringify(step.value) : step.value} {step.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governing Citations */}
          {trace.citations?.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 650,
                  marginBottom: '0.5rem'
                }}
              >
                Governing Code Citations
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {trace.citations.map((c, i) => (
                  <ClauseCitation
                    key={i}
                    citation={c}
                    onClick={onOpenCitation ? () => onOpenCitation(c) : undefined}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notes & Caveats */}
          {trace.notes?.length > 0 && (
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              {trace.notes.map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span>ℹ️</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
