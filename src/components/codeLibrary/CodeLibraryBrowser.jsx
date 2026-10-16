import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, BookOpen, Table, FileText, CheckCircle2, ExternalLink, 
  Filter, Layers, Info, ArrowRight, Bookmark, Hash, CornerDownRight, 
  ChevronLeft, ChevronRight, BookMarked, X, RefreshCw, Library, ArrowLeft,
  Star, Copy, Check, Calculator, Columns, Menu
} from 'lucide-react';
import { 
  searchCodeRegistry, 
  CSA_STANDARDS, 
  ALL_CLAUSES, 
  ALL_TABLES, 
  ALL_DEFINITIONS,
  getStandardSections,
  getClause,
  getTable,
  ALL_LIBRARY_BOOKS,
  PLS_BOOK_META,
  PLS_LESSONS,
  ALL_LESSON_CLAUSES
} from '../../core/code/codeLibraryRegistry';
import { getTableDetails } from '../../core/code/tableContentResolver';
import HighlightMatches from './HighlightMatches';
import { getHighlightTerms, buildHighlightRegex } from '../../utils/textHighlight';
import BookCoverSvg from './BookCoverSvg';
import LibraryHallView from './LibraryHallView';
import BookTocSidebar from './BookTocSidebar';
import CompanionSplitPane from './CompanionSplitPane';
import UniversalTableRenderer from './UniversalTableRenderer';
import LessonsLearnedReader from './LessonsLearnedReader';

const BOOKMARKS_STORAGE_KEY = 'linedesk_csa_library_bookmarks_v1';
const HISTORY_STORAGE_KEY = 'linedesk_csa_library_history_v1';

/**
 * Helper to determine if a clause or table is linked to one of the engineering calculators
 */
function getCalculatorTargetForClauseOrTable(standardId, clauseOrTableNum = '', section = '') {
  const numStr = String(clauseOrTableNum || '').toLowerCase();
  const secStr = String(section || '').toLowerCase();

  if (standardId === 'csa_o15') {
    return { id: 'wood_pole', label: 'Wood Pole Calculator' };
  }
  if (standardId === 'c22_3_60826') {
    return { id: 'weather', label: 'Weather & PLS-CADD Criteria' };
  }
  if (standardId === 'c22_3_no1') {
    if (numStr.startsWith('5.') || secStr.includes('clearance') || numStr.includes('table 2') || numStr.includes('table 3') || numStr.includes('table 4') || numStr.includes('table 5')) {
      return { id: 'clearance', label: 'Clearance Calculator' };
    }
    if (numStr.startsWith('7.') || secStr.includes('weather') || numStr.includes('table 30') || numStr.includes('table 31')) {
      return { id: 'weather', label: 'Weather Criteria Calculator' };
    }
    if (numStr.startsWith('8.') || secStr.includes('strength') || numStr.includes('table 10') || numStr.includes('table 32')) {
      return { id: 'wood_pole', label: 'Wood Pole Structural Engine' };
    }
  }
  return null;
}

