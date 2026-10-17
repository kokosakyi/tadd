/**
 * Clearance Engine (Rules-as-Code & Calcs-with-Trace)
 * Conforms to CSA C22.3 No. 1 Clause 5.3 & Table 2 and §9.4 / §10.2 of App Plan.
 */

import { resolveTable2Clearance } from '../../utils/csaTable2Resolver.js';
import { TABLE_2_ROWS } from '../../data/csa/c22_3_no1/table2.js';
import { createTraceRecord } from '../trace/calcTrace';
import type { UtilityOverlay, VerticalClearanceInput } from '../../types/clearance';
import type { CalcStep } from '../../types/trace';

export const UTILITY_OVERLAYS: UtilityOverlay[] = [
  { id: 'csa_std', label: 'CSA Base Standard (No Buffer)', bufferM: 0.0, description: 'Direct CSA C22.3 No. 1 baseline' },
  { id: 'hydro_one', label: 'Hydro One / Ontario Standard (+0.3 m)', bufferM: 0.3, description: 'Ontario distributor safety & re-sag buffer' },
  { id: 'bc_hydro', label: 'BC Hydro Standard (+0.5 m)', bufferM: 0.5, description: 'BC Hydro design clearance buffer' },
  { id: 'altalink', label: 'AltaLink / ATCO Standard (+0.3 m)', bufferM: 0.3, description: 'Alberta transmission safety margin' },
  { id: 'custom', label: 'Custom User Buffer', bufferM: 0.0, description: 'User-specified engineering buffer' }
].sort((a, b) => a.label.localeCompare(b.label));

/**
 * Evaluates vertical clearance compliance with full audit trace
 */
