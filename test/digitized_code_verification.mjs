/**
 * Digitized CSA Code-as-Data & Bidirectional Linking Verification Test
 */

import {
  ALL_CLAUSES,
  ALL_TABLES,
  TABLES_MAP,
  ALL_DEFINITIONS,
  CSA_STANDARDS,
  getStandardSections,
  searchDigitizedCode,
  getClause,
  getTable
} from '../src/data/csa/digitized/index.js';

import { getTableDetails } from '../src/core/code/tableContentResolver.ts';


console.log('=== Digitized CSA Code-as-Data Test Suite ===');

// 1. Verify standard collections counts
console.log('\n[1] Verifying total counts:');
console.log(`  Clauses: ${ALL_CLAUSES.length} (Expected: 805)`);
console.log(`  Tables: ${ALL_TABLES.length} (Expected: 83)`);
console.log(`  Glossary Terms: ${ALL_DEFINITIONS.length} (Expected: 183)`);

if (ALL_CLAUSES.length !== 805) throw new Error(`Expected 805 clauses, got ${ALL_CLAUSES.length}`);
if (ALL_TABLES.length !== 83) throw new Error(`Expected 83 tables, got ${ALL_TABLES.length}`);
if (ALL_DEFINITIONS.length < 150) throw new Error(`Expected >= 150 definitions, got ${ALL_DEFINITIONS.length}`);

// 2. Verify individual standards breakdown
console.log('\n[2] Verifying standard coverage:');
const no1Count = ALL_CLAUSES.filter(c => c.standardId === 'c22_3_no1').length;
const sixCount = ALL_CLAUSES.filter(c => c.standardId === 'c22_3_60826').length;
const o15Count = ALL_CLAUSES.filter(c => c.standardId === 'csa_o15').length;
console.log(`  CSA C22.3 No. 1 Clauses: ${no1Count}`);
console.log(`  CSA C22.3 No. 60826 Clauses: ${sixCount}`);
console.log(`  CSA O15 Clauses: ${o15Count}`);

if (no1Count !== 506) throw new Error(`Expected 506 No. 1 clauses, got ${no1Count}`);
if (sixCount !== 213) throw new Error(`Expected 213 60826 clauses, got ${sixCount}`);
if (o15Count !== 86) throw new Error(`Expected 86 O15 clauses, got ${o15Count}`);

// 3. Verify Forward Links (Clause -> Tables)
console.log('\n[3] Verifying Forward Links (Clause -> Tables):');
const cl5311 = getClause('c22_3_no1', '5.3.1.1');
console.log(`  Clause 5.3.1.1 title: "${cl5311.title}"`);
console.log(`  Referenced tables:`, cl5311.tablesReferenced.map(t => t.tableNumber));
if (!cl5311.tablesReferenced.some(t => t.tableNumber === 'Table 2')) {
  throw new Error('Clause 5.3.1.1 missing Table 2 reference');
}
if (!cl5311.tablesReferenced.some(t => t.tableNumber === 'Table 4')) {
  throw new Error('Clause 5.3.1.1 missing Table 4 reference');
}

// 4. Verify Reverse Links (Table -> Referencing Clauses)
console.log('\n[4] Verifying Reverse Links (Table -> Referencing Clauses):');
const tbl2 = getTable('table2', 'c22_3_no1');
console.log(`  Table 2 title: "${tbl2.title}"`);
console.log(`  Reverse referencing clauses:`, tbl2.referencingClauses.map(c => c.clauseNumber));
if (!tbl2.referencingClauses.some(c => c.clauseNumber === '5.3.1.1')) {
  throw new Error('Table 2 reverse links missing Clause 5.3.1.1');
}

const tblCA1 = getTable('tableCA1', 'c22_3_60826');
console.log(`  Table CA.1 title: "${tblCA1.title}"`);
console.log(`  Reverse referencing clauses:`, tblCA1.referencingClauses.map(c => c.clauseNumber));
if (!tblCA1.referencingClauses.some(c => c.clauseNumber === '6.2.4')) {
  throw new Error('Table CA.1 reverse links missing Clause 6.2.4');
}

const tblO15_3 = getTable('table3', 'csa_o15');
console.log(`  CSA O15 Table 3 title: "${tblO15_3.title}"`);
console.log(`  Reverse referencing clauses:`, tblO15_3.referencingClauses.map(c => c.clauseNumber));
if (!tblO15_3.referencingClauses.some(c => c.clauseNumber === '4.1.1')) {
  throw new Error('CSA O15 Table 3 reverse links missing Clause 4.1.1');
}

// 5. Verify Table Content Resolution across standards
console.log('\n[5] Verifying Live Table Data Resolution:');
const t2Details = getTableDetails('c22_3_no1_table2');
console.log(`  Table 2 columns: ${t2Details.details.columns.length}, rows: ${t2Details.details.rows.length}`);
if (t2Details.details.columns.length !== 12 || t2Details.details.rows.length !== 8) {
  throw new Error('Table 2 data matrix incorrect dimensions');
}

const t3Details = getTableDetails('csa_o15_table3');
console.log(`  O15 Table 3 species rows: ${t3Details.details.rows.length}`);
if (t3Details.details.rows.length !== 16) {
  throw new Error('O15 Table 3 missing species records');
}

// 6. Verify Search Engine
console.log('\n[6] Verifying Search Engine:');
const searchCl = searchDigitizedCode('clearance', { standardId: 'c22_3_no1' });
console.log(`  Search 'clearance' in No. 1: ${searchCl.clauses.length} clauses, ${searchCl.tables.length} tables`);
if (searchCl.clauses.length === 0 || searchCl.tables.length === 0) {
  throw new Error('Search failed to return results');
}

// 7. Verify Alphabetical Sorting Compliance per .agents/AGENTS.md
console.log('\n[7] Verifying Alphabetical Sorting Compliance per .agents/AGENTS.md:');
const sections = getStandardSections('all');
for (let i = 0; i < sections.length - 1; i++) {
  if (sections[i].localeCompare(sections[i + 1]) > 0) {
    throw new Error(`Section sorting rule violated: "${sections[i]}" > "${sections[i + 1]}"`);
  }
}
console.log(`  Sections properly sorted using localeCompare (${sections.length} sections verified)`);

console.log('\n>>> ALL DIGITIZED CSA CODE TESTS PASSED! <<<');
