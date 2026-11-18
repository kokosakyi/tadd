import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  Table,
  FileText,
  ExternalLink,
  Copy,
  Check,
  CornerDownRight,
  ArrowLeft
} from 'lucide-react';
import { resolveCitationReference } from '../../core/code/citationResolver';
import { getTableDetails } from '../../core/code/tableContentResolver';
import { getClause, ALL_TABLES } from '../../core/code/codeLibraryRegistry';
import UniversalTableRenderer from '../codeLibrary/UniversalTableRenderer';
import HighlightMatches from '../codeLibrary/HighlightMatches';

/**
 * Slide-over Citation Quick-Inspector Drawer
 * Opens directly over the active calculator so engineers can verify cited CSA/ASCE
 * clauses and tables (with full KaTeX equations and UniversalTableRenderer tables)
 * without losing calculator state or scroll position.
 */
export default function CitationInspectorDrawer({
  citation,
  onClose,
  onOpenInLibrary
}) {
  const [historyStack, setHistoryStack] = useState([]);
  const [copied, setCopied] = useState(false);

  // Reset internal drawer navigation stack whenever a new external citation is opened
  useEffect(() => {
    if (!citation) {
      setHistoryStack([]);
      return;
    }
    const resolved = resolveCitationReference(citation);
    setHistoryStack(resolved ? [resolved] : []);
  }, [citation]);

  // Escape key dismissal
  useEffect(() => {
    if (!citation) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [citation, onClose]);

  const activeItem = historyStack.length > 0 ? historyStack[historyStack.length - 1] : null;

  const tableDetails = useMemo(() => {
    if (activeItem?.type === 'table' && activeItem.table?.id) {
      return getTableDetails(activeItem.table.id);
    }
    return null;
  }, [activeItem]);

  if (!citation || !activeItem) return null;

  const handleCopy = (textToCopy) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleHopToClause = (clauseNum, stdId) => {
    const cl = getClause(stdId || activeItem.standardId || 'all', clauseNum) || getClause('all', clauseNum);
    if (cl) {
      setHistoryStack((prev) => [
        ...prev,
        {
          type: 'clause',
          raw: `${cl.standardName} Cl. ${cl.clauseNumber}`,
          standardId: cl.standardId,
          clause: cl,
          query: cl.clauseNumber
        }
      ]);
    }
  };

  const handleHopToTable = (tableRef, stdId) => {
    const refStr = typeof tableRef === 'string' ? tableRef : (tableRef?.tableId || tableRef?.tableNumber || '');
    const direct = ALL_TABLES.find(
      (t) =>
        t.id === refStr ||
        (t.standardId === (stdId || activeItem.standardId) &&
          t.number.toLowerCase() === String(refStr).toLowerCase())
    );
    if (direct) {
      setHistoryStack((prev) => [
        ...prev,
        {
          type: 'table',
          raw: `${direct.standardName} ${direct.number}`,
          standardId: direct.standardId,
          table: direct,
          query: direct.number
        }
      ]);
      return;
    }
    const resolved = resolveCitationReference(`${stdId || ''} ${refStr}`);
    if (resolved) {
      setHistoryStack((prev) => [...prev, resolved]);
    }
  };

  const isTable = activeItem.type === 'table' && tableDetails;
  const isClause = activeItem.type === 'clause' && activeItem.clause;

  const copyPayload = isTable
    ? `[${tableDetails.standardName}-${tableDetails.edition}, ${tableDetails.number}: ${tableDetails.title}]`
    : isClause
      ? `[${activeItem.clause.standardName}-${activeItem.clause.edition}, Cl. ${activeItem.clause.clauseNumber}] "${activeItem.clause.title}" — ${activeItem.clause.text}`
      : activeItem.raw;

  return (
    <>
      <div
        className="citation-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="glass-panel citation-inspector-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Citation Quick Inspector"
      >
        {/* Top Bar */}
        <div className="citation-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            {historyStack.length > 1 && (
              <button
                type="button"
                onClick={() => setHistoryStack((prev) => prev.slice(0, -1))}
                className="btn-secondary"
                style={{ padding: '0.28rem 0.48rem', fontSize: '0.72rem' }}
                aria-label="Previous citation"
                title="Back to previous inspected item"
              >
                <ArrowLeft size={13} />
              </button>
            )}
            {isTable ? (
              <Table size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
            ) : (
              <FileText size={16} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
            )}
            <div style={{ minWidth: 0 }}>
              <div
                className="mono"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 750,
                  color: isTable ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {isTable
                  ? `${tableDetails.standardName} — ${tableDetails.number}`
                  : isClause
                    ? `${activeItem.clause.standardName} Cl. ${activeItem.clause.clauseNumber}`
                    : activeItem.raw}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Quick-Inspector • Esc to close
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => handleCopy(copyPayload)}
              className="btn-secondary"
              style={{ padding: '0.32rem 0.6rem', fontSize: '0.72rem', gap: '0.3rem' }}
              title="Copy citation text"
            >
              {copied ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenInLibrary?.(activeItem.raw)}
              className="btn-primary"
              style={{ padding: '0.34rem 0.72rem', fontSize: '0.72rem', gap: '0.3rem' }}
              title="Open full Code Library focused on this citation"
            >
              <ExternalLink size={13} />
              <span>Open in Code Library</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ width: '30px', height: '30px', padding: 0 }}
              aria-label="Close Citation Quick Inspector"
              title="Close (Esc)"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="citation-drawer-body">
          {isTable && (
            <>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                  {tableDetails.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {tableDetails.edition && (
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      Edition {tableDetails.edition}
                    </span>
                  )}
                  {tableDetails.unit && (
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      Unit: {tableDetails.unit}
                    </span>
                  )}
                </div>
              </div>

              <UniversalTableRenderer table={tableDetails} compact={true} />

              {tableDetails.referencingClauses?.length > 0 && (
                <div className="glass-inset" style={{ padding: '0.75rem 0.9rem' }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--accent-cyan)',
                      marginBottom: '0.45rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <CornerDownRight size={13} />
                    <span>Referenced by Clauses</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {tableDetails.referencingClauses.slice(0, 14).map((rc, i) => (
                      <button
                        key={`${rc.clauseNumber}_${i}`}
                        type="button"
                        onClick={() => handleHopToClause(rc.clauseNumber, tableDetails.standardId)}
                        className="btn-secondary"
                        style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                      >
                        Cl. {rc.clauseNumber}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {isClause && (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                    {activeItem.clause.section}
                  </span>
                  {activeItem.clause.edition && (
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      Edition {activeItem.clause.edition}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {activeItem.clause.title}
                </h3>
              </div>

              <div
                className="glass-inset"
                style={{
                  padding: '0.95rem 1.05rem',
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-line'
                }}
              >
                <HighlightMatches text={activeItem.clause.text} />
              </div>

              {activeItem.clause.canadianDeviation && (
                <div
                  className="glass-inset"
                  style={{
                    padding: '0.8rem 0.95rem',
                    borderColor: 'rgba(251, 191, 36, 0.45)'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.25rem' }}>
                    Canadian Deviation / National Annex Note
                  </div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    <HighlightMatches text={activeItem.clause.canadianDeviation} />
                  </div>
                </div>
              )}

              {/* Referenced Tables */}
              {activeItem.clause.tablesReferenced?.length > 0 && (
                <div className="glass-inset" style={{ padding: '0.75rem 0.9rem' }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--accent-emerald)',
                      marginBottom: '0.45rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Table size={13} />
                    <span>Referenced Tables</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {activeItem.clause.tablesReferenced.map((tRef, idx) => {
                      const label =
                        typeof tRef === 'string'
                          ? tRef
                          : (tRef?.tableNumber || tRef?.tableId || 'Table');
                      return (
                        <button
                          key={`${label}_${idx}`}
                          type="button"
                          onClick={() => handleHopToTable(tRef, activeItem.clause.standardId)}
                          className="btn-secondary"
                          style={{ padding: '0.22rem 0.58rem', fontSize: '0.73rem' }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cross-Referenced Clauses */}
              {(activeItem.clause.clausesReferenced?.length > 0 || activeItem.clause.crossReferences?.length > 0) && (
                <div className="glass-inset" style={{ padding: '0.75rem 0.9rem' }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--accent-cyan)',
                      marginBottom: '0.45rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <CornerDownRight size={13} />
                    <span>Cross-Referenced Clauses</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(activeItem.clause.clausesReferenced || activeItem.clause.crossReferences || [])
                      .slice(0, 12)
                      .map((ref, idx) => (
                        <button
                          key={`${ref}_${idx}`}
                          type="button"
                          onClick={() => handleHopToClause(ref, activeItem.clause.standardId)}
                          className="btn-secondary"
                          style={{ padding: '0.22rem 0.58rem', fontSize: '0.73rem' }}
                        >
                          Cl. {ref}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!isTable && !isClause && (
            <div className="glass-inset" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 650 }}>
                <BookOpen size={17} color="var(--accent-cyan)" />
                <span>Reference: {activeItem.raw}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                No single exact clause number matched this citation string. Open it in the full Code Library to browse matching clauses, tables, and commentary.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
