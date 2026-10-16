/**
 * Resolver for CSA C22.3 No. 1 Table 6 horizontal design clearances
 * between wires and railway tracks (Clauses 5.4.2 & 5.4.3).
 *
 * Pure functions; no UI dependencies. All clearance values in metres.
 */
import {
  TABLE_6_META,
  TABLE_6_TRACK_TYPES,
  TABLE_6_WIRE_CATEGORIES,
} from '../data/csa/c22_3_no1/table6.js';

function inRange(v, r) {
  if (!r) return false;
  const lowOk = r.minInclusive !== undefined ? v >= r.minInclusive : v > r.minExclusive;
  if (r.maxInclusive !== undefined) {
    return lowOk && v <= r.maxInclusive;
  }
  return lowOk;
}

/**
 * Resolves the matching wire category from Table 6 given circuit parameters.
 *
 * @param {object} params
 * @param {string} [params.wireCategoryId] - Pre-selected wire category ID
 * @param {string} [params.systemType='AC'] - 'AC' | 'DC' | 'GROUNDED_OR_COMM' | 'METALLIC_SHEATH'
 * @param {number} [params.vLgKv] - Operating voltage line-to-ground in kV
 * @returns {object|null} Wire category definition
 */
export function resolveTable6WireCategory({
  wireCategoryId,
  systemType = 'AC',
  vLgKv,
}) {
  if (wireCategoryId) {
    return TABLE_6_WIRE_CATEGORIES.find((c) => c.id === wireCategoryId) || null;
  }

  if (systemType === 'GROUNDED_OR_COMM') {
    return TABLE_6_WIRE_CATEGORIES.find((c) => c.id === 'grounded_and_comm') || null;
  }

  if (systemType === 'METALLIC_SHEATH') {
    return (
      TABLE_6_WIRE_CATEGORIES.find(
        (c) => c.id === 'supply_0_750v_or_metallic_sheathed'
      ) || null
    );
  }

  if (vLgKv == null || isNaN(vLgKv) || vLgKv < 0) {
    return null;
  }

  if (systemType === 'AC') {
    if (vLgKv <= 0.75) {
      return (
        TABLE_6_WIRE_CATEGORIES.find(
          (c) => c.id === 'supply_0_750v_or_metallic_sheathed'
        ) || null
      );
    }
    const match = TABLE_6_WIRE_CATEGORIES.find(
      (c) => c.systemType === 'AC' && inRange(vLgKv, c.vLgKv)
    );
    return match || null;
  }

  if (systemType === 'DC') {
    const match = TABLE_6_WIRE_CATEGORIES.find(
      (c) => c.systemType === 'DC' && inRange(vLgKv, c.vLgKv)
    );
    return match || null;
  }

  return null;
}

/**
 * Calculates horizontal design clearance between wires and railway tracks.
 *
 * Evaluates:
 * - Table 6 Base Clearance
 * - Clause 5.4.3 Track Curvature increment (+25 mm / degree of curvature = 0.025 m / deg)
 * - Clause 5.4.3 Superelevation increment (+2.5 mm / mm of superelevation = 0.0025 m / mm)
 *   applicable when wire is closer to the low side of tracks at different elevations.
 * - Clause 5.4.3 Cap: Total of curvature + superelevation increments <= 0.75 m.
 *   (Note: user may choose useFixedMaxCurveAdder=true to use 0.75 m in place of calculations).
 *
 * @param {object} params
 * @param {string} params.trackTypeId - 'main_tracks' | 'siding'
 * @param {string} [params.wireCategoryId] - Pre-selected wire category ID
 * @param {string} [params.systemType='AC'] - 'AC' | 'DC' | 'GROUNDED_OR_COMM' | 'METALLIC_SHEATH'
 * @param {number} [params.vLgKv] - Voltage line-to-ground in kV
 * @param {number} [params.degreeOfCurvature=0] - Track curvature in degrees
 * @param {boolean} [params.isLowSideOfSuperelevation=false] - Whether wire is on the low side of track superelevation
 * @param {number} [params.superelevationMm=0] - Track superelevation in millimetres
 * @param {boolean} [params.useFixedMaxCurveAdder=false] - Whether to use 0.75 m instead of calculating increments
 * @returns {object} Resolution results
 */
