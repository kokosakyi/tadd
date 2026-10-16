import fs from 'fs';
import path from 'path';

// Let's create an index for c22_3_no1 tables first
function generateNo1Index() {
  const files = [];
  for (let i = 1; i <= 31; i++) {
    files.push(`table${i}`);
  }
  
  let code = `/**
 * CSA C22.3 No. 1 (Overhead Systems) — Table Registry Index
 * Exports all 31 tables from CSA C22.3 No. 1
 */\n\n`;

  files.forEach(f => {
    code += `export * from './${f}.js';\n`;
  });

  code += `\nimport { TABLE_1_META } from './table1.js';\n`;
  for (let i = 2; i <= 31; i++) {
    code += `import { TABLE_${i}_META } from './table${i}.js';\n`;
  }

  code += `\nexport const CSA_C22_3_NO1_TABLES_META = {\n`;
  for (let i = 1; i <= 31; i++) {
    code += `  'table${i}': TABLE_${i}_META,\n`;
  }
  code += `};\n`;

  fs.writeFileSync('src/data/csa/c22_3_no1/index.js', code, 'utf8');
  console.log('Generated src/data/csa/c22_3_no1/index.js');
}

generateNo1Index();
