/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Complete Table Data Index
 * Exports all 47 tables from CAN/CSA-C22.3 No. 60826-10:
 *   - Canadian National Annexes: Tables CA.1, CA.2, CB.1, CB.2, CB.3 (5 tables)
 *   - Normative Clauses (5–7): Tables 1 through 20 (20 tables)
 *   - Informative Annex A: Tables A.1 through A.14 (14 tables)
 *   - Informative Annex B: Tables B.1 through B.6 (6 tables)
 *   - Informative Annex C: Tables C.1 and C.2 (2 tables)
 */

export * from './tableCA1.js';
export * from './tableCA2.js';
export * from './tableCB1.js';
export * from './tableCB2.js';
export * from './tableCB3.js';

export * from './table1.js';
export * from './table2.js';
export * from './table3.js';
export * from './table4.js';
export * from './table5.js';
export * from './table6.js';
export * from './table7.js';
export * from './table8.js';
export * from './table9.js';
export * from './table10.js';
export * from './table11.js';
export * from './table12.js';
export * from './table13.js';
export * from './table14.js';
export * from './table15.js';
export * from './table16.js';
export * from './table17.js';
export * from './table18.js';
export * from './table19.js';
export * from './table20.js';

export * from './tableA1.js';
export * from './tableA2.js';
export * from './tableA3.js';
export * from './tableA4.js';
export * from './tableA5.js';
export * from './tableA6.js';
export * from './tableA7.js';
export * from './tableA8.js';
export * from './tableA9.js';
export * from './tableA10.js';
export * from './tableA11.js';
export * from './tableA12.js';
export * from './tableA13.js';
export * from './tableA14.js';

export * from './tableB1.js';
export * from './tableB2.js';
export * from './tableB3.js';
export * from './tableB4.js';
export * from './tableB5.js';
export * from './tableB6.js';

export * from './tableC1.js';
export * from './tableC2.js';

import { TABLE_CA1_META, TABLE_CA1_ROWS } from './tableCA1.js';
import { TABLE_CA2_META, TABLE_CA2_ROWS } from './tableCA2.js';
import { TABLE_CB1_META, TABLE_CB1_ROWS } from './tableCB1.js';
import { TABLE_CB2_META, TABLE_CB2_ROWS } from './tableCB2.js';
import { TABLE_CB3_META, TABLE_CB3_ROWS } from './tableCB3.js';

import { TABLE_1_META, TABLE_1_ROWS } from './table1.js';
import { TABLE_2_META, TABLE_2_ROWS } from './table2.js';
import { TABLE_3_META, TABLE_3_ROWS } from './table3.js';
import { TABLE_4_META, TABLE_4_ROWS } from './table4.js';
import { TABLE_5_META, TABLE_5_ROWS } from './table5.js';
import { TABLE_6_META, TABLE_6_ROWS } from './table6.js';
import { TABLE_7_META, TABLE_7_ROWS } from './table7.js';
import { TABLE_8_META, TABLE_8_ROWS } from './table8.js';
import { TABLE_9_META, TABLE_9_ROWS } from './table9.js';
import { TABLE_10_META, TABLE_10_ROWS } from './table10.js';
import { TABLE_11_META, TABLE_11_ROWS } from './table11.js';
import { TABLE_12_META, TABLE_12_ROWS } from './table12.js';
import { TABLE_13_META, TABLE_13_ROWS } from './table13.js';
import { TABLE_14_META, TABLE_14_ROWS } from './table14.js';
import { TABLE_15_META, TABLE_15_ROWS } from './table15.js';
import { TABLE_16_META, TABLE_16_ROWS } from './table16.js';
import { TABLE_17_META, TABLE_17_ROWS } from './table17.js';
import { TABLE_18_META, TABLE_18_ROWS } from './table18.js';
import { TABLE_19_META, TABLE_19_ROWS } from './table19.js';
import { TABLE_20_META, TABLE_20_ROWS } from './table20.js';

import { TABLE_A1_META, TABLE_A1_ROWS } from './tableA1.js';
import { TABLE_A2_META, TABLE_A2_ROWS } from './tableA2.js';
import { TABLE_A3_META, TABLE_A3_ROWS } from './tableA3.js';
import { TABLE_A4_META, TABLE_A4_ROWS } from './tableA4.js';
import { TABLE_A5_META, TABLE_A5_ROWS } from './tableA5.js';
import { TABLE_A6_META, TABLE_A6_ROWS } from './tableA6.js';
import { TABLE_A7_META, TABLE_A7_ROWS } from './tableA7.js';
import { TABLE_A8_META, TABLE_A8_ROWS } from './tableA8.js';
import { TABLE_A9_META, TABLE_A9_ROWS } from './tableA9.js';
import { TABLE_A10_META, TABLE_A10_ROWS } from './tableA10.js';
import { TABLE_A11_META, TABLE_A11_ROWS } from './tableA11.js';
import { TABLE_A12_META, TABLE_A12_ROWS } from './tableA12.js';
import { TABLE_A13_META, TABLE_A13_ROWS } from './tableA13.js';
import { TABLE_A14_META, TABLE_A14_ROWS } from './tableA14.js';

