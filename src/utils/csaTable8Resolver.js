/**
 * Resolver for CSA C22.3 No. 1 Table 8 clearances of supply conductors attached to buildings
 * (See Clauses 5.7.2, 5.7.2.1, 5.7.2.2, and Clause 5.2.7).
 *
 * Pure functions; no UI dependencies. All clearance values in metres.
 */
import { TABLE_8_META, TABLE_8_ROWS, TABLE_8_SURFACE_TYPES } from '../data/csa/c22_3_no1/table8.js';

/**
 * Resolves the matching row from Table 8 given a row id or voltage / construction type.
 *
 * @param {object} criteria
 * @param {string} [criteria.rowId]
 * @param {number} [criteria.voltageLgKv] - Line-to-ground voltage in kV (rms)
 * @param {string} [criteria.constructionType] - 'grounded_metallic_sheath' | 'insulated_or_grounded' | 'bare_not_sheathed'
 * @returns {object|null}
 */
export function resolveTable8Row(criteria = {}) {
  if (criteria.rowId) {
    return TABLE_8_ROWS.find((r) => r.id === criteria.rowId) || null;
  }

  const { voltageLgKv, constructionType = 'bare_not_sheathed' } = criteria;
  if (voltageLgKv === undefined || voltageLgKv === null) return null;

  if (voltageLgKv > 22) {
    return TABLE_8_ROWS.find((r) => r.id === 'supply_over_22kv') || null;
  }

  if (voltageLgKv <= 0.75) {
    if (constructionType === 'grounded_metallic_sheath') {
      return TABLE_8_ROWS.find((r) => r.id === 'supply_0_750v_grounded_metallic_sheath') || null;
    }
    if (constructionType === 'insulated_or_grounded') {
      return TABLE_8_ROWS.find((r) => r.id === 'supply_0_750v_insulated_grounded') || null;
    }
    return TABLE_8_ROWS.find((r) => r.id === 'supply_0_750v_bare_open') || null;
  }

  if (voltageLgKv > 0.75 && voltageLgKv <= 5) {
    if (constructionType === 'grounded_metallic_sheath') {
      return TABLE_8_ROWS.find((r) => r.id === 'supply_0_75_to_5kv_grounded_metallic_sheath') || null;
    }
    return TABLE_8_ROWS.find((r) => r.id === 'supply_0_75_to_5kv_not_sheathed') || null;
  }

  if (voltageLgKv > 5 && voltageLgKv <= 22) {
    if (constructionType === 'grounded_metallic_sheath') {
      return TABLE_8_ROWS.find((r) => r.id === 'supply_5_to_22kv_grounded_metallic_sheath') || null;
    }
    return TABLE_8_ROWS.find((r) => r.id === 'supply_5_to_22kv_not_sheathed') || null;
  }

  return null;
}

