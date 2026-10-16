import fs from 'fs';
import path from 'path';

async function testImports() {
  console.log('Testing table imports...');

  // 1. C22.3 No. 1
  const no1Files = fs.readdirSync('src/data/csa/c22_3_no1').filter(f => f.startsWith('table'));
  console.log(`Found ${no1Files.length} table files in c22_3_no1`);
  let no1Success = 0;
  for (const f of no1Files) {
    try {
      const mod = await import(`../src/data/csa/c22_3_no1/${f}`);
      no1Success++;
    } catch (e) {
      console.error(`Error importing c22_3_no1/${f}:`, e.message);
    }
  }
  console.log(`Successfully imported ${no1Success}/${no1Files.length} c22_3_no1 tables.`);

  // 2. C22.3 No. 60826
  const sixFiles = fs.readdirSync('src/data/csa/c22_3_60826').filter(f => f.startsWith('table'));
  console.log(`Found ${sixFiles.length} table files in c22_3_60826`);
  let sixSuccess = 0;
  for (const f of sixFiles) {
    try {
      const mod = await import(`../src/data/csa/c22_3_60826/${f}`);
      sixSuccess++;
    } catch (e) {
      console.error(`Error importing c22_3_60826/${f}:`, e.message);
    }
  }
  console.log(`Successfully imported ${sixSuccess}/${sixFiles.length} c22_3_60826 tables.`);

  // 3. O15
  const o15Files = fs.readdirSync('src/data/csa/o15').filter(f => f.startsWith('table'));
  console.log(`Found ${o15Files.length} table files in o15`);
  let o15Success = 0;
  for (const f of o15Files) {
    try {
      const mod = await import(`../src/data/csa/o15/${f}`);
      o15Success++;
    } catch (e) {
      console.error(`Error importing o15/${f}:`, e.message);
    }
  }
  console.log(`Successfully imported ${o15Success}/${o15Files.length} o15 tables.`);
}

testImports();