import { TABLE_B1_META, TABLE_B1_ROWS } from './tableB1.js';
import { TABLE_B2_META, TABLE_B2_ROWS } from './tableB2.js';
import { TABLE_B3_META, TABLE_B3_ROWS } from './tableB3.js';
import { TABLE_B4_META, TABLE_B4_ROWS } from './tableB4.js';
import { TABLE_B5_META, TABLE_B5_ROWS } from './tableB5.js';
import { TABLE_B6_META, TABLE_B6_ROWS } from './tableB6.js';

import { TABLE_C1_META, TABLE_C1_ROWS } from './tableC1.js';
import { TABLE_C2_META, TABLE_C2_ROWS } from './tableC2.js';

export const CSA_60826_TABLES = {
  'Table CA.1': { meta: TABLE_CA1_META, rows: TABLE_CA1_ROWS },
  'Table CA.2': { meta: TABLE_CA2_META, rows: TABLE_CA2_ROWS },
  'Table CB.1': { meta: TABLE_CB1_META, rows: TABLE_CB1_ROWS },
  'Table CB.2': { meta: TABLE_CB2_META, rows: TABLE_CB2_ROWS },
  'Table CB.3': { meta: TABLE_CB3_META, rows: TABLE_CB3_ROWS },
  'Table 1': { meta: TABLE_1_META, rows: TABLE_1_ROWS },
  'Table 2': { meta: TABLE_2_META, rows: TABLE_2_ROWS },
  'Table 3': { meta: TABLE_3_META, rows: TABLE_3_ROWS },
  'Table 4': { meta: TABLE_4_META, rows: TABLE_4_ROWS },
  'Table 5': { meta: TABLE_5_META, rows: TABLE_5_ROWS },
  'Table 6': { meta: TABLE_6_META, rows: TABLE_6_ROWS },
  'Table 7': { meta: TABLE_7_META, rows: TABLE_7_ROWS },
  'Table 8': { meta: TABLE_8_META, rows: TABLE_8_ROWS },
  'Table 9': { meta: TABLE_9_META, rows: TABLE_9_ROWS },
  'Table 10': { meta: TABLE_10_META, rows: TABLE_10_ROWS },
  'Table 11': { meta: TABLE_11_META, rows: TABLE_11_ROWS },
  'Table 12': { meta: TABLE_12_META, rows: TABLE_12_ROWS },
  'Table 13': { meta: TABLE_13_META, rows: TABLE_13_ROWS },
  'Table 14': { meta: TABLE_14_META, rows: TABLE_14_ROWS },
  'Table 15': { meta: TABLE_15_META, rows: TABLE_15_ROWS },
  'Table 16': { meta: TABLE_16_META, rows: TABLE_16_ROWS },
  'Table 17': { meta: TABLE_17_META, rows: TABLE_17_ROWS },
  'Table 18': { meta: TABLE_18_META, rows: TABLE_18_ROWS },
  'Table 19': { meta: TABLE_19_META, rows: TABLE_19_ROWS },
  'Table 20': { meta: TABLE_20_META, rows: TABLE_20_ROWS },
  'Table A.1': { meta: TABLE_A1_META, rows: TABLE_A1_ROWS },
  'Table A.2': { meta: TABLE_A2_META, rows: TABLE_A2_ROWS },
  'Table A.3': { meta: TABLE_A3_META, rows: TABLE_A3_ROWS },
  'Table A.4': { meta: TABLE_A4_META, rows: TABLE_A4_ROWS },
  'Table A.5': { meta: TABLE_A5_META, rows: TABLE_A5_ROWS },
  'Table A.6': { meta: TABLE_A6_META, rows: TABLE_A6_ROWS },
  'Table A.7': { meta: TABLE_A7_META, rows: TABLE_A7_ROWS },
  'Table A.8': { meta: TABLE_A8_META, rows: TABLE_A8_ROWS },
  'Table A.9': { meta: TABLE_A9_META, rows: TABLE_A9_ROWS },
  'Table A.10': { meta: TABLE_A10_META, rows: TABLE_A10_ROWS },
  'Table A.11': { meta: TABLE_A11_META, rows: TABLE_A11_ROWS },
  'Table A.12': { meta: TABLE_A12_META, rows: TABLE_A12_ROWS },
  'Table A.13': { meta: TABLE_A13_META, rows: TABLE_A13_ROWS },
  'Table A.14': { meta: TABLE_A14_META, rows: TABLE_A14_ROWS },
  'Table B.1': { meta: TABLE_B1_META, rows: TABLE_B1_ROWS },
  'Table B.2': { meta: TABLE_B2_META, rows: TABLE_B2_ROWS },
  'Table B.3': { meta: TABLE_B3_META, rows: TABLE_B3_ROWS },
  'Table B.4': { meta: TABLE_B4_META, rows: TABLE_B4_ROWS },
  'Table B.5': { meta: TABLE_B5_META, rows: TABLE_B5_ROWS },
  'Table B.6': { meta: TABLE_B6_META, rows: TABLE_B6_ROWS },
  'Table C.1': { meta: TABLE_C1_META, rows: TABLE_C1_ROWS },
  'Table C.2': { meta: TABLE_C2_META, rows: TABLE_C2_ROWS },
};
