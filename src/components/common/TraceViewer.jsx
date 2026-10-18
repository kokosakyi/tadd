import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Copy, Check, FileCode, Layers } from 'lucide-react';
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
        return <span className="badge badge-info text-xs">LOOKUP</span>;
      case 'adder':
        return <span className="badge badge-warning text-xs">ADDER</span>;
      case 'multiplier':
        return <span className="badge text-xs" style={{ background: '#8b5cf6', color: '#fff' }}>FACTOR</span>;
      case 'overlay':
        return <span className="badge text-xs" style={{ background: '#ec4899', color: '#fff' }}>OVERLAY</span>;
      case 'formula':
        return <span className="badge text-xs" style={{ background: '#10b981', color: '#fff' }}>FORMULA</span>;
      default:
        return <span className="badge text-xs" style={{ background: '#64748b', color: '#fff' }}>CALC</span>;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        marginTop: '1.5rem',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}
    >
      {/* Trace Card Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          background: 'var(--bg-inset)',
          cursor: 'pointer',
          borderBottom: isOpen ? '1px solid var(--border-color)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ShieldCheck size={18} color="var(--accent-cyan)" />
          <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main)' }}>
            Engineering Audit Trace
          </span>
          <span className="badge badge-info" style={{ fontSize: '0.7rem', borderRadius: '6px', padding: '0.15rem 0.45rem' }}>
            {trace.snapshotVersion}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {trace.calcId}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="btn-secondary"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px' }}
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
        <div style={{ padding: '1.25rem' }}>
          {/* Step-by-Step Mathematical Trace */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: '0.65rem' }}>
              Execution Sequence & Derivation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {trace.steps?.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '10px',
                    background: 'var(--bg-inset)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.825rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums' }}>
                      #{idx + 1}
                    </span>
                    {getOpBadge(step.op)}
                    <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>
                      {step.description}
                    </span>
                    {step.ref && (
                      <span style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>
                        [{step.ref}]
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                    {typeof step.value === 'object' ? JSON.stringify(step.value) : step.value} {step.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governing Citations */}
          {trace.citations?.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
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
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem' }}>
              {trace.notes.map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
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