export default function CodeLibraryBrowser({ onOpenCalculator, initialCitation = null, onClearCitation }) {
  // Mode: 'library' (shelf hall overview of all books) | 'book' (interactive E-Book reader)
  const [viewMode, setViewMode] = useState('library');
  
  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState('clauses'); // 'clauses' | 'tables' | 'definitions' | 'editions'
  const [selectedStandard, setSelectedStandard] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedSubsectionPrefix, setSelectedSubsectionPrefix] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Companion Split-Pane state: { type: 'table' | 'clause', id: string, standardId?: string, clauseNumber?: string } | null
  const [companionItem, setCompanionItem] = useState(null);

  // Copy feedback state: clause.id or table.id
  const [copiedId, setCopiedId] = useState(null);

  // Mobile Table of Contents drawer state (for screens < 1024px)
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Bookmarks persisted in localStorage
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Recent reading history persisted in localStorage
  const [recentHistory, setRecentHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const saveHistory = useCallback((entry) => {
    setRecentHistory(entry);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entry));
    } catch {
      // ignore storage errors
    }
  }, []);

  const isBookmarked = useCallback((type, id) => {
    return bookmarks.some(b => b.type === type && b.id === id);
  }, [bookmarks]);

  const handleToggleBookmark = useCallback((item) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.type === item.type && b.id === item.id);
      const next = exists
        ? prev.filter(b => !(b.type === item.type && b.id === item.id))
        : [item, ...prev];
      try {
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const handleCopyCitation = (id, citationText) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(citationText);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Memoize highlight regex based on active searchQuery
  const highlightRegex = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const terms = getHighlightTerms(searchQuery);
    return buildHighlightRegex(terms);
  }, [searchQuery]);

  // Table view state
  const [selectedTableId, setSelectedTableId] = useState('c22_3_no1_table2');
  
  // Clause pagination state
  const [clausePage, setClausePage] = useState(1);
  const CLAUSES_PER_PAGE = 20;

  // Selected clause highlight
  const [highlightedClauseId, setHighlightedClauseId] = useState(null);

  // Filter standards for display (excluding 'all' for the books shelves)
  const standardBooks = useMemo(() => {
    return ALL_LIBRARY_BOOKS;
  }, []);

  // 1. Standard options sorted alphabetically per project rule
  const standardOptions = useMemo(() => {
    const list = [
      { id: 'all', label: 'All Standards & Practice Guides' },
      { id: 'c22_3_no1', label: 'CSA C22.3 No. 1 — Overhead Systems' },
      { id: 'c22_3_60826', label: 'CSA C22.3 No. 60826 — Transmission Design Criteria' },
      { id: 'csa_o15', label: 'CSA O15 — Wood Utility Poles and Stubs' },
      { id: 'pls_cadd_lessons', label: 'PLS CADD - Lessons learned — Field & Office Dialogue' }
    ];
    return list.sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // 2. Section options sorted alphabetically per project rule
  const sectionOptions = useMemo(() => {
    const rawSections = getStandardSections(selectedStandard);
    const sorted = [...rawSections].sort((a, b) => a.localeCompare(b));
    return ['all', ...sorted];
  }, [selectedStandard]);

  // 3. Search results (plus subsection prefix filtering when selected in TOC)
  const searchResults = useMemo(() => {
    const base = searchCodeRegistry(searchQuery, {
      standardId: selectedStandard,
      section: selectedSection,
      activeTab
    });

    if (selectedSubsectionPrefix) {
      const prefix = selectedSubsectionPrefix.toLowerCase();
      const filteredClauses = base.clauses.filter(c => {
        const cNum = String(c.clauseNumber || '').toLowerCase();
        return cNum === prefix || cNum.startsWith(`${prefix}.`);
      });
      return {
        ...base,
        clauses: filteredClauses
      };
    }

    return base;
  }, [searchQuery, selectedStandard, selectedSection, selectedSubsectionPrefix, activeTab]);

  const { clauses, tables, definitions, crossSectionClauseCount = 0 } = searchResults;

  // Global search match counts grouped by Book Volume when user is typing a search query
  const bookSearchMatchCounts = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const globalRes = searchCodeRegistry(searchQuery, { standardId: 'all', section: 'all' });
    const counts = {
      all: globalRes.clauses.length + globalRes.tables.length,
      c22_3_no1: 0,
      c22_3_60826: 0,
      csa_o15: 0,
      pls_cadd_lessons: 0
    };
    for (const c of globalRes.clauses) {
      if (counts[c.standardId] !== undefined) counts[c.standardId]++;
    }
    for (const t of globalRes.tables) {
      if (counts[t.standardId] !== undefined) counts[t.standardId]++;
    }
    return counts;
  }, [searchQuery]);

  // 4. Tables list for dropdown, strictly sorted alphabetically per project rule
  const sortedTableOptions = useMemo(() => {
    const sourceList = searchQuery.trim() ? tables : (
      selectedStandard === 'all'
        ? ALL_TABLES
        : ALL_TABLES.filter(t => t.standardId === selectedStandard)
    );

    const tableList = sourceList.map(t => ({
      id: t.id,
      label: `${t.number} — ${t.title} (${t.standardName})`,
      standardId: t.standardId
    }));

    return tableList.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
  }, [searchQuery, tables, selectedStandard]);

  // Track previous search query to detect when user typed a new query
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  // Synchronize selectedTableId whenever search query or sortedTableOptions changes
  useEffect(() => {
    if (searchQuery !== prevSearchQuery) {
      setPrevSearchQuery(searchQuery);
      if (searchQuery.trim() && tables.length > 0) {
        setSelectedTableId(tables[0].id);
      }
    } else if (sortedTableOptions.length > 0) {
      const exists = sortedTableOptions.some(t => t.id === selectedTableId);
      if (!exists) {
        setSelectedTableId(sortedTableOptions[0].id);
      }
    }
  }, [searchQuery, prevSearchQuery, tables, sortedTableOptions, selectedTableId]);

  // Handle external citation jumping (from calculators or trace viewers)
  useEffect(() => {
    if (!initialCitation) return;

    const cit = String(initialCitation).trim();
    if (!cit) return;

    const tableMatch = cit.match(/(?:table|tbl)\s*([a-z0-9\._-]+)/i);
    let matchedTable = null;
    if (tableMatch) {
      const tNum = tableMatch[1].replace(/-/g, '.');
      matchedTable = ALL_TABLES.find(t => 
        t.number.toLowerCase().replace(/-/g, '.') === `table ${tNum}`.toLowerCase() ||
        t.id.toLowerCase().includes(tNum.toLowerCase()) ||
        t.key.toLowerCase() === `table${tNum}`.toLowerCase()
      );
    }

    if (matchedTable) {
      setSelectedStandard(matchedTable.standardId);
      setSelectedSection('all');
      setSelectedSubsectionPrefix(null);
      setSelectedTableId(matchedTable.id);
      setActiveTab('tables');
      setSearchQuery(matchedTable.number);
      setViewMode('book');
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      const clauseMatch = cit.match(/(?:cl(?:ause|\.)?)\s*([a-z0-9\._-]+)/i);
      const clauseNum = clauseMatch ? clauseMatch[1] : null;

      let stdId = 'all';
      if (/c22\.?3\s*(?:no\.?\s*1|#1)/i.test(cit)) stdId = 'c22_3_no1';
      else if (/60826/i.test(cit)) stdId = 'c22_3_60826';
      else if (/o15/i.test(cit)) stdId = 'csa_o15';

      let matchedClause = null;
      if (clauseNum) {
        matchedClause = getClause(stdId, clauseNum) || getClause('all', clauseNum);
      }

      if (matchedClause) {
        setSelectedStandard(matchedClause.standardId);
        setSelectedSection('all');
        setSelectedSubsectionPrefix(null);
        setSearchQuery(matchedClause.clauseNumber);
        setHighlightedClauseId(matchedClause.id);
        setActiveTab('clauses');
        setClausePage(1);
      } else {
        setSelectedSection('all');
        setSelectedSubsectionPrefix(null);
        setSearchQuery(cit);
        setActiveTab('clauses');
        setClausePage(1);
      }
      setViewMode('book');
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }

    if (onClearCitation) {
      onClearCitation();
    }
  }, [initialCitation, onClearCitation]);

  // Selected table detailed data
  const currentTable = useMemo(() => {
    if (searchQuery.trim() && tables.length === 0) {
      return null;
    }
    return getTableDetails(selectedTableId) || (sortedTableOptions[0] ? getTableDetails(sortedTableOptions[0].id) : null);
  }, [selectedTableId, searchQuery, tables, sortedTableOptions]);

  // Pagination for clauses
  const paginatedClauses = useMemo(() => {
    const start = (clausePage - 1) * CLAUSES_PER_PAGE;
    return clauses.slice(start, start + CLAUSES_PER_PAGE);
  }, [clauses, clausePage]);

  const totalClausePages = Math.ceil(clauses.length / CLAUSES_PER_PAGE) || 1;

  const isFiltered = Boolean(
    searchQuery.trim() || selectedStandard !== 'all' || selectedSection !== 'all' || selectedSubsectionPrefix
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSection('all');
    setSelectedSubsectionPrefix(null);
    setClausePage(1);
    setHighlightedClauseId(null);
  };

  // Open a specific book from the Library Hall
  const handleOpenBook = (standardId, tab = 'clauses') => {
    const stdMeta = standardBooks.find(s => s.id === standardId);
    setSelectedStandard(standardId);
    setSelectedSection('all');
    setSelectedSubsectionPrefix(null);
    setActiveTab(tab);
    setSearchQuery('');
    setClausePage(1);
    setHighlightedClauseId(null);
    setCompanionItem(null);

    if (tab === 'tables') {
      const stdTables = ALL_TABLES.filter(t => t.standardId === standardId);
      if (stdTables.length > 0) {
        setSelectedTableId(stdTables[0].id);
      }
    }

    if (stdMeta) {
      saveHistory({
        standardId,
        tab,
        label: stdMeta.code,
        subtitle: stdMeta.title
      });
    }

    setViewMode('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open a bookmarked clause or table
  const handleOpenBookmark = (bm) => {
    if (!bm) return;
    if (bm.type === 'table') {
      setSelectedStandard(bm.standardId || 'all');
      setSelectedTableId(bm.id);
      setActiveTab('tables');
      setSearchQuery('');
      setViewMode('book');
    } else {
      setSelectedStandard(bm.standardId || 'all');
      setSelectedSection('all');
      setSelectedSubsectionPrefix(null);
      setSearchQuery(bm.clauseNumber || '');
      setHighlightedClauseId(bm.id);
      setActiveTab('clauses');
      setClausePage(1);
      setViewMode('book');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resume from recent history
  const handleResumeHistory = (hist) => {
    if (!hist) return;
    setSelectedStandard(hist.standardId || 'all');
    setActiveTab(hist.tab || 'clauses');
    if (hist.clauseNumber) {
      setSearchQuery(hist.clauseNumber);
      setHighlightedClauseId(hist.clauseId || null);
    } else if (hist.tableId) {
      setSelectedTableId(hist.tableId);
    }
    setViewMode('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open a referenced table in the Side-by-Side Split-Pane Inspector without losing reading position
  const handleOpenTableInSplitPane = (tableId) => {
    const tbl = getTable(tableId);
    if (tbl) {
      setCompanionItem({
        type: 'table',
        id: tbl.id,
        standardId: tbl.standardId
      });
      saveHistory({
        standardId: tbl.standardId,
        tab: 'tables',
        tableId: tbl.id,
        label: `${tbl.standardName} ${tbl.number}`,
        subtitle: tbl.title
      });
    }
  };

  // Open a cross-referenced clause in the Side-by-Side Split-Pane Inspector
  const handleOpenClauseInSplitPane = (clauseNum, stdId) => {
    const matched = getClause(stdId, clauseNum) || getClause('all', clauseNum);
    if (matched) {
      setCompanionItem({
        type: 'clause',
        id: matched.id,
        clauseNumber: matched.clauseNumber,
        standardId: matched.standardId
      });
      saveHistory({
        standardId: matched.standardId,
        tab: 'clauses',
        clauseId: matched.id,
        clauseNumber: matched.clauseNumber,
        label: `${matched.standardName} Cl. ${matched.clauseNumber}`,
        subtitle: matched.title
      });
    }
  };

  // Full-screen jump to table tab
  const handleJumpToTableFull = (tableId, stdId) => {
    const tbl = getTable(tableId);
    if (tbl) {
      setSelectedStandard(stdId || tbl.standardId);
      setSelectedTableId(tbl.id);
      setActiveTab('tables');
      setCompanionItem(null);
      setViewMode('book');
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  // Full-screen jump to clause in main reader
  const handleJumpToClauseFull = (clauseNum, stdId) => {
    const matched = getClause(stdId, clauseNum) || getClause('all', clauseNum);
    if (matched) {
      setSelectedStandard(matched.standardId);
      setSelectedSection('all');
      setSelectedSubsectionPrefix(null);
      setSearchQuery(matched.clauseNumber);
      setHighlightedClauseId(matched.id);
      setActiveTab('clauses');
      setViewMode('book');
      setClausePage(1);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  // Current active standard object if a single standard is selected
  const activeBookMeta = useMemo(() => {
    if (selectedStandard === 'all') return null;
    return standardBooks.find(s => s.id === selectedStandard) || null;
  }, [selectedStandard, standardBooks]);

  return (
    <div style={{ maxWidth: '1420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      
      {/* Top Library Navigation Bar */}
      <div 
        className="glass-panel" 
        style={{ 
            padding: '0.85rem 1.25rem', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem'
        }}
      >
        {/* Left: View Mode Toggle & Book Volume Switcher Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setViewMode('library')}
            className={viewMode === 'library' ? 'btn-primary' : 'btn-secondary'}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              padding: '0.42rem 0.85rem', 
              fontSize: '0.84rem',
              fontWeight: '600'
            }}
          >
            <Library size={16} />
            <span>Library Shelf</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('book')}
            className={viewMode === 'book' ? 'btn-primary' : 'btn-secondary'}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              padding: '0.42rem 0.85rem', 
              fontSize: '0.84rem',
              fontWeight: '600'
            }}
          >
            <BookOpen size={16} />
            <span>Book Reader {activeBookMeta ? `(${activeBookMeta.code})` : '(All Volumes)'}</span>
          </button>

          {/* When searching, show Volume Match Grouping Pills */}
          {bookSearchMatchCounts && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Matches by Book:</span>
              {[
                { id: 'all', code: 'All', color: 'var(--accent-cyan)' },
                { id: 'c22_3_no1', code: 'C22.3 No. 1', color: '#38bdf8' },
                { id: 'c22_3_60826', code: '60826', color: '#c084fc' },
                { id: 'csa_o15', code: 'CSA O15', color: '#34d399' },
                { id: 'pls_cadd_lessons', code: 'PLS-CADD', color: '#f59e0b' }
              ].map(vol => {
                const count = bookSearchMatchCounts[vol.id] || 0;
                const isSelected = selectedStandard === vol.id;
                return (
                  <button
                    key={vol.id}
                    type="button"
                    onClick={() => {
                      setSelectedStandard(vol.id);
                      setSelectedSection('all');
                      setSelectedSubsectionPrefix(null);
                      setClausePage(1);
                      setViewMode('book');
                    }}
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)',
                      border: isSelected ? `1px solid ${vol.color}` : '1px solid var(--border-color)',
                      borderRadius: '20px',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.73rem',
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? vol.color : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>{vol.code}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', opacity: 0.9 }}>({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Global Quick Search across all digitized books */}
        <div style={{ position: 'relative', minWidth: '300px', flex: '1', maxWidth: '440px' }}>
          <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            id="csa-library-search-input"
            name="csa-library-search"
            type="search"
            role="searchbox"
            aria-label="Search CSA Standards Library clauses, tables, and definitions"
            autoComplete="off"
            spellCheck="false"
            placeholder="Search all books (e.g. 5.3.1.1, Table 2, Western Red Cedar)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedSubsectionPrefix(null);
              setClausePage(1);
              if (viewMode === 'library' && e.target.value.trim()) {
                setViewMode('book');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSearchQuery('');
                setClausePage(1);
              }
            }}
            style={{
              width: '100%',
              padding: '0.55rem 2.4rem 0.55rem 2.3rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setClausePage(1); }}
              aria-label="Clear search query"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: LIBRARY HALL VIEW (Digital Bookshelf Concept)          */}
      {/* ============================================================== */}
      {viewMode === 'library' && (
        <LibraryHallView
          standards={standardBooks}
          onOpenBook={handleOpenBook}
          onSearchQuery={(q) => {
            setSearchQuery(q);
            setViewMode('book');
          }}
          totalClauses={ALL_CLAUSES.length}
          totalTables={ALL_TABLES.length}
          totalDefinitions={ALL_DEFINITIONS.length}
          bookmarks={bookmarks}
          onOpenBookmark={handleOpenBookmark}
          onRemoveBookmark={handleToggleBookmark}
          recentHistory={recentHistory}
          onResumeHistory={handleResumeHistory}
          onOpenCalculator={onOpenCalculator}
        />
      )}

      {/* ============================================================== */}
      {/* MODE 2: INTERACTIVE E-BOOK READER (TOC Sidebar + Reading Pane) */}
      {/* ============================================================== */}
      {viewMode === 'book' && (
        <div
          key={`book_reader_${selectedStandard}`}
          className="animate-book-open book-reader-layout"
        >
          
          {/* Persistent Hierarchical Table of Contents Sidebar */}
          <BookTocSidebar
            selectedStandard={selectedStandard}
            activeBookMeta={activeBookMeta}
            clauses={selectedStandard === 'pls_cadd_lessons' ? ALL_LESSON_CLAUSES : ALL_CLAUSES}
            tables={ALL_TABLES}
            definitions={ALL_DEFINITIONS}
            selectedSection={selectedSection}
            onSelectSection={(sec) => {
              setSelectedSection(sec);
              setClausePage(1);
              setMobileTocOpen(false);
            }}
            selectedSubsectionPrefix={selectedSubsectionPrefix}
            onSelectSubsectionPrefix={(prefix) => {
              setSelectedSubsectionPrefix(prefix);
              setClausePage(1);
              setMobileTocOpen(false);
            }}
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setMobileTocOpen(false);
            }}
            onSelectClause={(cl) => {
              setSelectedStandard(cl.standardId);
              setSelectedSection(cl.section || 'all');
              setSelectedSubsectionPrefix(null);
              setSearchQuery(cl.clauseNumber);
              setHighlightedClauseId(cl.id);
              setActiveTab('clauses');
              setClausePage(1);
              setMobileTocOpen(false);
              saveHistory({
                standardId: cl.standardId,
                tab: 'clauses',
                clauseId: cl.id,
                clauseNumber: cl.clauseNumber,
                label: `${cl.standardName} Cl. ${cl.clauseNumber}`,
                subtitle: cl.title
              });
            }}
            onSelectTable={(tblId) => {
              const tbl = getTable(tblId);
              if (tbl) {
                setSelectedStandard(tbl.standardId);
                setSelectedTableId(tbl.id);
                setActiveTab('tables');
                setMobileTocOpen(false);
                saveHistory({
                  standardId: tbl.standardId,
                  tab: 'tables',
                  tableId: tbl.id,
                  label: `${tbl.standardName} ${tbl.number}`,
                  subtitle: tbl.title
                });
              }
            }}
            selectedTableId={selectedTableId}
            highlightedClauseId={highlightedClauseId}
            bookmarks={bookmarks}
            onOpenBookmark={(bm) => {
              handleOpenBookmark(bm);
              setMobileTocOpen(false);
            }}
            onBackToShelf={() => {
              setViewMode('library');
              setMobileTocOpen(false);
            }}
            isMobileOpen={mobileTocOpen}
            onCloseMobile={() => setMobileTocOpen(false)}
          />

          {/* Main Book Reading Column */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
            
            {/* Mobile Table of Contents Quick Toggle Bar (Visible strictly on mobile/tablet < 1024px) */}
            <div className="mobile-toc-bar">
              <button
                type="button"
                onClick={() => setMobileTocOpen(true)}
                className="mobile-toc-toggle-btn"
                aria-label="Open Table of Contents"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '6px', padding: '0.3rem', display: 'flex', color: 'var(--accent-cyan)' }}>
                    <Menu size={16} />
                  </div>
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--accent-cyan)' }}>
                      Table of Contents
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {selectedSubsectionPrefix
                        ? `Subsection ${selectedSubsectionPrefix}`
                        : selectedSection !== 'all'
                        ? selectedSection
                        : activeBookMeta ? `${activeBookMeta.code} — All Sections` : 'All Volumes'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: '600', flexShrink: 0 }}>
                  <span>Browse</span>
                  <ChevronRight size={15} />
                </div>
              </button>
            </div>

            {/* Active Book Control Header */}
            <div 
              className="glass-panel" 
              style={{ 
                padding: '1.25rem 1.5rem', 
                borderRadius: '14px', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {/* Top row: Book Identity & Return button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                      {activeBookMeta ? `${activeBookMeta.code} — ${activeBookMeta.title}` : 'All Digitized CSA Volumes'}
                    </h2>
                    {activeBookMeta && (
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        Edition {activeBookMeta.edition}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                    {selectedSubsectionPrefix
                      ? `Viewing Subsection ${selectedSubsectionPrefix} (${clauses.length} clauses)`
                      : selectedSection !== 'all'
                      ? `Chapter: ${selectedSection} (${clauses.length} clauses)`
                      : `Showing ${clauses.length} clauses, ${tables.length} tables, and ${definitions.length} definitions.`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode('library')}
                  className="btn-secondary"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    padding: '0.4rem 0.85rem', 
                    fontSize: '0.8rem' 
                  }}
                >
                  <ArrowLeft size={15} />
                  <span>Return to Library Shelf</span>
                </button>
              </div>

              {/* Book Selector & Section Filter Bar (Strictly sorted alphabetically per AGENTS.md) */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Filter size={14} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Book:</span>
                  <select
                    value={selectedStandard}
                    onChange={(e) => {
                      const newStd = e.target.value;
                      setSelectedStandard(newStd);
                      setSelectedSection('all');
                      setSelectedSubsectionPrefix(null);
                      setClausePage(1);
                      if (newStd !== 'all') {
                        const stdTables = ALL_TABLES.filter(t => t.standardId === newStd);
                        if (stdTables.length > 0 && !stdTables.some(t => t.id === selectedTableId)) {
                          setSelectedTableId(stdTables[0].id);
                        }
                      }
                    }}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-main)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {standardOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Section:</span>
                  <select
                    value={selectedSection}
                    onChange={(e) => {
                      setSelectedSection(e.target.value);
                      setSelectedSubsectionPrefix(null);
                      setClausePage(1);
                    }}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-main)',
                      fontSize: '0.8rem',
                      maxWidth: '280px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">All Sections ({sectionOptions.length - 1})</option>
                    {sectionOptions.filter(s => s !== 'all').map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                {/* Active Filter Tags */}
                {isFiltered && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
                    {selectedSubsectionPrefix && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', color: 'var(--accent-cyan)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.73rem' }}>
                        Subsection: {selectedSubsectionPrefix}
                        <button type="button" onClick={() => setSelectedSubsectionPrefix(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={11} /></button>
                      </span>
                    )}
                    {searchQuery.trim() && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', color: 'var(--accent-cyan)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.73rem' }}>
                        Query: "{searchQuery.trim()}"
                        <button type="button" onClick={() => { setSearchQuery(''); setClausePage(1); }} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={11} /></button>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-cyan)',
                        fontSize: '0.74rem',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: '0.15rem 0.35rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <RefreshCw size={11} /> Reset Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Book Content Tabs */}
              <div className="book-content-tabs">
                <button
                  onClick={() => setActiveTab('clauses')}
                  className={activeTab === 'clauses' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <FileText size={15} />
                  <span>{selectedStandard === 'pls_cadd_lessons' ? `Dialogue Lessons (${clauses.length})` : `Digitized Clauses (${clauses.length})`}</span>
                </button>
                <button
                  onClick={() => setActiveTab('tables')}
                  className={activeTab === 'tables' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Table size={15} />
                  <span>Digitized Tables ({tables.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('definitions')}
                  className={activeTab === 'definitions' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Bookmark size={15} />
                  <span>Definitions & Glossary ({definitions.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('editions')}
                  className={activeTab === 'editions' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Layers size={15} />
                  <span>Adopted Standards & Scope</span>
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* TAB 1: DIGITIZED CLAUSES / DIALOGUE LESSONS                    */}
            {/* ============================================================== */}
            {activeTab === 'clauses' && (
              selectedStandard === 'pls_cadd_lessons' ? (
                <LessonsLearnedReader
                  lessons={PLS_LESSONS}
                  activeLessonId={highlightedClauseId || (clauses[0] ? clauses[0].id : null)}
                  onSelectLesson={(lesson) => {
                    setHighlightedClauseId(lesson.id);
                    setSearchQuery(lesson.clauseNumber);
                  }}
                  bookmarks={bookmarks}
                  onToggleBookmark={handleToggleBookmark}
                  onOpenCalculator={onOpenCalculator}
                  searchQuery={searchQuery}
                />
              ) : (
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
                      onClick={() => { setSelectedSection('all'); setSelectedSubsectionPrefix(null); setClausePage(1); }}
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
                      {(tables.length > 0 || definitions.length > 0) && (
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>Results found in other tabs:</span>
                          {tables.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('tables')}
                              className="btn-primary"
                              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <Table size={14} /> View {tables.length} Matching Table{tables.length > 1 ? 's' : ''}
                            </button>
                          )}
                          {definitions.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('definitions')}
                              className="btn-primary"
                              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <Bookmark size={14} /> View {definitions.length} Matching Definition{definitions.length > 1 ? 's' : ''}
                            </button>
                          )}
                        </div>
                      )}
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

                            {/* Engineering Action Toolbar: Bookmark, Copy Citation, Calculator Link */}
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
                                  background: 'rgba(255, 255, 255, 0.05)',
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
                                  clauseNumber: cl.clauseNumber,
                                  standardId: cl.standardId,
                                  label: `${cl.standardName} Cl. ${cl.clauseNumber}`,
                                  title: cl.title
                                })}
                                aria-label={bookmarked ? `Remove bookmark for Clause ${cl.clauseNumber}` : `Bookmark Clause ${cl.clauseNumber}`}
                                title={bookmarked ? 'Pinned to Reference Shelf' : 'Pin Clause to Reference Shelf'}
                                style={{
                                  background: bookmarked ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                  border: bookmarked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)',
                                  borderRadius: '6px',
                                  padding: '0.25rem 0.45rem',
                                  color: bookmarked ? '#f59e0b' : 'var(--text-muted)',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Star size={13} className={bookmarked ? 'bookmark-pop' : ''} fill={bookmarked ? '#f59e0b' : 'none'} />
                              </button>
                            </div>
                          </div>

                          {/* Clause Title */}
                          <h3 style={{ fontSize: '1.08rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.6rem' }}>
                            <HighlightMatches text={cl.title} regex={highlightRegex} />
                          </h3>

                          {/* Clause Text */}
                          <div style={{ 
                            fontSize: '0.9rem', 
                            color: 'var(--text-secondary)', 
                            lineHeight: 1.6, 
                            whiteSpace: 'pre-wrap', 
                            marginBottom: (cl.tablesReferenced?.length > 0 || cl.crossReferences?.length > 0) ? '0.85rem' : 0 
                          }}>
                            <HighlightMatches text={cl.text} regex={highlightRegex} />
                          </div>

                          {/* Canadian Deviation Alert Banner */}
                          {cl.canadianDeviation && (
                            <div style={{
                              margin: '0.75rem 0',
                              padding: '0.65rem 0.85rem',
                              borderRadius: '8px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              fontSize: '0.82rem',
                              color: '#fca5a5'
                            }}>
                              <strong>Canadian National Deviation:</strong> {cl.canadianDeviation}
                            </div>
                          )}

                          {/* Interactive Cross-References & Referenced Tables Footer */}
                          {((cl.tablesReferenced && cl.tablesReferenced.length > 0) || (cl.crossReferences && cl.crossReferences.length > 0)) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                              
                              {/* Tables Referenced (Opens Split-Pane Inspector!) */}
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

                                    const tblObj = ALL_TABLES.find(t => 
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

                              {/* Interactive Clause Cross-References (Opens Split-Pane Inspector!) */}
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
            )
          )}

            {/* ============================================================== */}
            {/* TAB 2: DIGITIZED TABLES                                        */}
            {/* ============================================================== */}
            {activeTab === 'tables' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Table Selector Dropdown (Alphabetically sorted per AGENTS.md) */}
                <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Table size={20} color="var(--accent-cyan)" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                        Select Digitized Table ({sortedTableOptions.length}):
                      </span>
                    </div>

                    <select
                      value={selectedTableId}
                      onChange={(e) => setSelectedTableId(e.target.value)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-main)',
                        fontSize: '0.85rem',
                        maxWidth: '520px',
                        flex: 1,
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
                        onClick={() => { setSelectedStandard('c22_3_no1'); setSelectedTableId('c22_3_no1_table2'); setSearchQuery(''); }}
                        className={selectedTableId === 'c22_3_no1_table2' ? 'btn-primary' : 'btn-secondary'}
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Table 2 (Ground Clearances)
                      </button>
                      <button
                        onClick={() => { setSelectedStandard('c22_3_no1'); setSelectedTableId('c22_3_no1_table10'); setSearchQuery(''); }}
                        className={selectedTableId === 'c22_3_no1_table10' ? 'btn-primary' : 'btn-secondary'}
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Table 10 (Bridge Clearances)
                      </button>
                      <button
                        onClick={() => { setSelectedStandard('c22_3_no1'); setSelectedTableId('c22_3_no1_table31'); setSearchQuery(''); }}
                        className={selectedTableId === 'c22_3_no1_table31' ? 'btn-primary' : 'btn-secondary'}
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Table 31 (Overload Factors)
                      </button>
                      <button
                        onClick={() => { setSelectedStandard('c22_3_60826'); setSelectedTableId('c22_3_60826_tableCA1'); setSearchQuery(''); }}
                        className={selectedTableId === 'c22_3_60826_tableCA1' ? 'btn-primary' : 'btn-secondary'}
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        60826 Table CA.1 (682 Weather Stations)
                      </button>
                      <button
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
                            background: 'rgba(255,255,255,0.05)',
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
                            background: isBookmarked('table', currentTable.id) ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.05)',
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
                          Referenced by Clauses ({currentTable.referencingClauses.length}):
                        </span>
                      </div>

                      {currentTable.referencingClauses.length === 0 ? (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          No explicit clause references registered.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {currentTable.referencingClauses.map((rc, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOpenClauseInSplitPane(rc.clauseNumber, currentTable.standardId)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                background: 'rgba(15, 23, 42, 0.6)',
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
            )}

            {/* ============================================================== */}
            {/* TAB 3: DEFINITIONS & GLOSSARY                                  */}
            {/* ============================================================== */}
            {activeTab === 'definitions' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {definitions.map((def) => (
                  <div 
                    key={def.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '1.25rem', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>
                          <HighlightMatches text={def.term} regex={highlightRegex} />
                        </span>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {def.type === 'abbreviation' ? 'Abbreviation' : 'Definition'}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.85rem' }}>
                        <HighlightMatches text={def.definition} regex={highlightRegex} />
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{def.standardName}</span>
                      <span>Clause {def.clauseNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: ADOPTED EDITIONS & SCOPE                               */}
            {/* ============================================================== */}
            {activeTab === 'editions' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {CSA_STANDARDS.filter(s => s.id !== 'all').map((ed) => (
                  <div key={ed.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.15rem' }}>
                        {ed.code}
                      </span>
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                        {ed.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {ed.title} (Edition: {ed.edition})
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {ed.id === 'c22_3_no1' && 'Covers overhead electric supply and communication facilities, vertical and horizontal clearances, crossing profiles, deterministic weather loadings (Heavy/Medium/Light), and structural strength capacity factors.'}
                      {ed.id === 'c22_3_60826' && 'Establishes reliability-based limit states design for transmission lines (50–500 yr return periods), dynamic wind pressure, radial ice accretion, combined wind & ice, security, and Canadian National Annexes CA & CB.'}
                      {ed.id === 'csa_o15' && 'Covers commercial wood pole species in Canada and North America (Western Red Cedar, Douglas Fir, Lodgepole Pine, Jack Pine, etc.), fiber stress, knot limitations, pole classes H6 to 8, and reinforcing stubs.'}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                      <div style={{ flex: '1', textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{ed.clauseCount}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Digitized Clauses</div>
                      </div>
                      <div style={{ flex: '1', textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>{ed.tableCount}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Digitized Tables</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right-hand Side-by-Side Companion Split-Pane Inspector (when active) */}
          {companionItem && (
            <CompanionSplitPane
              companionItem={companionItem}
              onClose={() => setCompanionItem(null)}
              onExpandToFullTab={handleJumpToTableFull}
              onJumpToClause={handleJumpToClauseFull}
              onJumpToTable={(tblId) => handleOpenTableInSplitPane(tblId)}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

        </div>
      )}

    </div>
  );
}
