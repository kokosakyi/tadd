import React from 'react';
import { 
  FileText, Bookmark, Calculator, Copy, Check,
  ChevronLeft, ChevronRight, Table, Columns, CornerDownRight, Info 
} from 'lucide-react';
import HighlightMatches from '../HighlightMatches';

const CLAUSES_PER_PAGE = 20;

export default function ClauseListTab({
  clauses = [],
  paginatedClauses = [],
  highlightedClauseId = null,
  isBookmarked,
  copiedId,
  getCalculatorTargetForClauseOrTable,
  onOpenCalculator,
  handleCopyCitation,
  handleToggleBookmark,
  handleResetFilters,
  searchQuery = '',
  highlightRegex,
  allTables = [],
  companionItem,
  handleOpenTableInSplitPane,
  handleOpenClauseInSplitPane,
  clausePage = 1,
  totalClausePages = 1,
  setClausePage,
  selectedSection = 'all',
  crossSectionClauseCount = 0,
  onSearchAllChapters
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Cross-section matches notice */}
      {selectedSection !== 'all' && crossSectionClauseCount > 0 && (
        <div style={{
          background: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          padding: '0.65rem 0.85rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#fef08a' }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>Found <strong>{crossSectionClauseCount}</strong> matching clause(s) in other chapters.</span>
          </div>
          <button
            type="button"
            onClick={onSearchAllChapters}
            className="btn-primary"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', whiteSpace: 'nowrap' }}
          >
            Search All Chapters
          </button>
        </div>
      )}

      {/* Results Summary & Pagination Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Showing {clauses.length === 0 ? 0 : (clausePage - 1) * CLAUSES_PER_PAGE + 1}–
          {Math.min(clausePage * CLAUSES_PER_PAGE, clauses.length)} of {clauses.length} clauses
          {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
        </span>

        {totalClausePages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setClausePage(p => Math.max(1, p - 1))}
              disabled={clausePage === 1}
              className="btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', padding: '0 0.4rem' }}>
              Page {clausePage} of {totalClausePages}
            </span>
            <button
              type="button"
              onClick={() => setClausePage(p => Math.min(totalClausePages, p + 1))}
              disabled={clausePage === totalClausePages}
              className="btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Clause Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {paginatedClauses.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '12px' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              No clauses matched your query and filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}
            >
              Reset All Search & Filters
            </button>
          </div>
        ) : (
          paginatedClauses.map((cl, cIdx) => {
            const isHighlighted = highlightedClauseId === cl.id;
            const bookmarked = isBookmarked('clause', cl.id);
            const isCopied = copiedId === cl.id;
            const calcTarget = getCalculatorTargetForClauseOrTable(cl.standardId, cl.clauseNumber, cl.section);
            const formattedCitation = `[${cl.standardName}-${cl.edition}, Cl. ${cl.clauseNumber}] "${cl.title}" — ${cl.text}`;

            return (
              <div
                key={cl.id}
                id={cl.id}
                className={`glass-panel animate-stagger-item${isHighlighted ? ' clause-target-pulse' : ''}`}
                style={{
                  '--stagger-index': cIdx,
                  padding: '1.25rem 1.5rem',
                  borderRadius: '12px',
                  border: isHighlighted ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  boxShadow: isHighlighted ? '0 0 16px rgba(6, 182, 212, 0.25)' : 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Clause Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontWeight: 'bold', 
                      background: 'rgba(6, 182, 212, 0.15)', 
                      color: 'var(--accent-cyan)', 
                      padding: '0.25rem 0.55rem', 
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}>
                      {cl.standardName} Cl. <HighlightMatches text={cl.clauseNumber} regex={highlightRegex} />
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <HighlightMatches text={cl.section} regex={highlightRegex} />
                    </span>
                  </div>

                  {/* Engineering Action Toolbar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {cl.page > 0 && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                        Page {cl.page}
                      </span>
                    )}

                    {calcTarget && onOpenCalculator && (
                      <button
                        type="button"
                        onClick={() => onOpenCalculator(calcTarget.id)}
                        title={`Open in ${calcTarget.label}`}
                        style={{
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '6px',
                          padding: '0.22rem 0.5rem',
                          fontSize: '0.72rem',
                          color: 'var(--accent-cyan)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontWeight: '600'
                        }}
                      >
                        <Calculator size={12} />
                        <span>{calcTarget.label}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopyCitation(cl.id, formattedCitation)}
                      title="Copy Engineering Citation & Excerpt"
                      style={{
                        background: 'var(--bg-inset)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '0.22rem 0.5rem',
                        fontSize: '0.72rem',
                        color: isCopied ? '#10b981' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {isCopied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{isCopied ? 'Cited!' : 'Cite'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleBookmark({
                        type: 'clause',
                        id: cl.id,
                        standardId: cl.standardId,
                        clauseNumber: cl.clauseNumber,
                        label: `${cl.standardName} Cl. ${cl.clauseNumber}`,
                        title: cl.title
                      })}
                      aria-label={`Bookmark Clause ${cl.clauseNumber}`}
                      style={{
                        background: bookmarked ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-inset)',
                        border: bookmarked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '0.22rem 0.5rem',
                        fontSize: '0.72rem',
                        color: bookmarked ? '#f59e0b' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Bookmark size={12} fill={bookmarked ? '#f59e0b' : 'none'} />
                      <span>{bookmarked ? 'Pinned' : 'Pin'}</span>
                    </button>
                  </div>
                </div>

                {/* Clause Title */}
                <h4 style={{ 
                  margin: '0 0 0.65rem', 
                  fontSize: '1.05rem', 
                  fontWeight: 'bold', 
                  color: 'var(--text-main)' 
                }}>
                  <HighlightMatches text={cl.title} regex={highlightRegex} />
                </h4>

                {/* Clause Body Text */}
                <div style={{ 
                  fontSize: '0.88rem', 
                  lineHeight: 1.6, 
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-line',
                  marginBottom: '0.75rem'
                }}>
                  <HighlightMatches text={cl.text} regex={highlightRegex} />
                </div>

                {/* Canadian National Deviation Banner */}
                {cl.canadianDeviation && (
                  <div style={{
                    margin: '0.65rem 0',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    fontSize: '0.82rem',
                    color: 'var(--accent-rose)'
                  }}>
                    <strong>Canadian National Deviation:</strong> {cl.canadianDeviation}
                  </div>
                )}

                {/* Interactive Cross-References & Referenced Tables Footer */}
                {((cl.tablesReferenced && cl.tablesReferenced.length > 0) || (cl.crossReferences && cl.crossReferences.length > 0)) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)' }}>
                    
                    {/* Tables Referenced (Opens Split-Pane Inspector) */}
                    {cl.tablesReferenced && cl.tablesReferenced.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Table size={13} color="#10b981" /> Inspect Table:
                        </span>
                        {cl.tablesReferenced.map((tItem, idx) => {
                          const tNum = typeof tItem === 'object' && tItem !== null 
                            ? (tItem.tableNumber || tItem.tableId || '') 
                            : String(tItem || '');
                          const cleanTNum = tNum.replace(/^table\s+/i, '').trim();
                          const displayLabel = typeof tItem === 'object' && tItem !== null && tItem.tableNumber 
                            ? tItem.tableNumber 
                            : `Table ${cleanTNum}`;

                          const tblObj = allTables.find(t => 
                            (t.number.toLowerCase() === `table ${cleanTNum}`.toLowerCase() || 
                             t.number.toLowerCase() === cleanTNum.toLowerCase() ||
                             (tItem?.tableId && t.id === tItem.tableId)) &&
                            (cl.standardId ? t.standardId === cl.standardId : true)
                          );

                          const isOpenInPane = companionItem?.type === 'table' && companionItem?.id === tblObj?.id;

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => tblObj && handleOpenTableInSplitPane(tblObj.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: isOpenInPane ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.12)',
                                border: isOpenInPane ? '1px solid #10b981' : '1px solid rgba(16, 185, 129, 0.35)',
                                color: '#10b981',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '5px',
                                fontSize: '0.76rem',
                                fontWeight: '600',
                                cursor: tblObj ? 'pointer' : 'default',
                                transition: 'all 0.15s ease'
                              }}
                              title={tblObj ? `Open ${tblObj.number} (${tblObj.title}) side-by-side` : displayLabel}
                            >
                              <Columns size={11} />
                              <span>{displayLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Interactive Clause Cross-References (Opens Split-Pane Inspector) */}
                    {cl.crossReferences && cl.crossReferences.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CornerDownRight size={13} color="var(--accent-cyan)" /> Cross-Refs:
                        </span>
                        {cl.crossReferences.map((refNum, idx) => {
                          const refStr = String(refNum || '').trim();
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleOpenClauseInSplitPane(refStr, cl.standardId)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                background: 'rgba(56, 189, 248, 0.12)',
                                border: '1px solid rgba(56, 189, 248, 0.35)',
                                color: 'var(--accent-cyan)',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '5px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                              title={`Inspect Clause ${refStr} side-by-side`}
                            >
                              <span>Cl. {refStr}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Bottom Pagination */}
      {totalClausePages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => { setClausePage(p => Math.max(1, p - 1)); window.scrollTo({ top: 150, behavior: 'smooth' }); }}
            disabled={clausePage === 1}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <ChevronLeft size={16} /> Previous Page
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Page {clausePage} of {totalClausePages}
          </span>
          <button
            type="button"
            onClick={() => { setClausePage(p => Math.min(totalClausePages, p + 1)); window.scrollTo({ top: 150, behavior: 'smooth' }); }}
            disabled={clausePage === totalClausePages}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            Next Page <ChevronRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
