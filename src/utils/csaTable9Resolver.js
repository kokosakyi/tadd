/**
 * Resolver for CSA C22.3 No. 1 Table 9 clearances from wires and conductors
 * not attached to buildings, signs, and similar plant
 * (See Clauses 5.7.3.1 to 5.7.3.3, and Clause 5.2.7).
 *
 * Pure functions; no UI dependencies. All clearance values in metres.
 */

import { TABLE_9_META, TABLE_9_ROWS, TABLE_9_TARGET_CATEGORIES } from '../data/csa/c22_3_no1/table9.js';
import { calculateTable1ConductorSwing } from './csaTable1Resolver.js';

/**
 * Resolves the matching row from Table 9 given a row ID or criteria (group, voltage, construction).
 *
 * @param {object} criteria
 * @param {string} [criteria.rowId]
 * @param {string} [criteria.group] - 'communication_and_guys' | 'supply'
 * @param {number} [criteria.voltageLgKv] - Line-to-ground voltage in kV (rms)
 * @param {string} [criteria.constructionType] - 'grounded_metallic_sheath' | 'insulated_or_grounded' | 'bare_not_sheathed'
 * @returns {object|null}
 */
export function resolveTable9Row(criteria = {}) {
  if (criteria.rowId) {
    return TABLE_9_ROWS.find((r) => r.id === criteria.rowId) || null;
  }

  const { group = 'supply', voltageLgKv, constructionType = 'bare_not_sheathed' } = criteria;

  if (group === 'communication_and_guys') {
    return TABLE_9_ROWS.find((r) => r.id === 'guys_comm_drop') || null;
  }

  if (voltageLgKv === undefined || voltageLgKv === null) return null;

  if (voltageLgKv > 22) {
    return TABLE_9_ROWS.find((r) => r.id === 'supply_over_22kv') || null;
  }

  if (voltageLgKv <= 0.75) {
    if (constructionType === 'grounded_metallic_sheath') {
      return TABLE_9_ROWS.find((r) => r.id === 'supply_0_750v_grounded_metallic_sheath') || null;
    }
    if (constructionType === 'insulated_or_grounded') {
      return TABLE_9_ROWS.find((r) => r.id === 'supply_0_750v_insulated_grounded') || null;
    }
    return TABLE_9_ROWS.find((r) => r.id === 'supply_0_750v_bare_open') || null;
  }

  if (voltageLgKv > 0.75 && voltageLgKv <= 22) {
    if (constructionType === 'grounded_metallic_sheath') {
      return TABLE_9_ROWS.find((r) => r.id === 'supply_0_75_to_22kv_grounded_metallic_sheath') || null;
    }
    return TABLE_9_ROWS.find((r) => r.id === 'supply_0_75_to_22kv_not_sheathed') || null;
  }

  return null;
}

/**
 * Calculates Table 9 design clearances from wires not attached to buildings or plant.
 *
 * Evaluates:
 *   - Base clearance for target category and orientation (horizontal or vertical)
 *   - > 22 kV voltage adder (+0.01 m/kV over 22 kV)
 *   - Footnote § (0–750 V vertical building clearance reduction to 1.0 m for normally inaccessible portions)
 *   - Footnote ‡‡ (> 0.75 kV ≤ 22 kV unsheathed horizontal building clearance reduction to 1.5 m when no fire escapes/balconies/openable windows)
 *   - Clause 5.7.3.1 conditions (max sag for vertical, conductor swing per 5.2.7 for horizontal, rubbing prohibition)
 *   - Clause 5.7.3.2 application rules (under building projection requires >= horizontal clearance, sign swing allowance, flammable/explosives check)
 *   - Clause 5.7.3.3 electrostatic induction study trigger for voltages > 200 kV
 *   - Footnote * cross-reference to Tables 2 and 4 for traversed portions of buildings
 *   - Footnote † non-metallic or ungrounded building check
 *
 * @param {object} params
 * @param {string|object} params.rowOrCriteria - Table 9 row object or search criteria for resolveTable9Row
 * @param {'buildings_horizontal'|'buildings_vertical'|'signs_horizontal'|'signs_vertical'} params.columnId
 * @param {number} [params.voltageLgKv] - Applied line-to-ground rms voltage (kV), required if row is > 22 kV
 * @param {number} [params.conductorSwingM=0] - Conductor swing in metres (Clause 5.7.3.1(c), Clause 5.2.7, & Footnote ‡)
 * @param {'exposed'|'partly_sheltered'|'fully_sheltered'} [params.exposureCondition='exposed'] - Exposure condition per Clause 5.2.7(a)-(c). If 'fully_sheltered', conductor swing allowance is zero.
 * @param {number} [params.plantSwingM=0] - Swing of the sign / plant in metres (Clause 5.7.3.2)
 * @param {boolean} [params.isNormallyInaccessible=false] - For building vertical clearance (Footnote §)
 * @param {boolean} [params.hasAdjacentOpeningsOrBalconies=true] - For building horizontal clearance (Footnote ‡‡)
 * @param {boolean} [params.passesUnderProjection=false] - If passing under a building projection (Clause 5.7.3.2)
 * @param {boolean} [params.isNormallyTraversedByPersonsOrVehicles=false] - Triggers Tables 2 & 4 note (Footnote *)
 * @param {boolean} [params.isBuildingMetallicAndGrounded=true] - If false, triggers assessment warning (Footnote †)
 * @param {boolean} [params.hasFlammableOrExplosives=false] - Triggers Clause 5.7.3.2 investigation warning
 * @returns {object} Detailed calculation result
 */
