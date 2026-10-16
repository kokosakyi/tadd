import { describe, it, expect } from 'vitest';
import assert from 'node:assert/strict';
import {
  ALL_CLAUSES,
  ALL_TABLES,
  ALL_DEFINITIONS,
  CSA_STANDARDS,
  getStandardSections,
  searchDigitizedCode,
  getClause,
  getTable
} from '../src/data/csa/digitized/index.js';
import {
  getHighlightTerms,
  buildHighlightRegex,
  splitTextWithMatches
} from '../src/utils/textHighlight.js';

describe('CSA Digitized Code Search & Filter Engine', () => {
  it('loads all clauses, tables, and definitions properly', () => {
    assert.strictEqual(ALL_CLAUSES.length, 792, 'Should have exactly 792 clauses');
    assert.strictEqual(ALL_TABLES.length, 83, 'Should have exactly 83 tables');
    assert.strictEqual(ALL_DEFINITIONS.length, 183, 'Should have exactly 183 definitions');
  });

  describe('Clause Number and Citation Parsing', () => {
    it('matches exact clause number "5.3.1.1"', () => {
      const res = searchDigitizedCode('5.3.1.1');
      assert.ok(res.clauses.length > 0, 'Should find clauses for 5.3.1.1');
      assert.strictEqual(res.clauses[0].clauseNumber, '5.3.1.1', 'Top result should be exact clause 5.3.1.1');
    });

    it('matches "Clause 5.3.1.1" prefix', () => {
      const res = searchDigitizedCode('Clause 5.3.1.1');
      assert.ok(res.clauses.length > 0, 'Should find clauses for Clause 5.3.1.1');
      assert.strictEqual(res.clauses[0].clauseNumber, '5.3.1.1', 'Top result should be exact clause 5.3.1.1');
    });

    it('matches "cl 5.3.1.1" and "cl. 5.3.1.1" abbreviations', () => {
      const res1 = searchDigitizedCode('cl 5.3.1.1');
      assert.ok(res1.clauses.length > 0, 'Should find clauses for cl 5.3.1.1');
      assert.strictEqual(res1.clauses[0].clauseNumber, '5.3.1.1', 'Top result should be exact clause 5.3.1.1');

      const res2 = searchDigitizedCode('cl. 5.3.1.1');
      assert.ok(res2.clauses.length > 0, 'Should find clauses for cl. 5.3.1.1');
      assert.strictEqual(res2.clauses[0].clauseNumber, '5.3.1.1', 'Top result should be exact clause 5.3.1.1');
    });

    it('matches full citation "CSA C22.3 No. 1 Cl. 5.3.1.1"', () => {
      const res = searchDigitizedCode('CSA C22.3 No. 1 Cl. 5.3.1.1');
      assert.ok(res.clauses.length > 0, 'Should find clauses for full citation');
      assert.strictEqual(res.clauses[0].clauseNumber, '5.3.1.1', 'Top result should be exact clause 5.3.1.1');
      assert.strictEqual(res.clauses[0].standardId, 'c22_3_no1');
    });

    it('matches Annex clauses like "A.5.2.7" and "Annex A.5.2.7"', () => {
      const res1 = searchDigitizedCode('A.5.2.7');
      assert.ok(res1.clauses.length > 0, 'Should find A.5.2.7');
      assert.strictEqual(res1.clauses[0].clauseNumber, 'A.5.2.7');

      const res2 = searchDigitizedCode('Cl. A.5.2.7');
      assert.ok(res2.clauses.length > 0, 'Should find Cl. A.5.2.7');
      assert.strictEqual(res2.clauses[0].clauseNumber, 'A.5.2.7');
    });

    it('matches CSA O15 clauses like "Clause 1.1" and "1.1"', () => {
      const res = searchDigitizedCode('Clause 1.1', { standardId: 'csa_o15' });
      assert.ok(res.clauses.length > 0, 'Should find O15 clause 1.1');
      assert.strictEqual(res.clauses[0].clauseNumber, '1.1');
      assert.strictEqual(res.clauses[0].standardId, 'csa_o15');
    });
  });

  describe('Table Search and Content Resolution', () => {
    it('matches "Table 2" and finds Table 2 at top of tables', () => {
      const res = searchDigitizedCode('Table 2');
      assert.ok(res.tables.length > 0, 'Should find tables');
      assert.strictEqual(res.tables[0].number, 'Table 2', 'Top result should be Table 2');
    });

    it('matches "Table CA.1" and alternative hyphen spelling "Table CA-1"', () => {
      const res1 = searchDigitizedCode('Table CA.1');
      assert.ok(res1.tables.length > 0, 'Should find Table CA.1');
      assert.strictEqual(res1.tables[0].number, 'Table CA.1');

      const res2 = searchDigitizedCode('Table CA-1');
      assert.ok(res2.tables.length > 0, 'Should find Table CA-1');
      assert.strictEqual(res2.tables[0].number, 'Table CA.1');
    });

    it('matches table contents like "Western Red Cedar" or "Douglas Fir"', () => {
      const res = searchDigitizedCode('Western Red Cedar');
      assert.ok(res.tables.length > 0, 'Should find tables containing Western Red Cedar');
      const table3 = res.tables.find(t => t.id === 'csa_o15_table3');
      assert.ok(table3, 'Table 3 should match Western Red Cedar');
    });

    it('matches table contents like "Grade 1"', () => {
      const res = searchDigitizedCode('Grade 1');
      assert.ok(res.tables.length > 0, 'Should find tables containing Grade 1');
      const table31 = res.tables.find(t => t.id === 'c22_3_no1_table31');
      assert.ok(table31, 'Table 31 should match Grade 1');
    });
  });

  describe('Multi-word Keyword Queries and Spelling Equivalence', () => {
    it('matches multi-word query "vertical clearance ground"', () => {
      const res = searchDigitizedCode('vertical clearance ground');
      assert.ok(res.clauses.length > 0, 'Should match clauses containing all tokens');
    });

    it('matches "wind ice" and "ice wind" equivalently', () => {
      const res1 = searchDigitizedCode('wind ice');
      const res2 = searchDigitizedCode('ice wind');
      assert.ok(res1.clauses.length > 0, 'Should match wind ice');
      assert.strictEqual(res1.clauses.length, res2.clauses.length, 'Order of tokens should not reduce results');
    });

    it('normalizes Canadian vs American spelling (fiber vs fibre)', () => {
      const resCanadian = searchDigitizedCode('fibre stress');
      const resAmerican = searchDigitizedCode('fiber stress');
      assert.ok(resCanadian.clauses.length > 0, 'Should match fibre stress');
      assert.strictEqual(resAmerican.clauses.length, resCanadian.clauses.length, 'fiber stress should match same clauses as fibre stress');
      assert.strictEqual(resAmerican.tables.length, resCanadian.tables.length, 'fiber stress should match same tables as fibre stress');
    });
  });

  describe('Definitions Search', () => {
    it('matches glossary term "COV"', () => {
      const res = searchDigitizedCode('COV');
      assert.ok(res.definitions.length > 0, 'Should find COV definition');
      assert.strictEqual(res.definitions[0].term, 'COV');
    });

    it('matches multi-word terms like "wood pole" or "characteristic strength"', () => {
      const res = searchDigitizedCode('characteristic strength');
      assert.ok(res.definitions.length > 0, 'Should find characteristic strength');
    });
  });

  describe('Filtering and Cross-Section Diagnostics', () => {
    it('filters by standardId', () => {
      const resNo1 = searchDigitizedCode('clearance', { standardId: 'c22_3_no1' });
      assert.ok(resNo1.clauses.every(c => c.standardId === 'c22_3_no1'));

      const resO15 = searchDigitizedCode('species', { standardId: 'csa_o15' });
      assert.ok(resO15.clauses.every(c => c.standardId === 'csa_o15'));
      assert.ok(resO15.tables.every(t => t.standardId === 'csa_o15'));
    });

    it('provides crossSectionClauseCount when section filter restricts search', () => {
      // Searching "wood" in Section 5 (Clearances)
      const res = searchDigitizedCode('wood', {
        standardId: 'c22_3_no1',
        section: '5 Clearances, separations, and spacings'
      });
      // There may be 0 clauses in Section 5 with "wood", but other sections have them
      assert.ok(typeof res.crossSectionClauseCount === 'number');
    });
  });

  describe('Dropdown Alphabetical Sorting Compliance per AGENTS.md', () => {
    it('sorts sections alphabetically using localeCompare', () => {
      const sections = getStandardSections('all');
      const sorted = [...sections].sort((a, b) => a.localeCompare(b));
      assert.deepStrictEqual(sections, sorted, 'Sections must be sorted via localeCompare');
    });

    it('sorts tables with natural numeric collation (e.g. Table 2 before Table 10)', () => {
      const labels = ALL_TABLES.map(t => `${t.number} — ${t.title}`);
      const sorted = [...labels].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      // Ensure Table 2 comes before Table 10 in sorted
      const idxTable2 = sorted.findIndex(l => l.startsWith('Table 2 —'));
      const idxTable10 = sorted.findIndex(l => l.startsWith('Table 10 —'));
      assert.ok(idxTable2 >= 0 && idxTable10 >= 0, 'Both tables should be present');
      assert.ok(idxTable2 < idxTable10, 'Table 2 must come before Table 10 under numeric collation');
    });
  });

  describe('Calculator Citations and Complex Search Queries', () => {
    it('matches "CSA C22.3 No. 1 Table 2" and extracts Table 2', () => {
      const res = searchDigitizedCode('CSA C22.3 No. 1 Table 2');
      assert.ok(res.tables.length > 0, 'Should find Table 2');
      assert.strictEqual(res.tables[0].number, 'Table 2');
      assert.strictEqual(res.tables[0].standardId, 'c22_3_no1');
    });

    it('matches "CSA C22.3 No. 60826 Table CA.1"', () => {
      const res = searchDigitizedCode('CSA C22.3 No. 60826 Table CA.1');
      assert.ok(res.tables.length > 0, 'Should find Table CA.1');
      assert.strictEqual(res.tables[0].number, 'Table CA.1');
      assert.strictEqual(res.tables[0].standardId, 'c22_3_60826');
    });

    it('matches "CSA O15 Table 3" and "CSA O15 Table B.1"', () => {
      const res3 = searchDigitizedCode('CSA O15 Table 3');
      assert.ok(res3.tables.length > 0, 'Should find Table 3');
      assert.strictEqual(res3.tables[0].id, 'csa_o15_table3');

      const resB1 = searchDigitizedCode('CSA O15 Table B.1');
      assert.ok(resB1.tables.length > 0, 'Should find Table B.1');
      assert.strictEqual(resB1.tables[0].id, 'csa_o15_tableB1');
    });

    it('handles special characters, punctuation, and extra spaces safely without crashing', () => {
      const specialQueries = [
        '   clearance (vertical)   ',
        '"ground clearance"',
        'sag & swing',
        'ice / wind',
        'c22.3: 5.3.1.1',
        '???!!',
        ''
      ];
      for (const q of specialQueries) {
        const res = searchDigitizedCode(q);
        assert.ok(Array.isArray(res.clauses));
        assert.ok(Array.isArray(res.tables));
        assert.ok(Array.isArray(res.definitions));
      }
    });

    it('returns all items when search query is empty', () => {
      const res = searchDigitizedCode('');
      assert.strictEqual(res.clauses.length, 792);
      assert.strictEqual(res.tables.length, 83);
      assert.strictEqual(res.definitions.length, 183);
    });
  });

  describe('Search Word Highlighting in Filtered Clauses', () => {
    it('extracts tokens and expands spelling synonyms for highlighting', () => {
      const terms1 = getHighlightTerms('vertical clearance');
      assert.ok(terms1.includes('vertical clearance'), 'Includes full phrase');
      assert.ok(terms1.includes('clearance'), 'Includes clearance token');
      assert.ok(terms1.includes('vertical'), 'Includes vertical token');

      const terms2 = getHighlightTerms('fiber stress');
      assert.ok(terms2.includes('fiber'), 'Includes fiber');
      assert.ok(terms2.includes('fibre'), 'Includes Canadian synonym fibre');
      assert.ok(terms2.includes('stress'), 'Includes stress');

      const terms3 = getHighlightTerms('Clause 5.3.1.1');
      assert.ok(terms3.includes('5.3.1.1'), 'Includes bare clause number 5.3.1.1');
    });

    it('filters stop words when multiple search tokens exist', () => {
      const terms = getHighlightTerms('clearances for wires in roads');
      assert.ok(terms.includes('clearances'));
      assert.ok(terms.includes('wires'));
      assert.ok(terms.includes('roads'));
      assert.ok(!terms.includes('for'), 'Excludes stop word for');
      assert.ok(!terms.includes('in'), 'Excludes stop word in');
    });

    it('builds boundary-aware regex preventing substring contamination', () => {
      const regexIce = buildHighlightRegex(['ice']);
      const text = 'Customer service requirements under ice loading';
      const chunks = splitTextWithMatches(text, regexIce);

      const matchedWords = chunks.filter(c => c.isMatch).map(c => c.text);
      assert.deepStrictEqual(matchedWords, ['ice'], 'Should match ice but NOT match service');

      const unmatched = chunks.filter(c => !c.isMatch).map(c => c.text).join('');
      assert.ok(unmatched.includes('service'), 'service should remain in unmatched text');
    });

    it('splits and marks clause titles and text accurately', () => {
      const query = 'vertical clearance ground';
      const terms = getHighlightTerms(query);
      const regex = buildHighlightRegex(terms);

      const clauseText = 'Vertical clearance of conductors above ground shall conform to Table 2.';
      const chunks = splitTextWithMatches(clauseText, regex);

      const matchedChunks = chunks.filter(c => c.isMatch);
      assert.ok(matchedChunks.length >= 3, 'Should match Vertical, clearance, and ground');
      assert.ok(matchedChunks.some(c => c.text.toLowerCase() === 'vertical'));
      assert.ok(matchedChunks.some(c => c.text.toLowerCase() === 'clearance'));
      assert.ok(matchedChunks.some(c => c.text.toLowerCase() === 'ground'));

      // Reconstructed text should equal original exactly
      const reconstructed = chunks.map(c => c.text).join('');
      assert.strictEqual(reconstructed, clauseText, 'Reconstructed text must match original exactly');
    });

    it('highlights Canadian spelling variants in actual CSA clause results', () => {
      // Search for US spelling 'fiber'
      const searchRes = searchDigitizedCode('fiber');
      assert.ok(searchRes.clauses.length > 0, 'Finds clauses for fiber');

      const terms = getHighlightTerms('fiber');
      assert.ok(terms.includes('fibre'), 'Expands to Canadian spelling fibre');
      const regex = buildHighlightRegex(terms);

      // Find a clause containing 'fibre'
      const clauseWithFibre = searchRes.clauses.find(c => c.text.toLowerCase().includes('fibre'));
      assert.ok(clauseWithFibre, 'Should find a clause containing fibre');

      const chunks = splitTextWithMatches(clauseWithFibre.text, regex);
      const matches = chunks.filter(c => c.isMatch);
      assert.ok(matches.length > 0, 'Should find matches in clause text');
      assert.ok(matches.some(m => m.text.toLowerCase().includes('fibre')), 'Matches Canadian spelling fibre in text');
    });

    it('highlights clause number in badge and title when matched', () => {
      const query = '5.3.1.1';
      const searchRes = searchDigitizedCode(query);
      assert.ok(searchRes.clauses.length > 0);
      const cl = searchRes.clauses[0];

      const terms = getHighlightTerms(query);
      const regex = buildHighlightRegex(terms);

      const numChunks = splitTextWithMatches(cl.clauseNumber, regex);
      assert.ok(numChunks.some(c => c.isMatch && c.text === '5.3.1.1'), 'Matches 5.3.1.1 in clause number badge');

      // When searching for words in the title
      const titleQuery = 'Basic clearances';
      const titleTerms = getHighlightTerms(titleQuery);
      const titleRegex = buildHighlightRegex(titleTerms);
      const titleChunks = splitTextWithMatches(cl.title, titleRegex);
      assert.ok(titleChunks.some(c => c.isMatch), 'Matches search words in clause title');
    });
  });
});

