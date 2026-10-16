import React from 'react';
import {
  X,
  Table,
  FileText,
  Maximize2,
  ArrowRight,
  CornerDownRight,
  Star,
  Copy,
  Check
} from 'lucide-react';
import { getTableDetails } from '../../core/code/tableContentResolver';
import { getClause, ALL_TABLES } from '../../core/code/codeLibraryRegistry';
import UniversalTableRenderer from './UniversalTableRenderer';

/**
 * CompanionSplitPane Component
 * Renders a docked side-by-side reference inspector right next to the active clause list
 * so engineers can inspect referenced tables or cross-referenced clauses without losing
 * their reading position.
 */
export default function CompanionSplitPane({
  companionItem, // { type: 'table' | 'clause', id: string, standardId?: string, clauseNumber?: string }
  onClose,
  onExpandToFullTab,
  onJumpToClause,
  onJumpToTable,
  isBookmarked,
  onToggleBookmark
}) {
  const [copied, setCopied] = React.useState(false);

  if (!companionItem) return null;

  const handleCopyCitation = (textToCopy) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (companionItem.type === 'table') {
    const tableData = getTableDetails(companionItem.id);
    if (!tableData) return null;

    const bookmarked = isBookmarked ? isBookmarked('table', tableData.id) : false;
    const citationString = `[${tableData.standardName}-${tableData.edition}, ${tableData.number}: ${tableData.title}]`;

    return (
      <aside
        key={`table_${tableData.id}`}
        className="glass-panel animate-split-pane"
        aria-label={`Companion Inspector: ${tableData.number}`}
        style={{
          width: '460px',
          flexShrink: 0,
          borderRadius: '14px',
          border: '1px solid rgba(16, 185, 129, 0.45)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 120px)',
          position: 'sticky',
          top: '1rem',
          overflow: 'hidden',
          background: 'var(--bg-secondary)'
        }}
      >
        {/* Top Inspector Bar */}
        <div
          style={{
            padding: '0.85rem 1.1rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            <Table size={16} color="#10b981" />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '0.85rem', color: '#10b981' }}>
              {tableData.standardName} — {tableData.number}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark({
                  type: 'table',
                  id: tableData.id,
                  standardId: tableData.standardId,
                  label: `${tableData.standardName} ${tableData.number}`,
                  title: tableData.title
                })}
                title={bookmarked ? 'Remove Bookmark' : 'Bookmark Table'}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.3rem',
                  cursor: 'pointer',
                  color: bookmarked ? '#f59e0b' : 'var(--text-muted)',
                  display: 'flex'
                }}
              >
                <Star size={14} fill={bookmarked ? '#f59e0b' : 'none'} />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleCopyCitation(citationString)}
              title="Copy Table Citation"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.3rem 0.5rem',
                cursor: 'pointer',
                color: copied ? '#10b981' : 'var(--text-muted)',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Cite'}</span>
            </button>

            <button
              type="button"
              onClick={() => onExpandToFullTab && onExpandToFullTab(tableData.id, tableData.standardId)}
              title="View Full Screen in Tables Tab"
              style={{
                background: 'rgba(16, 185, 129, 0.18)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '6px',
                padding: '0.3rem 0.55rem',
                cursor: 'pointer',
                color: '#10b981',
                fontSize: '0.72rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Maximize2 size={12} />
              <span>Full View</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close split pane"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Table Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
              {tableData.title}
            </h4>
            {tableData.unit && (
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                Unit: {tableData.unit}
              </span>
            )}
          </div>

          {/* Universal Table Grid & Footnotes */}
          <UniversalTableRenderer table={tableData} compact={true} />

          {/* Referencing clauses */}
          {tableData.referencingClauses?.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CornerDownRight size={13} />
                <span>Referenced by Clauses:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {tableData.referencingClauses.map((rc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onJumpToClause && onJumpToClause(rc.clauseNumber, tableData.standardId)}
                    style={{
                      background: 'rgba(6, 182, 212, 0.12)',
                      border: '1px solid rgba(6, 182, 212, 0.35)',
                      borderRadius: '5px',
                      padding: '0.2rem 0.5rem',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.73rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cl. {rc.clauseNumber}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // Type === 'clause'
  const cl = getClause(companionItem.standardId || 'all', companionItem.clauseNumber) ||
             getClause('all', companionItem.clauseNumber);
  if (!cl) return null;

  const bookmarked = isBookmarked ? isBookmarked('clause', cl.id) : false;
  const citationString = `[${cl.standardName}-${cl.edition}, Cl. ${cl.clauseNumber}] "${cl.title}" — ${cl.text}`;

  return (
    <aside
      key={`clause_${cl.id}`}
      className="glass-panel animate-split-pane"
      aria-label={`Companion Inspector: Clause ${cl.clauseNumber}`}
      style={{
        width: '420px',
        flexShrink: 0,
        borderRadius: '14px',
        border: '1px solid rgba(56, 189, 248, 0.45)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 120px)',
        position: 'sticky',
        top: '1rem',
        overflow: 'hidden',
        background: 'var(--bg-secondary)'
      }}
    >
      <div
        style={{
          padding: '0.85rem 1.1rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(56, 189, 248, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
          <FileText size={16} color="var(--accent-cyan)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
            {cl.standardName} Cl. {cl.clauseNumber}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark({
                type: 'clause',
                id: cl.id,
                clauseNumber: cl.clauseNumber,
                standardId: cl.standardId,
                label: `${cl.standardName} Cl. ${cl.clauseNumber}`,
                title: cl.title
              })}
              title={bookmarked ? 'Remove Bookmark' : 'Bookmark Clause'}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.3rem',
                cursor: 'pointer',
                color: bookmarked ? '#f59e0b' : 'var(--text-muted)',
                display: 'flex'
              }}
            >
              <Star size={14} fill={bookmarked ? '#f59e0b' : 'none'} />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleCopyCitation(citationString)}
            title="Copy Clause Citation"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              color: copied ? '#10b981' : 'var(--text-muted)',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Cite'}</span>
          </button>

          <button
            type="button"
            onClick={() => onJumpToClause && onJumpToClause(cl.clauseNumber, cl.standardId)}
            title="Jump to Clause in Main Reader"
            style={{
              background: 'rgba(56, 189, 248, 0.18)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '6px',
              padding: '0.3rem 0.55rem',
              cursor: 'pointer',
              color: 'var(--accent-cyan)',
              fontSize: '0.72rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <span>Go to Clause</span>
            <ArrowRight size={12} />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close split pane"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {cl.section} {cl.page > 0 ? `• Page ${cl.page}` : ''}
        </div>
        <h4 style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
          {cl.title}
        </h4>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {cl.text || 'See subsections under this clause heading.'}
        </div>

        {cl.tablesReferenced?.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tables:</span>
            {cl.tablesReferenced.map((tItem, idx) => {
              const tNum = typeof tItem === 'object' && tItem !== null ? (tItem.tableNumber || tItem.tableId || '') : String(tItem || '');
              const cleanTNum = tNum.replace(/^table\s+/i, '').trim();
              const tblObj = ALL_TABLES.find(t =>
                (t.number.toLowerCase() === `table ${cleanTNum}`.toLowerCase() ||
                 (tItem?.tableId && t.id === tItem.tableId)) &&
                t.standardId === cl.standardId
              );
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => tblObj && onJumpToTable && onJumpToTable(tblObj.id)}
                  style={{
                    background: 'rgba(16, 185, 129, 0.14)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '5px',
                    padding: '0.2rem 0.5rem',
                    color: '#10b981',
                    fontSize: '0.74rem',
                    cursor: tblObj ? 'pointer' : 'default'
                  }}
                >
                  Table {cleanTNum}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
