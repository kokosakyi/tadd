import type { CalcTraceRecord } from './trace';

export interface UtilityOverlay {
  id: string;
  label: string;
  bufferM: number;
  description: string;
}

export interface VerticalClearanceInput {
  rowId?: string;
  operatingVoltageKv?: number;
  circuitKind?: 'supply' | 'communication' | 'trolley' | 'neutral';
  elevationMeters?: number;
  ownerOverlayId?: string;
  customBufferM?: number;
  attachmentHeightM?: number;
  midspanSagM?: number;
  obstacleHeightM?: number;
  thermalSagBufferM?: number;
  iceWindSagBufferM?: number;
  siteOptions?: Record<string, unknown>;
}

export interface VerticalClearanceResult {
  rowId: string;
  rowLabel: string;
  operatingVoltageKv: number;
  baseTableClearanceM: number;
  modifiersM: number;
  csaRequiredM: number;
  ownerBufferM: number;
  designRequiredClearanceM: number;
  thermalTotalReqM: number;
  iceTotalReqM: number;
  governingSagCondition: string;
  governingRequiredM: number;
  attachmentHeightM: number;
  midspanSagM: number;
  obstacleHeightM: number;
  thermalActualClearanceM: number;
  iceActualClearanceM: number;
  actualClearanceM: number;
  clearanceMarginM: number;
  status: 'PASS' | 'MARGINAL' | 'VIOLATION';
  governingCitation: string;
  trace: CalcTraceRecord;
}