export function calculateVerticalClearance({
  rowId = 'road_vehicular',
  operatingVoltageKv = 25.0,
  circuitKind = 'supply',
  elevationMeters = 0,
  ownerOverlayId = 'csa_std',
  customBufferM = 0.0,
  attachmentHeightM = 12.0,
  midspanSagM = 2.5,
  obstacleHeightM = 0.0,
  thermalSagBufferM = 0.3,
  iceWindSagBufferM = 0.5,
  siteOptions = {}
}: VerticalClearanceInput = {}) {
  const tableRows = TABLE_2_ROWS as Array<{ id: string; label: string; [key: string]: any }>;
  const row = tableRows.find((r) => r.id === rowId) || tableRows[0];
  const overlay = UTILITY_OVERLAYS.find((o) => o.id === ownerOverlayId) || UTILITY_OVERLAYS[0];
  const ownerBuffer = ownerOverlayId === 'custom' ? Number(customBufferM) || 0 : overlay.bufferM;

  // 1. Resolve CSA Table 2 base + code modifiers
  const t2Result = resolveTable2Clearance({
    rowId: row.id,
    circuit: { kind: circuitKind, vLlKv: operatingVoltageKv },
    site: { elevationM: elevationMeters, ...siteOptions },
    project: {}
  });

  const baseTableClearanceM: number = t2Result.baseM || 0;
  const modifiersM: number = t2Result.modifiersM || 0;
  const csaRequiredM: number = t2Result.finalM || baseTableClearanceM;

  // 2. Add Owner Overlay Buffer
  const designRequiredClearanceM = Number((csaRequiredM + ownerBuffer).toFixed(3));

  // 3. Side-by-Side Sag Condition Analysis
  const thermalSag = Number(thermalSagBufferM) || 0;
  const iceSag = Number(iceWindSagBufferM) || 0;

  const thermalTotalReqM = Number((designRequiredClearanceM + thermalSag).toFixed(3));
  const iceTotalReqM = Number((designRequiredClearanceM + iceSag).toFixed(3));

  const isIceGoverning = iceSag > thermalSag;
  const governingSagCondition = isIceGoverning ? 'CSA Ice & Wind Weather Load' : 'Max Thermal Operating Sag';
  const governingRequiredM = Math.max(thermalTotalReqM, iceTotalReqM);

  // 4. Actual Conductor Heights & Field Clearances
  const hAtt = Number(attachmentHeightM) || 12.0;
  const sag = Number(midspanSagM) || 2.5;
  const hObs = Number(obstacleHeightM) || 0.0;

  const baseConductorLowestPointM = hAtt - sag;
  const thermalActualClearanceM = Number((baseConductorLowestPointM - thermalSag - hObs).toFixed(3));
  const iceActualClearanceM = Number((baseConductorLowestPointM - iceSag - hObs).toFixed(3));

  const actualClearanceM = Math.min(thermalActualClearanceM, iceActualClearanceM);
  const clearanceMarginM = Number((actualClearanceM - designRequiredClearanceM).toFixed(3));

  let status: 'PASS' | 'MARGINAL' | 'VIOLATION' = 'PASS';
  if (clearanceMarginM < 0 && clearanceMarginM >= -0.3) {
    status = 'MARGINAL';
  } else if (clearanceMarginM < -0.3) {
    status = 'VIOLATION';
  }

  // 5. Construct Audit Trace
  const steps: CalcStep[] = [
    {
      op: 'lookup',
      ref: `Table 2, row "${row.id}", Col. ${t2Result.columnId}`,
      description: `Base clearance for "${row.label}"`,
      value: baseTableClearanceM,
      unit: 'm'
    }
  ];

  if (modifiersM !== 0) {
    steps.push({
      op: 'adder',
      ref: 'Cl. 5.3.1.1 (Modifiers)',
      description: 'Voltage adder / altitude / roadway modifier adjustments',
      value: modifiersM,
      unit: 'm'
    });
  }

  if (ownerBuffer > 0) {
    steps.push({
      op: 'overlay',
      ref: overlay.id,
      description: `Owner buffer (${overlay.label})`,
      value: ownerBuffer,
      unit: 'm'
    });
  }

  steps.push({
    op: 'calc',
    ref: 'Field Margin',
    description: `Conductor lowest point (${actualClearanceM} m) minus required (${designRequiredClearanceM} m)`,
    value: clearanceMarginM,
    unit: 'm'
  });

  const trace = createTraceRecord({
    calculatorId: 'clearance.vertical',
    snapshotVersion: 'C22.3-1:2020',
    inputs: {
      rowId: row.id,
      operatingVoltageKv,
      circuitKind,
      elevationMeters,
      ownerOverlayId,
      ownerBuffer,
      attachmentHeightM: hAtt,
      midspanSagM: sag,
      obstacleHeightM: hObs,
      thermalSagBufferM: thermalSag,
      iceWindSagBufferM: iceSag
    },
    steps,
    result: {
      baseTableClearanceM,
      modifiersM,
      csaRequiredM,
      ownerBufferM: ownerBuffer,
      designRequiredClearanceM,
      thermalTotalReqM,
      iceTotalReqM,
      governingSagCondition,
      governingRequiredM,
      actualClearanceM,
      clearanceMarginM,
      status
    },
    citations: [
      `CSA C22.3 No. 1:20 Table 2, Row "${row.id}"`,
      'CSA C22.3 No. 1:20 Cl. 5.3.1.1'
    ],
    notes: t2Result.warnings || []
  });

  return {
    result: {
      row,
      columnId: t2Result.columnId,
      baseTableClearanceM,
      modifiersM,
      csaRequiredM,
      ownerBufferM: ownerBuffer,
      designRequiredClearanceM,
      thermalTotalReqM,
      iceTotalReqM,
      governingSagCondition,
      isIceGoverning,
      attachmentHeightM: hAtt,
      midspanSagM: sag,
      obstacleHeightM: hObs,
      baseConductorLowestPointM,
      thermalActualClearanceM,
      iceActualClearanceM,
      actualClearanceM,
      clearanceMarginM,
      status,
      flags: t2Result.flags
    },
    trace
  };
}
