/**
 * Resolver for CSA C22.3 No. 1 Table 2 clearances (+ Clause 5.3.1.1 modifiers).
 * Pure functions; no UI dependencies. All values in metres.
 */
import {
  TABLE_2_COLUMNS,
  TABLE_2_ROWS,
  TABLE_2_FOOTNOTES,
  TABLE_2_META,
} from '../data/csa/c22_3_no1/table2.js';
import { CLEARANCE_MODIFIERS } from '../data/csa/c22_3_no1/clearanceModifiers.js';

const SQRT3 = Math.sqrt(3);

/** Convert a phase-to-phase voltage to rms line-to-ground (Table 2 Note 1). */
export const llToLg = (vLlKv) => Number(vLlKv) / SQRT3;

function inRange(v, r) {
  if (r.exact !== undefined) return v === r.exact;
  const lowOk = r.minInclusive !== undefined ? v >= r.minInclusive : v > r.minExclusive;
  return lowOk && v <= r.maxInclusive;
}

/**
 * Select the Table 2 column for a circuit.
 * circuit: { kind: 'supply'|'communication'|'grounded'|'trolley', vLgKv?, vLlKv? }
 * Returns { column, flags[], vLgKv }.
 */
export function selectColumn(circuit) {
  const flags = [];
  if (circuit.kind === 'communication' || circuit.kind === 'grounded') {
    return { column: TABLE_2_COLUMNS.find((c) => c.id === 'I'), flags, vLgKv: 0 };
  }
  if (circuit.kind === 'trolley') {
    return { column: TABLE_2_COLUMNS.find((c) => c.id === 'II'), flags, vLgKv: 0 };
  }
  const vLg = circuit.vLgKv !== undefined ? Number(circuit.vLgKv) : llToLg(circuit.vLlKv);
  if (!Number.isFinite(vLg) || vLg < 0) throw new Error('Invalid circuit voltage');

  const supply = TABLE_2_COLUMNS.filter((c) => c.kind === 'supply');
  let col = supply.find((c) => inRange(vLg, c.vLgKv));
  if (!col) {
    // Above 200 kV the table lists fixed classes only (rounded L-G of nominal L-L values,
    // e.g. 735/√3 = 424.35 → "424"). Allow 0.5% tolerance, otherwise round UP to the next class.
    const TOL = 1.005;
    col = supply.find((c) => c.vLgKv.exact !== undefined && c.vLgKv.exact * TOL >= vLg);
    if (!col) throw new Error(`Voltage ${vLg.toFixed(1)} kV line-to-ground exceeds Table 2 (max 424 kV)`);
    if (Math.abs(col.vLgKv.exact - vLg) / col.vLgKv.exact > 0.005) flags.push('ROUNDED_UP_TO_FIXED_CLASS');
  }
  return { column: col, flags, vLgKv: vLg };
}

/**
 * Resolve the Table 2 clearance for a context.
 * ctx = {
 *   rowId,
 *   circuit: { kind, vLgKv | vLlKv },
 *   site:    { elevationM, maxVehicleHeightM, ballasted, snowCleared, meanAnnualMaxSnowDepthM,
 *              alley, highFarmVehiclesLikely, winterCrossable },
 *   project: { constructedOrAltered, agreedBallastAllowanceM, altitudeStepping }
 * }
 */
export function resolveTable2Clearance(ctx) {
  const row = TABLE_2_ROWS.find((r) => r.id === ctx.rowId);
  if (!row) throw new Error(`Unknown Table 2 row: ${ctx.rowId}`);

  const site = ctx.site ?? {};
  const project = ctx.project ?? {};
  const { column, flags: colFlags, vLgKv } = selectColumn(ctx.circuit);
  const circuit = { ...ctx.circuit, vLgKv };
  const cell = row.cells[column.id];

  const trace = [];
  const flags = [...colFlags];
  const warnings = [];

  if (cell.na) {
    return { applicable: false, reason: `Table 2 lists N/A for "${row.label}" in Col. ${column.id}`, columnId: column.id, rowId: row.id, flags, trace };
  }

  let baseM = cell.m;
  trace.push({ step: 'table2', valueM: baseM, ref: `Table 2, row ${row.id}, Col. ${column.id}` });
  if (cell.basis === 'electrostatic') flags.push('ELECTROSTATIC_BASIS');

  // Cell-level footnotes
  let adjustedM = baseM;
  for (const sym of cell.footnotes) {
    const fn = TABLE_2_FOOTNOTES[sym];
    if (!fn) continue;
    if (fn.effect.type === 'flag') {
      flags.push(fn.effect.code);
    } else if (fn.effect.type === 'override' && sym === '‡') {
      if (ctx.circuit.kind === 'communication' && site.alley === true) {
        trace.push({ step: 'footnote ‡', deltaM: fn.effect.value - adjustedM, ref: 'Table 2 ‡ (alley, communication)' });
        adjustedM = fn.effect.value;
      }
    } else if (fn.effect.type === 'add' && sym === '**') {
      if (site.highFarmVehiclesLikely === false && site.winterCrossable !== true) {
        adjustedM += fn.effect.value;
        trace.push({ step: 'footnote **', deltaM: fn.effect.value, ref: 'Table 2 ** (farmland not travelled by high vehicles)' });
      }
    }
  }
  const tableValueM = adjustedM;

  // Row-level footnotes (informational)
  for (const sym of row.footnotes) {
    const fn = TABLE_2_FOOTNOTES[sym];
    if (sym === '§') {
      const z = fn.horizontalZoneM[column.id];
      flags.push('HORIZONTAL_ZONE_APPLIES');
      trace.push({ step: 'footnote §', horizontalZone: resolveZone(z, vLgKv), ref: 'Table 2 § (swing / adjacent vehicle land)' });
    }
    if (sym === '‡‡') flags.push('SEE_5_3_1_1_C');
  }

  // Clause 5.3.1.1 modifiers (summed against the table value)
  const mctx = { row, column, circuit, site, project };
  let modifiersM = 0;
  for (const m of [...CLEARANCE_MODIFIERS].sort((a, b) => a.order - b.order)) {
    if (!m.appliesWhen(mctx)) continue;
    const d = m.compute(mctx, tableValueM);
    modifiersM += d;
    trace.push({ step: m.id, deltaM: d, ref: `Cl. ${m.clause}`, note: m.describe(mctx, d) });
  }

  const finalM = tableValueM + modifiersM;
  if (cell.basis === 'electrostatic' && modifiersM > 0) {
    warnings.push('Modifiers added to an electrostatic-basis (†) value; verify they apply.');
  }
  if (site.elevationM > 1000 && circuit.vLgKv <= 50) {
    trace.push({ step: 'altitude', deltaM: 0, ref: 'Cl. 5.3.1.1(b)', note: 'Not applicable: voltage ≤ 50 kV' });
  }

  return {
    applicable: true,
    rowId: row.id,
    columnId: column.id,
    basis: cell.basis,
    baseM,
    tableValueM,
    modifiersM,
    finalM,
    flags: [...new Set(flags)],
    warnings,
    trace,
    evaluatedAt: TABLE_2_META.evaluatedAt,
  };
}

function resolveZone(z, vLgKv) {
  if (typeof z === 'number') return { distanceM: z, condition: 'swing' };
  if (z.fixed !== undefined) return { distanceM: z.fixed, condition: z.condition };
  return { distanceM: z.base + z.perKvOver150 * Math.max(0, vLgKv - 150), condition: z.condition };
}
