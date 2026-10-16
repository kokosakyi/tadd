const fs = require('fs');
const path = require('path');

function inspectStandards() {
  const standards = [
    { id: 'c22_3_no1', name: 'CSA C22.3 No. 1', dir: 'src/data/csa/c22_3_no1', json: 'sandbox/csa_c22_1_clauses.json' },
    { id: 'c22_3_60826', name: 'CSA C22.3 No. 60826', dir: 'src/data/csa/c22_3_60826', json: 'sandbox/csa_60826_clauses.json' },
    { id: 'o15', name: 'CSA O15', dir: 'src/data/csa/o15', json: 'sandbox/csa_o15_clauses.json' }
  ];

  standards.forEach(std => {
    console.log(`\n========================================`);
    console.log(`STANDARD: ${std.name}`);
    console.log(`========================================`);

    // 1. Table files in src/data/csa
    const files = fs.readdirSync(std.dir).filter(f => f.endsWith('.js') && f.startsWith('table'));
    console.log(`Found ${files.length} digitized table JS files in ${std.dir}:`);
    files.forEach(f => {
      const c = fs.readFileSync(path.join(std.dir, f), 'utf8');
      const titleMatch = c.match(/title:\s*['"]([^'"]+)['"]/i) || c.match(/\*\s*"([^"]+)"/);
      const seeMatch = c.match(/\(See Clause[s]?\s*([^)]+)\)/i);
      console.log(`  - ${f.padEnd(16)}: ${titleMatch ? titleMatch[1].substring(0, 50) : 'Untitled'} ${seeMatch ? '| Ref: ' + seeMatch[1] : ''}`);
    });

    // 2. Clause JSON file
    if (fs.existsSync(std.json)) {
      const data = JSON.parse(fs.readFileSync(std.json, 'utf8'));
      const clauses = Object.values(data.clauses);
      console.log(`Total clauses in JSON: ${clauses.length}`);
      const referencedTables = new Set();
      clauses.forEach(cl => {
        if (cl.tables_referenced) {
          cl.tables_referenced.forEach(t => referencedTables.add(t));
        }
      });
      console.log(`Unique tables referenced in clauses: ${referencedTables.size} ->`, Array.from(referencedTables).slice(0, 10));
    }
  });
}

inspectStandards();
