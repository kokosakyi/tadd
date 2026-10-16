import { describe, it, expect } from 'vitest';
import {
  ALL_CLAUSES,
  ALL_TABLES,
  ALL_DEFINITIONS,
  getStandardSections,
  searchDigitizedCode,
  getClause,
  getTable
} from '../src/data/csa/digitized/index.js';
import { getTableDetails } from '../src/core/code/tableContentResolver.js';

describe('Digitized CSA Code-as-Data Verification Test Suite', () => {
  it('verifies standard collections counts', () => {
    expect(ALL_CLAUSES.length).toBe(792);
    expect(ALL_TABLES.length).toBe(83);
    expect(ALL_DEFINITIONS.length).toBeGreaterThanOrEqual(150);
  });

  it('verifies standard breakdown counts across C22.3 No. 1, 60826, and O15', () => {
    const no1Count = ALL_CLAUSES.filter(c => c.standardId === 'c22_3_no1').length;
    const sixCount = ALL_CLAUSES.filter(c => c.standardId === 'c22_3_60826').length;
    const o15Count = ALL_CLAUSES.filter(c => c.standardId === 'csa_o15').length;

    expect(no1Count).toBe(500);
    expect(sixCount).toBe(206);
    expect(o15Count).toBe(86);
  });

  it('verifies Forward Links (Clause -> Tables)', () => {
    const cl5311 = getClause('c22_3_no1', '5.3.1.1');
    expect(cl5311).toBeDefined();
    expect(cl5311.tablesReferenced.some(t => t.tableNumber === 'Table 2')).toBe(true);
    expect(cl5311.tablesReferenced.some(t => t.tableNumber === 'Table 4')).toBe(true);
  });

  it('verifies Reverse Links (Table -> Referencing Clauses)', () => {
    const tbl2 = getTable('table2', 'c22_3_no1');
    expect(tbl2.referencingClauses.some(c => c.clauseNumber === '5.3.1.1')).toBe(true);

    const tblCA1 = getTable('tableCA1', 'c22_3_60826');
    expect(tblCA1.referencingClauses.some(c => c.clauseNumber === '6.2.4')).toBe(true);

    const tblO15_3 = getTable('table3', 'csa_o15');
    expect(tblO15_3.referencingClauses.some(c => c.clauseNumber === '4.1.1')).toBe(true);
  });

  it('verifies live table data resolution across all 83 tables in all 3 standards', () => {
    expect(ALL_TABLES.length).toBe(83);

    ALL_TABLES.forEach((tbl) => {
      const resolved = getTableDetails(tbl.id);
      expect(resolved, `Table ${tbl.id} should resolve`).toBeDefined();
      expect(resolved.details, `Table ${tbl.id} should have details`).toBeDefined();
      expect(resolved.details.rows, `Table ${tbl.id} should have rows`).toBeDefined();

      if (Array.isArray(resolved.details.rows)) {
        expect(resolved.details.rows.length, `Table ${tbl.id} should have >0 rows`).toBeGreaterThan(0);
      } else {
        const subArrays = Object.values(resolved.details.rows).filter(Array.isArray);
        expect(subArrays.length, `Table ${tbl.id} object rows should contain sub-arrays`).toBeGreaterThan(0);
        subArrays.forEach((arr) => expect(arr.length).toBeGreaterThan(0));
      }
    });

    // Verify specific matrix and full-station tables
    const t2Details = getTableDetails('c22_3_no1_table2');
    expect(t2Details.details.columns.length).toBe(12);
    expect(t2Details.details.rows.length).toBe(8);

    const t6Details = getTableDetails('c22_3_no1_table6');
    expect(t6Details.details.columns.length).toBe(2);
    expect(t6Details.details.rows.length).toBe(18);

    const t8Details = getTableDetails('c22_3_no1_table8');
    expect(t8Details.details.columns.length).toBe(3);
    expect(t8Details.details.rows.length).toBe(8);

    const t9Details = getTableDetails('c22_3_no1_table9');
    expect(t9Details.details.columns.length).toBe(4);
    expect(t9Details.details.rows.length).toBe(7);

    const t13Details = getTableDetails('c22_3_no1_table13');
    expect(t13Details.details.columns.length).toBe(11);
    expect(t13Details.details.rows.length).toBeGreaterThan(10);
    expect(t13Details.details.dcColumns.length).toBeGreaterThan(5);
    expect(t13Details.details.dcRows.length).toBeGreaterThan(10);

    const tCA1Details = getTableDetails('c22_3_60826_tableCA1');
    expect(tCA1Details.details.rows.length).toBe(682);

    const t3Details = getTableDetails('csa_o15_table3');
    expect(t3Details.details.rows.length).toBe(16);
  });

  it('verifies search engine querying', () => {
    const searchCl = searchDigitizedCode('clearance', { standardId: 'c22_3_no1' });
    expect(searchCl.clauses.length).toBeGreaterThan(0);
    expect(searchCl.tables.length).toBeGreaterThan(0);
  });

  it('verifies alphabetical sorting compliance per .agents/AGENTS.md', () => {
    const sections = getStandardSections('all');
    for (let i = 0; i < sections.length - 1; i++) {
      expect(sections[i].localeCompare(sections[i + 1])).toBeLessThanOrEqual(0);
    }
  });
});
