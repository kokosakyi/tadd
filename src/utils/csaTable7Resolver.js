/**
 * Resolver for CSA C22.3 No. 1 Table 7 horizontal design separations
 * from supporting structures to railway tracks (Clauses 5.5.2, 5.5.3, 5.5.4, 5.5.5, and 5.4.3).
 *
 * Pure functions; no UI dependencies. All clearance/separation values in metres.
 */
import { TABLE_7_META, TABLE_7_ROWS } from '../data/csa/c22_3_no1/table7.js';

/**
 * Resolves the matching track row from Table 7.
 *
 * @param {string} trackId - 'main_tracks' | 'sidings'
 * @returns {object|null}
 */
export function resolveTable7Track(trackId) {
  if (!trackId) return null;
  return TABLE_7_ROWS.find((row) => row.id === trackId) || null;
}

/**
 * Calculates minimum horizontal separation between supporting structures and railway tracks.
 *
 * Evaluates:
 * - Table 7 Base Separation (Straight, level runs: Main tracks = 2.5 m, Sidings = 1.9 m)
 * - Clause 5.5.3 / 5.4.3:
 *     - Track curvature increment (+25 mm / degree of curvature = 0.025 m / deg)
 *     - Superelevation increment (+2.5 mm / mm of superelevation = 0.0025 m / mm)
 *       applicable when structure is closer to the low side of tracks at different elevations.
 *     - Combined increment cap: max 0.75 m (or user may specify fixed 0.75 m).
 * - Clause 5.5.4: Loading sidings driveway requirement
 *     - If isLoadingSiding is true, verifies or enforces additional clearance required by railway.
 * - Clause 5.5.5: Unobstructed view of signals, signs, and similar equipment
 *     - If requiresSignalSightClearance is true, checks or applies sight-line clearance override.
 *
 * @param {object} params
 * @param {string} params.trackId - 'main_tracks' | 'sidings'
 * @param {number} [params.degreeOfCurvature=0] - Track curvature in degrees
 * @param {boolean} [params.isLowSideOfSuperelevation=false] - Whether structure is on low side of superelevation
 * @param {number} [params.superelevationMm=0] - Track superelevation in millimetres
 * @param {boolean} [params.useFixedMaxCurveAdder=false] - Whether to use 0.75 m instead of calculating increments
 * @param {boolean} [params.isLoadingSiding=false] - Clause 5.5.4: Loading siding with driveway requirement
 * @param {number} [params.drivewayWidthM=0] - Clause 5.5.4: Driveway space required by railway (m)
 * @param {boolean} [params.requiresSignalSightClearance=false] - Clause 5.5.5: Sight-line obstruction considerations
 * @param {number} [params.signalSightClearanceM=0] - Clause 5.5.5: Extra separation specified for unobstructed signal view (m)
 * @returns {object} Resolution results
 */
