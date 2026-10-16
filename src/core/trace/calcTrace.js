/**
 * Calculation Audit Trace Engine
 * Conforms to §10.2 of CSA C22.3 Digital Code & Design App Plan.
 * Provides immutable, unit-aware trace records linking computed engineering values
 * to governing editions, clauses, table rows, and owner overlays.
 */

/**
 * Creates a structured calculation trace record
 * @param {object} params
 * @param {string} params.calculatorId Identifier of calculator (e.g. 'clearance.vertical', 'weather.matrix')
 * @param {string} params.snapshotVersion Pinned library snapshot (e.g. 'C22.3-1:2020')
 * @param {object} params.inputs Key-value dictionary of raw inputs
 * @param {Array<object>} params.steps Array of calculation steps { op, ref, description, value, unit }
 * @param {object} params.result Computed result summary
 * @param {Array<string>} [params.citations] Governing standards citations
 * @param {Array<string>} [params.notes] Engineering considerations or caveats
 * @returns {object} Formatted calculation trace object
 */
export function createTraceRecord({
  calculatorId,
  snapshotVersion = 'C22.3-1:2020',
  inputs = {},
  steps = [],
  result = {},
  citations = [],
  notes = []
}) {
  return {
    calcId: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    calculatorId,
    snapshotVersion,
    inputs: { ...inputs },
    steps: steps.map((s) => ({
      op: s.op || 'calc', // 'lookup' | 'adder' | 'multiplier' | 'overlay' | 'calc' | 'formula'
      ref: s.ref || '',
      description: s.description || '',
      value: s.value !== undefined ? s.value : null,
      unit: s.unit || ''
    })),
    result: { ...result },
    citations: [...citations],
    notes: [...notes]
  };
}

/**
 * Formats a citation string according to §8.3 format
 */
export function formatCitation({ standard = 'CSA C22.3 No. 1', edition = '2020', clause, table, row }) {
  const parts = [`${standard}:${edition}`];
  if (clause) parts.push(`Cl. ${clause}`);
  if (table) parts.push(`Table ${table}`);
  if (row) parts.push(`Row ${row}`);
  return parts.join(' ');
}
