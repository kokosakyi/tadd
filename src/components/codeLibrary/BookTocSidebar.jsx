import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Table,
  Bookmark,
  Star,
  BookOpen,
  FolderOpen,
  Folder,
  Layers
} from 'lucide-react';
import BookCoverSvg from './BookCoverSvg';

/**
 * Builds a clean multi-level TOC tree for a given standard (or all standards)
 * Hierarchy:
 * - Chapters / Sections (sorted cleanly)
 *   - Major Subsections (e.g. 5.1, 5.2, 5.3, A.1, A.2...)
 *     - Individual Clauses (5.3.1, 5.3.1.1...)
 * - Tables node (all tables for the standard)
 * - Definitions & Glossary node
 */
export function buildBookTocTree(clauses = [], tables = [], definitions = [], standardId = 'all') {
  const stdClauses = standardId === 'all'
    ? clauses
    : clauses.filter(c => c.standardId === standardId);

  const stdTables = standardId === 'all'
    ? tables
    : tables.filter(t => t.standardId === standardId);

  const stdDefs = standardId === 'all'
    ? definitions
    : definitions.filter(d => d.standardId === standardId);

  // Group clauses by section
  const sectionMap = new Map();
  for (const cl of stdClauses) {
    const secName = cl.section || 'General';
    if (!sectionMap.has(secName)) {
      sectionMap.set(secName, []);
    }
    sectionMap.get(secName).push(cl);
  }

  // Sort sections naturally (numeric chapters 0, 1, 2... then Annexes A, B, C...)
  const sortedSectionNames = Array.from(sectionMap.keys()).sort((a, b) => {
    const isAnnexA = /^annex/i.test(a);
    const isAnnexB = /^annex/i.test(b);
    if (isAnnexA !== isAnnexB) return isAnnexA ? 1 : -1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

  const sections = sortedSectionNames.map(secName => {
    const secClauses = sectionMap.get(secName) || [];
    
    // Group into major subsections (depth 2: e.g. "5.3", "A.5", or top-level if depth 1)
    const subMap = new Map();
    for (const cl of secClauses) {
      const parts = String(cl.clauseNumber || '').split('.');
      let groupKey = parts[0];
      if (parts.length >= 2) {
        groupKey = `${parts[0]}.${parts[1]}`;
      }
      if (!subMap.has(groupKey)) {
        subMap.set(groupKey, {
          key: groupKey,
          title: cl.title,
          rootClause: null,
          clauses: []
        });
      }
      const group = subMap.get(groupKey);
      if (cl.clauseNumber === groupKey) {
        group.rootClause = cl;
        if (cl.title && !cl.title.includes('— Clause')) {
          group.title = cl.title;
        }
      }
      group.clauses.push(cl);
    }

    const subsections = Array.from(subMap.values()).map(sub => {
      // Clean title if it's a generic section repeat
      let cleanSubTitle = sub.title || `Subsection ${sub.key}`;
      cleanSubTitle = cleanSubTitle.replace(new RegExp(`^${secName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*—\\s*`, 'i'), '');
      return {
        ...sub,
        title: cleanSubTitle
      };
    });

    return {
      sectionName: secName,
      clauseCount: secClauses.length,
      subsections
    };
  });

  return {
    sections,
    tables: [...stdTables].sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true })),
    definitions: stdDefs
  };
}

