/**
 * Resolver for CSA C22.3 No. 1 Table 4 clearances (+ Clause 5.3.1.1 modifiers).
 * Pure functions; no UI dependencies. All clearance values in metres.
 */
import {
  TABLE_4_COLUMNS,
  TABLE_4_ROWS,
  TABLE_4_FOOTNOTES,
  TABLE_4_META,
} from '../data/csa/c22_3_no1/table4.js';
import { CLEARANCE_MODIFIERS } from '../data/csa/c22_3_no1/clearanceModifiers.js';
import { resolveTable2Clearance } from './csaTable2Resolver.js';

function inRange(v, r) {
  const lowOk = r.minInclusive !== undefined ? v >= r.minInclusive : v > r.minExclusive;
  if (r.maxInclusive !== undefined) {
    return lowOk && v <= r.maxInclusive;
  }
  return lowOk;
}

/**
 * Select the Table 4 column for a DC circuit.
 * circuit: { kind: 'supply' | 'bipole' | 'monopole', vLgKv?: number, vPoleToPoleKv?: number }
 * Returns: { column, flags[], vLgKv, adderOver500Kv: number }
 */
export function selectDcColumn(circuit) {
  const flags = [];

  // Determine line-to-ground voltage in kV dc
  let vLg = circuit.vLgKv !== undefined
    ? Number(circuit.vLgKv)
    : (circuit.vPoleToPoleKv !== undefined ? Number(circuit.vPoleToPoleKv) / 2 : NaN);

  if (!Number.isFinite(vLg) || vLg < 0) {
    throw new Error('Invalid dc circuit voltage');
  }

  // Under 0.75 kV: Note * directs to Table 2 Columns II and III
  if (vLg < 0.75) {
    flags.push('USE_TABLE_2_BELOW_0_75_KV');
    return {
      redirectTable2: true,
      flags,
      vLgKv: vLg,
    };
  }

  // Find column
  let col = TABLE_4_COLUMNS.find((c) => inRange(vLg, c.vLgKv));
  let adderOver500Kv = 0;

  if (!col) {
    // If voltage > 500 kV, Footnote ‡ applies: Column IX base + 0.005 m/kV for each kV over 500 kV
    if (vLg > 500) {
      col = TABLE_4_COLUMNS.find((c) => c.id === 'IX');
      adderOver500Kv = (vLg - 500) * 0.005;
      flags.push('VOLTAGE_EXCEEDS_500KV_ADDER_APPLIED');
    } else {
      throw new Error(`Unable to determine Table 4 column for dc voltage ${vLg} kV`);
    }
  }

  return { column: col, flags, vLgKv: vLg, adderOver500Kv };
}

/**
 * Resolve the Table 4 clearance for a context.
 * ctx = {
 *   rowId: string,
 *   circuit: { kind?: 'supply', vLgKv?: number, vPoleToPoleKv?: number },
 *   site?: {
 *     elevationM?: number,
 *     maxVehicleHeightM?: number,
 *     ballasted?: boolean,
 *     snowCleared?: boolean,
 *     meanAnnualMaxSnowDepthM?: number,
 *   },
 *   project?: {
 *     constructedOrAltered?: boolean,
 *     agreedBallastAllowanceM?: number,
 *     altitudeStepping?: 'wholeSteps' | 'continuous',
 *   }
 * }
 */
export function resolveTable4Clearance(ctx) {
  const row = TABLE_4_ROWS.find((r) => r.id === ctx.rowId);
  if (!row) throw new Error(`Unknown Table 4 row: ${ctx.rowId}`);

  const site = ctx.site ?? {};
  const project = ctx.project ?? {};
  const colSelection = selectDcColumn(ctx.circuit);

  // If redirected to Table 2 (voltage < 0.75 kV)
  if (colSelection.redirectTable2) {
    const table2Ctx = {
      ...ctx,
      circuit: {
        kind: 'supply',
        vLgKv: colSelection.vLgKv,
      },
    };
    const t2Res = resolveTable2Clearance(table2Ctx);
    return {
      ...t2Res,
      redirectedFromTable4: true,
      flags: [...t2Res.flags, ...colSelection.flags],
      note: 'Evaluated under Table 2 per Table 4 Footnote * (voltage < 0.75 kV dc).',
    };
  }

  const { column, flags: colFlags, vLgKv, adderOver500Kv } = colSelection;
  const circuit = { ...ctx.circuit, vLgKv };
  const cell = row.cells[column.id];

  const trace = [];
  const flags = [...colFlags];
  const warnings = [];

  if (cell.na) {
    return {
      applicable: false,
      reason: `Table 4 lists N/A for "${row.label}" in Col. ${column.id}`,
      columnId: column.id,
      rowId: row.id,
      flags,
      trace,
    };
  }

  let baseM = cell.m;
  trace.push({
    step: 'table4_base',
    valueM: baseM,
    ref: `Table 4, row ${row.id}, Col. ${column.id}`,
  });

  // Voltage adder if > 500 kV (Footnote ‡)
  let tableValueM = baseM;
  if (adderOver500Kv > 0) {
    tableValueM += adderOver500Kv;
    trace.push({
      step: 'voltage_adder_over_500kv',
      deltaM: adderOver500Kv,
      ref: 'Table 4 Footnote ‡ (+0.005 m/kV over 500 kV)',
    });
  }

  // Row-level footnotes / references
  for (const sym of row.footnotes) {
    if (sym === '†') flags.push('SEE_5_3_1_1_D');
    if (sym === '**') flags.push('SEE_5_3_1_1_C');
    if (sym === '§') flags.push('LOW_VEHICLE_LIKELIHOOD_AREA');
  }

  // Clause 5.3.1.1 modifiers (vehicular, altitude, ballast, road resurfacing, snow)
  const mctx = { row, column, circuit, site, project };
  let modifiersM = 0;
  for (const m of [...CLEARANCE_MODIFIERS].sort((a, b) => a.order - b.order)) {
    if (!m.appliesWhen(mctx)) continue;
    const d = m.compute(mctx, tableValueM);
    modifiersM += d;
    trace.push({
      step: m.id,
      deltaM: d,
      ref: `Cl. ${m.clause}`,
      note: m.describe(mctx, d),
    });
  }

  const finalM = tableValueM + modifiersM;

  return {
    applicable: true,
    rowId: row.id,
    columnId: column.id,
    baseM,
    adderOver500Kv,
    tableValueM,
    modifiersM,
    finalM,
    flags: [...new Set(flags)],
    warnings,
    trace,
    evaluatedAt: TABLE_4_META.evaluatedAt,
  };
}