/**
 * Calculates Table 8 design clearances of supply conductors attached to buildings.
 *
 * Evaluates:
 * - Table 8 Base Clearances:
 *     - Horizontal to surface (Clause 5.7.2.1b & 5.2.7 at conductor swing)
 *     - Vertical to normally inaccessible surface (Clause 5.7.2.1a at max sag)
 *     - Vertical to readily accessible surface (Clause 5.7.2.1a at max sag)
 * - Footnote *: Non-metallic buildings or effectively grounded metallic parts. Warning for ungrounded metal buildings.
 * - Footnote †: For 0–750 V:
 *     - Inaccessible surface reduction: horizontal clearance may be reduced to 0.08 m.
 *     - Service attachment point reduction: horizontal clearance may be reduced to 0.02 m.
 * - Footnotes ‡ & §: Where the building does NOT have fire escapes, balconies, or openable windows adjacent to conductor:
 *     - >0.75 kV ≤ 5 kV: horizontal clearance may be reduced from 2.0 m to 1.2 m.
 *     - >5 kV ≤ 22 kV: horizontal clearance may be reduced from 2.0 m to 1.5 m.
 * - Footnotes ** & ††: Advisory/warning against carrying conductors > 5 kV over buildings.
 * - Over 22 kV voltage adder: +0.01 m/kV over 22 kV line-to-ground.
 * - Clause 5.7.2.2 Service attachment head geometry validation:
 *     - Consumer's service head emergence: 150 mm to 300 mm above point of attachment.
 *     - Consumer's service head horizontal separation: 150 mm to 300 mm horizontally.
 *
 * @param {object} params
 * @param {string} [params.rowId] - Table 8 row ID
 * @param {number} [params.voltageLgKv] - Line-to-ground voltage (kV rms)
 * @param {string} [params.constructionType] - 'grounded_metallic_sheath' | 'insulated_or_grounded' | 'bare_not_sheathed'
 * @param {string} [params.surfaceType='horizontal_to_surface'] - 'horizontal_to_surface' | 'vertical_normally_inaccessible' | 'vertical_readily_accessible'
 * @param {boolean} [params.isBuildingMetallicAndUngrounded=false] - Footnote * induction evaluation check
 * @param {boolean} [params.isServiceAttachmentPoint=false] - Footnote † reduction to 0.02 m
 * @param {boolean} [params.isSurfaceInaccessible=false] - Footnote † reduction to 0.08 m
 * @param {boolean} [params.hasAdjacentOpeningsOrBalconies=true] - Footnotes ‡ and § condition
 * @param {object} [params.serviceHeadGeometry] - Optional Clause 5.7.2.2 verification
 * @param {number} [params.serviceHeadGeometry.verticalAboveAttachmentMm] - Vertical distance of emergence above attachment point (mm)
 * @param {number} [params.serviceHeadGeometry.horizontalDistanceMm] - Horizontal distance from service head (mm)
 * @returns {object} Resolution results
 */
