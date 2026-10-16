/**
 * CSA Digitized Code-as-Data Engine
 * Provides fully digitized, versioned, machine-readable repository for:
 * - CSA C22.3 No. 1 (503 clauses, 31 tables)
 * - CSA C22.3 No. 60826 (206 clauses, 47 tables, Canadian deviations)
 * - CSA O15 (86 clauses, 5 tables)
 * Total: 795 clauses, 83 tables, definitions, and bidirectional reverse references.
 */

import { CSA_C22_3_NO1_CLAUSES } from './clauses_c22_3_no1.js';
import { CSA_C22_3_60826_CLAUSES } from './clauses_c22_3_60826.js';
import { CSA_O15_CLAUSES } from './clauses_csa_o15.js';
import { CSA_ALL_TABLES, CSA_TABLES_MAP } from './tablesRegistry.js';
import { CSA_DEFINITIONS } from './definitionsRegistry.js';

export const ALL_CLAUSES = [
  ...CSA_C22_3_NO1_CLAUSES,
  ...CSA_C22_3_60826_CLAUSES,
  ...CSA_O15_CLAUSES
];

export const ALL_TABLES = CSA_ALL_TABLES;
export const TABLES_MAP = CSA_TABLES_MAP;
export const ALL_DEFINITIONS = CSA_DEFINITIONS;

export const CSA_STANDARDS = [
  {
    id: 'all',
    title: 'All CSA Standards (C22.3 No. 1, 60826, O15)',
    clauseCount: ALL_CLAUSES.length,
    tableCount: ALL_TABLES.length
  },
  {
    id: 'c22_3_no1',
    code: 'CSA C22.3 No. 1',
    edition: '2020',
    title: 'Overhead Systems',
    clauseCount: CSA_C22_3_NO1_CLAUSES.length,
    tableCount: 31,
    status: 'Adopted'
  },
  {
    id: 'c22_3_60826',
    code: 'CSA C22.3 No. 60826',
    edition: '2010 (R2020)',
    title: 'Design Criteria of Overhead Transmission Lines',
    clauseCount: CSA_C22_3_60826_CLAUSES.length,
    tableCount: 47,
    status: 'Adopted'
  },
  {
    id: 'csa_o15',
    code: 'CSA O15',
    edition: '2015 (R2020)',
    title: 'Wood Utility Poles and Reinforcing Stubs',
    clauseCount: CSA_O15_CLAUSES.length,
    tableCount: 5,
    status: 'Adopted'
  }
];

import { CSA_C22_3_NO1_TABLES_DATA } from '../c22_3_no1/index.js';
import { CSA_60826_TABLES } from '../c22_3_60826/index.js';
import {
  CSA_O15_KNOT_SIZES,
  CSA_O15_SPIRAL_GRAIN,
  CSA_O15_SPECIES,
  CSA_O15_POLE_CLASSES,
  CSA_O15_STUB_CLASSES
} from '../o15/index.js';

// Pre-index table search text for comprehensive table searching
const TABLE_SEARCH_CORPUS = new Map();

