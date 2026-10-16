/**
 * CSA C22.3 No. 1 (Overhead Systems) — Table Registry & Data Index
 * Exports all 31 tables from CSA C22.3 No. 1
 */

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
export * from './table21.js';
export * from './table22.js';
export * from './table23.js';
export * from './table24.js';
export * from './table25.js';
export * from './table26.js';
export * from './table27.js';
export * from './table28.js';
export * from './table29.js';
export * from './table30.js';
export * from './table31.js';

import { TABLE_1_META, TABLE_1_CURVE_POINTS } from './table1.js';
import { TABLE_2_META, TABLE_2_COLUMNS, TABLE_2_ROWS, TABLE_2_FOOTNOTES } from './table2.js';
import { TABLE_3_META, TABLE_3_COLUMNS, TABLE_3_ROWS } from './table3.js';
import { TABLE_4_META, TABLE_4_COLUMNS, TABLE_4_ROWS, TABLE_4_FOOTNOTES } from './table4.js';
import { TABLE_5_META, TABLE_5_COLUMNS, TABLE_5_ROWS } from './table5.js';
import { TABLE_6_META, TABLE_6_TRACK_TYPES, TABLE_6_WIRE_CATEGORIES } from './table6.js';
import { TABLE_7_META, TABLE_7_ROWS } from './table7.js';
import { TABLE_8_META, TABLE_8_ROWS, TABLE_8_SURFACE_TYPES } from './table8.js';
import { TABLE_9_META, TABLE_9_ROWS, TABLE_9_TARGET_CATEGORIES } from './table9.js';
import { TABLE_10_META, TABLE_10_COLUMNS, TABLE_10_ROWS } from './table10.js';
import { TABLE_11_META, TABLE_11_ROWS } from './table11.js';
import { TABLE_12_META, TABLE_12_ROWS } from './table12.js';
import { TABLE_13_META, TABLE_13_CROSSINGS_AC_UPPER, TABLE_13_UPPER_COLUMNS_AC, TABLE_13_CROSSINGS_DC_UPPER, TABLE_13_UPPER_COLUMNS_DC } from './table13.js';
import { TABLE_14_META, TABLE_14_COLUMNS, TABLE_14_ROWS } from './table14.js';
import { TABLE_15_META, TABLE_15_ROWS } from './table15.js';
import { TABLE_16_META, TABLE_16_ROWS } from './table16.js';
import { TABLE_17_META, TABLE_17_ROWS } from './table17.js';
import { TABLE_18_META, TABLE_18_ROWS, TABLE_18_HIGHER_LEVEL_COLUMNS } from './table18.js';
import { TABLE_19_META, TABLE_19_ROWS } from './table19.js';
import { TABLE_20_META, TABLE_20_ROWS } from './table20.js';
import { TABLE_21_META, TABLE_21_ROWS, TABLE_21_UPPER_VOLTAGE_COLUMNS } from './table21.js';
import { TABLE_22_META, TABLE_22_COLUMNS, TABLE_22_ROWS } from './table22.js';
import { TABLE_23_META, TABLE_23_ROWS, TABLE_23_VOLTAGE_COLUMNS } from './table23.js';
import { TABLE_24_META, TABLE_24_ROWS } from './table24.js';
import { TABLE_25_META, TABLE_25_ROWS } from './table25.js';
import { TABLE_26_META, TABLE_26_ROWS } from './table26.js';
import { TABLE_27_META, TABLE_27_ROWS } from './table27.js';
import { TABLE_28_META, TABLE_28_ROWS } from './table28.js';
import { TABLE_29_META, TABLE_29_ROWS } from './table29.js';
import { TABLE_30_META, TABLE_30_LOADING_AREAS } from './table30.js';
import { TABLE_31_META, TABLE_31_LOAD_FACTORS } from './table31.js';

export const CSA_C22_3_NO1_TABLES_META = {
  'table1': TABLE_1_META,
  'table2': TABLE_2_META,
  'table3': TABLE_3_META,
  'table4': TABLE_4_META,
  'table5': TABLE_5_META,
  'table6': TABLE_6_META,
  'table7': TABLE_7_META,
  'table8': TABLE_8_META,
  'table9': TABLE_9_META,
  'table10': TABLE_10_META,
  'table11': TABLE_11_META,
  'table12': TABLE_12_META,
  'table13': TABLE_13_META,
  'table14': TABLE_14_META,
  'table15': TABLE_15_META,
  'table16': TABLE_16_META,
  'table17': TABLE_17_META,
  'table18': TABLE_18_META,
  'table19': TABLE_19_META,
  'table20': TABLE_20_META,
  'table21': TABLE_21_META,
  'table22': TABLE_22_META,
  'table23': TABLE_23_META,
  'table24': TABLE_24_META,
  'table25': TABLE_25_META,
  'table26': TABLE_26_META,
  'table27': TABLE_27_META,
  'table28': TABLE_28_META,
  'table29': TABLE_29_META,
  'table30': TABLE_30_META,
  'table31': TABLE_31_META,
};

