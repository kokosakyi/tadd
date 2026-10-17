/**
 * Calculation Audit Trace Engine
 * Conforms to §10.2 of CSA C22.3 Digital Code & Design App Plan.
 * Provides immutable, unit-aware trace records linking computed engineering values
 * to governing editions, clauses, table rows, and owner overlays.
 */

import type { CalcTraceRecord, TraceRecordParams, CitationParams, CalcStep } from '../../types/trace';

/**
 * Creates a structured calculation trace record
 */
export function createTraceRecord({
  calculatorId,
  snapshotVersion = 'C22.3-1:2020',
  inputs = {},
  steps = [],
  result = {},
  citations = [],
  notes = []
}: TraceRecordParams): CalcTraceRecord {
  return {
    calcId: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    calculatorId,
    snapshotVersion,
    inputs: { ...inputs },
    steps: steps.map((s: CalcStep) => ({
      op: s.op || 'calc',
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
export function formatCitation({
  standard = 'CSA C22.3 No. 1',
  edition = '2020',
  clause,
  table,
  row
}: CitationParams): string {
  const parts = [`${standard}:${edition}`];
  if (clause) parts.push(`Cl. ${clause}`);
  if (table) parts.push(`Table ${table}`);
  if (row !== undefined) parts.push(`Row ${row}`);
  return parts.join(' ');
}
