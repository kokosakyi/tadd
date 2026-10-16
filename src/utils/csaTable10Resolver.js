/**
 * Resolver for CSA C22.3 No. 1 Table 10 clearances from supply conductors to bridges
 * (See Clauses 5.7.4.1, 5.7.4.2, and Clause 5.2.7).
 *
 * Pure functions; no UI dependencies. All clearance values in metres.
 */

import { TABLE_10_META, TABLE_10_ROWS, TABLE_10_COLUMNS } from '../data/csa/c22_3_no1/table10.js';

/**
 * Resolves the matching row from Table 10 given voltage and system type.
 *
 * @param {object} criteria
 * @param {string} [criteria.rowId]
 * @param {number} [criteria.voltageLgKv] - Line-to-ground voltage in kV (rms)
 * @param {'ac'|'dc'} [criteria.systemType='ac'] - Electrical system type (for voltages > 50 kV)
 * @returns {object|null}
 */
export function resolveTable10Row(criteria = {}) {
  if (criteria.rowId) {
    return TABLE_10_ROWS.find((r) => r.id === criteria.rowId) || null;
  }

  const { voltageLgKv, systemType = 'ac' } = criteria;
  if (voltageLgKv === undefined || voltageLgKv === null || isNaN(voltageLgKv)) {
    return null;
  }

  if (voltageLgKv <= 0.75) {
    return TABLE_10_ROWS.find((r) => r.id === 'supply_0_750v') || null;
  }

  if (voltageLgKv <= 22) {
    return TABLE_10_ROWS.find((r) => r.id === 'supply_0_75_to_22kv') || null;
  }

  if (voltageLgKv <= 50) {
    return TABLE_10_ROWS.find((r) => r.id === 'supply_22_to_50kv') || null;
  }

  // > 50 kV
  if (systemType === 'dc') {
    return TABLE_10_ROWS.find((r) => r.id === 'supply_over_50kv_dc') || null;
  }
  return TABLE_10_ROWS.find((r) => r.id === 'supply_over_50kv_ac') || null;
}

/**
 * Resolves the column ID from dimensional criteria:
 * @param {object} criteria
 * @param {'readily_accessible'|'inaccessible'} criteria.accessibility
 * @param {'horizontal'|'vertical'} criteria.orientation
 * @param {'attached'|'not_attached'} criteria.attachment
 * @param {'over_bridge'|'under_bridge'|'adjacent'} [criteria.position] - Required if vertical
 * @returns {string|null} Column ID
 */
export function resolveTable10ColumnId({ accessibility, orientation, attachment, position = 'adjacent' }) {
  const col = TABLE_10_COLUMNS.find(
    (c) =>
      c.accessibility === accessibility &&
      c.orientation === orientation &&
      c.attachment === attachment &&
      (orientation === 'horizontal' || c.position === position)
  );
  return col ? col.id : null;
}

/**
 * Calculates Table 10 design clearance from supply conductors to bridges.
 *
 * Evaluates:
 *   - Base clearance for bridge accessibility, orientation, attachment, and position
 *   - > 50 kV AC adder (+0.010 m/kV over 50 kV) or DC adder (+0.005 m/kV over 50 kV)
 *   - Footnote * definition of readily accessible portions
 *   - Footnote † (0–750 V horizontal clearance reduction to 1.0 m if accessible to workers only)
 *   - Note 2 (Grounding conductors or effectively grounded conduit do not require clearance under bridge)
 *   - Clause 5.7.4.1 scope guardrail (Tables 2 & 4 apply if portion is traversed by pedestrians, road vehicles, or trains; sole railway excluded)
 *   - Clause 5.7.4.2 sag & swing states:
 *       - Vertical over bridge: maximum sag
 *       - Vertical under bridge: initial sag at lowest anticipated temperature
 *       - Horizontal: wire in position of swing per Clause 5.2.7
 *
 * @param {object} params
 * @param {string|object} params.rowOrCriteria - Table 10 row object or lookup criteria
 * @param {string} [params.columnId] - Column ID from TABLE_10_COLUMNS
 * @param {'readily_accessible'|'inaccessible'} [params.accessibility] - Used if columnId not provided
 * @param {'horizontal'|'vertical'} [params.orientation]
 * @param {'attached'|'not_attached'} [params.attachment]
 * @param {'over_bridge'|'under_bridge'|'adjacent'} [params.position]
 * @param {number} [params.voltageLgKv] - Applied line-to-ground rms voltage (kV)
 * @param {'ac'|'dc'} [params.systemType='ac']
 * @param {number} [params.conductorSwingM=0] - Horizontal conductor swing in metres (Clause 5.7.4.2(b), Cl 5.2.7)
 * @param {boolean} [params.isAccessibleToWorkersOnly=false] - For Footnote † (0–750 V horizontal reduction to 1.0 m)
 * @param {boolean} [params.isGroundingOrShieldedConduit=false] - For Note 2 (zero clearance under bridge)
 * @param {boolean} [params.isSoleRailwayBridge=false] - Scope flag per Clause 5.7.4.1
 * @param {boolean} [params.isNormallyTraversedByPedestriansVehiclesTrains=false] - Scope flag per Clause 5.7.4.1 (redirects to Table 2/4)
 * @returns {object} Detailed calculation result
 */
