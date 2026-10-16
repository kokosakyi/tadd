/**
 * Resolver for CSA C22.3 No. 1 Table 3 clearances (+ Clause 5.3.3.2 modifiers).
 * Pure functions; all values in metres.
 */
import {
  TABLE_3_COLUMNS,
  TABLE_3_ROWS,
  TABLE_3_META,
} from '../data/csa/c22_3_no1/table3.js';
import { WATERWAY_CLEARANCE_MODIFIERS } from '../data/csa/c22_3_no1/waterwayModifiers.js';

const SQRT3 = Math.sqrt(3);

export const llToLg = (vLlKv) => Number(vLlKv) / SQRT3;

function inRange(v, r) {
  if (r.exact !== undefined) return v === r.exact;
  const lowOk = r.minInclusive !== undefined ? v >= r.minInclusive : v > r.minExclusive;
  if (r.maxInclusive !== undefined) {
    return lowOk && v <= r.maxInclusive;
  }
  return lowOk;
}

/**
 * Select the Table 3 column for a circuit.
 * circuit: { kind: 'supply' | 'communication' | 'grounded', vLgKv?, vLlKv? }
 */
export function selectWaterwayColumn(circuit) {
  const flags = [];
  if (circuit.kind === 'communication' || circuit.kind === 'grounded') {
    return { column: TABLE_3_COLUMNS.find((c) => c.id === 'I'), flags, vLgKv: 0 };
  }

  const vLg = circuit.vLgKv !== undefined ? Number(circuit.vLgKv) : llToLg(circuit.vLlKv);
  if (!Number.isFinite(vLg) || vLg < 0) throw new Error('Invalid circuit voltage');

  const supplyCols = TABLE_3_COLUMNS.filter((c) => c.kind === 'supply');
  const col = supplyCols.find((c) => inRange(vLg, c.vLgKv));
  if (!col) {
    throw new Error(`Unable to determine Table 3 column for voltage ${vLg} kV`);
  }
  return { column: col, flags, vLgKv: vLg };
}

/**
 * Resolve Table 3 waterway clearance.
 * ctx = {
 *   crossingClass: 0..7,
 *   circuit: { kind, vLgKv?, vLlKv? },
 *   site: { elevationM, vesselHeightM, tidal, peakTideAllowanceM },
 *   project: { altitudeStepping }
 * }
 */
export function resolveTable3Clearance(ctx) {
  const row = TABLE_3_ROWS.find((r) => r.crossingClass === Number(ctx.crossingClass));
  if (!row) throw new Error(`Unknown Table 3 crossing class: ${ctx.crossingClass}`);

  const site = ctx.site ?? {};
  const project = ctx.project ?? {};
  const { column, flags: colFlags, vLgKv } = selectWaterwayColumn(ctx.circuit);
  const circuit = { ...ctx.circuit, vLgKv };

  const trace = [];
  const flags = [...colFlags];
  const warnings = [];

  const cell = row.cells[column.id];

  // Crossing class 7 requires Transport Canada approval
  if (cell.transportCanadaApproval || cell.special === '§') {
    return {
      applicable: true,
      requiresTransportCanada: true,
      crossingClass: row.crossingClass,
      columnId: column.id,
      clearanceM: null,
      flags: [...flags, 'TRANSPORT_CANADA_APPROVAL_REQUIRED'],
      warnings: ['In Canada, clearances are specified by Transport Canada office. Where tide water has an effect, increase by peak tide.'],
      trace: [{ step: 'jurisdiction', ref: 'Table 3 Footnote §: Clearances specified by Transport Canada' }],
    };
  }

  // Base clearance calculation
  let baseM = 0;
  if (column.id === 'VI' && cell.baseM !== undefined) {
    const kvOver150 = Math.max(0, vLgKv - 150);
    baseM = cell.baseM + (cell.ratePerKvOver150 * kvOver150);
    trace.push({
      step: 'table3_base_formula',
      baseClassM: cell.baseM,
      kvOver150,
      valueM: baseM,
      ref: `Table 3 Col. VI formula: ${cell.baseM} + 0.01 * (${vLgKv.toFixed(2)} - 150)`,
    });
  } else {
    baseM = cell.m;
    trace.push({
      step: 'table3_base',
      valueM: baseM,
      ref: `Table 3, Class ${row.crossingClass}, Col. ${column.id}`,
    });
  }

  // Evaluate modifiers
  let totalModifierM = 0;
  const modifierTraces = [];

  for (const mod of WATERWAY_CLEARANCE_MODIFIERS) {
    if (mod.appliesWhen({ row, column, circuit, site, project })) {
      const deltaM = mod.compute({ row, column, circuit, site, project }, baseM);
      totalModifierM += deltaM;
      modifierTraces.push({
        id: mod.id,
        clause: mod.clause,
        deltaM,
        description: mod.describe({ row, site, project }, deltaM),
      });
    }
  }

  const finalM = baseM + totalModifierM;

  return {
    applicable: true,
    requiresTransportCanada: false,
    crossingClass: row.crossingClass,
    classTitle: row.title,
    referenceVesselHeightM: row.referenceVesselHeightM,
    columnId: column.id,
    columnLabel: column.label,
    baseM,
    totalModifierM,
    finalClearanceM: Number(finalM.toFixed(3)),
    trace: [...trace, ...modifierTraces],
    flags,
    warnings,
  };
}
