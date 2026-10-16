import fs from 'fs';

async function inspectTables() {
  const allTables = [];

  // No1
  for (let i = 1; i <= 31; i++) {
    const mod = await import(`../src/data/csa/c22_3_no1/table${i}.js`);
    const metaKey = Object.keys(mod).find(k => k.endsWith('_META'));
    const meta = metaKey ? mod[metaKey] : { title: `Table ${i}` };
    allTables.push({
      standardId: 'c22_3_no1',
      standardName: 'CSA C22.3 No. 1',
      file: `table${i}.js`,
      number: `Table ${i}`,
      title: meta.title || `Table ${i}`,
      metaKey,
      meta,
      keys: Object.keys(mod)
    });
  }

  // 60826
  const sixFiles = fs.readdirSync('src/data/csa/c22_3_60826').filter(f => f.startsWith('table'));
  for (const f of sixFiles) {
    const mod = await import(`../src/data/csa/c22_3_60826/${f}`);
    const metaKey = Object.keys(mod).find(k => k.endsWith('_META'));
    const meta = metaKey ? mod[metaKey] : {};
    allTables.push({
      standardId: 'c22_3_60826',
      standardName: 'CSA C22.3 No. 60826',
      file: f,
      number: meta.id ? meta.id.split('/').pop().replace('table', 'Table ') : f.replace('.js', ''),
      title: meta.title || f,
      metaKey,
      meta,
      keys: Object.keys(mod)
    });
  }

  // O15
  const o15Files = fs.readdirSync('src/data/csa/o15').filter(f => f.startsWith('table'));
  for (const f of o15Files) {
    const mod = await import(`../src/data/csa/o15/${f}`);
    const metaKey = Object.keys(mod).find(k => k.endsWith('_META'));
    const meta = metaKey ? mod[metaKey] : {};
    allTables.push({
      standardId: 'csa_o15',
      standardName: 'CSA O15',
      file: f,
      number: meta.id ? meta.id.split('/').pop().replace('table', 'Table ') : f.replace('.js', ''),
      title: meta.title || f,
      metaKey,
      meta,
      keys: Object.keys(mod)
    });
  }

  console.log(`Total tables collected: ${allTables.length}`);
  console.log('Sample table from No1:', allTables[1]);
  console.log('Sample table from 60826:', allTables[32]);
  console.log('Sample table from O15:', allTables[78]);
}

inspectTables();