export function calculateTable9Clearance(params = {}) {
  const {
    rowOrCriteria,
    columnId,
    voltageLgKv,
    conductorSwingM = 0,
    exposureCondition = 'exposed',
    plantSwingM = 0,
    isNormallyInaccessible = false,
    hasAdjacentOpeningsOrBalconies = true,
    passesUnderProjection = false,
    isNormallyTraversedByPersonsOrVehicles = false,
    isBuildingMetallicAndGrounded = true,
    hasFlammableOrExplosives = false,
  } = params;

  const row = typeof rowOrCriteria === 'string'
    ? resolveTable9Row({ rowId: rowOrCriteria })
    : (rowOrCriteria?.id ? rowOrCriteria : resolveTable9Row(rowOrCriteria));

  if (!row) {
    return { success: false, error: 'Invalid or unresolved Table 9 row.' };
  }

  const validColumnIds = ['buildings_horizontal', 'buildings_vertical', 'signs_horizontal', 'signs_vertical'];
  if (!validColumnIds.includes(columnId)) {
    return {
      success: false,
      error: `Invalid columnId "${columnId}". Must be one of: ${validColumnIds.join(', ')}`,
    };
  }

  const isBuilding = columnId.startsWith('buildings');
  const isHorizontal = columnId.endsWith('horizontal');
  const isVertical = columnId.endsWith('vertical');

  const baseClearance = row.clearances[columnId];
  if (baseClearance === undefined) {
    return { success: false, error: `Clearance not found for column "${columnId}" in row "${row.id}".` };
  }

  let finalClearance = baseClearance;
  let voltageAdder = 0;
  const notes = [];
  const warnings = [];
  const appliedClauses = ['5.7.3.1'];

  // 1. Voltage adder for > 22 kV
  if (row.voltageIncrementPerKvOver22) {
    const vLg = Number(voltageLgKv);
    if (!Number.isFinite(vLg) || vLg <= 22) {
      return {
        success: false,
        error: `Row "${row.id}" (> 22 kV) requires voltageLgKv > 22. Received: ${voltageLgKv}`,
      };
    }
    const excessKv = vLg - 22;
    voltageAdder = excessKv * row.voltageIncrementPerKvOver22;
    finalClearance += voltageAdder;
    notes.push(
      `Voltage adder: +${voltageAdder.toFixed(3)} m (0.01 m/kV for ${excessKv.toFixed(2)} kV in excess of 22 kV).`
    );
  }

  // 2. Footnote §: 0–750 V vertical clearance to buildings reducible to 1.0 m if normally inaccessible
  if (columnId === 'buildings_vertical' && row.reducibleVerticalInaccessibleClearance !== undefined) {
    if (isNormallyInaccessible) {
      finalClearance = row.reducibleVerticalInaccessibleClearance;
      notes.push(
        `Per Table 9 Footnote §: Vertical clearance to building reduced from ${baseClearance} m to ${row.reducibleVerticalInaccessibleClearance} m because the portion of the building is normally inaccessible.`
      );
    } else {
      notes.push(
        `Per Table 9: Standard vertical clearance ${baseClearance} m applies (portion is accessible or accessibility not confirmed).`
      );
    }
  }

  // 3. Footnote ‡‡: > 0.75 kV ≤ 22 kV unsheathed horizontal clearance reducible to 1.5 m
  if (columnId === 'buildings_horizontal' && row.reducibleHorizontalClearance !== undefined) {
    if (!hasAdjacentOpeningsOrBalconies) {
      finalClearance = row.reducibleHorizontalClearance;
      notes.push(
        `Per Table 9 Footnote ‡‡: Horizontal clearance reduced from ${baseClearance} m to ${row.reducibleHorizontalClearance} m because building does not have fire escapes, balconies, or windows that can be opened adjacent to the conductor.`
      );
    } else {
      notes.push(
        `Per Table 9 Footnote ‡‡: Standard horizontal clearance ${baseClearance} m retained because building has or may have fire escapes, balconies, or openable windows adjacent to the conductor.`
      );
    }
  }

  // 4. Clause 5.7.3.2: Passing under building projection
  // "The vertical clearance from a wire passing under a building projection to the nearest point of that projection shall be not less than the horizontal clearance requirement."
  if (isBuilding && isVertical && passesUnderProjection) {
    appliedClauses.push('5.7.3.2');
    const horizReq = row.clearances.buildings_horizontal + voltageAdder;
    if (finalClearance < horizReq) {
      notes.push(
        `Per Clause 5.7.3.2: Vertical clearance passing under building projection increased from ${finalClearance.toFixed(3)} m to horizontal clearance requirement of ${horizReq.toFixed(3)} m.`
      );
      finalClearance = horizReq;
    }
  }

  // 5. Swing Adders (Clause 5.7.3.1(c), Footnote ‡, Clause 5.2.7, Clause 5.7.3.2)
  let totalSwingAdder = 0;
  if (isHorizontal) {
    if (exposureCondition === 'fully_sheltered') {
      appliedClauses.push('5.2.7');
      notes.push(
        'Per Clause 5.2.7(c): Wires/conductors are fully sheltered from transverse wind loads (e.g., along narrow urban streets between tall buildings); no allowance is required for horizontal conductor deviation.'
      );
    } else {
      let activeConductorSwingM = conductorSwingM;
      if (!activeConductorSwingM && params.sagM !== undefined) {
        const shelterType = exposureCondition === 'partly_sheltered'
          ? 'partly_sheltered'
          : 'non_sheltered';
        const t1Result = calculateTable1ConductorSwing({
          sagM: params.sagM,
          insulatorStringLengthM: params.insulatorStringLengthM,
          conductorDiameterMm: params.conductorDiameterMm,
          conductorMassKgPerM: params.conductorMassKgPerM,
          dwRatio: params.dwRatio,
          shelterCondition: shelterType,
        });
        if (t1Result.success) {
          activeConductorSwingM = t1Result.horizontalDeviationM;
        }
      }

      if (activeConductorSwingM > 0) {
        appliedClauses.push('5.2.7');
        totalSwingAdder += Number(activeConductorSwingM);
        const shelterDesc = exposureCondition === 'partly_sheltered'
          ? 'partly sheltered location per Clause 5.2.7(b) / Table 1'
          : 'exposed/open terrain per Clause 5.2.7(a) / Table 1';
        notes.push(
          `Conductor swing added: +${Number(activeConductorSwingM).toFixed(3)} m (${shelterDesc}; swing sag evaluated at 40 °C or NBCC 2.5% July design temp per Clause 5.2.7(d)).`
        );
      }
    }

    if (!isBuilding && plantSwingM > 0) {
      totalSwingAdder += Number(plantSwingM);
      appliedClauses.push('5.7.3.2');
      notes.push(
        `Plant/sign swing added: +${Number(plantSwingM).toFixed(3)} m per Clause 5.7.3.2.`
      );
    }
    finalClearance += totalSwingAdder;
  }

  // 6. Warnings & Advisory Rules
  // Guys / comm rubbing prohibition
  if (row.prohibitRubbing) {
    warnings.push(
      'Clause 5.7.3.1(d): Guy wires, communication cables, and drop wires shall not be allowed to rub against buildings or other plant.'
    );
  }

  // Footnote *
  if (isBuilding && isNormallyTraversedByPersonsOrVehicles) {
    warnings.push(
      'Table 9 Footnote *: Portions of a building normally traversed by persons or vehicles are governed by Tables 2 and 4.'
    );
  }

  // Footnote †
  if (isBuilding && !isBuildingMetallicAndGrounded) {
    warnings.push(
      'Table 9 Footnote †: Building is non-metallic or ungrounded. An assessment might be needed to determine additional clearances for electrostatic induction (see Clause 5.7.3.3).'
    );
  }

  // Footnote ** and ††
  if (row.advisoryNotCarriedOverBuildings && isBuilding && isVertical) {
    warnings.push(
      'Table 9 Footnote **: Conductors of these voltage classes should not be carried over buildings where other suitable construction can be used.'
    );
  }
  if (row.requiresCrossOverSafetyAssessment && isBuilding && isVertical) {
    warnings.push(
      'Table 9 Footnote ††: Where necessary to carry conductors over buildings, determine whether additional measures, including increased clearances, are needed for safe and effective building use.'
    );
  }

  // Flammable / explosives
  if (hasFlammableOrExplosives) {
    appliedClauses.push('5.7.3.2');
    warnings.push(
      'Clause 5.7.3.2: Building contains flammable materials or explosives. The need for additional clearances shall be investigated.'
    );
  }

  // Clause 5.7.3.3 (> 200 kV transmission corridor study)
  if (voltageLgKv && Number(voltageLgKv) > 200) {
    appliedClauses.push('5.7.3.3');
    warnings.push(
      'Clause 5.7.3.3: Lines operating above 200 kV adjacent to buildings require a study to determine suitable clearances greater than Table 9 taking into account electrostatic induction.'
    );
  }

  return {
    success: true,
    finalClearance: Number(finalClearance.toFixed(3)),
    baseClearance,
    voltageAdder: Number(voltageAdder.toFixed(3)),
    totalSwingAdder: Number(totalSwingAdder.toFixed(3)),
    columnId,
    row,
    appliedClauses: [...new Set(appliedClauses)],
    notes,
    warnings,
  };
}

export { TABLE_9_META, TABLE_9_ROWS, TABLE_9_TARGET_CATEGORIES };