export default function BookTocSidebar({
  selectedStandard,
  activeBookMeta,
  clauses,
  tables,
  definitions,
  selectedSection,
  onSelectSection,
  selectedSubsectionPrefix,
  onSelectSubsectionPrefix,
  activeTab,
  onSelectTab,
  onSelectClause,
  onSelectTable,
  selectedTableId,
  highlightedClauseId,
  bookmarks = [],
  onOpenBookmark,
  onBackToShelf
}) {
  const [expandedSections, setExpandedSections] = useState(() => new Set());
  const [expandedSubsections, setExpandedSubsections] = useState(() => new Set());
  const [tablesExpanded, setTablesExpanded] = useState(false);

  const tocTree = useMemo(
    () => buildBookTocTree(clauses, tables, definitions, selectedStandard),
    [clauses, tables, definitions, selectedStandard]
  );

  const toggleSection = (secName) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(secName)) {
        next.delete(secName);
      } else {
        next.add(secName);
      }
      return next;
    });
  };

  const toggleSubsection = (subKey, e) => {
    e.stopPropagation();
    setExpandedSubsections(prev => {
      const next = new Set(prev);
      if (next.has(subKey)) {
        next.delete(subKey);
      } else {
        next.add(subKey);
      }
      return next;
    });
  };

  const accentColor = selectedStandard === 'c22_3_no1'
    ? '#38bdf8'
    : selectedStandard === 'c22_3_60826'
    ? '#c084fc'
    : selectedStandard === 'csa_o15'
    ? '#34d399'
    : selectedStandard === 'pls_cadd_lessons'
    ? '#f59e0b'
    : 'var(--accent-cyan)';

  const bookBookmarks = useMemo(() => {
    if (selectedStandard === 'all') return bookmarks;
    return bookmarks.filter(b => b.standardId === selectedStandard);
  }, [bookmarks, selectedStandard]);

  return (
    <aside
      className="glass-panel"
      aria-label="Book Table of Contents Sidebar"
      style={{
        width: '310px',
        flexShrink: 0,
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 120px)',
        position: 'sticky',
        top: '1rem',
        overflow: 'hidden'
      }}
    >
      {/* Book Spine & Mini Cover Header */}
      <div
        style={{
          padding: '1rem 1.1rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(15, 23, 42, 0.55)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem'
        }}
      >
        {selectedStandard !== 'all' ? (
          <div
            onClick={onBackToShelf}
            style={{
              width: '46px',
              height: '64px',
              flexShrink: 0,
              borderRadius: '4px',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}
            title="Return to Library Shelf"
          >
            <BookCoverSvg standardId={selectedStandard} width="46px" height="64px" />
          </div>
        ) : (
          <div
            style={{
              width: '46px',
              height: '64px',
              flexShrink: 0,
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BookOpen size={20} color="var(--accent-cyan)" />
          </div>
        )}

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: accentColor }}>
            {activeBookMeta ? `Edition ${activeBookMeta.edition}` : 'Omnibus Index'}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeBookMeta ? activeBookMeta.code : 'All CSA Volumes'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeBookMeta ? activeBookMeta.title : 'Combined 3-Book Index'}
          </div>
        </div>
      </div>

      {/* Scrollable TOC Tree */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
        
        {/* All Sections Reset Node */}
        <div style={{ marginBottom: '0.6rem' }}>
          <button
            type="button"
            onClick={() => {
              onSelectSection('all');
              if (onSelectSubsectionPrefix) onSelectSubsectionPrefix(null);
              onSelectTab('clauses');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.65rem',
              borderRadius: '8px',
              border: selectedSection === 'all' && !selectedSubsectionPrefix && activeTab === 'clauses'
                ? `1px solid ${accentColor}`
                : '1px solid transparent',
              background: selectedSection === 'all' && !selectedSubsectionPrefix && activeTab === 'clauses'
                ? 'rgba(56, 189, 248, 0.12)'
                : 'transparent',
              color: selectedSection === 'all' && !selectedSubsectionPrefix && activeTab === 'clauses'
                ? 'var(--text-main)'
                : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Layers size={14} color={accentColor} />
              <span>All Chapters & Clauses</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {tocTree.sections.reduce((acc, s) => acc + s.clauseCount, 0)}
            </span>
          </button>
        </div>

        {/* Bookmarks in this Volume (if any) */}
        {bookBookmarks.length > 0 && (
          <div style={{ marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f59e0b', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span>Bookmarked in Volume ({bookBookmarks.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.25rem' }}>
              {bookBookmarks.map((bm, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onOpenBookmark && onOpenBookmark(bm)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.55rem',
                    borderRadius: '6px',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    color: 'var(--text-main)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {bm.type === 'table' ? <Table size={12} color="#10b981" /> : <FileText size={12} color={accentColor} />}
                  <span style={{ fontWeight: '700', color: '#fbbf24', flexShrink: 0 }}>{bm.label}</span>
                  <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {bm.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CHAPTERS / SECTIONS HEADER */}
        <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', marginBottom: '0.25rem' }}>
          Table of Contents — Chapters
        </div>

        {/* Hierarchical Chapters -> Subsections -> Clauses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1rem' }}>
          {tocTree.sections.map((sec) => {
            const isSecExpanded = expandedSections.has(sec.sectionName) || selectedSection === sec.sectionName;
            const isSecActive = selectedSection === sec.sectionName && activeTab === 'clauses';

            return (
              <div key={sec.sectionName} style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Chapter Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '7px',
                    background: isSecActive && !selectedSubsectionPrefix ? 'rgba(56, 189, 248, 0.14)' : 'transparent',
                    border: isSecActive && !selectedSubsectionPrefix ? `1px solid ${accentColor}55` : '1px solid transparent'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.sectionName)}
                    aria-label={`Toggle ${sec.sectionName}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      padding: '0.45rem 0.25rem 0.45rem 0.45rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {isSecExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectSection(sec.sectionName);
                      if (onSelectSubsectionPrefix) onSelectSubsectionPrefix(null);
                      onSelectTab('clauses');
                      if (!expandedSections.has(sec.sectionName)) {
                        toggleSection(sec.sectionName);
                      }
                    }}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      padding: '0.45rem 0.5rem 0.45rem 0.2rem',
                      color: isSecActive ? 'var(--text-main)' : 'var(--text-secondary)',
                      fontWeight: isSecActive ? '700' : '500',
                      fontSize: '0.8rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.35rem',
                      minWidth: 0
                    }}
                    title={sec.sectionName}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                      {isSecExpanded ? <FolderOpen size={13} color={accentColor} style={{ flexShrink: 0 }} /> : <Folder size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sec.sectionName}
                      </span>
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                      {sec.clauseCount}
                    </span>
                  </button>
                </div>

                {/* Expanded Major Subsections */}
                {isSecExpanded && (
                  <div className="animate-toc-expand" style={{ paddingLeft: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.15rem', marginBottom: '0.3rem', borderLeft: '1px solid rgba(255,255,255,0.07)', marginLeft: '0.85rem' }}>
                    {sec.subsections.map((sub) => {
                      const isSubExpanded = expandedSubsections.has(sub.key);
                      const isSubActive = selectedSubsectionPrefix === sub.key && activeTab === 'clauses';

                      return (
                        <div key={sub.key} style={{ display: 'flex', flexDirection: 'column' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '6px',
                              background: isSubActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent'
                            }}
                          >
                            {sub.clauses.length > 1 ? (
                              <button
                                type="button"
                                onClick={(e) => toggleSubsection(sub.key, e)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--text-muted)',
                                  padding: '0.3rem 0.2rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {isSubExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              </button>
                            ) : (
                              <span style={{ width: '18px', display: 'inline-block' }} />
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                onSelectSection(sec.sectionName);
                                if (onSelectSubsectionPrefix) onSelectSubsectionPrefix(sub.key);
                                onSelectTab('clauses');
                              }}
                              style={{
                                flex: 1,
                                background: 'none',
                                border: 'none',
                                padding: '0.3rem 0.4rem 0.3rem 0.15rem',
                                color: isSubActive ? accentColor : 'var(--text-secondary)',
                                fontWeight: isSubActive ? '700' : '500',
                                fontSize: '0.76rem',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.3rem',
                                minWidth: 0
                              }}
                              title={`${sub.key} — ${sub.title}`}
                            >
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <strong style={{ fontFamily: 'var(--font-mono)', color: accentColor, marginRight: '0.3rem' }}>{sub.key}</strong>
                                {sub.title}
                              </span>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', flexShrink: 0 }}>
                                {sub.clauses.length}
                              </span>
                            </button>
                          </div>

                          {/* Individual Leaf Clauses inside Subsection */}
                          {isSubExpanded && sub.clauses.length > 1 && (
                            <div className="animate-toc-expand" style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.1rem', marginTop: '0.1rem', marginBottom: '0.2rem' }}>
                              {sub.clauses.map(cl => {
                                const isClActive = highlightedClauseId === cl.id;
                                return (
                                  <button
                                    key={cl.id}
                                    type="button"
                                    onClick={() => onSelectClause && onSelectClause(cl)}
                                    style={{
                                      background: isClActive ? 'rgba(56, 189, 248, 0.2)' : 'none',
                                      border: 'none',
                                      borderRadius: '5px',
                                      padding: '0.25rem 0.45rem',
                                      color: isClActive ? 'var(--text-main)' : 'var(--text-muted)',
                                      fontSize: '0.73rem',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      minWidth: 0
                                    }}
                                    title={`Cl. ${cl.clauseNumber} — ${cl.title}`}
                                  >
                                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: accentColor, flexShrink: 0 }}>
                                      {cl.clauseNumber}
                                    </span>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {cl.title}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DIGITIZED TABLES NODE */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', borderRadius: '8px', background: activeTab === 'tables' ? 'rgba(16, 185, 129, 0.14)' : 'transparent' }}>
            <button
              type="button"
              onClick={() => setTablesExpanded(p => !p)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                padding: '0.45rem 0.25rem 0.45rem 0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {tablesExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('tables');
                setTablesExpanded(true);
              }}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                padding: '0.45rem 0.6rem 0.45rem 0.2rem',
                color: activeTab === 'tables' ? '#10b981' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Table size={14} color="#10b981" />
                <span>Engineering Tables</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {tocTree.tables.length}
              </span>
            </button>
          </div>

          {tablesExpanded && (
            <div className="animate-toc-expand" style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.25rem', maxHeight: '240px', overflowY: 'auto' }}>
              {tocTree.tables.map(tbl => {
                const isSelected = activeTab === 'tables' && selectedTableId === tbl.id;
                return (
                  <button
                    key={tbl.id}
                    type="button"
                    onClick={() => onSelectTable && onSelectTable(tbl.id)}
                    style={{
                      background: isSelected ? 'rgba(16, 185, 129, 0.18)' : 'none',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.3rem 0.5rem',
                      color: isSelected ? '#10b981' : 'var(--text-muted)',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.74rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      minWidth: 0
                    }}
                    title={`${tbl.number} — ${tbl.title}`}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#10b981', flexShrink: 0 }}>
                      {tbl.number}
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tbl.title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* GLOSSARY & DEFINITIONS NODE */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onSelectTab('definitions')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.65rem',
              borderRadius: '8px',
              background: activeTab === 'definitions' ? 'rgba(192, 132, 252, 0.14)' : 'transparent',
              border: 'none',
              color: activeTab === 'definitions' ? '#c084fc' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Bookmark size={14} color="#c084fc" />
              <span>Definitions & Glossary</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {tocTree.definitions.length}
            </span>
          </button>
        </div>

      </div>
    </aside>
  );
}
