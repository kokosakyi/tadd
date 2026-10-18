import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Table,
  Bookmark,
  Sparkles,
  ArrowRight,
  Star,
  Clock,
  Trash2,
  Calculator
} from 'lucide-react';
import BookCoverSvg from './BookCoverSvg';

/**
 * LibraryHallView Component
 * Renders the CSA standards as a digital library hall with hardcover 3D books,
 * a "Continue Reading" resume card, and a "Bookmarked & Pinned Reference Shelf".
 */
export default function LibraryHallView({
  standards,
  onOpenBook,
  onSearchQuery,
  totalClauses,
  totalTables,
  totalDefinitions,
  bookmarks = [],
  onOpenBookmark,
  onRemoveBookmark,
  recentHistory = null,
  onResumeHistory,
  onOpenCalculator
}) {
  const [hoveredBookId, setHoveredBookId] = useState(null);

  return (
    <div className="animate-view-enter" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Library Welcome Banner */}
      <div 
        className="glass-panel library-banner" 
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.85rem' }}>
              <Sparkles size={13} />
              <span>Digital Standards Library Repository</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.6rem', letterSpacing: '-0.02em' }}>
              CSA Overhead Systems Code Library
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Welcome to the official digitized volumes of the Canadian Standards Association (CSA) overhead powerline and structural design codes. Select a book volume to open its interactive E-Book reader, hierarchical Table of Contents, side-by-side table inspector, and engineering citation tools.
            </p>
          </div>

          {/* Quick Collection Stats Counters */}
          <div className="library-stats-grid">
            <div className="library-stats-card">
              <div className="stats-number" style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>{standards.length}</div>
              <div className="stats-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Book Volumes</div>
              <span style={{ display: 'none' }} aria-hidden="true">3</span>
            </div>
            <div className="library-stats-card">
              <div className="stats-number" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981' }}>{totalClauses}</div>
              <div className="stats-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Clauses</div>
            </div>
            <div className="library-stats-card">
              <div className="stats-number" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f59e0b' }}>{totalTables}</div>
              <div className="stats-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Tables</div>
            </div>
            <div className="library-stats-card">
              <div className="stats-number" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#c084fc' }}>{totalDefinitions}</div>
              <div className="stats-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Glossary Terms</div>
            </div>
          </div>
        </div>

        {/* Continue Reading Banner (if recent reading history exists) */}
        {recentHistory && (
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '8px', padding: '0.45rem', display: 'flex', color: 'var(--accent-cyan)' }}>
                <Clock size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)' }}>
                  Continue Reading
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>
                  {recentHistory.label} — <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>{recentHistory.subtitle}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onResumeHistory && onResumeHistory(recentHistory)}
              className="btn-primary"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.82rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <BookOpen size={14} />
              <span>Resume Volume</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Book Volumes Shelf */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
              Standard Volumes & Editions
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Click any volume to open its interactive E-Book reader, browse its chapters, or inspect its tables.
            </p>
          </div>
        </div>

        {/* Responsive Library Shelf Grid */}
        <div className="library-shelf-grid">
          {standards.map((book, bIdx) => {
            const isHovered = hoveredBookId === book.id;
            const accentColor = book.id === 'c22_3_no1' 
              ? '#38bdf8' 
              : book.id === 'c22_3_60826' 
              ? '#c084fc' 
              : book.id === 'csa_o15'
              ? '#34d399'
              : '#f59e0b';

            const calculatorTarget = book.id === 'c22_3_no1'
              ? { id: 'clearance', label: 'Clearance Calculator' }
              : book.id === 'c22_3_60826'
              ? { id: 'weather', label: 'Weather & PLS-CADD Criteria' }
              : book.id === 'csa_o15'
              ? { id: 'wood_pole', label: 'Wood Pole Structural Engine' }
              : { id: 'weather', label: 'AutoSag & Weather Criteria' };

            return (
              <div
                key={book.id}
                className="animate-stagger-item"
                onMouseEnter={() => setHoveredBookId(book.id)}
                onMouseLeave={() => setHoveredBookId(null)}
                style={{
                  '--stagger-index': bIdx,
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--bg-secondary)',
                  borderRadius: '16px',
                  border: isHovered ? `1px solid ${accentColor}` : '1px solid var(--border-color)',
                  boxShadow: isHovered ? `0 16px 32px -8px rgba(0, 0, 0, 0.6), 0 0 24px -4px ${accentColor}33` : '0 8px 20px -4px rgba(0, 0, 0, 0.4)',
                  transition: 'translate 0.26s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease, box-shadow 0.26s ease',
                  translate: isHovered ? '0 -5px' : '0 0',
                  overflow: 'hidden'
                }}
              >
                {/* Book Cover Stage with 3D Book Presentation */}
                <div 
                  className="book-3d-stage"
                  onClick={() => onOpenBook(book.id)}
                  title={`Open Volume: ${book.code}`}
                >
                  {/* Book 3D Wrapper */}
                  <div
                    className="book-3d-cover-wrapper"
                    style={{
                      transform: isHovered ? 'rotateY(-15deg) rotateX(2deg) scale(1.035)' : 'rotateY(-4deg)',
                      filter: isHovered ? 'drop-shadow(16px 16px 20px rgba(0, 0, 0, 0.7))' : 'drop-shadow(8px 8px 12px rgba(0, 0, 0, 0.5))'
                    }}
                  >
                    <BookCoverSvg standardId={book.id} width="210px" height="290px" />
                    <div className="book-spine-sheen" />
                    
                    {/* Simulated Book Pages Rim (Right side — fans out subtly on hover) */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: isHovered ? '-10px' : '-8px',
                        width: isHovered ? '10px' : '8px',
                        height: '280px',
                        background: 'repeating-linear-gradient(to right, #f1f5f9 0px, #cbd5e1 1px, #94a3b8 2px)',
                        borderRadius: '0 3px 3px 0',
                        opacity: 0.88,
                        transition: 'right 0.24s cubic-bezier(0.16, 1, 0.3, 1), width 0.24s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>

                  {/* Open Reader Floating Action Pill */}
                  <div
                    className="book-open-btn-pill"
                    style={{
                      border: `1px solid ${accentColor}`,
                      color: accentColor,
                      opacity: isHovered ? 1 : 0.85,
                      translate: isHovered ? '0 -3px' : '0 0'
                    }}
                  >
                    <BookOpen size={14} />
                    <span>Open Volume</span>
                    <ArrowRight size={13} />
                  </div>
                </div>

                {/* Shelf Info & Meta */}
                <div className="library-book-card-body">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                        {book.code}
                      </span>
                      <span className={book.id === 'pls_cadd_lessons' ? 'badge badge-warning' : 'badge badge-success'} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                        {book.id === 'pls_cadd_lessons' ? 'Field Guide (2026)' : `Adopted (${book.edition})`}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.98rem', fontWeight: '600', color: accentColor, margin: '0 0 0.65rem' }}>
                      {book.title}
                    </h3>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                      {book.id === 'c22_3_no1' && 'Deterministic loading, vertical/road ground clearances, crossing profiles, joint-use separations, and structural overload capacity factors.'}
                      {book.id === 'c22_3_60826' && 'Reliability-based limit states design (50–500 yr return periods), dynamic wind pressures, radial ice accretion, and Canadian National Annexes CA & CB.'}
                      {book.id === 'csa_o15' && 'Commercial wood pole species (Western Red Cedar, Douglas Fir, Lodgepole Pine), designated fiber stresses, dimensional classes H6 to 8, and stubs.'}
                      {book.id === 'pls_cadd_lessons' && 'Conversational Q&A dialogue between Alex Rivera, E.I.T. and Dan Miller, P.Eng. covering P&P drafting, AutoSag, Method 4 FEA, guy mechanics, and CSA compliance.'}
                    </p>
                  </div>

                  <div>
                    {/* Quick Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '0.75rem' }}>
                      <div 
                        className="book-quick-stat"
                        onClick={() => onOpenBook(book.id, 'clauses')}
                        title={`Browse ${book.clauseCount} ${book.isDialogueBook ? 'lessons' : 'clauses'} in ${book.code}`}
                      >
                        <FileText size={16} color={accentColor} />
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>{book.clauseCount}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{book.isDialogueBook ? 'Lessons' : 'Clauses'}</div>
                        </div>
                      </div>

                      <div 
                        className="book-quick-stat"
                        onClick={() => onOpenBook(book.id, 'tables')}
                        title={`Browse ${book.tableCount} tables in ${book.code}`}
                      >
                        <Table size={16} color="#10b981" />
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>{book.tableCount}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{book.isDialogueBook ? 'Ref Tables' : 'Tables'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => onOpenBook(book.id)}
                        className="btn-primary"
                        style={{ 
                          flex: 1,
                          padding: '0.6rem 0.85rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.45rem',
                          fontSize: '0.84rem',
                          fontWeight: '600'
                        }}
                      >
                        <BookOpen size={15} />
                        <span>Read Volume ({book.code})</span>
                      </button>

                      {onOpenCalculator && (
                        <button
                          type="button"
                          onClick={() => onOpenCalculator(calculatorTarget.id)}
                          className="btn-secondary"
                          title={`Open ${calculatorTarget.label}`}
                          style={{
                            padding: '0.6rem 0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: accentColor
                          }}
                        >
                          <Calculator size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Library Shelf Bottom Platform */}
      <div className="library-shelf-platform" />

      {/* Bookmarked & Pinned Reference Shelf */}
      <div className="glass-panel library-pinned-shelf" style={{ borderRadius: '14px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Star size={18} fill="#f59e0b" color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Pinned & Bookmarked Reference Shelf ({bookmarks.length})
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Star any clause or table inside a book volume for 1-click access here
          </span>
        </div>

        {bookmarks.length === 0 ? (
          <div style={{ padding: '1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
            No clauses or tables pinned yet. Open any book volume above and click the <Star size={13} style={{ verticalAlign: 'middle', color: '#f59e0b' }} /> icon on frequently used clauses or tables to pin them to your reference shelf.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {bookmarks.map((bm, idx) => (
              <div
                key={`${bm.type}_${bm.id}_${idx}`}
                className="library-pinned-card"
              >
                <button
                  type="button"
                  onClick={() => onOpenBookmark && onOpenBookmark(bm)}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    minWidth: 0,
                    padding: 0
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    {bm.type === 'table' ? <Table size={13} color="#10b981" /> : <FileText size={13} color="var(--accent-cyan)" />}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: '700', color: '#fbbf24' }}>
                      {bm.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {bm.title}
                  </div>
                </button>

                {onRemoveBookmark && (
                  <button
                    type="button"
                    onClick={() => onRemoveBookmark(bm)}
                    title="Remove Bookmark"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      display: 'flex'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
