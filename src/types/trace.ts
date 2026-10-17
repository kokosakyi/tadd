/**
 * Types for Calculation Audit Traces (§10.2 CSA C22.3 Digital Code & Design App Plan)
 */

export type StepOp = 'lookup' | 'adder' | 'multiplier' | 'overlay' | 'calc' | 'formula';

export interface CalcStep {
  op: StepOp;
  ref?: string;
  description: string;
  value: number | string | boolean | null;
  unit?: string;
}

export interface TraceRecordParams {
  calculatorId: string;
  snapshotVersion?: string;
  inputs?: Record<string, unknown>;
  steps?: CalcStep[];
  result?: Record<string, unknown>;
  citations?: string[];
  notes?: string[];
}

export interface CalcTraceRecord {
  calcId: string;
  timestamp: string;
  calculatorId: string;
  snapshotVersion: string;
  inputs: Record<string, unknown>;
  steps: CalcStep[];
  result: Record<string, unknown>;
  citations: string[];
  notes: string[];
}

export interface CitationParams {
  standard?: string;
  edition?: string;
  clause?: string;
  table?: string;
  row?: string | number;
}
