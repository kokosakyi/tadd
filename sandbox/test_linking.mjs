import fs from 'fs';

async function testBidirectionalLinking() {
  const no1Json = JSON.parse(fs.readFileSync('sandbox/csa_c22_1_clauses.json', 'utf8'));
  const sixJson = JSON.parse(fs.readFileSync('sandbox/csa_60826_clauses.json', 'utf8'));
  const o15Json = JSON.parse(fs.readFileSync('sandbox/csa_o15_clauses.json', 'utf8'));

  // Helper to normalize table keys
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

  // Load all tables metadata
  const tables = {};

  // 1. No 1
  for (let i = 1; i <= 31; i++) {
    const mod = await import(`../src/data/csa/c22_3_no1/table${i}.js`);
    const metaKey = Object.keys(mod).find(k => k.endsWith('_META'));
    const meta = metaKey ? mod[metaKey] : {};
    const tableId = `c22_3_no1_table${i}`;
    tables[tableId] = {
      id: tableId,
      key: `table${i}`,
      standardId: 'c22_3_no1',
      standardName: 'CSA C22.3 No. 1',
      number: `Table ${i}`,
      title: meta.title || `Table ${i}`,
      explicitRefs: meta.references || [],
      referencingClauses: []
    };
  }

  // 2. 60826
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
    tables[tableId] = {
      id: tableId,
      key,
      standardId: 'c22_3_60826',
      standardName: 'CSA C22.3 No. 60826',
      number: displayNum,
      title: meta.title || displayNum,
      explicitRefs: meta.references || [],
      referencingClauses: []
    };
  }

  // 3. O15
  const o15Files = fs.readdirSync('src/data/csa/o15').filter(f => f.startsWith('table'));
  for (const f of o15Files) {
    const key = f.replace('.js', '');
    const mod = await import(`../src/data/csa/o15/${f}`);
    const metaKey = Object.keys(mod).find(k => k.endsWith('_META'));
    const meta = metaKey ? mod[metaKey] : {};
    const tableId = `csa_o15_${key}`;
    const displayNum = key.replace('table', 'Table ')
      .replace(/Table ([BC])(\d+)/, 'Table $1.$2');
    tables[tableId] = {
      id: tableId,
      key,
      standardId: 'csa_o15',
      standardName: 'CSA O15',
      number: displayNum,
      title: meta.title || displayNum,
      explicitRefs: meta.references || [],
      referencingClauses: []
    };
  }

  console.log(`Initialized ${Object.keys(tables).length} tables.`);

  // Bidirectional linking from table explicitRefs
  Object.values(tables).forEach(tbl => {
    tbl.explicitRefs.forEach(r => {
      // Check if r is a clause number like '5.3.1.1' or 'Clause 6.2'
      const clNum = r.replace(/Clause\s*/i, '').trim();
      if (!clNum.startsWith('Table')) {
        tbl.referencingClauses.push({
          clauseNumber: clNum,
          fromTableMeta: true
        });
      }
    });
  });

  // Cross-reference all clauses
  let clausesWithTableLinks = 0;
  const linkClause = (cl, stdId) => {
    const referencedTableIds = new Set();
    const clNum = cl.clause_id;

    // Check tables_referenced
    (cl.tables_referenced || []).forEach(tr => {
      const key = normalizeTableKey(stdId, tr);
      if (key && tables[`${stdId}_${key}`]) {
        referencedTableIds.add(`${stdId}_${key}`);
      }
    });

    // Also regex match in text
    const textMatches = cl.text.match(/Table\s+([A-Za-z0-9\.]+)/gi);
    if (textMatches) {
      textMatches.forEach(tm => {
        const key = normalizeTableKey(stdId, tm);
        if (key && tables[`${stdId}_${key}`]) {
          referencedTableIds.add(`${stdId}_${key}`);
        }
      });
    }

    if (referencedTableIds.size > 0) {
      clausesWithTableLinks++;
      referencedTableIds.forEach(tId => {
        const tbl = tables[tId];
        if (tbl && !tbl.referencingClauses.some(rc => rc.clauseNumber === clNum)) {
          tbl.referencingClauses.push({
            clauseNumber: clNum,
            title: cl.title,
            section: cl.section,
            fromClauseText: true
          });
        }
      });
    }
  };

  no1Json.clause_list.forEach(cl => linkClause(cl, 'c22_3_no1'));
  sixJson.clause_list.forEach(cl => linkClause(cl, 'c22_3_60826'));
  o15Json.clause_list.forEach(cl => linkClause(cl, 'csa_o15'));

  console.log(`Clauses referencing tables: ${clausesWithTableLinks}`);
  
  // Check sample tables with reverse links
  console.log('\n--- Sample Reverse Links ---');
  ['c22_3_no1_table2', 'c22_3_no1_table31', 'c22_3_60826_tableCA1', 'c22_3_60826_table1', 'csa_o15_table3'].forEach(id => {
    const tbl = tables[id];
    console.log(`${tbl.number} (${tbl.title}): Referenced by ${tbl.referencingClauses.length} clauses:`,
      tbl.referencingClauses.slice(0, 8).map(c => c.clauseNumber));
  });
}

testBidirectionalLinking();
