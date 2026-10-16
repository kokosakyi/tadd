import fs from 'fs';
import path from 'path';

async function generateDigitizedDatabase() {
  console.log('--- Starting CSA Code Digitization Pipeline ---');

  const outDir = 'src/data/csa/digitized';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Read source clause JSONs
  const no1Json = JSON.parse(fs.readFileSync('sandbox/csa_c22_1_clauses.json', 'utf8'));
  const sixJson = JSON.parse(fs.readFileSync('sandbox/csa_60826_clauses.json', 'utf8'));
  const o15Json = JSON.parse(fs.readFileSync('sandbox/csa_o15_clauses.json', 'utf8'));

  // Table Key normalizer
  function normalizeTableKey(std, str) {
    if (!str) return null;
    const clean = str.replace(/Table\s*/i, '').replace(/[\.\s]/g, '').toUpperCase();
    if (std === 'c22_3_no1') {
      const num = parseInt(clean, 10);
      if (!isNaN(num) && num >= 1 && num <= 31) return `table${num}`;
    } else if (std === 'c22_3_60826') {
      if (clean.startsWith('CA')) return `tableCA${clean.replace('CA', '')}`;
      if (clean.startsWith('CB')) return `tableCB${clean.replace('CB', '')}`;
      if (clean.startsWith('A')) return `tableA${clean.replace('A', '')}`;
      if (clean.startsWith('B')) return `tableB${clean.replace('B', '')}`;
      if (clean.startsWith('C')) return `tableC${clean.replace('C', '')}`;
      const num = parseInt(clean, 10);
      if (!isNaN(num) && num >= 1 && num <= 20) return `table${num}`;
    } else if (std === 'csa_o15') {
      if (clean.startsWith('B')) return `tableB1`;
      if (clean.startsWith('C')) return `tableC1`;
      const num = parseInt(clean, 10);
      if (!isNaN(num) && num >= 1 && num <= 3) return `table${num}`;
    }
    return null;
  }

  // 2. Discover all 83 tables
  const allTablesMap = {};

  // C22.3 No. 1 tables (31)
  for (let i = 1; i <= 31; i++) {
    const mod = await import(`../src/data/csa/c22_3_no1/table${i}.js`);
    const metaKey = Object.keys(mod).find(k => k.endsWith('_META'));
    const meta = metaKey ? mod[metaKey] : {};
    const tableId = `c22_3_no1_table${i}`;
    allTablesMap[tableId] = {
      id: tableId,
      key: `table${i}`,
      standardId: 'c22_3_no1',
      standardName: 'CSA C22.3 No. 1',
      edition: '2020',
      number: `Table ${i}`,
      title: meta.title || `Table ${i}`,
      unit: meta.unit || '',
      evaluatedAt: meta.evaluatedAt || null,
      explicitRefs: meta.references || [],
      notes: meta.notes || null,
      footnotes: meta.footnotes || meta.columnFootnote || null,
      referencingClauses: []
    };
  }

  // C22.3 No. 60826 tables (47)
  const sixFiles = fs.readdirSync('src/data/csa/c22_3_60826').filter(f => f.startsWith('table'));
  for (const f of sixFiles) {
    const key = f.replace('.js', '');
    const mod = await import(`../src/data/csa/c22_3_60826/${f}`);
    const metaKey = Object.keys(mod).find(k => k.endsWith('_META'));
    const meta = metaKey ? mod[metaKey] : {};
    const tableId = `c22_3_60826_${key}`;
    const displayNum = key.replace('table', 'Table ')
      .replace('Table CA', 'Table CA.')
      .replace('Table CB', 'Table CB.')
      .replace(/Table ([ABC])(\d+)/, 'Table $1.$2');
    allTablesMap[tableId] = {
      id: tableId,
      key,
      standardId: 'c22_3_60826',
      standardName: 'CSA C22.3 No. 60826',
      edition: '2010 (R2020)',
      number: displayNum,
      title: meta.title || displayNum,
      unit: meta.unit || '',
      explicitRefs: meta.references || [],
      notes: meta.notes || null,
      footnotes: meta.footnotes || null,
      referencingClauses: []
    };
  }

  // CSA O15 tables (5)
  const o15Files = fs.readdirSync('src/data/csa/o15').filter(f => f.startsWith('table'));
  for (const f of o15Files) {
    const key = f.replace('.js', '');
    const mod = await import(`../src/data/csa/o15/${f}`);
    const metaKey = Object.keys(mod).find(k => k.endsWith('_META'));
    const meta = metaKey ? mod[metaKey] : {};
    const tableId = `csa_o15_${key}`;
    const displayNum = key.replace('table', 'Table ')
      .replace(/Table ([BC])(\d+)/, 'Table $1.$2');
    allTablesMap[tableId] = {
      id: tableId,
      key,
      standardId: 'csa_o15',
      standardName: 'CSA O15',
      edition: '2015 (R2020)',
      number: displayNum,
      title: meta.title || displayNum,
      unit: meta.unit || '',
      explicitRefs: meta.references || [],
      notes: meta.notes || null,
      footnotes: null,
      referencingClauses: []
    };
  }

  console.log(`Discovered and mapped ${Object.keys(allTablesMap).length} tables.`);

  // 3. Process Clauses and compute bidirectional linkages
  function processClauses(jsonList, stdId, stdName, edition) {
    return jsonList.map(item => {
      const cid = item.clause_id;
      const id = `${stdId}_cl_${cid.replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Normalize section name
      let section = item.section || 'General';
      if (stdId === 'c22_3_60826') {
        if (cid.startsWith('A.') || cid.startsWith('A1') || cid === 'A') section = 'Annex A (Climatic Data)';
        else if (cid.startsWith('B.') || cid === 'B') section = 'Annex B (Soil & Foundations)';
        else if (cid.startsWith('C.') || cid === 'C') section = 'Annex C (Conductor Properties)';
        else if (cid.startsWith('CA.') || cid.startsWith('CA')) section = 'Annex CA (Canadian Weather Data)';
        else if (cid.startsWith('CB.') || cid.startsWith('CB')) section = 'Annex CB (Canadian Topography)';
      }

      // Title cleanup
      let title = item.title ? item.title.trim() : '';
      if (!title) {
        // extract first meaningful sentence fragment
        const firstLine = item.text.split(/[\.\n]/)[0].trim();
        if (firstLine.length > 5 && firstLine.length < 80) {
          title = firstLine;
        } else {
          title = `${section} — Clause ${cid}`;
        }
      }

      // Find all referenced tables
      const matchedTableIds = new Set();
      (item.tables_referenced || []).forEach(tr => {
        const k = normalizeTableKey(stdId, tr);
        if (k && allTablesMap[`${stdId}_${k}`]) {
          matchedTableIds.add(`${stdId}_${k}`);
        }
      });
      // Scan text for table citations
      const textMatches = item.text.match(/Table\s+([A-Za-z0-9\.]+)/gi);
      if (textMatches) {
        textMatches.forEach(tm => {
          const k = normalizeTableKey(stdId, tm);
          if (k && allTablesMap[`${stdId}_${k}`]) {
            matchedTableIds.add(`${stdId}_${k}`);
          }
        });
      }

      const tablesReferenced = Array.from(matchedTableIds).map(tId => {
        const tbl = allTablesMap[tId];
        return {
          tableId: tId,
          tableNumber: tbl.number,
          title: tbl.title,
          standardId: tbl.standardId
        };
      });

      // Register reverse link on table
      matchedTableIds.forEach(tId => {
        const tbl = allTablesMap[tId];
        if (tbl && !tbl.referencingClauses.some(rc => rc.clauseNumber === cid)) {
          tbl.referencingClauses.push({
            clauseId: id,
            clauseNumber: cid,
            title,
            section,
            standardId: stdId
          });
        }
      });

      return {
        id,
        standardId: stdId,
        standardName: stdName,
        edition,
        clauseNumber: cid,
        title,
        section,
        page: item.page_start || 0,
        text: item.text,
        tablesReferenced,
        crossReferences: item.cross_references || [],
        canadianDeviation: item.canadian_deviation || null
      };
    });
  }

  const no1Clauses = processClauses(no1Json.clause_list, 'c22_3_no1', 'CSA C22.3 No. 1', '2020');
  const sixClauses = processClauses(sixJson.clause_list, 'c22_3_60826', 'CSA C22.3 No. 60826', '2010 (R2020)');
  const o15Clauses = processClauses(o15Json.clause_list, 'csa_o15', 'CSA O15', '2015 (R2020)');

  // Also add any explicit table references from table metadata that weren't caught in clause text
  Object.values(allTablesMap).forEach(tbl => {
    tbl.explicitRefs.forEach(ref => {
      const clNum = ref.replace(/Clause\s*/i, '').trim();
      if (!clNum.startsWith('Table') && !tbl.referencingClauses.some(rc => rc.clauseNumber === clNum)) {
        // Find matching clause
        let matchedCl = null;
        if (tbl.standardId === 'c22_3_no1') matchedCl = no1Clauses.find(c => c.clauseNumber === clNum);
        else if (tbl.standardId === 'c22_3_60826') matchedCl = sixClauses.find(c => c.clauseNumber === clNum);
        else if (tbl.standardId === 'csa_o15') matchedCl = o15Clauses.find(c => c.clauseNumber === clNum);

        tbl.referencingClauses.push({
          clauseId: matchedCl ? matchedCl.id : `${tbl.standardId}_cl_${clNum.replace(/[^a-zA-Z0-9]/g, '_')}`,
          clauseNumber: clNum,
          title: matchedCl ? matchedCl.title : `Clause ${clNum}`,
          section: matchedCl ? matchedCl.section : 'Normative Clause',
          standardId: tbl.standardId
        });

        // Also add table to that clause's tablesReferenced if found
        if (matchedCl && !matchedCl.tablesReferenced.some(t => t.tableId === tbl.id)) {
          matchedCl.tablesReferenced.push({
            tableId: tbl.id,
            tableNumber: tbl.number,
            title: tbl.title,
            standardId: tbl.standardId
          });
        }
      }
    });
  });

  // Sort referencingClauses on every table using localeCompare
  Object.values(allTablesMap).forEach(tbl => {
    tbl.referencingClauses.sort((a, b) => a.clauseNumber.localeCompare(b.clauseNumber, undefined, { numeric: true }));
  });

  console.log(`Processed clauses: No1=${no1Clauses.length}, 60826=${sixClauses.length}, O15=${o15Clauses.length}. Total=${no1Clauses.length + sixClauses.length + o15Clauses.length}`);

  // 4. Process Definitions and Abbreviations
  const definitionsList = [];

  // Parse C22.3 No. 1 Clause 3.1 definitions text
  const c31 = no1Clauses.find(c => c.clauseNumber === '3.1');
  if (c31 && c31.text) {
    const rawDefParts = c31.text.replace('The following definitions shall apply in this Standard:', '').split(/(?<=[a-zA-Z\)])\s*—\s*/);
    let currentTerm = '';
    for (let i = 0; i < rawDefParts.length; i++) {
      const part = rawDefParts[i].trim();
      if (i === 0) {
        currentTerm = part;
      } else {
        const nextWords = part.split(/\s+/);
        // last 1-4 words might be the next term if capitalized or hyphenated
        // Let's do a regex split on '\n' or Capitalized term followed by em-dash or dash
      }
    }
    // Alternatively, let's extract by regex for "Term — definition"
    const defMatches = c31.text.matchAll(/([A-Z][a-zA-Z0-9\s\(\)\/\-,]+?)\s+[—–-]\s+([^—–]+?)(?=(?:[A-Z][a-zA-Z0-9\s\(\)\/\-,]{2,40}\s+[—–-]\s+)|$)/gs);
    for (const m of defMatches) {
      const term = m[1].replace('The following definitions shall apply in this Standard:', '').trim();
      const def = m[2].trim();
      if (term.length > 1 && term.length < 80 && def.length > 5) {
        definitionsList.push({
          id: `def_no1_${term.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          term,
          definition: def,
          standardId: 'c22_3_no1',
          standardName: 'CSA C22.3 No. 1',
          clauseNumber: '3.1',
          type: 'definition'
        });
      }
    }
  }

  // Parse C22.3 No. 1 Clause 3.2 abbreviations
  const c32 = no1Clauses.find(c => c.clauseNumber === '3.2');
  if (c32 && c32.text) {
    const abbrMatches = c32.text.matchAll(/([A-Z0-9]{2,8})\s+[\—\–\-I\s]+\s+([^A-Z\n]+?)(?=(?:[A-Z0-9]{2,8}\s+[\—\–\-I\s]+\s+)|4 General|$)/g);
    for (const m of abbrMatches) {
      const term = m[1].trim();
      const def = m[2].replace(/[I\—\–]/g, '').trim();
      if (term.length >= 2 && def.length >= 3) {
        definitionsList.push({
          id: `abbr_no1_${term.toLowerCase()}`,
          term,
          definition: def,
          standardId: 'c22_3_no1',
          standardName: 'CSA C22.3 No. 1',
          clauseNumber: '3.2',
          type: 'abbreviation'
        });
      }
    }
  }

  // 60826 Definitions
  if (sixJson.definitions) {
    Object.entries(sixJson.definitions).forEach(([cid, val]) => {
      const termMatch = (val.definition || '').match(/^([a-z\s\(\)]+)\s+(state|value|limit|condition|characteristic|strength|load|stress|probability|ratio|factor|angle|force|displacement)/i);
      let term = val.title || cid;
      let defText = val.definition || '';
      if (val.canadian_deviation) {
        defText += `\n[Canadian Deviation]: ${val.canadian_deviation}`;
      }
      definitionsList.push({
        id: `def_60826_${cid.replace(/[^a-zA-Z0-9]/g, '_')}`,
        term: val.title ? `${val.title} (${cid})` : `Clause ${cid} Definition`,
        definition: defText,
        standardId: 'c22_3_60826',
        standardName: 'CSA C22.3 No. 60826',
        clauseNumber: cid,
        canadianDeviation: val.canadian_deviation || null,
        type: 'definition'
      });
    });
  }

  // O15 Definitions
  if (o15Json.definitions) {
    Object.entries(o15Json.definitions).forEach(([term, def]) => {
      definitionsList.push({
        id: `def_o15_${term.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        term,
        definition: typeof def === 'string' ? def : JSON.stringify(def),
        standardId: 'csa_o15',
        standardName: 'CSA O15',
        clauseNumber: '3',
        type: 'definition'
      });
    });
  }

  // Sort definitions alphabetically per project rule
  definitionsList.sort((a, b) => a.term.localeCompare(b.term));

  console.log(`Extracted ${definitionsList.length} glossary definitions and abbreviations.`);

  // 5. Write out compiled modules
  fs.writeFileSync(
    path.join(outDir, 'clauses_c22_3_no1.js'),
    `export const CSA_C22_3_NO1_CLAUSES = ${JSON.stringify(no1Clauses, null, 2)};\n`,
    'utf8'
  );

  fs.writeFileSync(
    path.join(outDir, 'clauses_c22_3_60826.js'),
    `export const CSA_C22_3_60826_CLAUSES = ${JSON.stringify(sixClauses, null, 2)};\n`,
    'utf8'
  );

  fs.writeFileSync(
    path.join(outDir, 'clauses_csa_o15.js'),
    `export const CSA_O15_CLAUSES = ${JSON.stringify(o15Clauses, null, 2)};\n`,
    'utf8'
  );

  fs.writeFileSync(
    path.join(outDir, 'tablesRegistry.js'),
    `export const CSA_ALL_TABLES = ${JSON.stringify(Object.values(allTablesMap), null, 2)};\n` +
    `export const CSA_TABLES_MAP = ${JSON.stringify(allTablesMap, null, 2)};\n`,
    'utf8'
  );

  fs.writeFileSync(
    path.join(outDir, 'definitionsRegistry.js'),
    `export const CSA_DEFINITIONS = ${JSON.stringify(definitionsList, null, 2)};\n`,
    'utf8'
  );

  // Write unified index.js
  const indexContent = `/**
 * CSA Digitized Code-as-Data Engine
 * Provides fully digitized, versioned, machine-readable repository for:
 * - CSA C22.3 No. 1 (506 clauses, 31 tables)
 * - CSA C22.3 No. 60826 (213 clauses, 47 tables, Canadian deviations)
 * - CSA O15 (86 clauses, 5 tables)
 * Total: 805 clauses, 83 tables, definitions, and bidirectional reverse references.
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
  const q = String(query).toLowerCase().trim();
  const { standardId = 'all', section = 'all', activeTab = 'clauses' } = filters;

  // Filter clauses
  let filteredClauses = ALL_CLAUSES;
  if (standardId !== 'all') {
    filteredClauses = filteredClauses.filter(c => c.standardId === standardId);
  }
  if (section !== 'all') {
    filteredClauses = filteredClauses.filter(c => c.section === section);
  }
  if (q) {
    filteredClauses = filteredClauses.filter(c =>
      c.clauseNumber.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.text.toLowerCase().includes(q) ||
      (c.tablesReferenced && c.tablesReferenced.some(t => t.tableNumber.toLowerCase().includes(q) || t.title.toLowerCase().includes(q))) ||
      (c.crossReferences && c.crossReferences.some(r => r.toLowerCase().includes(q))) ||
      (c.canadianDeviation && c.canadianDeviation.toLowerCase().includes(q))
    );
  }

  // Filter tables
  let filteredTables = ALL_TABLES;
  if (standardId !== 'all') {
    filteredTables = filteredTables.filter(t => t.standardId === standardId);
  }
  if (q) {
    filteredTables = filteredTables.filter(t =>
      t.number.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.standardName.toLowerCase().includes(q) ||
      (t.referencingClauses && t.referencingClauses.some(rc => rc.clauseNumber.toLowerCase().includes(q) || rc.title.toLowerCase().includes(q)))
    );
  }

  // Filter definitions
  let filteredDefinitions = ALL_DEFINITIONS;
  if (standardId !== 'all') {
    filteredDefinitions = filteredDefinitions.filter(d => d.standardId === standardId);
  }
  if (q) {
    filteredDefinitions = filteredDefinitions.filter(d =>
      d.term.toLowerCase().includes(q) ||
      d.definition.toLowerCase().includes(q) ||
      d.standardName.toLowerCase().includes(q) ||
      (d.clauseNumber && d.clauseNumber.toLowerCase().includes(q))
    );
  }

  return {
    clauses: filteredClauses,
    tables: filteredTables,
    definitions: filteredDefinitions,
    totalCounts: {
      clauses: filteredClauses.length,
      tables: filteredTables.length,
      definitions: filteredDefinitions.length
    }
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
`;

  fs.writeFileSync(path.join(outDir, 'index.js'), indexContent, 'utf8');
  console.log(`Successfully generated digitized code library in ${outDir}/`);
}

generateDigitizedDatabase();