export function resolveTable8Clearance({
  rowId,
  voltageLgKv,
  constructionType = 'bare_not_sheathed',
  surfaceType = 'horizontal_to_surface',
  isBuildingMetallicAndUngrounded = false,
  isServiceAttachmentPoint = false,
  isSurfaceInaccessible = false,
  hasAdjacentOpeningsOrBalconies = true,
  serviceHeadGeometry = null,
} = {}) {
  const row = resolveTable8Row({ rowId, voltageLgKv, constructionType });
  if (!row) {
    return {
      success: false,
      error: `Could not resolve Table 8 row for criteria: rowId="${rowId}", voltageLgKv="${voltageLgKv}", constructionType="${constructionType}".`,
    };
  }

  const validSurface = TABLE_8_SURFACE_TYPES.find((s) => s.id === surfaceType);
  if (!validSurface) {
    return {
      success: false,
      error: `Invalid surfaceType "${surfaceType}". Must be one of: ${TABLE_8_SURFACE_TYPES.map((s) => s.id).join(', ')}.`,
    };
  }

  const baseClearance = row.clearances[surfaceType];
  let voltageAdder = 0;
  const appliedClauses = ['5.7.2', '5.7.2.1'];
  const notes = [];
  const warnings = [];

  // Voltage adder for > 22 kV
  const effectiveVoltageKv = voltageLgKv !== undefined && voltageLgKv !== null ? voltageLgKv : (row.id === 'supply_over_22kv' ? 22 : 0);
  if (row.id === 'supply_over_22kv' && effectiveVoltageKv > 22) {
    const deltaKv = effectiveVoltageKv - 22;
    voltageAdder = deltaKv * (row.voltageIncrementPerKvOver22 || 0.01);
    notes.push(
      `Per Table 8: Voltage adder of ${voltageAdder.toFixed(3)} m applied for ${deltaKv.toFixed(1)} kV over 22 kV (${row.voltageIncrementPerKvOver22} m/kV).`
    );
  }

  let finalClearance = baseClearance + voltageAdder;

  // Clause 5.7.2.1 conditions note
  if (validSurface.orientation === 'vertical') {
    notes.push('Per Clause 5.7.2.1(a): Vertical clearances apply under conditions of maximum sag of the conductor.');
  } else {
    appliedClauses.push('5.2.7');
    notes.push('Per Clause 5.7.2.1(b): Horizontal clearances apply where the conductor is in the position of swing (Clause 5.2.7).');
  }

  // Footnote *
  if (isBuildingMetallicAndUngrounded) {
    warnings.push(
      'Footnote *: Building has ungrounded metallic parts. An assessment might be needed to determine additional clearances for electrostatic induction.'
    );
  }

  // Footnote † (0–750 V horizontal clearance reductions)
  if (surfaceType === 'horizontal_to_surface' && row.allowsInaccessibleReductionTo0_08m) {
    if (isServiceAttachmentPoint) {
      finalClearance = 0.02;
      notes.push('Per Table 8 Footnote †: At the service attachment point, horizontal clearance reduced to 0.02 m.');
    } else if (isSurfaceInaccessible) {
      finalClearance = 0.08;
      notes.push('Per Table 8 Footnote †: For inaccessible surfaces, horizontal clearance reduced to 0.08 m.');
    }
  }

  // Footnotes ‡ and § (reductions when no fire escapes, balconies, or windows that can be opened adjacent to conductor)
  if (surfaceType === 'horizontal_to_surface' && row.reducibleHorizontalClearance !== undefined) {
    if (!hasAdjacentOpeningsOrBalconies) {
      const reducedVal = row.reducibleHorizontalClearance;
      finalClearance = reducedVal;
      notes.push(
        `Per Table 8 Footnote ${row.id.includes('5kv_not_sheathed') ? '‡' : '§'}: Horizontal clearance reduced to ${reducedVal} m because the building does not have fire escapes, balconies, or windows that can be opened adjacent to the conductor.`
      );
    } else {
      notes.push(
        `Per Table 8 Footnote ${row.id.includes('5kv_not_sheathed') ? '‡' : '§'}: Standard clearance ${baseClearance} m retained because building has or may have fire escapes, balconies, or openable windows adjacent to the conductor.`
      );
    }
  }

  // Footnote ** and †† advisory
  if (row.advisoryNotCarriedOverBuildings && validSurface.orientation === 'vertical') {
    warnings.push(
      'Footnote **: Conductors of these voltage classes should not be carried over buildings where other suitable construction can be used.'
    );
  }
  if (row.requiresCrossOverSafetyAssessment && validSurface.orientation === 'vertical') {
    warnings.push(
      'Footnote ††: Where necessary to carry conductors over buildings, determine whether additional measures, including increased clearances, are needed for safe and appropriate building use.'
    );
  }

  // Clause 5.7.2.2 service head geometry verification
  let serviceHeadCompliance = null;
  if (serviceHeadGeometry) {
    appliedClauses.push('5.7.2.2');
    const { verticalAboveAttachmentMm, horizontalDistanceMm } = serviceHeadGeometry;
    const vertValid =
      verticalAboveAttachmentMm === undefined ||
      (verticalAboveAttachmentMm >= 150 && verticalAboveAttachmentMm <= 300);
    const horizValid =
      horizontalDistanceMm === undefined ||
      (horizontalDistanceMm >= 150 && horizontalDistanceMm <= 300);

    serviceHeadCompliance = {
      isCompliant: vertValid && horizValid,
      verticalAboveAttachmentMm,
      verticalCompliant: vertValid,
      horizontalDistanceMm,
      horizontalCompliant: horizValid,
      limits: {
        verticalMinMm: 150,
        verticalMaxMm: 300,
        horizontalMinMm: 150,
        horizontalMaxMm: 300,
      },
    };

    if (!vertValid) {
      warnings.push(
        `Clause 5.7.2.2(a) non-compliance: Emergence of conductors is ${verticalAboveAttachmentMm} mm above support (must be between 150 mm and 300 mm).`
      );
    }
    if (!horizValid) {
      warnings.push(
        `Clause 5.7.2.2(b) non-compliance: Horizontal distance from service head is ${horizontalDistanceMm} mm (must be between 150 mm and 300 mm).`
      );
    }
  }

  return {
    success: true,
    finalClearance: Number(finalClearance.toFixed(3)),
    baseClearance,
    voltageAdder: Number(voltageAdder.toFixed(3)),
    surfaceType: validSurface,
    row,
    appliedClauses: [...new Set(appliedClauses)],
    notes,
    warnings,
    serviceHeadCompliance,
  };
}

export { TABLE_8_META, TABLE_8_ROWS, TABLE_8_SURFACE_TYPES };