for (const t of CSA_ALL_TABLES) {
  const parts = [
    t.number || '',
    t.id || '',
    t.key || '',
    t.title || '',
    t.standardName || '',
    t.unit || ''
  ];

  if (t.notes) {
    parts.push(typeof t.notes === 'object' ? Object.values(t.notes).join(' ') : String(t.notes));
  }
  if (t.footnotes) {
    parts.push(typeof t.footnotes === 'object' ? Object.values(t.footnotes).join(' ') : String(t.footnotes));
  }
  if (t.referencingClauses && Array.isArray(t.referencingClauses)) {
    for (const rc of t.referencingClauses) {
      parts.push(rc.clauseNumber || '', rc.title || '');
    }
  }

  // Add structured table contents
  if (t.standardId === 'c22_3_no1') {
    const data = CSA_C22_3_NO1_TABLES_DATA[t.key];
    if (data) {
      if (Array.isArray(data.columns)) {
        parts.push(data.columns.map(c => `${c.id} ${c.label || ''}`).join(' '));
      }
      if (data.rows) {
        parts.push(JSON.stringify(data.rows));
        if (Array.isArray(data.rows)) {
          for (const r of data.rows) {
            if (r.grades && Array.isArray(r.grades)) {
              parts.push(r.grades.map(g => `Grade ${g.grade}`).join(' '));
            }
          }
        }
      }
    }
  } else if (t.standardId === 'c22_3_60826') {
    const data = CSA_60826_TABLES[t.number] || CSA_60826_TABLES[t.key];
    if (data && data.rows) {
      parts.push(JSON.stringify(data.rows));
    }
  } else if (t.standardId === 'csa_o15') {
    if (t.key === 'table1') parts.push(JSON.stringify(CSA_O15_KNOT_SIZES));
    else if (t.key === 'table2') parts.push(JSON.stringify(CSA_O15_SPIRAL_GRAIN));
    else if (t.key === 'table3') {
      parts.push(CSA_O15_SPECIES.map(s => `${s.commonName} ${s.speciesCode} ${s.fibreStressMpa} ${s.modulusOfElasticityMpa}`).join(' '));
    } else if (t.key === 'tableB1') {
      parts.push(CSA_O15_POLE_CLASSES.map(p => `Class ${p.class} ${p.loadKn} ${p.loadLbf} ${p.category}`).join(' '));
    } else if (t.key === 'tableC1') {
      parts.push(CSA_O15_STUB_CLASSES.map(s => `Stub ${s.stubClass} ${s.momentKnM}`).join(' '));
    }
  }

  TABLE_SEARCH_CORPUS.set(t.id, parts.join(' ').toLowerCase());
}

// Canadian / US engineering spelling normalization
const SPELLING_SYNONYMS = {
  fiber: ['fiber', 'fibre'],
  fibre: ['fiber', 'fibre'],
  center: ['center', 'centre'],
  centre: ['center', 'centre'],
  color: ['color', 'colour'],
  colour: ['color', 'colour'],
  traveled: ['traveled', 'travelled'],
  travelled: ['traveled', 'travelled'],
  canceled: ['canceled', 'cancelled'],
  cancelled: ['canceled', 'cancelled'],
  aluminum: ['aluminum', 'aluminium'],
  aluminium: ['aluminum', 'aluminium']
};

function getTermVariants(term) {
  const lower = term.toLowerCase();
  const variants = [lower];
  if (SPELLING_SYNONYMS[lower]) {
    for (const syn of SPELLING_SYNONYMS[lower]) {
      if (!variants.includes(syn)) variants.push(syn);
    }
  }
  return variants;
}

