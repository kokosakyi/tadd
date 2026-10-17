/**
 * Universal CSA Table Content Resolver
 * Provides live structured rows, columns, notes, and reverse reference data
 * for all 83 digitized tables across CSA C22.3 No. 1, No. 60826, and CSA O15.
 */

import { CSA_C22_3_NO1_TABLES_DATA } from '../../data/csa/c22_3_no1/index.js';
import { CSA_60826_TABLES } from '../../data/csa/c22_3_60826/index.js';
import {
  CSA_O15_KNOT_SIZES,
  CSA_O15_SPIRAL_GRAIN,
  CSA_O15_SPECIES,
  CSA_O15_POLE_CLASSES,
  CSA_O15_STUB_CLASSES,
  TABLE_1_META as O15_TABLE_1_META,
  TABLE_2_META as O15_TABLE_2_META,
  TABLE_3_META as O15_TABLE_3_META,
  TABLE_B1_META as O15_TABLE_B1_META,
  TABLE_C1_META as O15_TABLE_C1_META
} from '../../data/csa/o15/index.js';

import { TABLES_MAP } from '../../data/csa/digitized/index.js';
import type { CsaTable } from '../../types/csaCode';

export interface TableDetailsResult extends CsaTable {
  details?: Record<string, unknown> | null;
}

/**
 * Get full data model for any of the 83 digitized tables
 * @param tableId e.g. 'c22_3_no1_table2', 'c22_3_60826_tableCA1', 'csa_o15_table3'
 */
export function getTableDetails(tableId: string): TableDetailsResult | null {
  if (!tableId) return null;
  const tablesMap = TABLES_MAP as Record<string, any>;
  const tblMeta = tablesMap[tableId] || Object.values(tablesMap).find((t: any) => {
    return t.id === tableId || t.key === tableId;
  });
  if (!tblMeta) return null;

  const stdId = tblMeta.standardId;
  const key = tblMeta.key; // e.g. 'table2', 'tableCA1', 'table3'

  let data: Record<string, unknown> | null = null;

  if (stdId === 'c22_3_no1') {
    data = (CSA_C22_3_NO1_TABLES_DATA as Record<string, any>)[key] || null;
  } else if (stdId === 'c22_3_60826') {
    const tables60826 = CSA_60826_TABLES as Record<string, any>;
    const mapped = tables60826[tblMeta.number] || tables60826[key];
    if (mapped) {
      data = {
        meta: mapped.meta,
        rows: mapped.rows,
        type: Array.isArray(mapped.rows) ? 'array' : 'object'
      };
    }
  } else if (stdId === 'csa_o15') {
    if (key === 'table1') {
      data = { meta: O15_TABLE_1_META, rows: CSA_O15_KNOT_SIZES, type: 'object' };
    } else if (key === 'table2') {
      data = { meta: O15_TABLE_2_META, rows: CSA_O15_SPIRAL_GRAIN, type: 'object' };
    } else if (key === 'table3') {
      data = { meta: O15_TABLE_3_META, rows: CSA_O15_SPECIES, type: 'species' };
    } else if (key === 'tableB1') {
      data = { meta: O15_TABLE_B1_META, rows: CSA_O15_POLE_CLASSES, type: 'classes' };
    } else if (key === 'tableC1') {
      data = { meta: O15_TABLE_C1_META, rows: CSA_O15_STUB_CLASSES, type: 'stubs' };
    }
  }

  return {
    ...tblMeta,
    details: data
  };
}