export const CSA_C22_3_NO1_TABLES_DATA = {
  'table1': { meta: TABLE_1_META, rows: TABLE_1_CURVE_POINTS, type: 'points' },
  'table2': { meta: TABLE_2_META, columns: TABLE_2_COLUMNS, rows: TABLE_2_ROWS, footnotes: TABLE_2_FOOTNOTES, type: 'matrix' },
  'table3': { meta: TABLE_3_META, columns: TABLE_3_COLUMNS, rows: TABLE_3_ROWS, type: 'matrix' },
  'table4': { meta: TABLE_4_META, columns: TABLE_4_COLUMNS, rows: TABLE_4_ROWS, footnotes: TABLE_4_FOOTNOTES, type: 'matrix' },
  'table5': { meta: TABLE_5_META, columns: TABLE_5_COLUMNS, rows: TABLE_5_ROWS, type: 'table' },
  'table6': { meta: TABLE_6_META, columns: TABLE_6_TRACK_TYPES, rows: TABLE_6_WIRE_CATEGORIES, type: 'matrix' },
  'table7': { meta: TABLE_7_META, rows: TABLE_7_ROWS, type: 'table' },
  'table8': { meta: TABLE_8_META, columns: TABLE_8_SURFACE_TYPES, rows: TABLE_8_ROWS, type: 'matrix' },
  'table9': {
    meta: TABLE_9_META,
    columns: [
      { id: 'buildings_horizontal', label: 'To buildings — Horizontal (m)' },
      { id: 'buildings_vertical', label: 'To buildings — Vertical (m)' },
      { id: 'signs_horizontal', label: 'To signs, billboards & lamp standards — Horizontal (m)' },
      { id: 'signs_vertical', label: 'To signs, billboards & lamp standards — Vertical (m)' }
    ],
    rows: TABLE_9_ROWS,
    type: 'matrix'
  },
  'table10': { meta: TABLE_10_META, columns: TABLE_10_COLUMNS, rows: TABLE_10_ROWS, type: 'matrix' },
  'table11': { meta: TABLE_11_META, rows: TABLE_11_ROWS, type: 'table' },
  'table12': { meta: TABLE_12_META, rows: TABLE_12_ROWS, type: 'table' },
  'table13': {
    meta: TABLE_13_META,
    columns: TABLE_13_UPPER_COLUMNS_AC,
    rows: TABLE_13_CROSSINGS_AC_UPPER,
    dcColumns: TABLE_13_UPPER_COLUMNS_DC,
    dcRows: TABLE_13_CROSSINGS_DC_UPPER,
    type: 'matrix'
  },
  'table14': { meta: TABLE_14_META, columns: TABLE_14_COLUMNS, rows: TABLE_14_ROWS, type: 'matrix' },
  'table15': { meta: TABLE_15_META, rows: TABLE_15_ROWS, type: 'table' },
  'table16': { meta: TABLE_16_META, rows: TABLE_16_ROWS, type: 'table' },
  'table17': { meta: TABLE_17_META, rows: TABLE_17_ROWS, type: 'table' },
  'table18': { meta: TABLE_18_META, columns: TABLE_18_HIGHER_LEVEL_COLUMNS, rows: TABLE_18_ROWS, type: 'matrix' },
  'table19': { meta: TABLE_19_META, rows: TABLE_19_ROWS, type: 'table' },
  'table20': { meta: TABLE_20_META, rows: TABLE_20_ROWS, type: 'table' },
  'table21': { meta: TABLE_21_META, columns: TABLE_21_UPPER_VOLTAGE_COLUMNS, rows: TABLE_21_ROWS, type: 'matrix' },
  'table22': { meta: TABLE_22_META, columns: TABLE_22_COLUMNS, rows: TABLE_22_ROWS, type: 'matrix' },
  'table23': { meta: TABLE_23_META, columns: TABLE_23_VOLTAGE_COLUMNS, rows: TABLE_23_ROWS, type: 'matrix' },
  'table24': { meta: TABLE_24_META, rows: TABLE_24_ROWS, type: 'table' },
  'table25': { meta: TABLE_25_META, rows: TABLE_25_ROWS, type: 'table' },
  'table26': { meta: TABLE_26_META, rows: TABLE_26_ROWS, type: 'table' },
  'table27': { meta: TABLE_27_META, rows: TABLE_27_ROWS, type: 'table' },
  'table28': { meta: TABLE_28_META, rows: TABLE_28_ROWS, type: 'table' },
  'table29': { meta: TABLE_29_META, rows: TABLE_29_ROWS, type: 'table' },
  'table30': { meta: TABLE_30_META, rows: TABLE_30_LOADING_AREAS, type: 'list' },
  'table31': { meta: TABLE_31_META, rows: TABLE_31_LOAD_FACTORS, type: 'ocf' },
};
