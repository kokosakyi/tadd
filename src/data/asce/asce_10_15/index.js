/**
 * ASCE/SEI 10-15 (Design of Latticed Steel Transmission Structures) Data Module Index
 *
 * Provides structured access to:
 * - Table 3.4-1: Slenderness limits and effective length (KL/r) equations (Curves 1–6)
 * - Table 7.2-1: Anchor bolt base friction coefficients (μ) and foundation anchorage equations
 * - Table C2-1: Potential horizontal plan bracing and diaphragm locations (Fig. C2-1)
 * - Table C4-1: A394 Type 0 bolt connecting A36 steel — end, rolled edge, and spacing distances
 * - Table C.11-1: Current and historical ASTM/CSA steel & bolt specifications
 */

import { TABLE_3_4_1_META, ASCE_10_15_TABLE_3_4_1_ROWS } from './table3_4_1.js';
import { TABLE_7_2_1_META, ASCE_10_15_TABLE_7_2_1_ROWS } from './table7_2_1.js';
import { TABLE_C2_1_META, ASCE_10_15_TABLE_C2_1_ROWS } from './tableC2_1.js';
import { TABLE_C4_1_META, ASCE_10_15_TABLE_C4_1_ROWS } from './tableC4_1.js';
import { TABLE_C_11_1_META, ASCE_10_15_TABLE_C_11_1_ROWS } from './tableC_11_1.js';

export {
  TABLE_3_4_1_META,
  ASCE_10_15_TABLE_3_4_1_ROWS,
  TABLE_7_2_1_META,
  ASCE_10_15_TABLE_7_2_1_ROWS,
  TABLE_C2_1_META,
  ASCE_10_15_TABLE_C2_1_ROWS,
  TABLE_C4_1_META,
  ASCE_10_15_TABLE_C4_1_ROWS,
  TABLE_C_11_1_META,
  ASCE_10_15_TABLE_C_11_1_ROWS
};

export const ASCE_10_15_TABLES = {
  table3_4_1: {
    meta: TABLE_3_4_1_META,
    rows: ASCE_10_15_TABLE_3_4_1_ROWS
  },
  table7_2_1: {
    meta: TABLE_7_2_1_META,
    rows: ASCE_10_15_TABLE_7_2_1_ROWS
  },
  tableC2_1: {
    meta: TABLE_C2_1_META,
    rows: ASCE_10_15_TABLE_C2_1_ROWS
  },
  tableC4_1: {
    meta: TABLE_C4_1_META,
    rows: ASCE_10_15_TABLE_C4_1_ROWS
  },
  tableC_11_1: {
    meta: TABLE_C_11_1_META,
    rows: ASCE_10_15_TABLE_C_11_1_ROWS
  }
};
