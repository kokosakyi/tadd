import React from 'react';
import { Table, Copy, Check, Star, CornerDownRight, FileText, Columns } from 'lucide-react';
import UniversalTableRenderer from '../UniversalTableRenderer';

export default function TableReaderTab({
  selectedTableId,
  setSelectedTableId,
  sortedTableOptions = [],
  setSelectedStandard,
  setSearchQuery,
  currentTable,
  handleCopyCitation,
  copiedId,
  isBookmarked,
  handleToggleBookmark,
  handleOpenClauseInSplitPane
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Table Selector Dropdown & Key Presets */}
      <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Table size={18} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
            Select Digitized CSA Table:
          </span>
          <select
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              flex: '1',
              minWidth: '280px',
              cursor: 'pointer'
            }}
          >
            {sortedTableOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Popular Quick-Select Presets */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Key Tables:</span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => { setSelectedStandard('c22_3_no1'); setSelectedTableId('c22_3_no1_table2'); setSearchQuery(''); }}
              className={selectedTableId === 'c22_3_no1_table2' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
            >
              Table 2 (Ground Clearances)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedStandard('c22_3_no1'); setSelectedTableId('c22_3_no1_table10'); setSearchQuery(''); }}
              className={selectedTableId === 'c22_3_no1_table10' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
            >
              Table 10 (Bridge Clearances)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedStandard('c22_3_no1'); setSelectedTableId('c22_3_no1_table31'); setSearchQuery(''); }}
              className={selectedTableId === 'c22_3_no1_table31' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
            >
              Table 31 (Overload Factors)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedStandard('c22_3_60826'); setSelectedTableId('c22_3_60826_tableCA1'); setSearchQuery(''); }}
              className={selectedTableId === 'c22_3_60826_tableCA1' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
            >
              60826 Table CA.1 (682 Weather Stations)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedStandard('csa_o15'); setSelectedTableId('csa_o15_table3'); setSearchQuery(''); }}
              className={selectedTableId === 'csa_o15_table3' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
            >
              O15 Table 3 (Wood Species)
            </button>
          </div>
        </div>
      </div>

      {/* Table Viewer Card */}
      {currentTable && (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Table Title & Metadata Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ 
                  fontFamily: 'monospace', 
                  fontWeight: 'bold', 
                  background: 'rgba(6, 182, 212, 0.15)', 
                  color: 'var(--accent-cyan)', 
                  padding: '0.2rem 0.55rem', 
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}>
                  {currentTable.standardName} — {currentTable.number}
                </span>
                <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                  Edition {currentTable.edition}
                </span>
                {currentTable.unit && (
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    Unit: {currentTable.unit}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                {currentTable.title}
              </h3>

              {currentTable.scope && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {currentTable.scope}
                </p>
              )}
            </div>

            {/* Table Bookmark & Copy Citation Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => handleCopyCitation(
                  currentTable.id,
                  `[${currentTable.standardName}-${currentTable.edition}, ${currentTable.number}: ${currentTable.title}]`
                )}
                style={{
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.78rem',
                  color: copiedId === currentTable.id ? '#10b981' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {copiedId === currentTable.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedId === currentTable.id ? 'Citation Copied' : 'Copy Citation'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleBookmark({
                  type: 'table',
                  id: currentTable.id,
                  standardId: currentTable.standardId,
                  label: `${currentTable.standardName} ${currentTable.number}`,
                  title: currentTable.title
                })}
                style={{
                  background: isBookmarked('table', currentTable.id) ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-inset)',
                  border: isBookmarked('table', currentTable.id) ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.78rem',
                  color: isBookmarked('table', currentTable.id) ? '#f59e0b' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Star size={14} fill={isBookmarked('table', currentTable.id) ? '#f59e0b' : 'none'} />
                <span>{isBookmarked('table', currentTable.id) ? 'Pinned' : 'Pin Table'}</span>
              </button>
            </div>
          </div>

          {/* REVERSE LINKS CALLOUT: Clauses referencing this table */}
          <div style={{ 
            background: 'rgba(6, 182, 212, 0.07)', 
            border: '1px solid rgba(6, 182, 212, 0.25)', 
            padding: '1rem 1.25rem', 
            borderRadius: '10px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <CornerDownRight size={18} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                Referenced by Clauses ({currentTable.referencingClauses?.length || 0}):
              </span>
            </div>

            {(!currentTable.referencingClauses || currentTable.referencingClauses.length === 0) ? (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                No explicit clause references registered.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {currentTable.referencingClauses.map((rc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenClauseInSplitPane(rc.clauseNumber, currentTable.standardId)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      background: 'var(--bg-inset)',
                      border: '1px solid rgba(6, 182, 212, 0.35)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title={`Inspect Clause ${rc.clauseNumber} side-by-side`}
                  >
                    <FileText size={13} color="var(--accent-cyan)" />
                    <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                      Cl. {rc.clauseNumber}
                    </span>
                    {rc.title && (
                      <span style={{ color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {rc.title}
                      </span>
                    )}
                    <Columns size={12} color="var(--text-muted)" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* UNIVERSAL TABLE DATA & FOOTNOTES DISPLAY */}
          <UniversalTableRenderer table={currentTable} compact={false} />

        </div>
      )}

    </div>
  );
}