export function calculateTable10Clearance(params = {}) {
  const {
    rowOrCriteria,
    voltageLgKv,
    systemType = 'ac',
    conductorSwingM = 0,
    isAccessibleToWorkersOnly = false,
    isGroundingOrShieldedConduit = false,
    isSoleRailwayBridge = false,
    isNormallyTraversedByPedestriansVehiclesTrains = false,
  } = params;

  // Resolve row
  let row = null;
  if (typeof rowOrCriteria === 'string') {
    row = resolveTable10Row({ rowId: rowOrCriteria });
  } else if (rowOrCriteria && typeof rowOrCriteria === 'object' && rowOrCriteria.id) {
    row = rowOrCriteria;
  } else {
    row = resolveTable10Row({ voltageLgKv, systemType, ...(rowOrCriteria || {}) });
  }

  if (!row) {
    return {
      isValid: false,
      error: 'Unable to resolve matching Table 10 row for the provided criteria.',
    };
  }

  // Resolve column
  let columnId = params.columnId;
  if (!columnId) {
    columnId = resolveTable10ColumnId({
      accessibility: params.accessibility,
      orientation: params.orientation,
      attachment: params.attachment,
      position: params.position,
    });
  }

  const column = TABLE_10_COLUMNS.find((c) => c.id === columnId);
  if (!column) {
    return {
      isValid: false,
      error: `Invalid or missing Table 10 column identifier: "${columnId}".`,
    };
  }

  // Base clearance lookup
  let baseClearanceM = 0;
  let voltageAdderM = 0;
  const appliedVoltage = voltageLgKv ?? row.vLgKv.minInclusive ?? 0;

  if (row.baseRowId) {
    // Over 50 kV AC/DC
    const baseRow = TABLE_10_ROWS.find((r) => r.id === row.baseRowId);
    baseClearanceM = baseRow ? baseRow.clearances[columnId] : 0;
    const excessKv = Math.max(0, appliedVoltage - row.thresholdKv);
    voltageAdderM = Number((excessKv * row.adderPerKv).toFixed(4));
  } else {
    baseClearanceM = row.clearances[columnId];
  }

  // Check Note 2: Grounding conductors or effectively grounded conduit under bridge
  const isUnderBridge = column.orientation === 'vertical' && column.position === 'under_bridge';
  let exemptUnderBridge = false;
  if (isUnderBridge && isGroundingOrShieldedConduit) {
    exemptUnderBridge = true;
  }

  // Evaluate reductions (Footnote †)
  let reductionM = 0;
  let footnoteDaggerApplied = false;
  if (
    !exemptUnderBridge &&
    row.id === 'supply_0_750v' &&
    column.orientation === 'horizontal' &&
    column.accessibility === 'readily_accessible' &&
    isAccessibleToWorkersOnly
  ) {
    // 1.2 m reduced to 1.0 m
    reductionM = 0.2;
    footnoteDaggerApplied = true;
  }

  const swingAllowanceM = column.orientation === 'horizontal' ? Math.max(0, conductorSwingM) : 0;

  // Final clearance
  let totalClearanceM = exemptUnderBridge
    ? 0
    : Number((baseClearanceM - reductionM + voltageAdderM + swingAllowanceM).toFixed(3));

  // Determine sag / swing condition rules per Clause 5.7.4.2
  let governingCondition = '';
  if (column.orientation === 'vertical') {
    if (column.position === 'over_bridge') {
      governingCondition = 'Clause 5.7.4.2(a): Maximum sag for conductor above the bridge involved.';
    } else if (column.position === 'under_bridge') {
      governingCondition =
        'Clause 5.7.4.2(a): Initial sag at lowest anticipated temperature for conductor under the bridge involved.';
    }
  } else {
    governingCondition =
      'Clause 5.7.4.2(b): Conductor in position of swing, as determined in accordance with Clause 5.2.7.';
  }

  // Collect applicable standard warnings / scope notes
  const notes = [];

  if (isSoleRailwayBridge) {
    notes.push({
      clause: '5.7.4.1',
      type: 'scope_exclusion',
      message: 'Clause 5.7.4 does not cover clearances over a bridge used solely for a railway.',
    });
  }

  if (isNormallyTraversedByPedestriansVehiclesTrains) {
    notes.push({
      clause: '5.7.4.1',
      type: 'table_redirect',
      message:
        'Clause 5.7.4 does not cover clearances over portions normally traversed by pedestrians, road vehicles, or trains. See Tables 2 and 4.',
    });
  }

  if (column.accessibility === 'readily_accessible') {
    notes.push({
      clause: 'Table 10 Footnote *',
      type: 'accessibility_definition',
      message:
        'Readily accessible portions include portions likely used by workers (e.g. bridge seats of steel bridges needing periodic inspection, concrete/masonry walkways) and portions accessible to the public.',
    });
  }

  if (exemptUnderBridge) {
    notes.push({
      clause: 'Table 10 Note 2',
      type: 'grounded_conduit_exemption',
      message:
        'Grounding conductors or conductors installed in effectively grounded conduit do not require clearance under a bridge.',
    });
  }

  if (footnoteDaggerApplied) {
    notes.push({
      clause: 'Table 10 Footnote †',
      type: 'worker_reduction',
      message:
        'Horizontal clearance reduced from 1.2 m to 1.0 m because the portion is readily accessible to workers but not to the public.',
    });
  }

  return {
    isValid: true,
    tableId: TABLE_10_META.id,
    rowId: row.id,
    rowLabel: row.label,
    columnId: column.id,
    columnLabel: column.label,
    accessibility: column.accessibility,
    orientation: column.orientation,
    attachment: column.attachment,
    position: column.position,
    voltageLgKv: appliedVoltage,
    systemType,
    governingCondition,
    calculations: {
      baseClearanceM,
      reductionM,
      voltageAdderM,
      swingAllowanceM,
      totalClearanceM,
    },
    flags: {
      isExemptUnderBridge: exemptUnderBridge,
      footnoteDaggerApplied,
      isSoleRailwayBridge,
      isNormallyTraversedByPedestriansVehiclesTrains,
    },
    notes,
  };
}
