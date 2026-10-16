/**
 * Code-as-Data Library Registry
 * Conforms to §8 of CSA C22.3 Digital Code & Design App Plan.
 * Provides a unified, high-performance, queryable registry of:
 * - CSA C22.3 No. 1 (Overhead Systems - 500 clauses, 31 tables)
 * - CSA C22.3 No. 60826 (Design Criteria - 206 clauses, 47 tables, Canadian deviations)
 * - CSA O15 (Wood Utility Poles - 86 clauses, 5 tables)
 * - PLS-CADD Lessons Learned (14 interactive engineering dialogues & technical lessons)
 * Total: 806 digitized clauses & lessons, 83 digitized tables, and 183 glossary terms & abbreviations.
 */

import {
  ALL_CLAUSES as CSA_ALL_CLAUSES,
  ALL_TABLES,
  TABLES_MAP,
  ALL_DEFINITIONS,
  CSA_STANDARDS,
  getStandardSections as getCsaStandardSections,
  searchDigitizedCode,
  getClause as getCsaClause,
  getTable
} from '../../data/csa/digitized/index.js';

import {
  PLS_BOOK_META,
  PLS_LESSONS,
  PLS_SECTIONS,
  getLesson,
  searchLessons
} from '../../data/lessons/plsCaddLessons.js';

export {
  ALL_TABLES,
  TABLES_MAP,
  ALL_DEFINITIONS,
  CSA_STANDARDS,
  getTable,
  PLS_BOOK_META,
  PLS_LESSONS,
  PLS_SECTIONS,
  getLesson,
  searchLessons
};

// Re-export core CSA clauses directly for tests asserting exact 792 CSA clause count
export const ALL_CLAUSES = CSA_ALL_CLAUSES;

/**
 * Format a PLS lesson into a clause-compatible object for unified reader / search views
 */
export function formatLessonAsClause(lesson) {
  if (!lesson) return null;
  return {
    id: lesson.id,
    clauseNumber: lesson.clauseNumber,
    title: lesson.title,
    text: lesson.dialogue.map(d => `${d.name} (${d.role}):\n${d.text}`).join('\n\n'),
    section: lesson.section,
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    isLesson: true,
    lesson,
    tablesReferenced: [],
    crossReferences: lesson.csaCitations || []
  };
}

export const ALL_LESSON_CLAUSES = PLS_LESSONS.map(formatLessonAsClause);

/**
 * All books available in the Reference Library Hall
 */
export const ALL_LIBRARY_BOOKS = [
  ...CSA_STANDARDS.filter(s => s.id !== 'all'),
  PLS_BOOK_META
];

export const CODE_EDITIONS = ALL_LIBRARY_BOOKS.map(s => ({
  id: s.id,
  standard: s.code,
  edition: s.edition,
  title: s.title,
  status: s.status || 'VERIFIED',
  scope: s.id === 'c22_3_no1' 
    ? 'Deterministic loading, clearances, separations, strength (OCFs), joint use.'
    : s.id === 'c22_3_60826'
    ? 'Reliability-based loading (wind, ice, combined), security, safety, Canadian annex.'
    : s.id === 'csa_o15'
    ? 'Pole classes, species, designated fiber stresses, dimensional tables.'
    : 'Drafting, AutoSag, Non-Linear FEA, Guy Mechanics, CSA Clearances, and Line Automation.',
  clauseCount: s.clauseCount,
  tableCount: s.tableCount
}));

export const CORE_CLAUSES = CSA_ALL_CLAUSES;
export const REGISTERED_TABLES = ALL_TABLES;

/**
 * Get distinct sections for a standard or all standards, sorted alphabetically per project rules
 */
export function getStandardSections(standardId = 'all') {
  if (standardId === 'pls_cadd_lessons') {
    return [...PLS_SECTIONS].sort((a, b) => a.localeCompare(b));
  }
  return getCsaStandardSections(standardId);
}

/**
 * Unified clause lookup handling CSA clauses and PLS lessons
 */
export function getClause(standardId = 'all', clauseNumber = '') {
  if (standardId === 'pls_cadd_lessons' || String(clauseNumber).startsWith('pls_lesson_')) {
    const lesson = getLesson(clauseNumber);
    return lesson ? formatLessonAsClause(lesson) : null;
  }
  const csaCl = getCsaClause(standardId, clauseNumber);
  if (csaCl) return csaCl;

  if (standardId === 'all') {
    const lesson = getLesson(clauseNumber);
    if (lesson) return formatLessonAsClause(lesson);
  }
  return null;
}

/**
 * Unified queryable search across CSA standards and PLS-CADD lessons
 */
export function searchCodeRegistry(query = '', filters = {}) {
  const { standardId = 'all', section = 'all' } = filters;

  if (standardId === 'pls_cadd_lessons') {
    let matchedLessons = searchLessons(query);
    if (section !== 'all') {
      matchedLessons = matchedLessons.filter(l => l.section === section);
    }
    const clauses = matchedLessons.map(formatLessonAsClause);
    return {
      clauses,
      tables: [],
      definitions: [],
      totalCounts: {
        clauses: clauses.length,
        tables: 0,
        definitions: 0
      },
      crossSectionClauseCount: 0
    };
  }

  const result = searchDigitizedCode(query, filters);

  // If searching across all standards and query is present, include matched PLS lessons
  let combinedClauses = result.clauses;
  if (standardId === 'all' && query.trim()) {
    const matchedLessons = searchLessons(query).map(formatLessonAsClause);
    if (matchedLessons.length > 0) {
      combinedClauses = [...result.clauses, ...matchedLessons];
    }
  }

  return {
    clauses: combinedClauses,
    tables: result.tables,
    definitions: result.definitions,
    totalCounts: {
      ...result.totalCounts,
      clauses: combinedClauses.length
    },
    crossSectionClauseCount: result.crossSectionClauseCount || 0
  };
}
