import fs from 'fs';

function updateNo1Index() {
  let code = `/**
 * CSA C22.3 No. 1 (Overhead Systems) — Table Registry & Data Index
 * Exports all 31 tables from CSA C22.3 No. 1
 */\n\n`;

  for (let i = 1; i <= 31; i++) {
    code += `export * from './table${i}.js';\n`;
  }

  // Import metas and rows
  code += `\nimport { TABLE_1_META, TABLE_1_CURVE_POINTS } from './table1.js';\n`;
  code += `import { TABLE_2_META, TABLE_2_COLUMNS, TABLE_2_ROWS, TABLE_2_FOOTNOTES } from './table2.js';\n`;
  code += `import { TABLE_3_META, TABLE_3_COLUMNS, TABLE_3_ROWS } from './table3.js';\n`;
  code += `import { TABLE_4_META, TABLE_4_COLUMNS, TABLE_4_ROWS, TABLE_4_FOOTNOTES } from './table4.js';\n`;
  code += `import { TABLE_5_META, TABLE_5_COLUMNS, TABLE_5_ROWS } from './table5.js';\n`;
  code += `import { TABLE_6_META, TABLE_6_TRACK_TYPES, TABLE_6_WIRE_CATEGORIES } from './table6.js';\n`;
  code += `import { TABLE_7_META, TABLE_7_ROWS } from './table7.js';\n`;
  code += `import { TABLE_8_META, TABLE_8_ROWS } from './table8.js';\n`;
  code += `import { TABLE_9_META, TABLE_9_ROWS } from './table9.js';\n`;
  code += `import { TABLE_10_META, TABLE_10_COLUMNS, TABLE_10_ROWS } from './table10.js';\n`;
  code += `import { TABLE_11_META, TABLE_11_ROWS } from './table11.js';\n`;
  code += `import { TABLE_12_META, TABLE_12_ROWS } from './table12.js';\n`;
  code += `import { TABLE_13_META, TABLE_13_CROSSINGS_AC_UPPER, TABLE_13_UPPER_COLUMNS_AC } from './table13.js';\n`;
  code += `import { TABLE_14_META, TABLE_14_COLUMNS, TABLE_14_ROWS } from './table14.js';\n`;
  code += `import { TABLE_15_META, TABLE_15_ROWS } from './table15.js';\n`;
  code += `import { TABLE_16_META, TABLE_16_ROWS } from './table16.js';\n`;
  code += `import { TABLE_17_META, TABLE_17_ROWS } from './table17.js';\n`;
  code += `import { TABLE_18_META, TABLE_18_ROWS, TABLE_18_HIGHER_LEVEL_COLUMNS } from './table18.js';\n`;
  code += `import { TABLE_19_META, TABLE_19_ROWS } from './table19.js';\n`;
  code += `import { TABLE_20_META, TABLE_20_ROWS } from './table20.js';\n`;
  code += `import { TABLE_21_META, TABLE_21_ROWS, TABLE_21_UPPER_VOLTAGE_COLUMNS } from './table21.js';\n`;
  code += `import { TABLE_22_META, TABLE_22_COLUMNS, TABLE_22_ROWS } from './table22.js';\n`;
  code += `import { TABLE_23_META, TABLE_23_ROWS, TABLE_23_VOLTAGE_COLUMNS } from './table23.js';\n`;
  code += `import { TABLE_24_META, TABLE_24_ROWS } from './table24.js';\n`;
  code += `import { TABLE_25_META, TABLE_25_ROWS } from './table25.js';\n`;
  code += `import { TABLE_26_META, TABLE_26_ROWS } from './table26.js';\n`;
  code += `import { TABLE_27_META, TABLE_27_ROWS } from './table27.js';\n`;
  code += `import { TABLE_28_META, TABLE_28_ROWS } from './table28.js';\n`;
  code += `import { TABLE_29_META, TABLE_29_ROWS } from './table29.js';\n`;
  code += `import { TABLE_30_META, TABLE_30_LOADING_AREAS } from './table30.js';\n`;
  code += `import { TABLE_31_META, TABLE_31_LOAD_FACTORS } from './table31.js';\n`;

  code += `\nexport const CSA_C22_3_NO1_TABLES_META = {\n`;
  for (let i = 1; i <= 31; i++) {
    code += `  'table${i}': TABLE_${i}_META,\n`;
  }
  code += `};\n`;

  code += `\nexport const CSA_C22_3_NO1_TABLES_DATA = {\n`;
  code += `  'table1': { meta: TABLE_1_META, rows: TABLE_1_CURVE_POINTS, type: 'points' },\n`;
  code += `  'table2': { meta: TABLE_2_META, columns: TABLE_2_COLUMNS, rows: TABLE_2_ROWS, footnotes: TABLE_2_FOOTNOTES, type: 'matrix' },\n`;
  code += `  'table3': { meta: TABLE_3_META, columns: TABLE_3_COLUMNS, rows: TABLE_3_ROWS, type: 'matrix' },\n`;
  code += `  'table4': { meta: TABLE_4_META, columns: TABLE_4_COLUMNS, rows: TABLE_4_ROWS, footnotes: TABLE_4_FOOTNOTES, type: 'matrix' },\n`;
  code += `  'table5': { meta: TABLE_5_META, columns: TABLE_5_COLUMNS, rows: TABLE_5_ROWS, type: 'table' },\n`;
  code += `  'table6': { meta: TABLE_6_META, rows: TABLE_6_TRACK_TYPES, type: 'list' },\n`;
  code += `  'table7': { meta: TABLE_7_META, rows: TABLE_7_ROWS, type: 'table' },\n`;
  code += `  'table8': { meta: TABLE_8_META, rows: TABLE_8_ROWS, type: 'table' },\n`;
  code += `  'table9': { meta: TABLE_9_META, rows: TABLE_9_ROWS, type: 'table' },\n`;
  code += `  'table10': { meta: TABLE_10_META, columns: TABLE_10_COLUMNS, rows: TABLE_10_ROWS, type: 'matrix' },\n`;
  code += `  'table11': { meta: TABLE_11_META, rows: TABLE_11_ROWS, type: 'table' },\n`;
  code += `  'table12': { meta: TABLE_12_META, rows: TABLE_12_ROWS, type: 'table' },\n`;
  code += `  'table13': { meta: TABLE_13_META, columns: TABLE_13_UPPER_COLUMNS_AC, rows: TABLE_13_CROSSINGS_AC_UPPER, type: 'matrix' },\n`;
  code += `  'table14': { meta: TABLE_14_META, columns: TABLE_14_COLUMNS, rows: TABLE_14_ROWS, type: 'matrix' },\n`;
  code += `  'table15': { meta: TABLE_15_META, rows: TABLE_15_ROWS, type: 'table' },\n`;
  code += `  'table16': { meta: TABLE_16_META, rows: TABLE_16_ROWS, type: 'table' },\n`;
  code += `  'table17': { meta: TABLE_17_META, rows: TABLE_17_ROWS, type: 'table' },\n`;
  code += `  'table18': { meta: TABLE_18_META, columns: TABLE_18_HIGHER_LEVEL_COLUMNS, rows: TABLE_18_ROWS, type: 'matrix' },\n`;
  code += `  'table19': { meta: TABLE_19_META, rows: TABLE_19_ROWS, type: 'table' },\n`;
  code += `  'table20': { meta: TABLE_20_META, rows: TABLE_20_ROWS, type: 'table' },\n`;
  code += `  'table21': { meta: TABLE_21_META, columns: TABLE_21_UPPER_VOLTAGE_COLUMNS, rows: TABLE_21_ROWS, type: 'matrix' },\n`;
  code += `  'table22': { meta: TABLE_22_META, columns: TABLE_22_COLUMNS, rows: TABLE_22_ROWS, type: 'matrix' },\n`;
  code += `  'table23': { meta: TABLE_23_META, columns: TABLE_23_VOLTAGE_COLUMNS, rows: TABLE_23_ROWS, type: 'matrix' },\n`;
  code += `  'table24': { meta: TABLE_24_META, rows: TABLE_24_ROWS, type: 'table' },\n`;
  code += `  'table25': { meta: TABLE_25_META, rows: TABLE_25_ROWS, type: 'table' },\n`;
  code += `  'table26': { meta: TABLE_26_META, rows: TABLE_26_ROWS, type: 'table' },\n`;
  code += `  'table27': { meta: TABLE_27_META, rows: TABLE_27_ROWS, type: 'table' },\n`;
  code += `  'table28': { meta: TABLE_28_META, rows: TABLE_28_ROWS, type: 'table' },\n`;
  code += `  'table29': { meta: TABLE_29_META, rows: TABLE_29_ROWS, type: 'table' },\n`;
  code += `  'table30': { meta: TABLE_30_META, rows: TABLE_30_LOADING_AREAS, type: 'list' },\n`;
  code += `  'table31': { meta: TABLE_31_META, rows: TABLE_31_LOAD_FACTORS, type: 'ocf' },\n`;
  code += `};\n`;

  fs.writeFileSync('src/data/csa/c22_3_no1/index.js', code, 'utf8');
  console.log('Updated src/data/csa/c22_3_no1/index.js with full table data mapping.');
}

updateNo1Index();
