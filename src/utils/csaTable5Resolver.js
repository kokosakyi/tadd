import {
  TABLE_5_META,
  TABLE_5_COLUMNS,
  TABLE_5_EQUIPMENT_TYPES,
  TABLE_5_LOCATIONS,
  TABLE_5_ROWS,
} from '../data/csa/c22_3_no1/table5.js';

/**
 * Resolves the matching column for a given voltage (rms line-to-ground in kV).
 *
 * @param {number} vLgKv - Operating rms voltage line-to-ground in kV (e.g. 0.12, 14.4, 25.0, etc.)
 * @returns {object|null} Matching column object from TABLE_5_COLUMNS, or null if out of range.
 */
export function resolveTable5Column(vLgKv) {
  if (vLgKv == null || isNaN(vLgKv) || vLgKv < 0) {
    return null;
  }

  for (const col of TABLE_5_COLUMNS) {
    const { minInclusive, maxInclusive, minExclusive } = col.vLgKv;
    const passesMin =
      minInclusive !== undefined ? vLgKv >= minInclusive : vLgKv > minExclusive;
    const passesMax = vLgKv <= maxInclusive;

    if (passesMin && passesMax) {
      return col;
    }
  }

  return null;
}

/**
 * Resolves minimum vertical separation from ground for supply equipment per Table 5 and Annex A.5.3.2.
 *
 * @param {object} params
 * @param {string} params.equipmentTypeId - 'live_or_ungrounded' | 'effectively_grounded'
 * @param {string} params.locationId - 'pedestrians_only' | 'vehicles'
 * @param {number} [params.vLgKv] - Operating rms voltage line-to-ground in kV
 * @param {string} [params.columnId] - Direct column ID if pre-selected
 * @param {boolean} [params.isEnclosedSubstation=false] - Annex A.5.3.2: Table 5 does not apply to enclosed substations
 * @param {boolean} [params.isFarmyardOrHighEquipment=false] - Annex A.5.3.2: utilities may increase height for hay racks / high equipment
 * @returns {object} Resolution result with separation (m), column info, row info, advisory notes, and status
 */
export function resolveTable5Separation({
  equipmentTypeId,
  locationId,
  vLgKv,
  columnId,
  isEnclosedSubstation = false,
  isFarmyardOrHighEquipment = false,
}) {
  if (isEnclosedSubstation) {
    return {
      success: false,
      error: 'Per Annex A.5.3.2, Table 5 specifies clearances for supply equipment mounted on poles and does not apply to equipment inside an enclosed substation.',
      applicableStandard: 'Enclosed Substation Design Standards / Station Code',
    };
  }

  const row = TABLE_5_ROWS.find(
    (r) => r.equipmentTypeId === equipmentTypeId && r.locationId === locationId
  );

  if (!row) {
    return {
      success: false,
      error: `No Table 5 row matching equipmentTypeId="${equipmentTypeId}" and locationId="${locationId}"`,
    };
  }

  const advisories = [];
  if (isFarmyardOrHighEquipment) {
    advisories.push(
      'Per Annex A.5.3.2: Specified values are minimums. Utilities may increase mounting height in farmyards or areas where hay racks and tall machinery operate.'
    );
  }

  let col = null;
  if (columnId) {
    col = TABLE_5_COLUMNS.find((c) => c.id === columnId);
  } else if (vLgKv !== undefined) {
    col = resolveTable5Column(vLgKv);
  }

  // Note: For effectively grounded equipment cases, separation is identical across all voltage columns (3.0 m or 4.4 m)
  if (!col) {
    if (equipmentTypeId === 'effectively_grounded') {
      const separation = row.separations.col_0_750v;
      return {
        success: true,
        separation,
        row,
        equipmentType: TABLE_5_EQUIPMENT_TYPES.find((e) => e.id === equipmentTypeId),
        location: TABLE_5_LOCATIONS.find((l) => l.id === locationId),
        column: null,
        note: 'Effectively grounded equipment cases require uniform minimum clearance regardless of voltage within 0–90 kV.',
      };
    }

    return {
      success: false,
      error:
        vLgKv !== undefined && vLgKv > 90
          ? `Voltage ${vLgKv} kV exceeds Table 5 maximum range (90 kV). Consult CSA C22.3 No. 1 specific transmission/substation rules or Annex A.5.3.2.`
          : 'Invalid or missing voltage specification for Table 5 resolution.',
    };
  }

  const separation = row.separations[col.id];

  return {
    success: true,
    separation,
    row,
    column: col,
    equipmentType: TABLE_5_EQUIPMENT_TYPES.find((e) => e.id === equipmentTypeId),
    location: TABLE_5_LOCATIONS.find((l) => l.id === locationId),
    advisories,
  };
}

export {
  TABLE_5_META,
  TABLE_5_COLUMNS,
  TABLE_5_EQUIPMENT_TYPES,
  TABLE_5_LOCATIONS,
  TABLE_5_ROWS,
};