function parseSearchQuery(query) {
  const raw = String(query || '').trim();
  if (!raw) return { raw: '', lower: '', tokens: [], targetClause: null, targetClauseRange: null, targetTable: null, standardHint: null };

  // Normalize Unicode dashes and standard abbreviation patterns
  const normalized = raw
    .replace(/[\u2013\u2014–—]/g, '-')
    .replace(/can\/csa[- ]c22\.?3/gi, 'c22.3')
    .replace(/c22\.?3[- ]no\.?[- ]?1(?::\d+)?/gi, 'c22.3 no 1')
    .replace(/c22\.?3[- ](?:no\.?[- ]?)?60826(?:-\d+)?/gi, '60826');

  const lower = normalized.toLowerCase();

  // Detect standard hint
  let standardHint = null;
  if (/c22\.?3\s*(?:no\.?\s*1\b|#1\b|no\s*1\b)/i.test(lower)) {
    standardHint = 'c22_3_no1';
  } else if (/60826\b|transmission design criteria/i.test(lower)) {
    standardHint = 'c22_3_60826';
  } else if (/\bo15\b|csa[- ]o15|wood utility poles/i.test(lower)) {
    standardHint = 'csa_o15';
  }

  // Detect clause range: e.g. "Clauses 6.2-6.4", "Clauses 6.2 to 6.4", "Cl. 6.2-6.4"
  let targetClauseRange = null;
  const rangeMatch = lower.match(/(?:clauses?|cls?\.?)\s*([a-z0-9\.]+)\s*(?:-|to)\s*([a-z0-9\.]+)/i);
  if (rangeMatch) {
    targetClauseRange = { start: rangeMatch[1], end: rangeMatch[2] };
  }

  // Detect single clause reference: e.g. "Cl. 5.3.1.1", "Clause 5.3.1", "5.3.1.1", "A.5.2.7"
  let targetClause = null;
  if (!targetClauseRange) {
    const clauseMatch = lower.match(/(?:cl(?:ause|\.)?)\s*([a-z0-9\._-]+)/i);
    if (clauseMatch) {
      targetClause = clauseMatch[1].replace(/[-_]/g, '.').toLowerCase();
    } else if (/^(?:annex\s+)?([a-z]\.[0-9]+(?:\.[0-9]+)*)$/i.test(lower)) {
      const m = lower.match(/^(?:annex\s+)?([a-z]\.[0-9]+(?:\.[0-9]+)*)$/i);
      targetClause = m[1].toLowerCase();
    } else if (/^[0-9]+(?:\.[0-9]+)*(?:[a-z])?$/i.test(lower)) {
      targetClause = lower;
    }
  }

  // Detect table reference: e.g. "Table 2", "Table CA.1", "Table CA-1", "Table 31", "tbl 31"
  let targetTable = null;
  const tableMatch = lower.match(/(?:table|tbl|tab\.?)\s*([a-z0-9\._-]+)/i);
  if (tableMatch) {
    targetTable = tableMatch[1].replace(/-/g, '.').toLowerCase();
  } else if (/^table\s+([a-z0-9\._-]+)$/i.test(lower)) {
    targetTable = lower.replace(/^table\s+/, '').replace(/-/g, '.');
  }

  // Clean tokens (strip punctuation, exclude standard name noise and common stop words if other tokens exist)
  const stripped = lower
    .replace(/(?:can\/)?csa[- ]c22\.?3[- ]no\.?[- ]?1(?::\d+)?/gi, ' ')
    .replace(/(?:can\/)?csa[- ]c22\.?3[- ](?:no\.?[- ]?)?60826(?:-\d+)?/gi, ' ')
    .replace(/(?:can\/)?csa[- ]o15(?:-\d+)?/gi, ' ')
    .replace(/[,\(\)\[\]"';:]/g, ' ');

  const rawTokens = stripped
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);

  const stopWords = new Set(['in', 'of', 'for', 'and', 'the', 'a', 'to', 'with', 'by', 'clauses', 'clause', 'cl', 'edition', 'row']);
  const meaningfulTokens = rawTokens.filter(t => !stopWords.has(t));
  const tokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

  return { raw, lower, tokens, targetClause, targetClauseRange, targetTable, standardHint };
}

/**
 * Get distinct sections for a standard or all standards, sorted alphabetically per project rules
 */
export function getStandardSections(standardId = 'all') {
  const clauses = standardId === 'all' 
    ? ALL_CLAUSES 
    : ALL_CLAUSES.filter(c => c.standardId === standardId);
  const sections = new Set();
  clauses.forEach(c => {
    if (c.section) sections.add(c.section);
  });
  return Array.from(sections).sort((a, b) => a.localeCompare(b));
}

/**
 * Search across clauses, tables, and definitions
 */
export function searchDigitizedCode(query = '', filters = {}) {
  const { standardId = 'all', section = 'all', activeTab = 'clauses' } = filters;
  const { raw, lower, tokens, targetClause, targetClauseRange, targetTable, standardHint } = parseSearchQuery(query);

  const effectiveStandard = standardId !== 'all' ? standardId : (standardHint || 'all');

  // 1. FILTER CLAUSES
  let clauseCandidates = ALL_CLAUSES;
  if (effectiveStandard !== 'all') {
    clauseCandidates = clauseCandidates.filter(c => c.standardId === effectiveStandard);
  }

  // Diagnostic: crossSectionClauseCount if a section is active
  let crossSectionClauseCount = 0;

  let filteredClauses = clauseCandidates;
  if (section !== 'all') {
    filteredClauses = filteredClauses.filter(c => c.section === section);
  }

  if (targetClauseRange) {
    const startVal = parseFloat(targetClauseRange.start);
    const endVal = parseFloat(targetClauseRange.end);
    const minVal = Math.min(startVal, endVal);
    const maxVal = Math.max(startVal, endVal);

    filteredClauses = filteredClauses.filter(c => {
      const cVal = parseFloat(c.clauseNumber);
      if (!isNaN(cVal)) {
        return cVal >= minVal && cVal <= maxVal + 0.999;
      }
      return false;
    });
  } else if (tokens.length > 0) {
    const scored = [];

    for (const c of filteredClauses) {
      let score = 0;
      const cNum = c.clauseNumber.toLowerCase();
      const cTitle = c.title.toLowerCase();
      const cText = c.text.toLowerCase();
      const cSec = (c.section || '').toLowerCase();
      const cStd = c.standardName.toLowerCase();
      const cDev = (c.canadianDeviation || '').toLowerCase();
      const cRefs = (c.crossReferences || []).join(' ').toLowerCase();
      const cTables = (c.tablesReferenced || []).map(t => `${t.tableNumber} ${t.title}`).join(' ').toLowerCase();

      // Check target clause matching
      if (targetClause) {
        if (cNum === targetClause) {
          score += 3000;
        } else if (cNum.startsWith(targetClause + '.')) {
          score += 1500;
        } else if (cNum.startsWith(targetClause)) {
          score += 900;
        } else if (cNum.includes(targetClause)) {
          score += 400;
        }
      }

      // Check exact phrase matching
      if (lower.length > 2) {
        if (cTitle.includes(lower)) score += 400;
        if (cText.includes(lower)) score += 150;
        if (cDev.includes(lower)) score += 100;
        if (cTables.includes(lower)) score += 100;
      }

      // Check all tokens
      const corpus = `${cNum} ${cTitle} ${cText} ${cSec} ${cStd} ${cDev} ${cRefs} ${cTables}`;
      let allTokensMatch = true;

      for (const token of tokens) {
        const variants = getTermVariants(token);
        const tokenMatches = variants.some(v => corpus.includes(v));
        if (!tokenMatches) {
          allTokensMatch = false;
          break;
        }
        // Score bonus per token - prioritize Title and Number heavily
        if (variants.some(v => cTitle.includes(v))) score += 60;
        if (variants.some(v => cNum.includes(v))) score += 80;
        if (variants.some(v => cText.includes(v))) score += 8;
        if (variants.some(v => cDev.includes(v))) score += 10;
      }

      if (allTokensMatch || score >= 400) {
        scored.push({ clause: c, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    filteredClauses = scored.map(s => s.clause);

    // Compute crossSectionClauseCount if section filter is active
    if (section !== 'all') {
      let crossMatches = 0;
      for (const c of clauseCandidates) {
        if (c.section === section) continue;
        const cNum = c.clauseNumber.toLowerCase();
        const cTitle = c.title.toLowerCase();
        const cText = c.text.toLowerCase();
        const cDev = (c.canadianDeviation || '').toLowerCase();
        const cTables = (c.tablesReferenced || []).map(t => `${t.tableNumber} ${t.title}`).join(' ').toLowerCase();
        const corpus = `${cNum} ${cTitle} ${cText} ${cDev} ${cTables}`;

        let matches = true;
        if (targetClause && (cNum === targetClause || cNum.startsWith(targetClause))) {
          crossMatches++;
          continue;
        }
        for (const token of tokens) {
          const variants = getTermVariants(token);
          if (!variants.some(v => corpus.includes(v))) {
            matches = false;
            break;
          }
        }
        if (matches) crossMatches++;
      }
      crossSectionClauseCount = crossMatches;
    }
  }



  // 2. FILTER TABLES
  let tableCandidates = ALL_TABLES;
  if (effectiveStandard !== 'all') {
    tableCandidates = tableCandidates.filter(t => t.standardId === effectiveStandard);
  }

  let filteredTables = tableCandidates;
  if (tokens.length > 0) {
    const scoredTables = [];

    for (const t of tableCandidates) {
      let score = 0;
      const tNum = t.number.toLowerCase().replace(/-/g, '.');
      const tId = t.id.toLowerCase();
      const tKey = t.key.toLowerCase();
      const tTitle = t.title.toLowerCase();
      const corpus = TABLE_SEARCH_CORPUS.get(t.id) || '';

      // Check target table
      if (targetTable) {
        const normTarget = targetTable.replace(/^table\s+/, '').replace(/-/g, '.');
        const normTNum = tNum.replace(/^table\s+/, '').replace(/-/g, '.');
        if (normTNum === normTarget) {
          score += 2500;
        } else if (normTNum.startsWith(normTarget + '.') || normTNum.startsWith(normTarget + ' ')) {
          score += 1500;
        } else if (tKey === `table${normTarget}` || tKey === normTarget || tId.endsWith(`table${normTarget}`)) {
          score += 1000;
        }

        // When user explicitly searches for a table number (e.g. "Table 31"), require matching that table number
        if (score > 0) {
          scoredTables.push({ table: t, score });
        }
        continue;
      }

      // Check exact query in title or number
      if (lower.length > 2) {
        if (tNum.includes(lower)) score += 500;
        if (tTitle.includes(lower)) score += 250;
      }

      // Check tokens
      let allTokensMatch = true;
      for (const token of tokens) {
        const variants = getTermVariants(token);
        const matchesToken = variants.some(v => corpus.includes(v));
        if (!matchesToken) {
          allTokensMatch = false;
          break;
        }
        if (variants.some(v => tTitle.includes(v))) score += 60;
        if (variants.some(v => tNum.includes(v))) score += 80;
      }

      if (allTokensMatch || score >= 500) {
        scoredTables.push({ table: t, score });
      }
    }

    scoredTables.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.table.number.localeCompare(b.table.number, undefined, { numeric: true });
    });
    filteredTables = scoredTables.map(s => s.table);
  }

  // 3. FILTER DEFINITIONS
  let defCandidates = ALL_DEFINITIONS;
  if (effectiveStandard !== 'all') {
    defCandidates = defCandidates.filter(d => d.standardId === effectiveStandard);
  }

  let filteredDefinitions = defCandidates;
  if (tokens.length > 0) {
    const scoredDefs = [];

    for (const d of defCandidates) {
      let score = 0;
      const dTerm = d.term.toLowerCase();
      const dDef = d.definition.toLowerCase();
      const dStd = d.standardName.toLowerCase();
      const dNum = (d.clauseNumber || '').toLowerCase();
      const corpus = `${dTerm} ${dDef} ${dStd} ${dNum}`;

      // Exact term match
      if (dTerm === lower) {
        score += 3000;
      } else if (dTerm.startsWith(lower)) {
        score += 1500;
      } else if (dTerm.includes(lower)) {
        score += 600;
      } else if (dDef.includes(lower)) {
        score += 200;
      }

      let allTokensMatch = true;
      for (const token of tokens) {
        const variants = getTermVariants(token);
        const matchesToken = variants.some(v => corpus.includes(v));
        if (!matchesToken) {
          allTokensMatch = false;
          break;
        }
        if (variants.some(v => dTerm.includes(v))) score += 80;
        if (variants.some(v => dDef.includes(v))) score += 20;
      }

      if (allTokensMatch || score >= 600) {
        scoredDefs.push({ def: d, score });
      }
    }

    scoredDefs.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.def.term.localeCompare(b.def.term);
    });
    filteredDefinitions = scoredDefs.map(s => s.def);
  }

  return {
    clauses: filteredClauses,
    tables: filteredTables,
    definitions: filteredDefinitions,
    totalCounts: {
      clauses: filteredClauses.length,
      tables: filteredTables.length,
      definitions: filteredDefinitions.length
    },
    crossSectionClauseCount
  };
}

/**
 * Get a specific clause by standardId and clauseNumber
 */
export function getClause(standardId, clauseNumber) {
  if (!clauseNumber) return null;
  const num = String(clauseNumber).trim();
  return ALL_CLAUSES.find(c => 
    (!standardId || standardId === 'all' || c.standardId === standardId) &&
    c.clauseNumber === num
  ) || null;
}

/**
 * Get a specific table by ID or table number
 */
export function getTable(tableIdOrNumber, standardId = 'all') {
  if (!tableIdOrNumber) return null;
  const key = String(tableIdOrNumber).trim();
  if (TABLES_MAP[key]) return TABLES_MAP[key];

  return ALL_TABLES.find(t =>
    (!standardId || standardId === 'all' || t.standardId === standardId) &&
    (t.id === key || t.key === key || t.number.toLowerCase() === key.toLowerCase())
  ) || null;
}