export function resolveTable6Clearance({
  trackTypeId = 'main_tracks',
  wireCategoryId,
  systemType = 'AC',
  vLgKv,
  degreeOfCurvature = 0,
  isLowSideOfSuperelevation = false,
  superelevationMm = 0,
  useFixedMaxCurveAdder = false,
}) {
  const track = TABLE_6_TRACK_TYPES.find((t) => t.id === trackTypeId);
  if (!track) {
    return {
      success: false,
      error: `Invalid trackTypeId "${trackTypeId}". Must be "main_tracks" or "siding".`,
    };
  }

  const category = resolveTable6WireCategory({ wireCategoryId, systemType, vLgKv });
  if (!category) {
    return {
      success: false,
      error: 'Unable to resolve Table 6 wire category. Please verify voltage and circuit type.',
    };
  }

  let baseClearance = 0;
  let voltageAdder = 0;

  if (category.clearances) {
    baseClearance = category.clearances[trackTypeId];
  } else if (category.baseClearances) {
    baseClearance = category.baseClearances[trackTypeId];
    if (category.id === 'ac_over_150kv' && vLgKv > 150) {
      voltageAdder = (vLgKv - 150) * category.voltageIncrementPerKvOver150;
    } else if (category.id === 'dc_over_450kv' && vLgKv > 450) {
      voltageAdder = (vLgKv - 450) * category.voltageIncrementPerKvOver450;
    }
  }

  // Clause 5.4.3 Curvature and Superelevation Adders
  let curvatureAdder = 0;
  let superelevationAdder = 0;
  let totalCurveSuperelevationAdder = 0;
  const notes = [];

  if (useFixedMaxCurveAdder) {
    totalCurveSuperelevationAdder = 0.75;
    notes.push(
      'Per Clause 5.4.3: Fixed maximum increment of 0.75 m applied in place of detailed track curvature calculations.'
    );
  } else {
    if (degreeOfCurvature > 0) {
      // 25 mm per degree of curvature
      curvatureAdder = (degreeOfCurvature * 25) / 1000;
      notes.push(
        `Per Clause 5.4.3: Curvature increment of ${curvatureAdder.toFixed(3)} m added (${degreeOfCurvature}° × 25 mm/°).`
      );
    }

    if (isLowSideOfSuperelevation && superelevationMm > 0) {
      // 2.5 mm per mm of superelevation
      superelevationAdder = (superelevationMm * 2.5) / 1000;
      notes.push(
        `Per Clause 5.4.3: Superelevation increment of ${superelevationAdder.toFixed(3)} m added for wire on low side (${superelevationMm} mm × 2.5 mm/mm).`
      );
    }

    const calculatedSum = curvatureAdder + superelevationAdder;
    if (calculatedSum > 0.75) {
      totalCurveSuperelevationAdder = 0.75;
      notes.push(
        `Per Clause 5.4.3: Total curvature + superelevation increment capped at maximum 0.75 m (calculated ${calculatedSum.toFixed(3)} m).`
      );
    } else {
      totalCurveSuperelevationAdder = calculatedSum;
    }
  }

  const finalClearance = baseClearance + voltageAdder + totalCurveSuperelevationAdder;

  return {
    success: true,
    finalClearance: Number(finalClearance.toFixed(3)),
    baseClearance,
    voltageAdder: Number(voltageAdder.toFixed(3)),
    curvatureAdder: Number(curvatureAdder.toFixed(3)),
    superelevationAdder: Number(superelevationAdder.toFixed(3)),
    totalCurveSuperelevationAdder: Number(totalCurveSuperelevationAdder.toFixed(3)),
    track,
    category,
    appliedClauses: totalCurveSuperelevationAdder > 0 ? ['5.4.2', '5.4.3'] : ['5.4.2'],
    notes,
  };
}

export {
  TABLE_6_META,
  TABLE_6_TRACK_TYPES,
  TABLE_6_WIRE_CATEGORIES,
};
