/**
 * Resolver for CSA C22.3 No. 1 Table 1:
 * "Wire and conductor swing for horizontal design clearance"
 * (See Clauses 5.2.7, A.5.2.7, A.5.8.2, and A.7.6.1)
 *
 * Pure functions; no UI dependencies.
 */

import { TABLE_1_META, TABLE_1_CURVE_POINTS } from '../data/csa/c22_3_no1/table1.js';

/**
 * Linearly interpolates the swing Factor from Table 1 curves given d/w and shelter condition.
 *
 * @param {number} dwRatio - d/w ratio where d is diameter in mm, w is mass in kg/m
 * @param {'non_sheltered'|'partially_sheltered'|'fully_sheltered'} shelterCondition
 * @returns {number} swing Factor (unitless)
 */
export function interpolateTable1Factor(dwRatio, shelterCondition = 'non_sheltered') {
  if (shelterCondition === 'fully_sheltered') {
    return 0; // Clause 5.2.7(c): no allowance required
  }

  const curve = shelterCondition === 'partially_sheltered'
    ? TABLE_1_CURVE_POINTS.partially_sheltered
    : TABLE_1_CURVE_POINTS.non_sheltered;

  const clampedDw = Math.max(curve[0].dw, Math.min(dwRatio, curve[curve.length - 1].dw));

  for (let i = 0; i < curve.length - 1; i++) {
    const p1 = curve[i];
    const p2 = curve[i + 1];
    if (clampedDw >= p1.dw && clampedDw <= p2.dw) {
      const t = (clampedDw - p1.dw) / (p2.dw - p1.dw);
      return p1.factor + t * (p2.factor - p1.factor);
    }
  }

  return curve[curve.length - 1].factor;
}

/**
 * Calculates horizontal conductor swing deviation per Clause 5.2.7 and Table 1.
 *
 * Formula:
 *   Horizontal deviation = Factor × Conductor Sag (including insulator string if unrestrained)
 *
 * @param {object} params
 * @param {number} params.sagM - Final unloaded sag at 40 °C (or NBCC 2.5% July design temp) in metres
 * @param {number} [params.insulatorStringLengthM=0] - Unrestrained suspension insulator length (Cl. 5.2.7(e))
 * @param {number} [params.conductorDiameterMm] - d in mm
 * @param {number} [params.conductorMassKgPerM] - w in kg/m
 * @param {number} [params.dwRatio] - Direct d/w ratio if diameter and mass are not supplied separately
 * @param {'non_sheltered'|'partially_sheltered'|'fully_sheltered'} [params.shelterCondition='non_sheltered']
 * @returns {object} Detailed calculation result
 */
export function calculateTable1ConductorSwing(params = {}) {
  const {
    sagM,
    insulatorStringLengthM = 0,
    conductorDiameterMm,
    conductorMassKgPerM,
    dwRatio,
    shelterCondition = 'non_sheltered',
  } = params;

  if (sagM === undefined || sagM === null || sagM < 0) {
    return { success: false, error: 'Valid conductor sag (sagM >= 0) is required.' };
  }

  let computedDw = dwRatio;
  if (computedDw === undefined || computedDw === null) {
    if (!conductorDiameterMm || !conductorMassKgPerM || conductorMassKgPerM <= 0) {
      return {
        success: false,
        error: 'Either dwRatio or both conductorDiameterMm and conductorMassKgPerM (> 0) must be provided.',
      };
    }
    computedDw = conductorDiameterMm / conductorMassKgPerM;
  }

  const effectiveSagM = Number(sagM) + Number(insulatorStringLengthM);
  const factor = interpolateTable1Factor(computedDw, shelterCondition);
  const horizontalDeviationM = factor * effectiveSagM;

  const notes = [];
  if (shelterCondition === 'fully_sheltered') {
    notes.push('Clause 5.2.7(c): Fully sheltered span; horizontal deviation allowance is 0 m.');
  } else {
    notes.push(
      `Table 1 factor: ${factor.toFixed(3)} for d/w = ${computedDw.toFixed(2)} (${shelterCondition === 'partially_sheltered' ? 'partially sheltered' : 'non-sheltered'}).`
    );
    if (insulatorStringLengthM > 0) {
      notes.push(
        `Clause 5.2.7(e): Added ${insulatorStringLengthM.toFixed(3)} m insulator string length to sag (${sagM} m -> effective sag ${effectiveSagM.toFixed(3)} m).`
      );
    }
    notes.push(
      `Clause 5.2.7(d): Evaluated at final unloaded sag at 40 °C or NBCC 2.5% July design temperature.`
    );
  }

  return {
    success: true,
    horizontalDeviationM: Number(horizontalDeviationM.toFixed(3)),
    factor: Number(factor.toFixed(3)),
    effectiveSagM: Number(effectiveSagM.toFixed(3)),
    dwRatio: Number(computedDw.toFixed(2)),
    shelterCondition,
    notes,
    appliedClauses: ['5.2.7'],
  };
}

export { TABLE_1_META, TABLE_1_CURVE_POINTS };
