import { ALL_TABLES, getClause, searchCodeRegistry } from './codeLibraryRegistry';
import type { CsaClause, CsaTable } from '../../types/csaCode';

export interface ResolvedCitation {
  type: 'table' | 'clause' | 'search';
  raw: string;
  standardId: string;
  table?: CsaTable | null;
  clause?: CsaClause | null;
  query: string;
}

export function detectStandardId(citation: string): string {
  const cit = String(citation || '');
  if (/c22\.?3\s*(?:no\.?\s*1|#1)/i.test(cit)) return 'c22_3_no1';
  if (/60826/i.test(cit)) return 'c22_3_60826';
  if (/o15/i.test(cit)) return 'csa_o15';
  if (/asce|10-15/i.test(cit)) return 'asce_10_15';
  if (/pls[- ]?cadd/i.test(cit)) return 'pls_cadd_lessons';
  return 'all';
}

/**
 * Resolves a human-readable engineering citation string (e.g. "CSA C22.3 No. 1 Table 2",
 * "CSA C22.3 No. 1 Cl. 5.3.1.1", "ASCE 10-15 Sec. 3.6", "CSA O15 Table 3")
 * to an exact digitized Table or Clause record, with fallback to search.
 */
export function resolveCitationReference(citation: string | null | undefined): ResolvedCitation | null {
  const cit = String(citation || '').trim();
  if (!cit) return null;

  const detectedStdId = detectStandardId(cit);

  // 1. Attempt Table match first (preferring matching standard when detected)
  const tableMatch = cit.match(/(?:table|tbl\.?)\s*([a-z0-9._-]+)/i);
  if (tableMatch) {
    const rawNum = tableMatch[1].replace(/[.,;:]+$/, '');
    const normalizedNum = rawNum.replace(/-/g, '.').toLowerCase();
    const candidates = (ALL_TABLES as unknown as CsaTable[]).filter((t) => {
      const tNum = String(t.number || '').toLowerCase().replace(/-/g, '.');
      const tKey = String(t.key || '').toLowerCase().replace(/-/g, '.');
      const tId = String(t.id || '').toLowerCase();
      return (
        tNum === `table ${normalizedNum}` ||
        tKey === `table${normalizedNum}` ||
        tKey === `table_${normalizedNum}` ||
        tId.endsWith(`_${normalizedNum}`) ||
        tId.includes(`table_${normalizedNum}`)
      );
    });

    const matchedTable =
      (detectedStdId !== 'all'
        ? candidates.find((t) => t.standardId === detectedStdId)
        : null) ||
      candidates[0] ||
      (ALL_TABLES as unknown as CsaTable[]).find((t) =>
        String(t.id || '').toLowerCase().includes(normalizedNum)
      ) ||
      null;

    if (matchedTable) {
      return {
        type: 'table',
        raw: cit,
        standardId: matchedTable.standardId,
        table: matchedTable,
        query: matchedTable.number
      };
    }
  }

  // 2. Attempt Clause / Section / Equation match
  const clauseMatch = cit.match(/(?:cl(?:ause|\.)?|sec(?:tion|\.)?|§)\s*([a-z0-9._-]+)/i);
  const rawClauseNum = clauseMatch ? clauseMatch[1].replace(/[.,;:]+$/, '') : null;

  let matchedClause: CsaClause | null = null;
  if (rawClauseNum) {
    matchedClause =
      getClause(detectedStdId, rawClauseNum) ||
      getClause('all', rawClauseNum);

    // Try progressive parent clause trim (e.g. 5.3.1.1 -> 5.3.1 -> 5.3)
    if (!matchedClause && rawClauseNum.includes('.')) {
      const parts = rawClauseNum.split('.');
      while (parts.length > 1 && !matchedClause) {
        parts.pop();
        const parentNum = parts.join('.');
        matchedClause =
          getClause(detectedStdId, parentNum) ||
          getClause('all', parentNum);
      }
    }
  }

  if (matchedClause) {
    return {
      type: 'clause',
      raw: cit,
      standardId: matchedClause.standardId,
      clause: matchedClause,
      query: matchedClause.clauseNumber
    };
  }

  // 3. Fallback search across code registry
  const fallback = searchCodeRegistry(rawClauseNum || cit, {
    standardId: detectedStdId,
    section: 'all'
  });

  if (fallback.clauses.length > 0) {
    const first = fallback.clauses[0];
    return {
      type: 'clause',
      raw: cit,
      standardId: first.standardId,
      clause: first,
      query: first.clauseNumber
    };
  }

  if (fallback.tables.length > 0) {
    const firstTable = fallback.tables[0];
    return {
      type: 'table',
      raw: cit,
      standardId: firstTable.standardId,
      table: firstTable,
      query: firstTable.number
    };
  }

  return {
    type: 'search',
    raw: cit,
    standardId: detectedStdId,
    query: cit
  };
}
