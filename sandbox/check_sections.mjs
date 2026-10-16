import fs from 'fs';

function checkSections() {
  ['sandbox/csa_c22_1_clauses.json', 'sandbox/csa_60826_clauses.json', 'sandbox/csa_o15_clauses.json'].forEach(p => {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    const sections = new Set();
    data.clause_list.forEach(c => {
      if (c.section) sections.add(c.section);
    });
    console.log(`\n=== ${p} ===`);
    console.log(`Total clauses: ${data.clause_list.length}`);
    console.log('Sections:', Array.from(sections));
  });
}

checkSections();