export function resolveTable7Separation({
  trackId = 'main_tracks',
  degreeOfCurvature = 0,
  isLowSideOfSuperelevation = false,
  superelevationMm = 0,
  useFixedMaxCurveAdder = false,
  isLoadingSiding = false,
  drivewayWidthM = 0,
  requiresSignalSightClearance = false,
  signalSightClearanceM = 0,
} = {}) {
  const track = resolveTable7Track(trackId);
  if (!track) {
    return {
      success: false,
      error: `Invalid trackId "${trackId}". Must be one of: ${TABLE_7_ROWS.map((r) => r.id).join(', ')}.`,
    };
  }

  const baseSeparation = track.minHorizontalSeparation;

  let curvatureAdder = 0;
  let superelevationAdder = 0;
  let totalCurveSuperelevationAdder = 0;
  const appliedClauses = ['5.5.2'];
  const notes = [];

  // Clause 5.5.3 (referencing 5.4.3)
  if (useFixedMaxCurveAdder) {
    totalCurveSuperelevationAdder = 0.75;
    appliedClauses.push('5.5.3', '5.4.3');
    notes.push(
      'Per Clause 5.5.3 / 5.4.3: Fixed maximum increment of 0.75 m applied in place of detailed track curvature calculations.'
    );
  } else {
    if (degreeOfCurvature > 0) {
      curvatureAdder = (degreeOfCurvature * 25) / 1000;
      notes.push(
        `Per Clause 5.5.3 / 5.4.3: Curvature increment of ${curvatureAdder.toFixed(3)} m added (${degreeOfCurvature}° × 25 mm/°).`
      );
    }

    if (isLowSideOfSuperelevation && superelevationMm > 0) {
      superelevationAdder = (superelevationMm * 2.5) / 1000;
      notes.push(
        `Per Clause 5.5.3 / 5.4.3: Superelevation increment of ${superelevationAdder.toFixed(3)} m added for structure on low side (${superelevationMm} mm × 2.5 mm/mm).`
      );
    }

    const calculatedSum = curvatureAdder + superelevationAdder;
    if (calculatedSum > 0.75) {
      totalCurveSuperelevationAdder = 0.75;
      appliedClauses.push('5.5.3', '5.4.3');
      notes.push(
        `Per Clause 5.5.3 / 5.4.3: Total curvature + superelevation increment capped at maximum 0.75 m (calculated ${calculatedSum.toFixed(3)} m).`
      );
    } else if (calculatedSum > 0) {
      totalCurveSuperelevationAdder = calculatedSum;
      appliedClauses.push('5.5.3', '5.4.3');
    }
  }

  const standardCalculatedSeparation = baseSeparation + totalCurveSuperelevationAdder;
  let finalSeparation = standardCalculatedSeparation;

  // Clause 5.5.4: Loading sidings driveway requirement
  let loadingSidingAdder = 0;
  if (isLoadingSiding) {
    appliedClauses.push('5.5.4');
    if (trackId !== 'sidings') {
      notes.push(
        'Per Clause 5.5.4: Loading siding condition applied. Ensure track configuration is designated as a siding.'
      );
    }
    if (drivewayWidthM > 0) {
      // If the specified railway driveway requirement exceeds the standard separation, separation is increased
      if (drivewayWidthM > finalSeparation) {
        loadingSidingAdder = drivewayWidthM - finalSeparation;
        finalSeparation = drivewayWidthM;
        notes.push(
          `Per Clause 5.5.4: Separation increased by ${loadingSidingAdder.toFixed(3)} m to provide sufficient space for railway driveway (${drivewayWidthM.toFixed(3)} m).`
        );
      } else {
        notes.push(
          `Per Clause 5.5.4: Railway driveway space (${drivewayWidthM.toFixed(3)} m) is accommodated within the calculated separation (${finalSeparation.toFixed(3)} m).`
        );
      }
    } else {
      notes.push(
        'Per Clause 5.5.4: At loading sidings, sufficient space shall be left for a driveway, in accordance with the stated needs of the railway.'
      );
    }
  }

  // Clause 5.5.5: Unobstructed view of signals and signs
  let signalSightAdder = 0;
  if (requiresSignalSightClearance) {
    appliedClauses.push('5.5.5');
    if (signalSightClearanceM > 0) {
      if (signalSightClearanceM > finalSeparation) {
        signalSightAdder = signalSightClearanceM - finalSeparation;
        finalSeparation = signalSightClearanceM;
        notes.push(
          `Per Clause 5.5.5: Separation increased by ${signalSightAdder.toFixed(3)} m to ensure unobstructed view of railway signals, signs, and similar equipment (governing: ${signalSightClearanceM.toFixed(3)} m).`
        );
      } else {
        notes.push(
          `Per Clause 5.5.5: Verified that horizontal separation satisfies unobstructed view of railway signals and signs (${signalSightClearanceM.toFixed(3)} m).`
        );
      }
    } else {
      notes.push(
        'Per Clause 5.5.5: In all cases, horizontal separations shall be great enough to permit an unobstructed view of signals, signs, and similar equipment.'
      );
    }
  }

  return {
    success: true,
    finalSeparation: Number(finalSeparation.toFixed(3)),
    baseSeparation,
    curvatureAdder: Number(curvatureAdder.toFixed(3)),
    superelevationAdder: Number(superelevationAdder.toFixed(3)),
    totalCurveSuperelevationAdder: Number(totalCurveSuperelevationAdder.toFixed(3)),
    standardCalculatedSeparation: Number(standardCalculatedSeparation.toFixed(3)),
    loadingSidingAdder: Number(loadingSidingAdder.toFixed(3)),
    signalSightAdder: Number(signalSightAdder.toFixed(3)),
    track,
    appliedClauses: [...new Set(appliedClauses)],
    notes,
  };
}

export { TABLE_7_META, TABLE_7_ROWS };
